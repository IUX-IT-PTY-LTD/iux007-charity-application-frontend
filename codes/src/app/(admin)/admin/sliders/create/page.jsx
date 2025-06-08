// src/app/(admin)/admin/sliders/create/page.jsx

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
import { toast } from 'sonner';

// Import API services
import {
  createSlider,
  getAllSliders,
  validateSliderData,
  formatSliderDataForSubmission,
  isOrderingInUse,
  getNextAvailableOrdering,
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

const AdminSliderCreate = () => {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingSliders, setExistingSliders] = useState([]);

  // Initialize form with validation
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      ordering: 1,
      status: '1',
      image: null,
    },
  });

  // Set page title and subtitle
  useEffect(() => {
    setPageTitle('Create Slider');
    setPageSubtitle('Add a new slider to your homepage carousel');
  }, [setPageTitle, setPageSubtitle]);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error('Authentication required. Please log in.');
      router.push('/admin/login');
    }
  }, [router]);

  // Fetch existing sliders to get next available ordering
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await getAllSliders();
        if (response.status === 'success' && response.data) {
          setExistingSliders(response.data);

          // Set next available ordering number
          const nextOrdering = getNextAvailableOrdering(response.data);
          form.setValue('ordering', nextOrdering);
        }
      } catch (error) {
        console.error('Error fetching sliders:', error);
      }
    };

    fetchSliders();
  }, [form]);

  // For form preview
  const formPreview = form.watch();

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
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Validate slider data
      const { isValid, errors } = validateSliderData(data);
      if (!isValid) {
        errors.forEach((error) => toast.error(error));
        setIsSubmitting(false);
        return;
      }

      // Check if ordering is already in use
      if (isOrderingInUse(data.ordering, existingSliders)) {
        toast.error('This ordering number is already in use. Please choose a different number.');
        setIsSubmitting(false);
        return;
      }

      // Prepare image data for submission
      const preparedImage = await prepareImageForSubmission(data.image);
      if (!preparedImage) {
        toast.error('Please upload an image for the slider');
        setIsSubmitting(false);
        return;
      }

      // Format data for API submission
      const formattedData = formatSliderDataForSubmission({
        ...data,
        image: preparedImage,
      });

      // Submit to API
      const response = await createSlider(formattedData);

      if (response.status === 'success') {
        toast.success('Slider created successfully!');
        router.push('/admin/sliders');
      } else {
        toast.error(response.message || 'Failed to create slider');
      }
    } catch (error) {
      console.error('Error creating slider:', error);

      // Handle the ordering error from API
      if (error.message && error.message.includes('ordering has already been taken')) {
        toast.error('This ordering number is already in use. Please choose a different number.');
      } else {
        toast.error(error.message || 'An error occurred while creating the slider');
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/admin/sliders')}
              className="mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sliders
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Form Section */}
            <div className="md:col-span-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Slider Information</CardTitle>
                      <CardDescription>
                        Create a new slider for your website carousel.
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
                              <Input placeholder="e.g. Summer Sale" {...field} />
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
                              <Textarea
                                placeholder="Enter a brief description..."
                                className="min-h-24"
                                {...field}
                              />
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
                              <Input type="number" min={1} placeholder="1" {...field} />
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        onClick={() => {
                          form.reset({
                            title: '',
                            description: '',
                            ordering: getNextAvailableOrdering(existingSliders),
                            status: '1',
                            image: null,
                          });
                          setImagePreview(null);
                        }}
                        disabled={isSubmitting}
                      >
                        Reset
                      </Button>
                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={isSubmitting}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {isSubmitting ? 'Creating...' : 'Create Slider'}
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
                    <div>
                      {imagePreview ? (
                        <div className="overflow-hidden rounded-md border">
                          <img
                            src={imagePreview}
                            alt="Slider Preview"
                            className="w-full h-32 object-cover"
                          />
                        </div>
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
                        {formPreview.title || 'Slider Title'}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={formPreview.status === '1' ? 'default' : 'secondary'}
                          className={
                            formPreview.status === '1'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                          }
                        >
                          {formPreview.status === '1' ? 'Active' : 'Inactive'}
                        </Badge>
                        <span className="text-xs text-gray-500">Order: {formPreview.ordering}</span>
                      </div>
                    </div>

                    <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                      <p className="text-xs text-gray-500 mb-2">Description Preview:</p>
                      <p className="text-sm line-clamp-5">
                        {formPreview.description || 'Your description will appear here...'}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="text-xs text-gray-500">
                  Changes will not be saved until form is submitted
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSliderCreate;
