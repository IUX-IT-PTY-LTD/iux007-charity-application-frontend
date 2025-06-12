'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
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

// Import custom components
import EditEventForm from '@/components/admin/events/edit/EditEventForm';
import EditEventPreview from '@/components/admin/events/edit/EditEventPreview';
import { eventFormSchema } from '@/components/admin/events/create/eventSchema';

// Import service
import { eventService } from '@/api/services/admin/eventService';

export default function EditEvent({ params }) {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalFormData, setOriginalFormData] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);

  // Set page title and subtitle
  useEffect(() => {
    setPageTitle('Edit Event');
    setPageSubtitle('Update event details and settings');
  }, [setPageTitle, setPageSubtitle]);

  // Initialize form
  const form = useForm({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      description: '',
      start_date: new Date(),
      end_date: new Date(),
      price: 0,
      target_amount: 0,
      is_fixed_donation: 0,
      location: '',
      status: 1,
      is_featured: 0,
      featured_image: null,
    },
    mode: 'onChange',
  });

  // Fetch event data based on the ID
  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      try {
        // Fetch event data from API
        const response = await eventService.getEventDetails(params.eventId);

        if (response && response.status === 'success' && response.data) {
          const fetchedEvent = response.data;
          setEvent(fetchedEvent);

          // Parse date strings to Date objects
          const startDate = fetchedEvent.start_date
            ? new Date(fetchedEvent.start_date)
            : new Date();
          const endDate = fetchedEvent.end_date ? new Date(fetchedEvent.end_date) : new Date();

          // Format form values from API data
          const formValues = {
            title: fetchedEvent.title || '',
            description: fetchedEvent.description || '',
            start_date: startDate,
            end_date: endDate,
            price: Number(fetchedEvent.price) || 0,
            target_amount: Number(fetchedEvent.target_amount) || 0,
            is_fixed_donation:
              fetchedEvent.is_fixed_donation === 1 || fetchedEvent.is_fixed_donation === true
                ? 1
                : 0,
            location: fetchedEvent.location || '',
            status: Number(fetchedEvent.status) || 0,
            is_featured:
              fetchedEvent.is_featured === 1 || fetchedEvent.is_featured === true ? 1 : 0,
            featured_image: fetchedEvent.featured_image || null,
          };

          // Set form values
          form.reset(formValues);

          // Store original form data for reset functionality
          setOriginalFormData(formValues);
        } else {
          toast.error('Event not found or invalid response');
          router.push('/admin/events');
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error(error.message || 'Failed to load event data');
        router.push('/admin/events');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.eventId) {
      fetchEvent();
    }
  }, [params.eventId, router, form]);

  // Track form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      setHasUnsavedChanges(true);
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Handle unsaved changes when navigating away
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Validate event data
      const { isValid, errors } = eventService.validateEventData(data);
      if (!isValid) {
        errors.forEach((error) => toast.error(error));
        setIsSubmitting(false);
        return;
      }

      // Create a new object from data to modify before submission
      const submissionData = { ...data };

      // Handle the featured image based on whether it was changed
      if (
        !imageChanged &&
        typeof data.featured_image === 'string' &&
        data.featured_image.startsWith('http')
      ) {
        // If image wasn't changed and it's a URL, don't send it in the request
        delete submissionData.featured_image;
      }

      // Format data for API submission
      const formattedData = eventService.formatEventDataForSubmission(submissionData);

      // Submit to API
      const response = await eventService.updateEvent(params.eventId, formattedData);

      if (response.status === 'success') {
        toast.success(response.message || 'Event updated successfully!');
        setHasUnsavedChanges(false);
        router.push('/admin/events');
      } else {
        toast.error(response.message || 'Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);

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
        toast.error(error.message || 'An error occurred while updating the event');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle event deletion
  const handleDelete = async () => {
    try {
      setIsSubmitting(true);

      // Call API to delete event
      const response = await eventService.deleteEvent(params.eventId);

      if (response.status === 'success') {
        toast.success(response.message || 'Event deleted successfully!');
        router.push('/admin/events');
      } else {
        toast.error(response.message || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error(error.message || 'An error occurred while deleting the event');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form to original values
  const handleReset = () => {
    if (originalFormData) {
      form.reset(originalFormData);
      setImageChanged(false);
      setHasUnsavedChanges(false);
      toast.info('Form reset to original values');
    }
  };

  // Handle image change
  const handleImageChange = (hasChanged) => {
    setImageChanged(hasChanged);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 py-6 mx-auto max-w-5xl">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (hasUnsavedChanges) {
                  if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
                    router.push('/admin/events');
                  }
                } else {
                  router.push('/admin/events');
                }
              }}
              className="mb-2 sm:mb-0"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Button>

            <div className="flex items-center gap-2">
              {/* <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    disabled={isSubmitting}
                  >
                    Delete Event
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the "{event?.title}" event. This action cannot be
                      undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog> */}

              <Button
                onClick={form.handleSubmit(onSubmit)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Form Section */}
            <div className="md:col-span-2">
              <EditEventForm
                form={form}
                onSubmit={onSubmit}
                isSubmitting={isSubmitting}
                onReset={handleReset}
                onImageChange={handleImageChange}
              />
            </div>

            {/* Preview Section */}
            <div className="md:col-span-1">
              <EditEventPreview
                form={form}
                eventId={params.eventId}
                hasUnsavedChanges={hasUnsavedChanges}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
