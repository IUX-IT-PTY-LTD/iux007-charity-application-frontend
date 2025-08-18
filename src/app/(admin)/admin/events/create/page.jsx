// src/app/(admin)/admin/events/create/page.jsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Import custom components
import EventForm from '@/components/admin/events/create/EventForm';
import EventPreview from '@/components/admin/events/create/EventPreview';
import { eventFormSchema, defaultEventValues } from '@/components/admin/events/create/eventSchema';

// Import service
import { eventService } from '@/api/services/admin/eventService';

const AdminEventCreate = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set page title and subtitle
  const { setPageTitle, setPageSubtitle } = useAdminContext();
  useEffect(() => {
    setPageTitle('Create Event');
    setPageSubtitle('Add a new event to your calendar');
  }, [setPageTitle, setPageSubtitle]);

  // Initialize form with validation
  const form = useForm({
    resolver: zodResolver(eventFormSchema),
    defaultValues: defaultEventValues,
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      console.log('Form data for submission:', data);

      // Submit to API using the eventService
      const response = await eventService.createEvent(data);

      if (response.status === 'success') {
        toast.success(response.message || 'Event created successfully!');

        // You can store the returned event ID or UUID if needed
        console.log('Created event details:', response.data);

        router.push('/admin/events');
      } else {
        toast.error(response.message || 'Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);

      // Check for validation errors in the API response
      if (error.errors) {
        // Handle specific field errors
        Object.entries(error.errors).forEach(([field, messages]) => {
          if (messages && messages.length > 0) {
            form.setError(field, {
              type: 'manual',
              message: messages[0],
            });
          }
        });

        toast.error('Please correct the errors in the form');
      } else {
        toast.error(error.message || 'An error occurred while creating the event');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 py-6 mx-auto max-w-5xl">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Event Information</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Enter the details for your new event
              </p>
            </div>
            <Button variant="outline" onClick={() => router.push('/admin/events')}>
              Cancel
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Form Section */}
            <div className="md:col-span-2">
              <EventForm form={form} onSubmit={onSubmit} isSubmitting={isSubmitting} />
            </div>

            {/* Preview Section */}
            <div className="md:col-span-1">
              <EventPreview form={form} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEventCreate;
