// src/app/(admin)/admin/sliders/page.jsx

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
  Image,
  SlidersHorizontal,
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

// Import API services
import { getAllSliders, deleteSlider, updateSlider } from '@/api/services/admin/sliderService';
import { isAuthenticated } from '@/api/services/admin/authService';

const AdminSlidersList = () => {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();

  // State management
  const [sliders, setSliders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('ordering');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [selectedSliderId, setSelectedSliderId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Set page title and subtitle
  useEffect(() => {
    setPageTitle('Sliders');
    setPageSubtitle('Manage homepage carousel sliders');
  }, [setPageTitle, setPageSubtitle]);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error('Authentication required. Please log in.');
      router.push('/admin/login');
    }
  }, [router]);

  // Fetch sliders from API
  useEffect(() => {
    const fetchSliders = async () => {
      setIsLoading(true);

      try {
        const response = await getAllSliders();

        if (response.status === 'success' && response.data) {
          setSliders(response.data);
        } else {
          toast.error('Failed to load sliders');
        }
      } catch (error) {
        console.error('Error fetching sliders:', error);
        toast.error(error.message || 'Failed to load sliders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSliders();
  }, []);

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort sliders
  const filteredAndSortedSliders = [...sliders]
    .filter((slider) => {
      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();

      if (query === 'active') return slider.status === '1' || slider.status === 1;
      if (query === 'inactive') return slider.status === '0' || slider.status === 0;

      return (
        slider.title.toLowerCase().includes(query) ||
        slider.description.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      const modifier = sortDirection === 'asc' ? 1 : -1;

      if (sortField === 'title' || sortField === 'description') {
        return a[sortField].localeCompare(b[sortField]) * modifier;
      } else {
        return (Number(a[sortField]) - Number(b[sortField])) * modifier;
      }
    });

  // Calculate pagination
  const totalSliders = filteredAndSortedSliders.length;
  const totalPages = Math.ceil(totalSliders / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSliders = filteredAndSortedSliders.slice(indexOfFirstItem, indexOfLastItem);

  // Handle slider deletion
  const handleDelete = async (id) => {
    try {
      setIsDeleting(true);
      setSelectedSliderId(id);

      const response = await deleteSlider(id);

      if (response.status === 'success') {
        // Update state after successful deletion
        const updatedSliders = sliders.filter((slider) => slider.id !== id);
        setSliders(updatedSliders);

        toast.success(response.message || 'Slider deleted successfully');
      } else {
        toast.error(response.message || 'Failed to delete slider');
      }
    } catch (error) {
      console.error('Error deleting slider:', error);
      toast.error(error.message || 'Failed to delete slider');
    } finally {
      setIsDeleting(false);
      setSelectedSliderId(null);
    }
  };

  // Handle status toggle
  const handleStatusChange = async (id, currentStatus) => {
    try {
      setIsStatusUpdating(true);
      setSelectedSliderId(id);

      const sliderToUpdate = sliders.find((slider) => slider.id === id);

      // Convert status to number if it's a string
      const currentStatusNum =
        typeof currentStatus === 'string' ? parseInt(currentStatus, 10) : currentStatus;

      // Toggle status (0 to 1 or 1 to 0)
      const newStatus = currentStatusNum === 1 ? 0 : 1;

      // Prepare update data
      const updateData = {
        ...sliderToUpdate,
        status: newStatus,
      };

      const response = await updateSlider(id, updateData);

      if (response.status === 'success') {
        // Update state after successful update
        const updatedSliders = sliders.map((slider) => {
          if (slider.id === id) {
            return {
              ...slider,
              status: newStatus,
            };
          }
          return slider;
        });

        setSliders(updatedSliders);

        toast.success(
          `Slider ${currentStatusNum === 1 ? 'deactivated' : 'activated'} successfully`
        );
      } else {
        toast.error(response.message || 'Failed to update slider status');
      }
    } catch (error) {
      console.error('Error updating slider status:', error);
      toast.error(error.message || 'Failed to update slider status');
    } finally {
      setIsStatusUpdating(false);
      setSelectedSliderId(null);
    }
  };

  // Column definitions for sortable headers
  const columns = [
    { field: 'image', label: 'Image', sortable: false },
    { field: 'title', label: 'Title', sortable: true },
    { field: 'description', label: 'Description', sortable: true },
    { field: 'ordering', label: 'Order', sortable: true },
    { field: 'status', label: 'Status', sortable: true },
    { field: 'actions', label: 'Actions', sortable: false },
  ];

  // Format status value to make sure it's consistent
  const getStatusValue = (status) => {
    if (status === '1' || status === 1) return 1;
    return 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle>Homepage Sliders</CardTitle>
              <CardDescription>Manage carousel sliders displayed on your website</CardDescription>
            </div>

            <Button
              onClick={() => router.push('/admin/sliders/create')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Slider
            </Button>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search sliders..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 self-end">
                <span className="text-sm text-gray-500">
                  {filteredAndSortedSliders.length}{' '}
                  {filteredAndSortedSliders.length === 1 ? 'slider' : 'sliders'} found
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
                        {sliders.length}
                      </Badge>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSearchQuery('active')}
                      className="justify-between"
                    >
                      Active
                      <Badge variant="outline" className="ml-2">
                        {sliders.filter((slider) => getStatusValue(slider.status) === 1).length}
                      </Badge>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSearchQuery('inactive')}
                      className="justify-between"
                    >
                      Inactive
                      <Badge variant="outline" className="ml-2">
                        {sliders.filter((slider) => getStatusValue(slider.status) === 0).length}
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
                        Loading sliders...
                      </TableCell>
                    </TableRow>
                  ) : filteredAndSortedSliders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        No sliders found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentSliders.map((slider) => (
                      <TableRow key={slider.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <TableCell>
                          {slider.image ? (
                            <div className="h-16 w-32 overflow-hidden rounded-md">
                              <img
                                src={slider.image}
                                alt={slider.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-16 w-32 bg-gray-200 rounded-md flex items-center justify-center">
                              <Image className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{slider.title}</div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="truncate" title={slider.description}>
                              {slider.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{slider.ordering}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={getStatusValue(slider.status) === 1}
                              onCheckedChange={() => handleStatusChange(slider.id, slider.status)}
                              aria-label={`Toggle status for ${slider.title}`}
                              className="data-[state=checked]:bg-black data-[state=checked]:text-white"
                              disabled={isStatusUpdating && selectedSliderId === slider.id}
                            />
                            <Badge
                              variant={
                                getStatusValue(slider.status) === 1 ? 'success' : 'destructive'
                              }
                              className={
                                getStatusValue(slider.status) === 1
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }
                            >
                              {getStatusValue(slider.status) === 1 ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => router.push(`/admin/sliders/${slider.id}/edit`)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-600 hover:text-red-800 hover:bg-red-100"
                                  disabled={isDeleting && selectedSliderId === slider.id}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete this slider. This action cannot be
                                    undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(slider.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                  >
                                    {isDeleting && selectedSliderId === slider.id
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
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalSliders)} of{' '}
              {totalSliders} sliders
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
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
                    // Show 5 pages around current page
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

export default AdminSlidersList;
