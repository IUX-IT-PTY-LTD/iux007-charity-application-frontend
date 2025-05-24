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
import {
  getAllEvents,
  updateEventStatus,
  deleteEvent as deleteEventService,
} from '@/api/services/admin/eventService';
import { isAuthenticated } from '@/api/services/admin/authService';

const AdminEvents = () => {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();

  // State management
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('start_date');
  const [sortDirection, setSortDirection] = useState('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Call API
        const response = await getAllEvents();

        // Process response
        if (response.status === 'success') {
          // Store all events for filtering
          setAllEvents(response.data || []);
        } else {
          throw new Error(response.message || 'Failed to fetch events');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setError(error.message || 'Failed to load events');
        toast.error(error.message || 'Failed to load events');

        // Fallback to empty state
        setAllEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter, sort and paginate events on the client side
  useEffect(() => {
    // Filter events based on search query
    let filteredEvents = [...allEvents];

    if (searchQuery) {
      if (searchQuery === 'active') {
        filteredEvents = allEvents.filter((event) => event.status === 'active');
      } else if (searchQuery === 'inactive') {
        filteredEvents = allEvents.filter((event) => event.status === 'inactive');
      } else if (searchQuery === 'featured') {
        filteredEvents = allEvents.filter((event) => event.is_featured === 1);
      } else {
        // Text search in title, description, location
        filteredEvents = allEvents.filter(
          (event) =>
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (event.description &&
              event.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
    }

    // Sort events
    filteredEvents.sort((a, b) => {
      const modifier = sortDirection === 'asc' ? 1 : -1;

      if (sortField === 'title' || sortField === 'location') {
        const aValue = a[sortField] || '';
        const bValue = b[sortField] || '';
        return aValue.localeCompare(bValue) * modifier;
      } else if (sortField === 'start_date' || sortField === 'end_date') {
        return (new Date(a[sortField]) - new Date(b[sortField])) * modifier;
      } else if (sortField === 'is_featured') {
        return (a[sortField] === b[sortField] ? 0 : a[sortField] ? -1 : 1) * modifier;
      } else {
        return (Number(a[sortField]) - Number(b[sortField])) * modifier;
      }
    });

    // Paginate events
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setEvents(filteredEvents.slice(indexOfFirstItem, indexOfFirstItem + itemsPerPage));
  }, [allEvents, searchQuery, sortField, sortDirection, currentPage, itemsPerPage]);

  // Calculate pagination values
  const totalEvents = allEvents.length;
  const totalFilteredEvents = events.length;
  const totalPages = Math.ceil(totalEvents / itemsPerPage);
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

  // Filter counts for the filter dropdown
  const activeEvents = allEvents.filter((event) => event.status === 'active').length;
  const inactiveEvents = allEvents.filter((event) => event.status === 'inactive').length;
  const featuredEvents = allEvents.filter((event) => event.is_featured === 1).length;

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    // Reset to first page when changing sort
    setCurrentPage(1);
  };

  // Handle status toggle
  const handleStatusChange = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? '0' : '1';
      const response = await updateEventStatus(id, newStatus);

      if (response.status === 'success') {
        // Update local state to avoid refetching
        const updatedAllEvents = allEvents.map((event) =>
          event.id === id ? { ...event, status: newStatus === '1' ? 'active' : 'inactive' } : event
        );

        setAllEvents(updatedAllEvents);
        toast.success(`Event ${newStatus === '1' ? 'activated' : 'deactivated'} successfully`);
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
      const response = await deleteEventService(id);

      if (response.status === 'success') {
        // Update local state to avoid refetching
        setAllEvents(allEvents.filter((event) => event.id !== id));
        toast.success('Event deleted successfully');
      } else {
        throw new Error(response.message || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error(error.message || 'Failed to delete event');
    }
  };

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
              totalEvents={totalEvents}
              activeEvents={activeEvents}
              inactiveEvents={inactiveEvents}
              featuredEvents={featuredEvents}
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
              indexOfFirstItem={indexOfFirstItem}
            />
          </CardContent>

          <CardFooter>
            {/* Pagination */}
            <EventsPagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              totalEvents={totalEvents}
              totalPages={totalPages}
              indexOfFirstItem={indexOfFirstItem}
              indexOfLastItem={indexOfFirstItem + events.length}
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminEvents;
