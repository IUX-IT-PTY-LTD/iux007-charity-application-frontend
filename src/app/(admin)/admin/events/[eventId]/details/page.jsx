'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Download, Lock, CreditCard } from 'lucide-react';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import BankTransferForm from '@/components/admin/donations/BankTransferForm';

// Import custom components
import EventDetailsHeader from '@/components/admin/events/details/EventDetailsHeader';
import EventDetailsInfo from '@/components/admin/events/details/EventDetailsInfo';
import EventDetailsStats from '@/components/admin/events/details/EventDetailsStats';
import EventDonationsTable from '@/components/admin/events/details/EventDonationsTable';
import EventDetailsLoading from '@/components/admin/events/details/EventDetailsLoading';
import BankTransferDonationsTable from '@/components/admin/donations/BankTransferDonationsTable';

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

// Permission-aware bank transfer button component
const PermissionAwareBankTransferButton = ({ eventId, eventTitle, onSuccess }) => {
  const eventPermissions = useEventPermissions();
  const [isOpen, setIsOpen] = useState(false);

  if (eventPermissions.isLoading) {
    return (
      <Button variant="outline" disabled>
        Loading...
      </Button>
    );
  }

  // Temporarily removed permission check - always show the button
  // if (!eventPermissions.canEdit) {
  //   return (
  //     <Button
  //       variant="outline"
  //       disabled
  //       className="opacity-50 cursor-not-allowed"
  //       title="You don't have permission to add donations"
  //     >
  //       <Lock className="mr-2 h-4 w-4" />
  //       Add Bank Transfer
  //     </Button>
  //   );
  // }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
      >
        <CreditCard className="mr-2 h-4 w-4" />
        Add Bank Transfer
      </Button>
      
      <BankTransferForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        eventId={eventId}
        eventTitle={eventTitle}
        onSuccess={onSuccess}
      />
    </>
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
  const [refreshKey, setRefreshKey] = useState(0);

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
    refreshKey,
  ]);

  // Handle bank transfer success - refresh the data
  const handleBankTransferSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

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
      // Check if this is a Qurbani event
      const isQurbaniEvent = event.is_qurbani_donation === 1;

      if (isQurbaniEvent) {
        // Qurbani-specific export with hierarchical structure
        // Main donation row + participant sub-rows
        const headers = [
          'Row Type',
          'Donation ID',
          'User Name',
          'User Email', 
          'User Phone',
          'Animal Type',
          'Per Unit Price',
          'Total Price',
          'Admin Contribution',
          'Donation Amount',
          'Donation Total Price',
          'Total Participants',
          'Participant Name',
          'Delivery Address',
          'Qurbani Day',
          'Donation Status',
          'Donated At'
        ];

        let csv = headers.join(',') + '\n';

        // Add data rows for Qurbani donations
        event.donation_details.forEach((donation) => {
          try {
            // Get participants from the API response
            const participants = donation.qurbani_participants || [];
            const participantCount = participants.length;

            // First, add the main donation row
            const donationRow = [
              '"DONATION"', // Row Type
              donation.id || '',
              `"${donation.user_name || ''}"`,
              `"${donation.user_email || ''}"`,
              `"${donation.user_phone_number || ''}"`,
              `"${donation.animal_type || ''}"`,
              donation.per_unit_price || 0,
              donation.total_price || 0,
              donation.admin_contribution_amount || 0,
              donation.donation_amount || 0,
              donation.donation_total_price || 0,
              participantCount,
              '""', // Participant fields empty for main donation row
              '""',
              '""',
              `"${donation.status || ''}"`,
              `"${donation.donated_at || ''}"`
            ];

            csv += donationRow.join(',') + '\n';

            // Then add participant rows (if any)
            participants.forEach((participant, index) => {
              const participantRow = [
                '"PARTICIPANT"', // Row Type
                donation.id || '', // Same donation ID for reference
                '""', // User fields empty for participant rows
                '""',
                '""',
                '""', // Animal type empty for participant rows
                '""', // Financial fields empty for participant rows
                '""',
                '""',
                '""',
                '""',
                '""', // Participant count empty for participant rows
                `"${participant.participant_name || ''}"`,
                `"${participant.address || ''}"`,
                `"${participant.qurbani_day || ''}"`,
                '""', // Status empty for participant rows
                '""'  // Date empty for participant rows
              ];

              csv += participantRow.join(',') + '\n';
            });

            // Add a blank row between donations for better readability
            if (event.donation_details.indexOf(donation) < event.donation_details.length - 1) {
              csv += Array(headers.length).fill('""').join(',') + '\n';
            }

          } catch (parseError) {
            console.error('Error processing donation data:', parseError);
            // Add a basic donation row if parsing fails
            const errorRow = [
              '"DONATION"',
              donation.id || '',
              `"${donation.user_name || ''}"`,
              `"${donation.user_email || ''}"`,
              `"${donation.user_phone_number || ''}"`,
              `"${donation.animal_type || ''}"`,
              donation.per_unit_price || 0,
              donation.total_price || 0,
              donation.admin_contribution_amount || 0,
              donation.donation_amount || 0,
              donation.donation_total_price || 0,
              0, // Error case participant count
              '"ERROR PARSING PARTICIPANTS"',
              '""',
              '""',
              `"${donation.status || ''}"`,
              `"${donation.donated_at || ''}"`
            ];
            csv += errorRow.join(',') + '\n';
          }
        });

        // Create download link
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${event.title}-qurbani-donations.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('Qurbani donations exported successfully');
      } else {
        // Regular donation export (existing logic)
        const fields = Object.keys(event.donation_details[0]);
        let csv = fields.join(',') + '\n';

        event.donation_details.forEach((donation) => {
          const row = fields.map((field) => {
            const value = donation[field] === null ? '' : donation[field];
            return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
          });
          csv += row.join(',') + '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${event.title}-donations.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('Donations exported successfully');
      }
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
              <PermissionAwareBankTransferButton 
                eventId={params.eventId} 
                eventTitle={event?.title} 
                onSuccess={handleBankTransferSuccess} 
              />
              
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

              {/* Right column - Donations */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <EventDonationsTable
                    donations={event.donation_details || []}
                    eventPermissions={eventPermissions}
                    event={event}
                  />
                </Card>

                {/* Bank Transfer Donations Section */}
                <BankTransferDonationsTable
                  eventId={params.eventId}
                  refreshTrigger={refreshKey}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Wrapper component that provides permission context
export default function EventDetails(props) {
  const params = use(props.params);
  return (
    <PermissionProvider>
      <EventDetailsContent params={params} />
    </PermissionProvider>
  );
}
