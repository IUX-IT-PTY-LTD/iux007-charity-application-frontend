'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { Loader2, FileDown, UserSearch, AlertCircle, Lock, Shield } from 'lucide-react';
import { format, parseISO, isSameDay, subDays } from 'date-fns';

// Import protected user service
import { getUsers, getUserDetails } from '@/api/services/admin/protected/userService';

// Import permission hooks and context
import { PermissionProvider } from '@/api/contexts/PermissionContext';
import { useUserPermissions } from '@/api/hooks/useModulePermissions';
import { isPermissionError, getPermissionErrorMessage } from '@/api/utils/permissionErrors';

// Import custom components
import UserFilters from '@/components/admin/users/list/UserFilters';
import UserRow from '@/components/admin/users/list/UserRow';
import UserStats from '@/components/admin/users/list/UserStats';

// Import shadcn components
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

// Permission-aware export button component
const PermissionAwareExportButton = () => {
  const userPermissions = useUserPermissions();

  if (!userPermissions.canView) {
    return null; // Hide export if user can't even view users
  }

  const handleExportUsers = () => {
    toast.info('Exporting users...');
    setTimeout(() => {
      toast.success('Users exported successfully!');
    }, 1500);
  };

  return (
    <Button variant="outline" onClick={handleExportUsers}>
      <FileDown className="mr-2 h-4 w-4" />
      Export Users
    </Button>
  );
};

// Main Users Page Component
const UsersPageContent = () => {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();
  const userPermissions = useUserPermissions();

  // Set page title
  useEffect(() => {
    setPageTitle('Users');
    setPageSubtitle('Manage user accounts and permissions');
  }, [setPageTitle, setPageSubtitle]);

  // State for users
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdateDate, setLastUpdateDate] = useState(new Date().toISOString());

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [donationStatus, setDonationStatus] = useState('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
    from: 0,
    to: 0,
  });

  // Stats state
  const [recentlyAddedUsers, setRecentlyAddedUsers] = useState(0);

  // Check for access and redirect if necessary
  useEffect(() => {
    if (!userPermissions.isLoading && !userPermissions.hasAccess) {
      toast.error("You don't have access to the Users module.");
      router.push('/admin/dashboard');
    }
  }, [userPermissions.isLoading, userPermissions.hasAccess, router]);

  // Load user data
  const fetchData = async (filters = {}) => {
    // Don't fetch if user doesn't have view permission
    if (!userPermissions.isLoading && !userPermissions.canView) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Prepare API parameters
      const params = {
        current_page: filters.page || currentPage,
        per_page: filters.perPage || itemsPerPage,
      };

      // Add name filter if search query exists
      if (filters.search !== undefined ? filters.search : searchQuery) {
        params.name = filters.search !== undefined ? filters.search : searchQuery;
      }

      // Add date filter if exists
      if (filters.date !== undefined ? filters.date : dateFilter) {
        // Format date as required by the API
        const formattedDate =
          filters.date || (dateFilter ? format(dateFilter, 'yyyy-MM-dd') : null);

        if (formattedDate) {
          params.date = formattedDate;
        }
      }

      console.log('Fetching users with params:', params);

      // Fetch users from protected API
      const response = await getUsers(params);

      if (response.status === 'success') {
        setUsers(response.data || []);
        setPagination(
          response.pagination || {
            total: 0,
            per_page: itemsPerPage,
            current_page: currentPage,
            last_page: 1,
            from: 0,
            to: 0,
          }
        );
        setLastUpdateDate(new Date().toISOString());

        // Calculate recently added users (users added in the last 30 days)
        const thirtyDaysAgo = subDays(new Date(), 30);
        const recentUsers = response.data.filter((user) => {
          const createdAt = parseISO(user.created_at);
          return createdAt >= thirtyDaysAgo;
        }).length;

        // For a more accurate count, we should ideally have an API endpoint for this
        // For now, we'll estimate based on the current page data
        const estimatedRecentUsers = Math.round(
          (recentUsers / response.data.length) * response.pagination.total
        );
        setRecentlyAddedUsers(estimatedRecentUsers);
      } else {
        throw new Error(response.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching data:', error);

      if (isPermissionError(error)) {
        setError(getPermissionErrorMessage(error));
        toast.error(getPermissionErrorMessage(error));
      } else {
        setError('Failed to load user data. Please try again later.');
        toast.error('Failed to load user data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle filter changes
  const handleFiltersChange = (filters) => {
    // Update local state
    if (filters.search !== undefined) setSearchQuery(filters.search);
    if (filters.date !== undefined) setDateFilter(filters.date ? new Date(filters.date) : null);
    if (filters.sort !== undefined) setSortBy(filters.sort);
    if (filters.donationStatus !== undefined) setDonationStatus(filters.donationStatus);

    // If a specific page is not provided in filters, reset to first page when filters change
    if (filters.page === undefined) {
      setCurrentPage(1);
    } else {
      setCurrentPage(filters.page);
    }

    // If a specific perPage is not provided in filters, use the current itemsPerPage
    if (filters.perPage !== undefined) {
      setItemsPerPage(filters.perPage);
    }

    // Fetch data with new filters
    fetchData({
      page: filters.page || 1,
      search: filters.search,
      date: filters.date,
      perPage: filters.perPage || itemsPerPage,
    });
  };

  // Initial data load - only when permissions are loaded
  useEffect(() => {
    if (!userPermissions.isLoading) {
      fetchData();
    }
  }, [userPermissions.isLoading]);

  // Handle user deletion (commented out for future implementation)
  const handleDeleteUser = (userId) => {
    toast.info('Delete functionality will be implemented in the future');
  };

  // Apply client-side filtering for donation status
  // (ideally this would be handled by the API)
  const filterByDonationStatus = (userList) => {
    if (donationStatus === 'all') return userList;

    return userList.filter((user) => {
      const hasDonations = (user.total_donors || 0) > 0;
      return (
        (donationStatus === 'donors' && hasDonations) ||
        (donationStatus === 'non-donors' && !hasDonations)
      );
    });
  };

  // Sort users
  const sortUsers = (userList) => {
    let sortedUsers = [...userList];

    // Apply sorting
    switch (sortBy) {
      case 'name-a-z':
        sortedUsers.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-z-a':
        sortedUsers.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        sortedUsers.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'oldest':
        sortedUsers.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'donations-high':
        sortedUsers.sort((a, b) => (b.total_donors || 0) - (a.total_donors || 0));
        break;
      case 'donations-low':
        sortedUsers.sort((a, b) => (a.total_donors || 0) - (b.total_donors || 0));
        break;
    }

    return sortedUsers;
  };

  // Calculate stats for user summary
  const calculateStats = () => {
    if (!users.length) {
      return {
        totalUsers: 0,
        totalDonations: 0,
        averageDonationsPerUser: 0,
      };
    }

    // Count all users from pagination
    const totalUsers = pagination.total;

    // Total donations made by all users
    const totalDonations = users.reduce((sum, user) => sum + (user.total_donors || 0), 0);

    // Average donations per user
    const averageDonationsPerUser = users.length ? totalDonations / users.length : 0;

    return {
      totalUsers,
      totalDonations,
      averageDonationsPerUser,
    };
  };

  // Apply sorting and filters, then calculate stats
  const filteredUsers = filterByDonationStatus(users);
  const sortedUsers = sortUsers(filteredUsers);
  const stats = calculateStats();

  // Show loading state while permissions are loading
  if (userPermissions.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading permissions...</p>
        </div>
      </div>
    );
  }

  // Show access denied if user has no user permissions
  if (!userPermissions.hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access the Users module.
          </p>
          <Button onClick={() => router.push('/admin/dashboard')}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  // Show loading state for data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500 mb-2" />
          <p className="text-muted-foreground">Loading user data...</p>
        </div>
      </div>
    );
  }

  // Render empty state if no users
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-4">
        <UserSearch className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No users found</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        {pagination.total === 0
          ? 'There are no registered users yet.'
          : 'No users match your current filters. Try adjusting your search or filter criteria.'}
      </p>
      {pagination.total > 0 && (searchQuery || dateFilter || donationStatus !== 'all') && (
        <Button
          variant="outline"
          onClick={() => {
            setSearchQuery('');
            setDateFilter(null);
            setDonationStatus('all');
            fetchData({ search: '', date: null, page: 1 });
          }}
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        {/* Permission Status Banner */}
        {/* <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Your User Management Permissions:</h4>
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge variant={userPermissions.canView ? 'default' : 'secondary'}>
              View: {userPermissions.canView ? '✓' : '✗'}
            </Badge>
            <Badge variant={userPermissions.canView ? 'default' : 'secondary'}>
              Details: {userPermissions.canView ? '✓' : '✗'}
            </Badge>
          </div>
          {!userPermissions.canView && (
            <p className="text-sm text-orange-600 mt-2">You have limited access to this module.</p>
          )}
        </div> */}

        {/* Header with Export Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-sm text-muted-foreground mt-1">
              View and manage registered user accounts
              {!userPermissions.canView && (
                <span className="text-orange-600 ml-2">(Limited access)</span>
              )}
            </p>
          </div>

          <PermissionAwareExportButton />
        </div>

        {/* User Statistics - only show if user can view */}
        {userPermissions.canView && (
          <UserStats
            totalUsers={stats.totalUsers}
            recentlyAddedUsers={recentlyAddedUsers}
            totalDonations={stats.totalDonations}
            averageDonationsPerUser={stats.averageDonationsPerUser}
            lastUpdateDate={lastUpdateDate}
          />
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader className="p-4 pb-0">
            {/* <div className="flex justify-between items-center">
              <div>
                <CardTitle>Registered Users</CardTitle>
                <CardDescription>
                  {userPermissions.canView
                    ? `Displaying ${pagination.total} out of ${pagination.total} total users`
                    : "You don't have permission to view user data"}
                </CardDescription>
              </div>
            </div> */}

            {/* Only show filters if user can view */}
            {userPermissions.canView && (
              <UserFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                roleFilter={roleFilter}
                setRoleFilter={setRoleFilter}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                onFiltersChange={handleFiltersChange}
              />
            )}
          </CardHeader>

          <CardContent className="p-0 pt-4">
            {!userPermissions.canView ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Lock className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Access Restricted</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  You don't have permission to view user data. Contact your administrator to request
                  access.
                </p>
              </div>
            ) : sortedUsers.length === 0 ? (
              renderEmptyState()
            ) : (
              <div className="border rounded-md">
                {sortedUsers.map((user) => (
                  <UserRow
                    key={user.id}
                    user={{
                      ...user,
                      // Map API fields to match the component props
                      donation_count: user.total_donors || 0,
                      total_donated: user.total_donation_amount || 0,
                    }}
                    onDelete={handleDeleteUser}
                  />
                ))}
              </div>
            )}
          </CardContent>

          {/* Only show pagination if user can view and has data */}
          {userPermissions.canView && sortedUsers.length > 0 && (
            <CardFooter className="flex flex-col sm:flex-row justify-between items-center p-4 gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {pagination.from} to {pagination.to} of {pagination.total} users
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => {
                        const newPage = Math.max(1, currentPage - 1);
                        handleFiltersChange({ page: newPage });
                      }}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                    // Show 5 pages around current page
                    const startPage = Math.max(1, currentPage - 2);
                    const endPage = Math.min(pagination.last_page, startPage + 4);
                    const adjustedStartPage = Math.max(1, endPage - 4);
                    const pageNumber = adjustedStartPage + i;

                    if (pageNumber <= pagination.last_page) {
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            onClick={() => {
                              handleFiltersChange({ page: pageNumber });
                            }}
                            isActive={pageNumber === currentPage}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => {
                        const newPage = Math.min(pagination.last_page, currentPage + 1);
                        handleFiltersChange({ page: newPage });
                      }}
                      disabled={currentPage === pagination.last_page}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Items per page:</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    const newPerPage = Number(value);
                    handleFiltersChange({ page: 1, perPage: newPerPage });
                  }}
                >
                  <SelectTrigger className="w-16 h-8">
                    <SelectValue placeholder={itemsPerPage} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

// Wrapper component that provides permission context
const UsersPage = () => {
  return (
    <PermissionProvider>
      <UsersPageContent />
    </PermissionProvider>
  );
};

export default UsersPage;
