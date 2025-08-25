// src/app/(admin)/admin/events/create/page.jsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';

// Import custom components
import EventForm from '@/components/admin/events/create/EventForm';
import EventPreview from '@/components/admin/events/create/EventPreview';
import { eventFormSchema, defaultEventValues } from '@/components/admin/events/create/eventSchema';

// Import protected service
import { createEvent } from '@/api/services/admin/protected/eventService';
import { isAuthenticated } from '@/api/services/admin/authService';

// Import permission hooks and context
import { PermissionProvider } from '@/api/contexts/PermissionContext';
import { useEventPermissions } from '@/api/hooks/useModulePermissions';
import { isPermissionError, getPermissionErrorMessage } from '@/api/utils/permissionErrors';

// Main Event Create Page Component
const AdminEventCreateContent = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const eventPermissions = useEventPermissions();

  // Set page title and subtitle
  const { setPageTitle, setPageSubtitle } = useAdminContext();
  useEffect(() => {
    setPageTitle('Create Event');
    setPageSubtitle('Add a new event to your calendar');
  }, [setPageTitle, setPageSubtitle]);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error('Authentication required. Please log in.');
      router.push('/admin/login');
    }
  }, [router]);

  // Check if user has event access and create permission
  useEffect(() => {
    if (!eventPermissions.isLoading && !eventPermissions.hasAccess) {
      toast.error("You don't have access to the Events module.");
      router.push('/admin/dashboard');
    }
  }, [eventPermissions.isLoading, eventPermissions.hasAccess, router]);

  useEffect(() => {
    if (!eventPermissions.isLoading && eventPermissions.hasAccess && !eventPermissions.canCreate) {
      toast.error("You don't have permission to create events.");
      router.push('/admin/events');
    }
  }, [eventPermissions.isLoading, eventPermissions.hasAccess, eventPermissions.canCreate, router]);

  // Initialize form with validation
  const form = useForm({
    resolver: zodResolver(eventFormSchema),
    defaultValues: defaultEventValues,
  });

  const onSubmit = async (data) => {
    if (!eventPermissions.canCreate) {
      toast.error("You don't have permission to create events");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Form data for submission:', data);

      // Submit to API using the protected createEvent service
      const response = await createEvent(data);

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

      if (isPermissionError(error)) {
        toast.error(getPermissionErrorMessage(error));
      } else {
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
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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

  // Show create permission denied
  if (!eventPermissions.canCreate) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Permission Required</h2>
          <p className="text-gray-600 mb-4">You don't have permission to create events.</p>
          <Button onClick={() => router.push('/admin/events')}>Back to Events</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 py-6 mx-auto max-w-5xl">
        {/* Permission Status Banner */}
        {/* <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Your Event Creation Permissions:</h4>
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge variant={eventPermissions.canCreate ? 'default' : 'secondary'}>
              Create: {eventPermissions.canCreate ? '✓' : '✗'}
            </Badge>
          </div>
        </div> */}

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

// Wrapper component that provides permission context
const AdminEventCreate = () => {
  return (
    <PermissionProvider>
      <AdminEventCreateContent />
    </PermissionProvider>
  );
};

export default AdminEventCreate;
