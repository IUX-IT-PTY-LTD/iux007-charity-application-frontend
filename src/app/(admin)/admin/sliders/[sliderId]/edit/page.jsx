// src/app/(admin)/admin/sliders/[sliderId]/edit/page.jsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { ArrowLeft, Lock } from 'lucide-react';

// Import components
import SliderForm from '@/components/admin/sliders/edit/SliderForm';
import SliderPreview from '@/components/admin/sliders/edit/SliderPreview';
import SliderDeleteDialog from '@/components/admin/sliders/edit/SliderDeleteDialog';

// Import UI components
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Import PROTECTED API services
import {
  getAllSliders,
  updateSlider,
  deleteSlider,
  validateSliderData,
  formatSliderDataForSubmission,
  isOrderingInUse,
  prepareImageForSubmission,
} from '@/api/services/admin/protected/sliderService';
import { isAuthenticated } from '@/api/services/admin/authService';

// Import permission hooks and context
import { PermissionProvider } from '@/api/contexts/PermissionContext';
import { useSliderPermissions } from '@/api/hooks/useModulePermissions';
import { isPermissionError, getPermissionErrorMessage } from '@/api/utils/permissionErrors';

// Define form schema with validation
const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  ordering: z.coerce.number().int().positive({
    message: 'Ordering must be a positive number.',
  }),
  status: z.string().default('1'),
  image: z.any().optional(),
});

// Main Edit Component
const EditSliderContent = ({ params }) => {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();
  const sliderPermissions = useSliderPermissions();

  const [slider, setSlider] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalFormData, setOriginalFormData] = useState(null);
  const [existingSliders, setExistingSliders] = useState([]);
  const [imageChanged, setImageChanged] = useState(false);

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      ordering: 1,
      status: '1',
      image: null,
    },
    mode: 'onChange',
  });

  // Set page title and subtitle
  useEffect(() => {
    setPageTitle('Edit Slider');
    setPageSubtitle('Update slider content and settings');
  }, [setPageTitle, setPageSubtitle]);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error('Authentication required. Please log in.');
      router.push('/admin/login');
    }
  }, [router]);

  // Check permissions
  useEffect(() => {
    if (!sliderPermissions.isLoading) {
      if (!sliderPermissions.hasAccess) {
        toast.error("You don't have access to the Sliders module.");
        router.push('/admin/dashboard');
      } else if (!sliderPermissions.canView) {
        toast.error("You don't have permission to view sliders.");
        router.push('/admin/sliders');
      }
    }
  }, [sliderPermissions.isLoading, sliderPermissions.hasAccess, sliderPermissions.canView, router]);

  // Fetch slider data and all sliders for ordering validation
  useEffect(() => {
    const fetchData = async () => {
      if (!sliderPermissions.isLoading && sliderPermissions.canView) {
        setIsLoading(true);
        try {
          // Fetch all sliders for ordering validation
          const slidersResponse = await getAllSliders();

          if (slidersResponse.status === 'success' && slidersResponse.data) {
            const allSliders = slidersResponse.data;
            setExistingSliders(allSliders);

            // Find the slider we want to edit
            const currentSlider = allSliders.find(
              (s) => s.id.toString() === params.sliderId.toString()
            );

            if (currentSlider) {
              setSlider(currentSlider);

              // Create form values from the slider data
              const formValues = {
                title: currentSlider.title || '',
                description: currentSlider.description || '',
                ordering: Number(currentSlider.ordering) || 1,
                status: currentSlider.status?.toString() || '1',
                image: currentSlider.image || null,
              };

              // Set form values
              form.reset(formValues);

              // Store original form data for reset functionality
              setOriginalFormData(formValues);

              // Set image preview
              if (currentSlider.image) {
                setImagePreview(currentSlider.image);
              }
            } else {
              toast.error('Slider not found');
              router.push('/admin/sliders');
            }
          } else {
            toast.error('Failed to load sliders data');
            router.push('/admin/sliders');
          }
        } catch (error) {
          console.error('Error fetching slider data:', error);

          if (isPermissionError(error)) {
            toast.error(getPermissionErrorMessage(error));
          } else {
            toast.error(error.message || 'Failed to load slider data');
          }
          router.push('/admin/sliders');
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (params.sliderId) {
      fetchData();
    }
  }, [params.sliderId, router, form, sliderPermissions.isLoading, sliderPermissions.canView]);

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

  // Handle image change
  const handleImageChange = (file) => {
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (JPEG, PNG, GIF, WEBP)');
        return;
      }

      // Maximum file size (5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error('Image file size should be less than 5MB');
        return;
      }

      form.setValue('image', file);

      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      setImageChanged(true);
      setHasUnsavedChanges(true);
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    if (!sliderPermissions.canEdit) {
      toast.error("You don't have permission to edit sliders");
      return;
    }

    try {
      setIsSubmitting(true);

      // Validate slider data
      const { isValid, errors } = validateSliderData({
        ...data,
        id: params.sliderId, // Include ID for validation
      });

      if (!isValid) {
        errors.forEach((error) => toast.error(error));
        setIsSubmitting(false);
        return;
      }

      // Check if ordering is already in use by other sliders
      if (isOrderingInUse(data.ordering, existingSliders, params.sliderId)) {
        toast.error('This ordering number is already in use. Please choose a different number.');
        setIsSubmitting(false);
        return;
      }

      // Create a new object from data to modify before submission
      const submissionData = { ...data };

      // Handle the image based on whether it was changed
      if (!imageChanged && typeof data.image === 'string' && data.image.startsWith('http')) {
        // If image wasn't changed and it's a URL, don't send it in the request
        delete submissionData.image;
      } else if (data.image instanceof File) {
        // If image is a File object, convert to base64
        submissionData.image = await prepareImageForSubmission(data.image);
      }

      // Format data for API submission
      const formattedData = formatSliderDataForSubmission(submissionData);

      // Submit to protected API
      const response = await updateSlider(params.sliderId, formattedData);

      if (response.status === 'success') {
        toast.success('Slider updated successfully!');
        setHasUnsavedChanges(false);
        router.push('/admin/sliders');
      } else {
        throw new Error(response.message || 'Failed to update slider');
      }
    } catch (error) {
      console.error('Error updating slider:', error);

      if (isPermissionError(error)) {
        toast.error(getPermissionErrorMessage(error));
      } else if (error.message && error.message.includes('ordering has already been taken')) {
        toast.error('This ordering number is already in use. Please choose a different number.');
      } else {
        toast.error(error.message || 'An error occurred while updating the slider');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle slider deletion
  const handleDelete = async () => {
    if (!sliderPermissions.canDelete) {
      toast.error("You don't have permission to delete sliders");
      return;
    }

    try {
      setIsDeleting(true);

      // Call protected API to delete slider
      const response = await deleteSlider(params.sliderId);

      if (response.status === 'success') {
        toast.success('Slider deleted successfully!');
        router.push('/admin/sliders');
      } else {
        throw new Error(response.message || 'Failed to delete slider');
      }
    } catch (error) {
      console.error('Error deleting slider:', error);

      if (isPermissionError(error)) {
        toast.error(getPermissionErrorMessage(error));
      } else {
        toast.error(error.message || 'An error occurred while deleting the slider');
      }
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  // Reset form to original values
  const handleReset = () => {
    if (originalFormData) {
      form.reset(originalFormData);
      setImagePreview(originalFormData.image);
      setImageChanged(false);
      setHasUnsavedChanges(false);
      toast.info('Form reset to original values');
    }
  };

  // Show loading state while permissions are loading
  if (sliderPermissions.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading permissions...</p>
        </div>
      </div>
    );
  }

  // Show access denied if user has no slider access
  if (!sliderPermissions.hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access the Sliders module.
          </p>
          <Button onClick={() => router.push('/admin/dashboard')}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  // Show view permission denied if user can't view
  if (!sliderPermissions.canView) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">View Permission Required</h2>
          <p className="text-gray-600 mb-4">You don't have permission to view slider details.</p>
          <Button onClick={() => router.push('/admin/sliders')}>Back to Sliders</Button>
        </div>
      </div>
    );
  }

  // Show loading state while data is loading
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
                    router.push('/admin/sliders');
                  }
                } else {
                  router.push('/admin/sliders');
                }
              }}
              className="mb-2 sm:mb-0"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sliders
            </Button>

            <div className="flex items-center gap-2">
              {/* Delete button with permission checking */}
              <SliderDeleteDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onDelete={handleDelete}
                isDeleting={isDeleting}
                sliderTitle={slider?.title}
              />

              {/* Save button with permission checking */}
              {sliderPermissions.canEdit ? (
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              ) : (
                <Button
                  disabled
                  className="opacity-50 cursor-not-allowed"
                  title="You don't have permission to edit sliders"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Form Section */}
            <div className="md:col-span-2">
              <SliderForm
                form={form}
                onSubmit={onSubmit}
                isSubmitting={isSubmitting}
                onReset={handleReset}
                onImageChange={handleImageChange}
                imagePreview={imagePreview}
                slider={slider}
                sliderPermissions={sliderPermissions}
              />
            </div>

            {/* Preview Section */}
            <div className="md:col-span-1">
              <SliderPreview
                form={form}
                imagePreview={imagePreview}
                sliderId={params.sliderId}
                hasUnsavedChanges={hasUnsavedChanges}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrapper component that provides permission context
const EditSlider = ({ params }) => {
  return (
    <PermissionProvider>
      <EditSliderContent params={params} />
    </PermissionProvider>
  );
};

export default EditSlider;
