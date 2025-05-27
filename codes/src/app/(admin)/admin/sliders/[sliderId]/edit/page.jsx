// src/app/(admin)/admin/sliders/[sliderId]/edit/page.jsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { Save, ArrowLeft, ImageIcon } from 'lucide-react';

// Import shadcn components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
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
import { toast } from 'sonner';

// Import API services
import {
  getAllSliders,
  updateSlider,
  deleteSlider,
  validateSliderData,
  formatSliderDataForSubmission,
  isOrderingInUse,
  prepareImageForSubmission,
} from '@/api/services/admin/sliderService';
import { isAuthenticated } from '@/api/services/admin/authService';

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

// Component for the edit page
export default function EditSlider({ params }) {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();
  const [slider, setSlider] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalFormData, setOriginalFormData] = useState(null);
  const [existingSliders, setExistingSliders] = useState([]);

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

  // Fetch slider data and all sliders for ordering validation
  useEffect(() => {
    const fetchData = async () => {
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
        toast.error(error.message || 'Failed to load slider data');
        router.push('/admin/sliders');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.sliderId) {
      fetchData();
    }
  }, [params.sliderId, router, form]);

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
  const handleImageChange = (e) => {
    const file = e.target.files[0];
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

      setHasUnsavedChanges(true);
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
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

      // Prepare image data
      let imageData = data.image;

      // If image is a File object, convert to base64
      if (data.image instanceof File) {
        imageData = await prepareImageForSubmission(data.image);
      } else if (!data.image && imagePreview) {
        // If no new image but we have the existing preview, use that
        imageData = imagePreview;
      }

      // Format data for API submission
      const formattedData = formatSliderDataForSubmission({
        ...data,
        image: imageData,
      });

      // Submit to API
      const response = await updateSlider(params.sliderId, formattedData);

      if (response.status === 'success') {
        toast.success(response.message || 'Slider updated successfully!');
        setHasUnsavedChanges(false);
        router.push('/admin/sliders');
      } else {
        toast.error(response.message || 'Failed to update slider');
      }
    } catch (error) {
      console.error('Error updating slider:', error);

      // Handle the ordering error from API
      if (error.message && error.message.includes('ordering has already been taken')) {
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
    try {
      setIsDeleting(true);

      // Call API to delete slider
      const response = await deleteSlider(params.sliderId);

      if (response.status === 'success') {
        toast.success(response.message || 'Slider deleted successfully!');
        router.push('/admin/sliders');
      } else {
        toast.error(response.message || 'Failed to delete slider');
      }
    } catch (error) {
      console.error('Error deleting slider:', error);
      toast.error(error.message || 'An error occurred while deleting the slider');
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
      setHasUnsavedChanges(false);
      toast.info('Form reset to original values');
    }
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
              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Slider'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the "{slider?.title}" slider. This action cannot
                      be undone.
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
              </AlertDialog>

              <Button
                onClick={form.handleSubmit(onSubmit)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Form Section */}
            <div className="md:col-span-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Edit Slider: {slider?.title}</CardTitle>
                      <CardDescription>
                        Update the content and settings for this slider
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slider Title</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              The main title displayed on the slider.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea className="min-h-24" {...field} />
                            </FormControl>
                            <FormDescription>
                              Additional text to display on the slider.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="ordering"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Order Priority</FormLabel>
                            <FormControl>
                              <Input type="number" min={1} {...field} />
                            </FormControl>
                            <FormDescription>
                              Lower numbers appear first in the carousel. Each slider must have a
                              unique ordering number.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Separator className="my-2" />

                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1">Active</SelectItem>
                                <SelectItem value="0">Inactive</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Only active sliders are displayed on the website.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div>
                        <FormLabel>Slider Image</FormLabel>
                        <div className="mt-2">
                          <Label htmlFor="image" className="cursor-pointer">
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center">
                              {imagePreview ? (
                                <div className="w-full">
                                  <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="max-h-64 object-contain rounded-md mx-auto"
                                  />
                                  <p className="text-sm text-center mt-2 text-muted-foreground">
                                    Click to change image
                                  </p>
                                </div>
                              ) : (
                                <>
                                  <ImageIcon className="h-10 w-10 text-gray-400" />
                                  <p className="mt-2 text-sm text-muted-foreground">
                                    Click to upload an image (PNG, JPG)
                                  </p>
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    Recommended size: 1920x600px
                                  </p>
                                </>
                              )}
                            </div>
                          </Label>
                          <Input
                            id="image"
                            type="file"
                            onChange={handleImageChange}
                            className="hidden"
                            accept="image/*"
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={handleReset}
                        disabled={isSubmitting}
                      >
                        Reset Changes
                      </Button>
                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </CardFooter>
                  </Card>
                </form>
              </Form>
            </div>

            {/* Preview Section */}
            <div className="md:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="overflow-hidden rounded-md border">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Slider Preview"
                          className="w-full h-32 object-cover"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            No image selected
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold">
                        {form.watch('title') || 'Slider Title'}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={form.watch('status') === '1' ? 'default' : 'secondary'}
                          className={
                            form.watch('status') === '1'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                          }
                        >
                          {form.watch('status') === '1' ? 'Active' : 'Inactive'}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Order: {form.watch('ordering')}
                        </span>
                      </div>
                    </div>

                    <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                      <p className="text-xs text-gray-500 mb-2">Description Preview:</p>
                      <p className="text-sm line-clamp-5">
                        {form.watch('description') || 'No description...'}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between text-xs text-gray-500">
                  <span>ID: {params.sliderId}</span>
                  <span>{hasUnsavedChanges ? 'Unsaved changes' : 'No changes'}</span>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
