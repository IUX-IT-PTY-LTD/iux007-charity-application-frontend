'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { useAdminContext } from '@/components/admin/layout/admin-context';

import {
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  ArrowUpDown,
  Check,
  X,
  Calendar,
  ImageIcon,
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

const AdminEvents = () => {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();

  // State management
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('start_date');
  const [sortDirection, setSortDirection] = useState('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setPageTitle('Events');
    setPageSubtitle('Manage your fundraising and charity events');
  }, [setPageTitle, setPageSubtitle]);

  // Fetch events from localStorage (for testing)
  useEffect(() => {
    const fetchEvents = () => {
      setIsLoading(true);

      try {
        // For testing: check localStorage first, then fall back to sample data
        const storedEvents = localStorage.getItem('events');
        let eventData = [];

        if (storedEvents) {
          eventData = JSON.parse(storedEvents);
        }

        // If no stored events, use sample data
        if (!eventData || eventData.length === 0) {
          eventData = [
            {
              id: '1',
              title: 'Winter Clothes Distribution',
              description: 'Providing warm clothes to the needy.',
              start_date: new Date('2025-01-01').toISOString(),
              end_date: new Date('2025-01-15').toISOString(),
              price: 100,
              target_amount: 50000,
              is_fixed_donation: true,
              location: 'Dhaka',
              status: '1',
              is_featured: true,
              featured_image: '/images/events/winter-clothes.jpg',
            },
            {
              id: '2',
              title: 'Flood Relief Fund',
              description: 'Supporting flood victims in Sylhet.',
              start_date: new Date('2025-03-01').toISOString(),
              end_date: new Date('2025-03-31').toISOString(),
              price: 0,
              target_amount: 100000,
              is_fixed_donation: false,
              location: 'Sylhet',
              status: '0',
              is_featured: false,
              featured_image: '/images/events/flood-relief.jpg',
            },
            {
              id: '3',
              title: 'Education for All',
              description: 'Supporting education for underprivileged children.',
              start_date: new Date('2025-02-15').toISOString(),
              end_date: new Date('2025-05-15').toISOString(),
              price: 50,
              target_amount: 75000,
              is_fixed_donation: false,
              location: 'Chittagong',
              status: '1',
              is_featured: true,
              featured_image: '/images/events/education-all.jpg',
            },
            {
              id: '4',
              title: 'Annual Charity Gala',
              description: 'Our biggest fundraising event of the year.',
              start_date: new Date('2025-06-30').toISOString(),
              end_date: new Date('2025-06-30').toISOString(),
              price: 250,
              target_amount: 150000,
              is_fixed_donation: true,
              location: 'Dhaka Grand Hotel',
              status: '1',
              is_featured: true,
              featured_image: '/images/events/charity-gala.jpg',
            },
            {
              id: '5',
              title: 'Clean Water Initiative',
              description: 'Providing clean drinking water to rural areas.',
              start_date: new Date('2025-04-10').toISOString(),
              end_date: new Date('2025-08-10').toISOString(),
              price: 25,
              target_amount: 35000,
              is_fixed_donation: false,
              location: 'Rural Bangladesh',
              status: '0',
              is_featured: false,
              featured_image: '/images/events/clean-water.jpg',
            },
          ];

          // Store sample data for testing
          localStorage.setItem('events', JSON.stringify(eventData));
        }

        setEvents(eventData);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
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

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch (error) {
      return dateString;
    }
  };

  // Sort and filter events
  const sortedAndFilteredEvents = [...events]
    .filter((event) => {
      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();

      if (query === 'active') return event.status === '1';
      if (query === 'inactive') return event.status === '0';
      if (query === 'featured') return event.is_featured === true;

      return (
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      const modifier = sortDirection === 'asc' ? 1 : -1;

      if (sortField === 'title' || sortField === 'location') {
        return a[sortField].localeCompare(b[sortField]) * modifier;
      } else if (sortField === 'start_date' || sortField === 'end_date') {
        return (new Date(a[sortField]) - new Date(b[sortField])) * modifier;
      } else if (sortField === 'is_featured') {
        return (a[sortField] === b[sortField] ? 0 : a[sortField] ? -1 : 1) * modifier;
      } else {
        return (Number(a[sortField]) - Number(b[sortField])) * modifier;
      }
    });

  // Calculate total pages
  const totalEvents = sortedAndFilteredEvents.length;
  const totalPages = Math.ceil(totalEvents / itemsPerPage);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEvents = sortedAndFilteredEvents.slice(indexOfFirstItem, indexOfLastItem);

  // Handle event deletion
  const handleDelete = (id) => {
    try {
      const updatedEvents = events.filter((event) => event.id !== id);
      setEvents(updatedEvents);
      localStorage.setItem('events', JSON.stringify(updatedEvents));

      toast.success('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  // Handle status toggle
  const handleStatusChange = (id, currentStatus) => {
    try {
      const updatedEvents = events.map((event) => {
        if (event.id === id) {
          return { ...event, status: currentStatus === '1' ? '0' : '1' };
        }
        return event;
      });

      setEvents(updatedEvents);
      localStorage.setItem('events', JSON.stringify(updatedEvents));

      toast.success(`Event ${currentStatus === '1' ? 'deactivated' : 'activated'} successfully`);
    } catch (error) {
      console.error('Error updating event status:', error);
      toast.error('Failed to update event status');
    }
  };

  // Column definitions for sortable headers
  const columns = [
    { field: 'id', label: '#', sortable: false },
    { field: 'featured_image', label: 'Image', sortable: false },
    { field: 'title', label: 'Title', sortable: true },
    { field: 'start_date', label: 'Start Date', sortable: true },
    { field: 'end_date', label: 'End Date', sortable: true },
    { field: 'price', label: 'Price', sortable: true },
    { field: 'target_amount', label: 'Target', sortable: true },
    { field: 'location', label: 'Location', sortable: true },
    { field: 'is_featured', label: 'Featured', sortable: true },
    { field: 'status', label: 'Status', sortable: true },
    { field: 'actions', label: 'Actions', sortable: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle>All Events</CardTitle>
              <CardDescription>Manage your fundraising and charity events</CardDescription>
            </div>

            <Button
              onClick={() => router.push('/admin/events/create')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search events..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 self-end">
                <span className="text-sm text-gray-500">
                  {sortedAndFilteredEvents.length}{' '}
                  {sortedAndFilteredEvents.length === 1 ? 'event' : 'events'} found
                </span>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Filter Events</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setSearchQuery('')}
                      className="justify-between"
                    >
                      All
                      <Badge variant="outline" className="ml-2">
                        {events.length}
                      </Badge>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSearchQuery('active')}
                      className="justify-between"
                    >
                      Active
                      <Badge variant="outline" className="ml-2">
                        {events.filter((event) => event.status === '1').length}
                      </Badge>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSearchQuery('inactive')}
                      className="justify-between"
                    >
                      Inactive
                      <Badge variant="outline" className="ml-2">
                        {events.filter((event) => event.status === '0').length}
                      </Badge>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setSearchQuery('featured')}
                      className="justify-between"
                    >
                      Featured
                      <Badge variant="outline" className="ml-2">
                        {events.filter((event) => event.is_featured).length}
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
                        Loading events...
                      </TableCell>
                    </TableRow>
                  ) : sortedAndFilteredEvents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        No events found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentEvents.map((event, index) => (
                      <TableRow key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <TableCell className="font-medium">
                          {indexOfFirstItem + index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="h-10 w-10 rounded-md overflow-hidden">
                            {event.featured_image ? (
                              <img
                                src={event.featured_image}
                                alt={event.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                                <ImageIcon className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[150px]">
                            <div
                              className="font-medium truncate"
                              title={event.title}
                              onClick={() => router.push(`/admin/events/${event.id}/donations`)}
                            >
                              {event.title}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {event.is_fixed_donation ? (
                                <Badge variant="outline" className="mt-1">
                                  Fixed
                                </Badge>
                              ) : null}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                            <span>{formatDate(event.start_date)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                            <span>{formatDate(event.end_date)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          ${Number(event.price).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-medium">
                          ${Number(event.target_amount).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <span className="max-w-[100px] truncate block" title={event.location}>
                            {event.location}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            {event.is_featured ? (
                              <span className="text-green-500">
                                <Check className="h-5 w-5" />
                              </span>
                            ) : (
                              <span className="text-red-500">
                                <X className="h-5 w-5" />
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={event.status === '1'}
                              onCheckedChange={() => handleStatusChange(event.id, event.status)}
                              aria-label={`Toggle status for ${event.title}`}
                              className="data-[state=checked]:bg-black data-[state=checked]:text-white"
                            />
                            <Badge
                              variant={event.status === '1' ? 'success' : 'destructive'}
                              className={
                                event.status === '1'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }
                            >
                              {event.status === '1' ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => router.push(`/admin/events/${event.id}/edit`)}
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
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete the "{event.title}" event. This
                                    action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(event.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                  >
                                    Delete
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
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalEvents)} of{' '}
              {totalEvents} events
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

export default AdminEvents;
