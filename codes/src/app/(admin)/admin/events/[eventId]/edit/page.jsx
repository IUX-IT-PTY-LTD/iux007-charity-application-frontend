// src/app/(admin)/admin/events/[eventId]/edit/page.jsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, ImageIcon, ArrowLeft, Save } from 'lucide-react';
import { useAdminContext } from '@/components/admin/layout/admin-context';

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
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
import { Label } from '@/components/ui/label';

// Import API services
import {
  getEventById,
  updateEvent,
  deleteEvent,
  validateEventData,
  formatEventDataForSubmission,
} from '@/api/services/admin/eventService';
import { isAuthenticated } from '@/api/services/admin/authService';

// Define form schema with validation
const formSchema = z
  .object({
    title: z.string().min(2, {
      message: 'Event title must be at least 2 characters.',
    }),
    description: z.string().min(10, {
      message: 'Description must be at least 10 characters.',
    }),
    start_date: z.date({
      required_error: 'Start date is required.',
    }),
    end_date: z.date({
      required_error: 'End date is required.',
    }),
    price: z.coerce.number().min(0, {
      message: 'Price must be a positive number.',
    }),
    target_amount: z.coerce.number().min(0, {
      message: 'Target amount must be a positive number.',
    }),
    is_fixed_donation: z.boolean().default(false),
    location: z.string().min(2, {
      message: 'Location must be at least 2 characters.',
    }),
    status: z.string().default('1'),
    is_featured: z.boolean().default(false),
    featured_image: z.any().optional(),
  })
  .refine((data) => data.end_date >= data.start_date, {
    message: 'End date must be after start date',
    path: ['end_date'],
  });

// Component for the edit page
export default function EditEvent({ params }) {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalFormData, setOriginalFormData] = useState(null);

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      start_date: new Date(),
      end_date: new Date(),
      price: 0,
      target_amount: 0,
      is_fixed_donation: false,
      location: '',
      status: '1',
      is_featured: false,
      featured_image: null,
    },
    mode: 'onChange',
  });

  // Set page title and subtitle
  useEffect(() => {
    setPageTitle('Edit Event');
    setPageSubtitle('Update event details and settings');
  }, [setPageTitle, setPageSubtitle]);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error('Authentication required. Please log in.');
      router.push('/admin/login');
    }
  }, [router]);

  // Fetch event data based on the ID
  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      try {
        // Fetch event data from API
        const eventData = await getEventById(params.eventId);

        if (eventData && eventData.status === 'success' && eventData.data) {
          const fetchedEvent = eventData.data;
          setEvent(fetchedEvent);

          // Parse date strings to Date objects
          const startDate = fetchedEvent.start_date
            ? parseISO(fetchedEvent.start_date)
            : new Date();
          const endDate = fetchedEvent.end_date ? parseISO(fetchedEvent.end_date) : new Date();

          // Format form values from API data
          const formValues = {
            title: fetchedEvent.title || '',
            description: fetchedEvent.description || '',
            start_date: startDate,
            end_date: endDate,
            price: Number(fetchedEvent.price) || 0,
            target_amount: Number(fetchedEvent.target_amount) || 0,
            is_fixed_donation:
              fetchedEvent.is_fixed_donation === '1' || fetchedEvent.is_fixed_donation === true,
            location: fetchedEvent.location || '',
            status: fetchedEvent.status?.toString() || '1',
            is_featured: fetchedEvent.is_featured === '1' || fetchedEvent.is_featured === true,
            featured_image: fetchedEvent.featured_image || null,
          };

          // Set form values
          form.reset(formValues);

          // Store original form data for reset functionality
          setOriginalFormData(formValues);

          // Set image preview if available
          if (fetchedEvent.featured_image) {
            setImagePreview(fetchedEvent.featured_image);
          }
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
      const { isValid, errors } = validateEventData(data);
      if (!isValid) {
        errors.forEach((error) => toast.error(error));
        setIsSubmitting(false);
        return;
      }

      // Format data for API submission
      const formattedData = formatEventDataForSubmission(data);

      // Debug
      console.log('Formatted data for submission:', formattedData);

      // Submit to API
      const response = await updateEvent(params.eventId, formattedData);

      if (response.status === 'success') {
        toast.success(response.message || 'Event updated successfully!');
        setHasUnsavedChanges(false);
        router.push('/admin/events');
      } else {
        toast.error(response.message || 'Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error(error.message || 'An error occurred while updating the event');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle event deletion
  const handleDelete = async () => {
    try {
      setIsSubmitting(true);

      // Call API to delete event
      const response = await deleteEvent(params.eventId);

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

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      form.setValue('featured_image', file);

      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      setHasUnsavedChanges(true);
    }
  };

  // Reset form to original values
  const handleReset = () => {
    if (originalFormData) {
      form.reset(originalFormData);
      setImagePreview(originalFormData.featured_image);
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
              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
                      <CardTitle>Edit Event: {event?.title}</CardTitle>
                      <CardDescription>Update the details for this event</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Title</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              The name of your event as it will appear to attendees
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
                              <Textarea className="min-h-32" {...field} />
                            </FormControl>
                            <FormDescription>
                              Provide a complete description of the event
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="start_date"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Start Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className="w-full flex justify-start text-left font-normal"
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {field.value ? (
                                        format(field.value, 'PPP')
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormDescription>When the event begins</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="end_date"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>End Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className="w-full flex justify-start text-left font-normal"
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {field.value ? (
                                        format(field.value, 'PPP')
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                    disabled={(date) => date < form.getValues('start_date')}
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormDescription>When the event concludes</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price ($)</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" step="0.01" {...field} />
                              </FormControl>
                              <FormDescription>Standard entry price</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="target_amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Target Amount ($)</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" step="0.01" {...field} />
                              </FormControl>
                              <FormDescription>Fundraising goal for this event</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              Physical address or virtual meeting link
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Separator />

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                              <FormDescription>Is this event currently active?</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="is_fixed_donation"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Fixed Donation</FormLabel>
                                  <FormDescription>
                                    Attendees can only donate the fixed price
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="is_featured"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Featured Event</FormLabel>
                                  <FormDescription>
                                    Highlight this event on the homepage
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div>
                        <FormLabel>Featured Image</FormLabel>
                        <div className="mt-2">
                          <Label htmlFor="featured_image" className="cursor-pointer">
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center">
                              {imagePreview ? (
                                <div className="w-full">
                                  <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="h-48 object-cover rounded-md mx-auto"
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
                                </>
                              )}
                            </div>
                          </Label>
                          <Input
                            id="featured_image"
                            type="file"
                            onChange={handleImageChange}
                            className="hidden"
                            accept="image/*"
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" type="button" onClick={handleReset}>
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
                    <div>
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Event"
                          className="w-full h-32 object-cover rounded-md"
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
                        {form.watch('title') || 'Event Title'}
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
                        {form.watch('is_featured') && (
                          <Badge
                            variant="outline"
                            className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                          >
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="text-sm">
                      <div className="grid grid-cols-3 gap-1">
                        <span className="text-muted-foreground">Dates:</span>
                        <span className="col-span-2">
                          {form.watch('start_date') &&
                            format(form.watch('start_date'), 'MMM d, yyyy')}
                          {' - '}
                          {form.watch('end_date') && format(form.watch('end_date'), 'MMM d, yyyy')}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-1 mt-1">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="col-span-2">{form.watch('location') || 'TBD'}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-1 mt-1">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="col-span-2">
                          ${form.watch('price')}
                          {form.watch('is_fixed_donation') && ' (Fixed)'}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-1 mt-1">
                        <span className="text-muted-foreground">Target:</span>
                        <span className="col-span-2">${form.watch('target_amount')}</span>
                      </div>
                    </div>

                    <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                      <p className="text-xs text-gray-500 mb-2">Description Preview:</p>
                      <p className="text-sm line-clamp-5">
                        {form.watch('description') || 'No description yet...'}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between text-xs text-gray-500">
                  <span>ID: {params.eventId}</span>
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
