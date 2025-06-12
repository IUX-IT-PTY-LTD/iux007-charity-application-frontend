'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Download } from 'lucide-react';
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

// Import service
import { eventService } from '@/api/services/admin/eventService';

export default function EventDetails({ params }) {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set page title and subtitle
  useEffect(() => {
    setPageTitle('Event Details');
    setPageSubtitle('View event information and donations');
  }, [setPageTitle, setPageSubtitle]);

  // Fetch event data with donations
  useEffect(() => {
    const fetchEventDetails = async () => {
      setIsLoading(true);
      try {
        const response = await eventService.getEventWithDonations(params.eventId);

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
        toast.error(error.message || 'Failed to load event data');
        setError(error.message || 'Failed to load event data');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.eventId) {
      fetchEventDetails();
    }
  }, [params.eventId, setPageTitle, setPageSubtitle]);

  // Export donations to CSV
  const handleExportDonations = () => {
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

  // Show loading state
  if (isLoading) {
    return <EventDetailsLoading />;
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
              <Button
                variant="outline"
                onClick={handleExportDonations}
                disabled={!event || !event.donation_details || event.donation_details.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Donations
              </Button>

              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => router.push(`/admin/events/${params.eventId}/edit`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Event
              </Button>
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
                  <EventDonationsTable donations={event.donation_details || []} />
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
