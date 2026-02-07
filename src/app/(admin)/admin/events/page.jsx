'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';

// Import UI components
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Import custom components
import EventsHeader from '@/components/admin/events/list/EventsHeader';
import EventsFilters from '@/components/admin/events/list/EventsFilters';
import EventsTable from '@/components/admin/events/list/EventsTable';
import EventsPagination from '@/components/admin/events/list/EventsPagination';

// Import protected services
import {
  getEvents,
  updateEventStatus,
  deleteEvent,
} from '@/api/services/admin/protected/eventService';
import { isAuthenticated } from '@/api/services/admin/authService';

// Import permission hooks and context
import { PermissionProvider } from '@/api/contexts/PermissionContext';
import { useEventPermissions } from '@/api/hooks/useModulePermissions';
import { isPermissionError, getPermissionErrorMessage } from '@/api/utils/permissionErrors';

// Main Events Page Component
const AdminEventsContent = () => {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();
  const eventPermissions = useEventPermissions();

  // State management
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]); // Store all events for total counts
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('start_date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('active');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
    from: 1,
    to: 10,
  });

  // Set page title
  useEffect(() => {
    setPageTitle('Events');
    setPageSubtitle('Manage your fundraising and charity events');
  }, [setPageTitle, setPageSubtitle]);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error('Authentication required. Please log in.');
      router.push('/admin/login');
    }
  }, [router]);

  // Check if user has any event access
  useEffect(() => {
    if (!eventPermissions.isLoading && !eventPermissions.hasAccess) {
      toast.error("You don't have access to the Events module.");
      router.push('/admin/dashboard');
    }
  }, [eventPermissions.isLoading, eventPermissions.hasAccess, router]);

  // Fetch all events for total counts (without pagination/filters)
  const fetchAllEvents = async () => {
    if (!eventPermissions.canView) return;

    try {
      const response = await getEvents({ per_page: 1000 }); // Get all events for counting
      if (response.status === 'success') {
        setAllEvents(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching all events for counts:', error);
    }
  };

  // Fetch events from API with permission handling
  const fetchEvents = async (page = 1, perPage = 10, searchQuery = '', filterStatus = 'all') => {
    // Don't fetch if user doesn't have view permission
    if (!eventPermissions.isLoading && !eventPermissions.canView) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Prepare query parameters - ALWAYS include pagination parameters
      const params = {
        current_page: page, // Use correct parameter name: current_page instead of page
        per_page: perPage, // Always include per_page parameter
      };

      // Add search if provided
      if (searchQuery && searchQuery.trim() !== '') {
        params.search = searchQuery;
      }

      // Add status filter if not 'all'
      if (filterStatus === 'active') {
        params.status = 1;
      } else if (filterStatus === 'inactive') {
        params.status = 0;
      } else if (filterStatus === 'featured') {
        params.is_featured = 1;
      }

      // Call protected API
      const response = await getEvents(params);

      // Process response
      if (response.status === 'success') {
        setEvents(response.data || []);

        // Set pagination data if available
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        throw new Error(response.message || 'Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);

      if (isPermissionError(error)) {
        setError(getPermissionErrorMessage(error));
        toast.error(getPermissionErrorMessage(error));
      } else {
        setError(error.message || 'Failed to load events');
        toast.error(error.message || 'Failed to load events');
      }

      // Fallback to empty state
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch for all events (for counts)
  useEffect(() => {
    if (!eventPermissions.isLoading && eventPermissions.canView) {
      fetchAllEvents();
    }
  }, [eventPermissions.isLoading, eventPermissions.canView]);

  // Initial fetch and when pagination, search, or filter changes
  useEffect(() => {
    // Only fetch when permissions are loaded
    if (!eventPermissions.isLoading) {
      fetchEvents(currentPage, itemsPerPage, searchQuery, filterStatus);
    }
  }, [
    currentPage,
    itemsPerPage,
    searchQuery,
    filterStatus,
    eventPermissions.isLoading,
    eventPermissions.canView,
  ]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newPerPage) => {
    setItemsPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle status toggle with permission checking
  const handleStatusChange = async (id, currentStatus) => {
    if (!eventPermissions.canEdit) {
      toast.error("You don't have permission to edit events");
      return;
    }

    try {
      // API expects 0 or 1
      const newStatus = currentStatus === 1 ? 0 : 1;

      const response = await updateEventStatus(id, newStatus);

      if (response.status === 'success') {
        // Update local state to avoid refetching
        const updatedEvents = events.map((event) =>
          event.id === id ? { ...event, status: newStatus } : event
        );

        setEvents(updatedEvents);
        toast.success(`Event ${currentStatus === 1 ? 'deactivated' : 'activated'} successfully`);
      } else {
        throw new Error(response.message || 'Failed to update event status');
      }
    } catch (error) {
      console.error('Error updating event status:', error);

      if (isPermissionError(error)) {
        toast.error(getPermissionErrorMessage(error));
      } else {
        toast.error(error.message || 'Failed to update event status');
      }
    }
  };

  // Handle event deletion with permission checking
  const handleDelete = async (id) => {
    if (!eventPermissions.canDelete) {
      toast.error("You don't have permission to delete events");
      return;
    }

    try {
      const response = await deleteEvent(id);

      if (response.status === 'success') {
        toast.success('Event deleted successfully');

        // Refresh the events list
        fetchEvents(currentPage, itemsPerPage, searchQuery, filterStatus);
      } else {
        throw new Error(response.message || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);

      if (isPermissionError(error)) {
        toast.error(getPermissionErrorMessage(error));
      } else {
        toast.error(error.message || 'Failed to delete event');
      }
    }
  };

  // Handle filter change
  const handleFilterChange = (filterType) => {
    setFilterStatus(filterType);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  // Calculate counts from all events (not filtered)
  const activeEvents = allEvents.filter((event) => event.status === 1).length;
  const inactiveEvents = allEvents.filter((event) => event.status === 0).length;
  const featuredEvents = allEvents.filter((event) => event.is_featured === 1).length;

  // Column definitions for the table
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

  // Show loading state while permissions are loading
  if (eventPermissions.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading permissions...</p>
        </div>
      </div>
    );
  }

  // Show access denied if user has no event permissions
  if (!eventPermissions.hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access the Events module.
          </p>
          <Button onClick={() => router.push('/admin/dashboard')}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        {/* Permission Status Banner */}
        {/* <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Your Event Management Permissions:</h4>
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge variant={eventPermissions.canCreate ? 'default' : 'secondary'}>
              Create: {eventPermissions.canCreate ? '✓' : '✗'}
            </Badge>
            <Badge variant={eventPermissions.canView ? 'default' : 'secondary'}>
              View: {eventPermissions.canView ? '✓' : '✗'}
            </Badge>
            <Badge variant={eventPermissions.canEdit ? 'default' : 'secondary'}>
              Edit: {eventPermissions.canEdit ? '✓' : '✗'}
            </Badge>
            <Badge variant={eventPermissions.canDelete ? 'default' : 'secondary'}>
              Delete: {eventPermissions.canDelete ? '✓' : '✗'}
            </Badge>
          </div>
          {!eventPermissions.canView && (
            <p className="text-sm text-orange-600 mt-2">You have limited access to this module.</p>
          )}
        </div> */}

        <Card>
          {/* Header */}
          <EventsHeader />

          <CardContent>
            {/* Filters */}
            <EventsFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              totalEvents={pagination.total}
              activeEvents={activeEvents}
              inactiveEvents={inactiveEvents}
              featuredEvents={featuredEvents}
              handleFilterChange={handleFilterChange}
              currentFilter={filterStatus}
            />

            {/* Table */}
            <EventsTable
              columns={columns}
              events={events}
              isLoading={isLoading}
              sortField={sortField}
              sortDirection={sortDirection}
              handleSort={handleSort}
              handleStatusChange={handleStatusChange}
              handleDelete={handleDelete}
              indexOfFirstItem={pagination.from - 1}
              eventPermissions={eventPermissions}
            />
          </CardContent>

          <CardFooter>
            {/* Pagination - only show if user can view and has data */}
            {eventPermissions.canView && events.length > 0 && (
              <EventsPagination
                currentPage={pagination.current_page}
                totalEvents={pagination.total}
                totalPages={pagination.last_page}
                indexOfFirstItem={pagination.from - 1}
                indexOfLastItem={pagination.to}
                onPageChange={handlePageChange}
                itemsPerPage={pagination.per_page}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

// Wrapper component that provides permission context
const AdminEvents = () => {
  return (
    <PermissionProvider>
      <AdminEventsContent />
    </PermissionProvider>
  );
};

export default AdminEvents;
