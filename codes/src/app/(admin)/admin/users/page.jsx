'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminContext } from '@/components/admin/admin-context';
import { Loader2, FileDown, UserSearch } from 'lucide-react';
import { format, parseISO, isSameDay } from 'date-fns';

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

const UsersPage = () => {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();

  // Set page title
  useEffect(() => {
    setPageTitle('Users');
    setPageSubtitle('Manage user accounts and permissions');
  }, [setPageTitle, setPageSubtitle]);

  // State for users
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdateDate, setLastUpdateDate] = useState(new Date().toISOString());

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState(null);
  const [sortBy, setSortBy] = useState('name-a-z');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Load user data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        // Check if users exist in localStorage
        const storedUsers = localStorage.getItem('users');
        let userData = [];

        if (storedUsers) {
          userData = JSON.parse(storedUsers);
        } else {
          // Generate sample users
          userData = generateSampleUsers();
          localStorage.setItem('users', JSON.stringify(userData));
          setLastUpdateDate(new Date().toISOString());
        }

        setUsers(userData);

        /* API Implementation (Commented out for future use)
        // Fetch users from API
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const userData = await response.json();
        setUsers(userData);
        setLastUpdateDate(new Date().toISOString());
        */
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to generate sample users for testing
  function generateSampleUsers() {
    const sampleUsers = [];
    const roles = ['Donor', 'Volunteer', 'Staff', 'Admin'];
    const firstNames = [
      'John',
      'Jane',
      'Michael',
      'Emma',
      'David',
      'Sarah',
      'Robert',
      'Emily',
      'William',
      'Olivia',
      'James',
      'Sophia',
      'Benjamin',
      'Isabella',
      'Daniel',
      'Mia',
      'Matthew',
      'Charlotte',
      'Joseph',
      'Amelia',
    ];
    const lastNames = [
      'Smith',
      'Johnson',
      'Williams',
      'Brown',
      'Jones',
      'Garcia',
      'Miller',
      'Davis',
      'Rodriguez',
      'Martinez',
      'Wilson',
      'Anderson',
      'Taylor',
      'Thomas',
      'Moore',
      'Jackson',
      'Martin',
      'Lee',
      'Thompson',
      'White',
    ];

    // Generate 50 sample users
    for (let i = 1; i <= 50; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const fullName = `${firstName} ${lastName}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;

      // Random registration date in the past 2 years
      const now = new Date();
      const twoYearsAgo = new Date(now);
      twoYearsAgo.setFullYear(now.getFullYear() - 2);

      const registrationDate = new Date(
        twoYearsAgo.getTime() + Math.random() * (now.getTime() - twoYearsAgo.getTime())
      );

      //   // Random role with weighted probability
      //   // 70% Donor, 15% Volunteer, 10% Staff, 5% Admin
      //   let role;
      //   const rand = Math.random();
      //   if (rand < 0.7) {
      //     role = "Donor";
      //   } else if (rand < 0.85) {
      //     role = "Volunteer";
      //   } else if (rand < 0.95) {
      //     role = "Staff";
      //   } else {
      //     role = "Admin";
      //   }

      // Random number of donations (0-20)
      const donationCount = Math.floor(Math.random() * 21);

      // Random last login date (within the last 30 days for most users)
      const lastActive =
        Math.random() < 0.7
          ? new Date(now - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)) // Random day in the last 30 days
          : new Date(now - Math.floor(Math.random() * 180 * 24 * 60 * 60 * 1000)); // Random day in the last 180 days

      // Create user object
      const user = {
        id: `USER-${i.toString().padStart(3, '0')}`,
        name: fullName,
        email: email,
        phone:
          Math.random() < 0.7
            ? `(${Math.floor(Math.random() * 900) + 100}) ${
                Math.floor(Math.random() * 900) + 100
              }-${Math.floor(Math.random() * 9000) + 1000}`
            : null,
        address:
          Math.random() < 0.5
            ? {
                street: `${Math.floor(Math.random() * 9999) + 1} Main St`,
                city: 'Springfield',
                state: 'IL',
                zip: `${Math.floor(Math.random() * 90000) + 10000}`,
                country: 'USA',
              }
            : null,
        created_at: registrationDate.toISOString(),
        last_active: lastActive.toISOString(),
        // role: role,
        donation_count: donationCount,
        total_donated:
          donationCount > 0
            ? Math.floor(Math.random() * 50 * donationCount) + 20 * donationCount
            : 0,
        newsletter: Math.random() < 0.7,
        avatar: null, // No avatar for sample users
      };

      sampleUsers.push(user);
    }

    return sampleUsers;
  }

  // Handle user deletion
  const handleDeleteUser = (userId) => {
    // Update users state
    setUsers(users.filter((user) => user.id !== userId));

    // Update localStorage
    localStorage.setItem('users', JSON.stringify(users.filter((user) => user.id !== userId)));
    setLastUpdateDate(new Date().toISOString());

    /* API Implementation (Commented out for future use)
    // Delete user from API
    fetch(`/api/users/${userId}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (!response.ok) throw new Error('Failed to delete user');
      return response.json();
    })
    .then(data => {
      setUsers(users.filter(user => user.id !== userId));
      setLastUpdateDate(new Date().toISOString());
      toast.success('User deleted successfully');
    })
    .catch(error => {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    });
    */
  };

  // Handle export users
  const handleExportUsers = () => {
    toast.info('Exporting users...');
    // In production, this would generate a CSV/Excel file
    // For now, we'll just show a toast message
    setTimeout(() => {
      toast.success('Users exported successfully!');
    }, 1500);
  };

  // Filter and sort users
  const filterAndSortUsers = () => {
    let filteredUsers = [...users];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          (user.phone && user.phone.includes(query))
      );
    }

    // Apply role filter
    // if (roleFilter !== "all") {
    //   filteredUsers = filteredUsers.filter((user) => user.role === roleFilter);
    // }

    // Apply date filter
    if (dateFilter) {
      filteredUsers = filteredUsers.filter((user) => {
        const userDate = parseISO(user.created_at);
        return isSameDay(userDate, dateFilter);
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'name-a-z':
        filteredUsers.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-z-a':
        filteredUsers.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
        filteredUsers.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'oldest':
        filteredUsers.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'donations-high':
        filteredUsers.sort((a, b) => b.donation_count - a.donation_count);
        break;
      case 'donations-low':
        filteredUsers.sort((a, b) => a.donation_count - b.donation_count);
        break;
    }

    return filteredUsers;
  };

  // Calculate stats for user summary
  const calculateStats = () => {
    if (!users.length) {
      return {
        totalUsers: 0,
        recentlyActiveUsers: 0,
        totalDonations: 0,
        averageDonationsPerUser: 0,
      };
    }

    // Count users who were active in the last 30 days
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const recentlyActiveUsers = users.filter(
      (user) => new Date(user.last_active) >= thirtyDaysAgo
    ).length;

    // Total donations made by all users
    const totalDonations = users.reduce((sum, user) => sum + user.donation_count, 0);

    // Average donations per user
    const averageDonationsPerUser = users.length ? totalDonations / users.length : 0;

    return {
      totalUsers: users.length,
      recentlyActiveUsers,
      totalDonations,
      averageDonationsPerUser,
    };
  };

  // Get unique roles for filtering
  //   const getRoles = () => {
  //     const roles = new Set();
  //     users.forEach((user) => {
  //       if (user.role) {
  //         roles.add(user.role);
  //       }
  //     });
  //     return Array.from(roles);
  //   };

  // Apply filters and calculate stats
  const filteredUsers = filterAndSortUsers();
  const stats = calculateStats();
  //   const roles = getRoles();

  // Calculate pagination
  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Show loading state
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
        {users.length === 0
          ? 'There are no registered users yet.'
          : 'No users match your current filters. Try adjusting your search or filter criteria.'}
      </p>
      {users.length > 0 && (
        <Button
          variant="outline"
          onClick={() => {
            setSearchQuery('');
            setRoleFilter('all');
            setDateFilter(null);
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-sm text-muted-foreground mt-1">
              View and manage registered user accounts
            </p>
          </div>

          <div>
            <Button variant="outline" onClick={handleExportUsers}>
              <FileDown className="mr-2 h-4 w-4" />
              Export Users
            </Button>
          </div>
        </div>

        {/* User Statistics */}
        <UserStats
          totalUsers={stats.totalUsers}
          recentlyActiveUsers={stats.recentlyActiveUsers}
          totalDonations={stats.totalDonations}
          averageDonationsPerUser={stats.averageDonationsPerUser}
          lastUpdateDate={lastUpdateDate}
        />

        <Card>
          <CardHeader className="p-4 pb-0">
            <div className="flex justify-between items-center">
              {/* <div>
                <CardTitle>Registered Users</CardTitle>
                <CardDescription>
                  Displaying {totalUsers} out of {users.length} total users
                </CardDescription>
              </div> */}
            </div>
            <UserFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              roleFilter={roleFilter}
              setRoleFilter={setRoleFilter}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              //   roles={roles}
            />
          </CardHeader>

          <CardContent className="p-0 pt-4">
            {totalUsers === 0 ? (
              renderEmptyState()
            ) : (
              <div className="border rounded-md">
                {paginatedUsers.map((user) => (
                  <UserRow key={user.id} user={user} onDelete={handleDeleteUser} />
                ))}
              </div>
            )}
          </CardContent>

          {totalUsers > 0 && (
            <CardFooter className="flex flex-col sm:flex-row justify-between items-center p-4 gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, totalUsers)} of {totalUsers} users
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show 5 pages around current page
                    const startPage = Math.max(1, currentPage - 2);
                    const endPage = Math.min(totalPages, startPage + 4);
                    const adjustedStartPage = Math.max(1, endPage - 4);
                    const pageNumber = adjustedStartPage + i;

                    if (pageNumber <= totalPages) {
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNumber)}
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
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Items per page:</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1); // Reset to first page
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

export default UsersPage;
