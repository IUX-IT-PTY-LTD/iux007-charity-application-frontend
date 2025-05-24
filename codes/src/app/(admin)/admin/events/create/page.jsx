'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Import custom components
import EventForm from '@/components/admin/events/EventForm';
import EventPreview from '@/components/admin/events/EventPreview';
import {
  eventFormSchema,
  defaultEventValues,
  formatEventDataForSubmission,
} from '@/components/admin/events/eventSchema';

// Import service
import { createEvent, validateEventData } from '@/api/services/admin/eventService';
import { isAuthenticated } from '@/api/services/admin/MainauthService';

const AdminEventCreate = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set page title and subtitle
  const { setPageTitle, setPageSubtitle } = useAdminContext();
  useEffect(() => {
    setPageTitle('Create Event');
    // setPageSubtitle("Add a new event to your calendar");
  }, [setPageTitle, setPageSubtitle]);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error('Authentication required. Please log in.');
      router.push('/admin/login');
    }
  }, [router]);

  // Initialize form with validation
  const form = useForm({
    resolver: zodResolver(eventFormSchema),
    defaultValues: defaultEventValues,
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Validate event data
      const { isValid, errors } = validateEventData(data);
      if (!isValid) {
        errors.forEach((error) => toast.error(error));
        setIsSubmitting(false);
        return;
      }

      // Format data for API submission
      const formattedData = formatEventDataForSubmission(data);

      // Create FormData for submission
      const formData = new FormData();

      // Append all data to FormData
      Object.keys(formattedData).forEach((key) => {
        // Handle file upload case
        if (key === 'featured_image' && formattedData[key] instanceof File) {
          formData.append('feature_image', formattedData[key]);
        } else {
          formData.append(key, formattedData[key]);
        }
      });

      // Submit to API using the updated event service
      const response = await createEvent(formData);

      if (response.status === 'success') {
        toast.success(response.message || 'Event created successfully!');
        router.push('/admin/events');
      } else {
        toast.error(response.message || 'Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error(error.message || 'An error occurred while creating the event');
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
