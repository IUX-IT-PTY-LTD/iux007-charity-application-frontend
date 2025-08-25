// src/app/(admin)/admin/faqs/page.jsx
// Complete Permission-aware FAQ page

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminContext } from '@/components/admin/layout/admin-context';

import {
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  ArrowUpDown,
  MessageSquare,
  HelpCircle,
  Lock,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

// Import protected API services
import {
  getAllFaqs,
  updateFaq,
  deleteFaq,
  searchFaqs,
  sortFaqsByOrdering,
} from '@/api/services/admin/protected/faqService';
import { isAuthenticated } from '@/api/services/admin/authService';

// Import permission hooks
import { useFaqPermissions } from '@/api/hooks/useModulePermissions';
import { PermissionProvider } from '@/api/contexts/PermissionContext';
import { isPermissionError, getPermissionErrorMessage } from '@/api/utils/permissionErrors';

// Permission-aware components
const PermissionAwareButton = ({ permission, children, fallback = null, ...props }) => {
  const permissions = useFaqPermissions();

  if (permissions.isLoading) {
    return (
      <Button {...props} disabled>
        Loading...
      </Button>
    );
  }

  const hasPermission =
    permission === 'create'
      ? permissions.canCreate
      : permission === 'view'
        ? permissions.canView
        : permission === 'edit'
          ? permissions.canEdit
          : permission === 'delete'
            ? permissions.canDelete
            : false;

  if (!hasPermission) {
    if (fallback) return fallback;
    return null; // Hide button completely
  }

  return <Button {...props}>{children}</Button>;
};

const PermissionAwareActionButton = ({ permission, children, disabledFallback, ...props }) => {
  const permissions = useFaqPermissions();

  if (permissions.isLoading) {
    return (
      <Button {...props} disabled>
        Loading...
      </Button>
    );
  }

  const hasPermission =
    permission === 'edit'
      ? permissions.canEdit
      : permission === 'delete'
        ? permissions.canDelete
        : false;

  if (!hasPermission) {
    if (disabledFallback) {
      return (
        <Button
          {...props}
          disabled
          title="You don't have permission for this action"
          className="opacity-50 cursor-not-allowed"
        >
          {disabledFallback}
        </Button>
      );
    }
    return (
      <Button
        {...props}
        disabled
        title="You don't have permission for this action"
        className="opacity-50 cursor-not-allowed"
      >
        <Lock className="h-4 w-4" />
      </Button>
    );
  }

  return <Button {...props}>{children}</Button>;
};

const AdminFAQsList = () => {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();
  const faqPermissions = useFaqPermissions();

  // State management
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('ordering');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [selectedFaqId, setSelectedFaqId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Set page title and subtitle
  useEffect(() => {
    setPageTitle('FAQs');
    setPageSubtitle('Manage frequently asked questions for your users');
  }, [setPageTitle, setPageSubtitle]);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error('Authentication required. Please log in.');
      router.push('/admin/login');
    }
  }, [router]);

  // Check if user has any FAQ access
  useEffect(() => {
    if (!faqPermissions.isLoading && !faqPermissions.hasAccess) {
      toast.error("You don't have access to the FAQ module.");
      router.push('/admin/dashboard');
    }
  }, [faqPermissions.isLoading, faqPermissions.hasAccess, router]);

  // Fetch FAQs from API with permission handling
  useEffect(() => {
    const fetchFaqs = async () => {
      // Don't fetch if user doesn't have view permission
      if (!faqPermissions.isLoading && !faqPermissions.canView) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const response = await getAllFaqs();

        if (response.status === 'success' && response.data) {
          setFaqs(response.data);
        } else {
          toast.error('Failed to load FAQs');
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error);

        if (isPermissionError(error)) {
          toast.error(getPermissionErrorMessage(error));
        } else {
          toast.error(error.message || 'Failed to load FAQs');
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch when permissions are loaded
    if (!faqPermissions.isLoading) {
      fetchFaqs();
    }
  }, [faqPermissions.isLoading, faqPermissions.canView]);

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort FAQs
  const filteredAndSortedFaqs = [...faqs]
    .filter((faq) => {
      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();

      if (query === 'active') return faq.status === '1' || faq.status === 1;
      if (query === 'inactive') return faq.status === '0' || faq.status === 0;

      return faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query);
    })
    .sort((a, b) => {
      const modifier = sortDirection === 'asc' ? 1 : -1;

      if (sortField === 'question' || sortField === 'answer') {
        return a[sortField].localeCompare(b[sortField]) * modifier;
      } else {
        return (Number(a[sortField]) - Number(b[sortField])) * modifier;
      }
    });

  // Calculate pagination
  const totalFaqs = filteredAndSortedFaqs.length;
  const totalPages = Math.ceil(totalFaqs / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFaqs = filteredAndSortedFaqs.slice(indexOfFirstItem, indexOfLastItem);

  // Handle FAQ deletion with permission checking
  const handleDelete = async (id) => {
    if (!faqPermissions.canDelete) {
      toast.error("You don't have permission to delete FAQs");
      return;
    }

    try {
      setIsDeleting(true);
      setSelectedFaqId(id);

      const response = await deleteFaq(id);

      if (response.status === 'success') {
        // Update state after successful deletion
        const updatedFaqs = faqs.filter((faq) => faq.id !== id);
        setFaqs(updatedFaqs);

        toast.success('FAQ deleted successfully');
      } else {
        toast.error(response.message || 'Failed to delete FAQ');
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);

      if (isPermissionError(error)) {
        toast.error(getPermissionErrorMessage(error));
      } else {
        toast.error(error.message || 'Failed to delete FAQ');
      }
    } finally {
      setIsDeleting(false);
      setSelectedFaqId(null);
    }
  };

  // Handle status toggle with permission checking
  const handleStatusChange = async (id, currentStatus) => {
    if (!faqPermissions.canEdit) {
      toast.error("You don't have permission to edit FAQs");
      return;
    }

    try {
      setIsStatusUpdating(true);
      setSelectedFaqId(id);

      const faqToUpdate = faqs.find((faq) => faq.id === id);

      // Convert status to number if it's a string
      const currentStatusNum =
        typeof currentStatus === 'string' ? parseInt(currentStatus, 10) : currentStatus;

      // Toggle status (0 to 1 or 1 to 0)
      const newStatus = currentStatusNum === 1 ? 0 : 1;

      // Prepare update data
      const updateData = {
        ...faqToUpdate,
        status: newStatus,
      };

      const response = await updateFaq(id, updateData);

      if (response.status === 'success') {
        // Update state after successful update
        const updatedFaqs = faqs.map((faq) => {
          if (faq.id === id) {
            return {
              ...faq,
              status: newStatus,
            };
          }
          return faq;
        });

        setFaqs(updatedFaqs);

        toast.success(`FAQ ${currentStatusNum === 1 ? 'deactivated' : 'activated'} successfully`);
      } else {
        toast.error(response.message || 'Failed to update FAQ status');
      }
    } catch (error) {
      console.error('Error updating FAQ status:', error);

      if (isPermissionError(error)) {
        toast.error(getPermissionErrorMessage(error));
      } else {
        toast.error(error.message || 'Failed to update FAQ status');
      }
    } finally {
      setIsStatusUpdating(false);
      setSelectedFaqId(null);
    }
  };

  // Format status value to make sure it's consistent
  const getStatusValue = (status) => {
    if (status === '1' || status === 1) return 1;
    return 0;
  };

  // Column definitions for sortable headers
  const columns = [
    { field: 'ordering', label: '#', sortable: true },
    { field: 'question', label: 'Question', sortable: true },
    { field: 'answer', label: 'Answer', sortable: true },
    { field: 'status', label: 'Status', sortable: true },
    { field: 'actions', label: 'Actions', sortable: false },
  ];

  // Show loading state while permissions are loading
  if (faqPermissions.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading permissions...</p>
        </div>
      </div>
    );
  }

  // Show access denied if user has no FAQ permissions
  if (!faqPermissions.hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to access the FAQ module.</p>
          <Button onClick={() => router.push('/admin/dashboard')}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Manage FAQs displayed on your website
                {!faqPermissions.canView && (
                  <span className="text-orange-600 ml-2">(Read-only access)</span>
                )}
              </CardDescription>
            </div>

            <PermissionAwareButton
              permission="create"
              onClick={() => router.push('/admin/faqs/create')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              fallback={
                <Button disabled className="opacity-50">
                  <Lock className="mr-2 h-4 w-4" />
                  Create FAQ
                </Button>
              }
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create FAQ
            </PermissionAwareButton>
          </CardHeader>

          <CardContent>
            {/* Permission Status Banner */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Your FAQ Permissions:</h4>
              <div className="flex flex-wrap gap-2 text-sm">
                <Badge variant={faqPermissions.canCreate ? 'default' : 'secondary'}>
                  Create: {faqPermissions.canCreate ? '✓' : '✗'}
                </Badge>
                <Badge variant={faqPermissions.canView ? 'default' : 'secondary'}>
                  View: {faqPermissions.canView ? '✓' : '✗'}
                </Badge>
                <Badge variant={faqPermissions.canEdit ? 'default' : 'secondary'}>
                  Edit: {faqPermissions.canEdit ? '✓' : '✗'}
                </Badge>
                <Badge variant={faqPermissions.canDelete ? 'default' : 'secondary'}>
                  Delete: {faqPermissions.canDelete ? '✓' : '✗'}
                </Badge>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search FAQs..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 self-end">
                <span className="text-sm text-gray-500">
                  {filteredAndSortedFaqs.length}{' '}
                  {filteredAndSortedFaqs.length === 1 ? 'FAQ' : 'FAQs'} found
                </span>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setSearchQuery('')}
                      className="justify-between"
                    >
                      All
                      <Badge variant="outline" className="ml-2">
                        {faqs.length}
                      </Badge>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSearchQuery('active')}
                      className="justify-between"
                    >
                      Active
                      <Badge variant="outline" className="ml-2">
                        {faqs.filter((faq) => getStatusValue(faq.status) === 1).length}
                      </Badge>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSearchQuery('inactive')}
                      className="justify-between"
                    >
                      Inactive
                      <Badge variant="outline" className="ml-2">
                        {faqs.filter((faq) => getStatusValue(faq.status) === 0).length}
                      </Badge>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead
                        key={column.field}
                        className={column.sortable ? 'cursor-pointer select-none' : ''}
                        onClick={column.sortable ? () => handleSort(column.field) : undefined}
                      >
                        <div className="flex items-center space-x-1">
                          <span>{column.label}</span>
                          {column.sortable && <ArrowUpDown className="h-3 w-3" />}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        Loading FAQs...
                      </TableCell>
                    </TableRow>
                  ) : !faqPermissions.canView ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Lock className="h-8 w-8 text-gray-400" />
                          <p>You don't have permission to view FAQs</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredAndSortedFaqs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        No FAQs found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentFaqs.map((faq) => (
                      <TableRow key={faq.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <TableCell className="font-medium">{faq.ordering}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <HelpCircle className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">{faq.question}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-md">
                            <p className="truncate" title={faq.answer}>
                              {faq.answer}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={getStatusValue(faq.status) === 1}
                              onCheckedChange={() => handleStatusChange(faq.id, faq.status)}
                              aria-label={`Toggle status for ${faq.question}`}
                              className="data-[state=checked]:bg-black data-[state=checked]:text-white"
                              disabled={
                                !faqPermissions.canEdit ||
                                (isStatusUpdating && selectedFaqId === faq.id)
                              }
                            />
                            <Badge
                              variant={getStatusValue(faq.status) === 1 ? 'success' : 'destructive'}
                              className={
                                getStatusValue(faq.status) === 1
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }
                            >
                              {getStatusValue(faq.status) === 1 ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-2">
                            <PermissionAwareActionButton
                              permission="edit"
                              variant="ghost"
                              size="icon"
                              onClick={() => router.push(`/admin/faqs/${faq.id}/edit`)}
                              disabledFallback={<Edit className="h-4 w-4" />}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </PermissionAwareActionButton>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <PermissionAwareActionButton
                                  permission="delete"
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-600 hover:text-red-800 hover:bg-red-100"
                                  disabled={isDeleting && selectedFaqId === faq.id}
                                  disabledFallback={<Trash2 className="h-4 w-4" />}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </PermissionAwareActionButton>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete this FAQ. This action cannot be
                                    undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(faq.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                  >
                                    {isDeleting && selectedFaqId === faq.id
                                      ? 'Deleting...'
                                      : 'Delete'}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="text-xs text-gray-500">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalFaqs)} of{' '}
              {totalFaqs} FAQs
            </div>

            {/* Pagination - only show if user can view */}
            {faqPermissions.canView && totalPages > 1 && (
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  &lt;
                </Button>

                <div className="flex items-center gap-1 mx-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const startPage = Math.max(1, currentPage - 2);
                    const endPage = Math.min(totalPages, startPage + 4);
                    const adjustedStartPage = Math.max(1, endPage - 4);
                    const pageNumber = adjustedStartPage + i;

                    if (pageNumber <= totalPages) {
                      return (
                        <Button
                          key={pageNumber}
                          variant={currentPage === pageNumber ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(pageNumber)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNumber}
                        </Button>
                      );
                    }
                    return null;
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </Button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Items per page:</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1); // Reset to first page when changing items per page
                }}
              >
                <SelectTrigger className="w-16 h-8">
                  <SelectValue placeholder="10" />
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
        </Card>
      </div>
    </div>
  );
};

// Wrap the component with PermissionProvider
const PermissionAwareFaqPageWrapper = () => {
  return (
    <PermissionProvider>
      <AdminFAQsList />
    </PermissionProvider>
  );
};

export default PermissionAwareFaqPageWrapper;
