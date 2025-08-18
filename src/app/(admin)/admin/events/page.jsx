'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { toast } from 'sonner';

// Import UI components
import { Card, CardContent, CardFooter } from '@/components/ui/card';

// Import custom components
import EventsHeader from '@/components/admin/events/list/EventsHeader';
import EventsFilters from '@/components/admin/events/list/EventsFilters';
import EventsTable from '@/components/admin/events/list/EventsTable';
import EventsPagination from '@/components/admin/events/list/EventsPagination';

// Import services
import { eventService } from '@/api/services/admin/eventService';

const AdminEvents = () => {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();

  // State management
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('start_date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');

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

  // Fetch events from API
  const fetchEvents = async (page = 1, perPage = 10, searchQuery = '', filterStatus = 'all') => {
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

      // Call API
      const response = await eventService.getEvents(params);

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
      setError(error.message || 'Failed to load events');
      toast.error(error.message || 'Failed to load events');

      // Fallback to empty state
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and when pagination, search, or filter changes
  useEffect(() => {
    // Make sure we're passing the actual state values
    fetchEvents(currentPage, itemsPerPage, searchQuery, filterStatus);
    // We need to include all dependencies that should trigger a refetch
  }, [currentPage, itemsPerPage, searchQuery, filterStatus]);

  // Handle page change
  const handlePageChange = (newPage) => {
    // Update current page state
    setCurrentPage(newPage);
    // No need to call fetchEvents here as the useEffect will handle it
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newPerPage) => {
    setItemsPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
    // No need to call fetchEvents here as the useEffect will handle it
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

  // Handle status toggle
  const handleStatusChange = async (id, currentStatus) => {
    try {
      // API expects 0 or 1
      const newStatus = currentStatus === 1 ? 0 : 1;

      const response = await eventService.updateEventStatus(id, newStatus);

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
      toast.error(error.message || 'Failed to update event status');
    }
  };

  // Handle event deletion
  const handleDelete = async (id) => {
    try {
      const response = await eventService.deleteEvent(id);

      if (response.status === 'success') {
        toast.success('Event deleted successfully');

        // Refresh the events list
        fetchEvents(currentPage, itemsPerPage, searchQuery, filterStatus);
      } else {
        throw new Error(response.message || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error(error.message || 'Failed to delete event');
    }
  };

  // Handle filter change
  const handleFilterChange = (filterType) => {
    setFilterStatus(filterType);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  // Calculate counts for the filter dropdown
  const activeEvents = events.filter((event) => event.status === 1).length;
  const inactiveEvents = events.filter((event) => event.status === 0).length;
  const featuredEvents = events.filter((event) => event.is_featured === 1).length;

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 py-6 mx-auto max-w-7xl">
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
            />
          </CardContent>

          <CardFooter>
            {/* Pagination */}
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
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminEvents;
