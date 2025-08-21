'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Download, Lock } from 'lucide-react';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

// Import custom components
import EventDetailsHeader from '@/components/admin/events/details/EventDetailsHeader';
import EventDetailsInfo from '@/components/admin/events/details/EventDetailsInfo';
import EventDetailsStats from '@/components/admin/events/details/EventDetailsStats';
import EventDonationsTable from '@/components/admin/events/details/EventDonationsTable';
import EventDetailsLoading from '@/components/admin/events/details/EventDetailsLoading';

// Import protected service
import { getEventWithDonations } from '@/api/services/admin/protected/eventService';
import { isAuthenticated } from '@/api/services/admin/authService';

// Import permission hooks and context
import { PermissionProvider } from '@/api/contexts/PermissionContext';
import { useEventPermissions } from '@/api/hooks/useModulePermissions';
import { isPermissionError, getPermissionErrorMessage } from '@/api/utils/permissionErrors';

// Permission-aware export button component
const PermissionAwareExportButton = ({ event, onExport }) => {
  const eventPermissions = useEventPermissions();

  if (eventPermissions.isLoading) {
    return (
      <Button variant="outline" disabled>
        Loading...
      </Button>
    );
  }

  if (!eventPermissions.canView) {
    return (
      <Button
        variant="outline"
        disabled
        className="opacity-50 cursor-not-allowed"
        title="You don't have permission to export donations"
      >
        <Lock className="mr-2 h-4 w-4" />
        Export Donations
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={onExport}
      disabled={!event || !event.donation_details || event.donation_details.length === 0}
    >
      <Download className="mr-2 h-4 w-4" />
      Export Donations
    </Button>
  );
};

// Permission-aware edit button component
const PermissionAwareEditButton = ({ eventId }) => {
  const router = useRouter();
  const eventPermissions = useEventPermissions();

  if (eventPermissions.isLoading) {
    return (
      <Button className="bg-blue-600 hover:bg-blue-700 text-white" disabled>
        Loading...
      </Button>
    );
  }

  if (!eventPermissions.canEdit) {
    return (
      <Button
        disabled
        className="opacity-50 cursor-not-allowed"
        title="You don't have permission to edit events"
      >
        <Lock className="mr-2 h-4 w-4" />
        Edit Event
      </Button>
    );
  }

  return (
    <Button
      className="bg-blue-600 hover:bg-blue-700 text-white"
      onClick={() => router.push(`/admin/events/${eventId}/edit`)}
    >
      <Edit className="mr-2 h-4 w-4" />
      Edit Event
    </Button>
  );
};

// Main Event Details Page Component
function EventDetailsContent({ params }) {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();
  const eventPermissions = useEventPermissions();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set page title and subtitle
  useEffect(() => {
    setPageTitle('Event Details');
    setPageSubtitle('View event information and donations');
  }, [setPageTitle, setPageSubtitle]);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error('Authentication required. Please log in.');
      router.push('/admin/login');
    }
  }, [router]);

  // Check if user has event access
  useEffect(() => {
    if (!eventPermissions.isLoading && !eventPermissions.hasAccess) {
      toast.error("You don't have access to the Events module.");
      router.push('/admin/dashboard');
    }
  }, [eventPermissions.isLoading, eventPermissions.hasAccess, router]);

  // Check if user has view permission
  useEffect(() => {
    if (!eventPermissions.isLoading && eventPermissions.hasAccess && !eventPermissions.canView) {
      toast.error("You don't have permission to view event details.");
      router.push('/admin/events');
    }
  }, [eventPermissions.isLoading, eventPermissions.hasAccess, eventPermissions.canView, router]);

  // Fetch event data with donations
  useEffect(() => {
    const fetchEventDetails = async () => {
      // Don't fetch if user doesn't have view permission
      if (!eventPermissions.isLoading && !eventPermissions.canView) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await getEventWithDonations(params.eventId);

        if (response && response.status === 'success' && response.data) {
          setEvent(response.data);

          // Update page title with event name
          setPageTitle(`Event: ${response.data.title}`);
          setPageSubtitle('View event information and donations');
        } else {
          toast.error('Event not found or invalid response');
          setError('Event not found');
        }
      } catch (error) {
        console.error('Error fetching event details:', error);

        if (isPermissionError(error)) {
          setError(getPermissionErrorMessage(error));
          toast.error(getPermissionErrorMessage(error));
        } else {
          setError(error.message || 'Failed to load event data');
          toast.error(error.message || 'Failed to load event data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (params.eventId && !eventPermissions.isLoading) {
      fetchEventDetails();
    }
  }, [
    params.eventId,
    setPageTitle,
    setPageSubtitle,
    eventPermissions.isLoading,
    eventPermissions.canView,
  ]);

  // Export donations to CSV with permission checking
  const handleExportDonations = () => {
    if (!eventPermissions.canView) {
      toast.error("You don't have permission to export donations");
      return;
    }

    if (!event || !event.donation_details || event.donation_details.length === 0) {
      toast.error('No donations to export');
      return;
    }

    try {
      // Get field names from the first donation
      const fields = Object.keys(event.donation_details[0]);

      // Create CSV header row
      let csv = fields.join(',') + '\n';

      // Add data rows
      event.donation_details.forEach((donation) => {
        const row = fields.map((field) => {
          // Handle values that might need escaping (like strings with commas)
          const value = donation[field] === null ? '' : donation[field];
          return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
        });
        csv += row.join(',') + '\n';
      });

      // Create download link
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${event.title}-donations.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Donations exported successfully');
    } catch (error) {
      console.error('Error exporting donations:', error);
      toast.error('Failed to export donations');
    }
  };

  // Show loading state while permissions are loading
  if (eventPermissions.isLoading || isLoading) {
    return <EventDetailsLoading />;
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

  // Show view permission denied
  if (!eventPermissions.canView) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">View Permission Required</h2>
          <p className="text-gray-600 mb-4">You don't have permission to view event details.</p>
          <Button onClick={() => router.push('/admin/events')}>Back to Events</Button>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 py-6 mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Error Loading Event
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{error}</p>
            <Button variant="default" className="mt-4" onClick={() => router.push('/admin/events')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        {/* Permission Status Banner */}
        {/* <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Your Event Details Permissions:</h4>
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge variant={eventPermissions.canView ? 'default' : 'secondary'}>
              View: {eventPermissions.canView ? '✓' : '✗'}
            </Badge>
            <Badge variant={eventPermissions.canEdit ? 'default' : 'secondary'}>
              Edit: {eventPermissions.canEdit ? '✓' : '✗'}
            </Badge>
          </div>
        </div> */}

        <div className="flex flex-col gap-6">
          {/* Actions bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/admin/events')}
              className="mb-2 sm:mb-0"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Button>

            <div className="flex items-center gap-2">
              <PermissionAwareExportButton event={event} onExport={handleExportDonations} />

              <PermissionAwareEditButton eventId={params.eventId} />
            </div>
          </div>

          {/* Event details */}
          {event && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Left column - Event info */}
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  <EventDetailsHeader event={event} />
                  <EventDetailsInfo event={event} />
                  <EventDetailsStats event={event} />
                </div>
              </div>

              {/* Right column - Donations table */}
              <div className="lg:col-span-2">
                <Card>
                  <EventDonationsTable
                    donations={event.donation_details || []}
                    eventPermissions={eventPermissions}
                  />
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Wrapper component that provides permission context
export default function EventDetails({ params }) {
  return (
    <PermissionProvider>
      <EventDetailsContent params={params} />
    </PermissionProvider>
  );
}
