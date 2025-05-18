'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { CalendarIcon, ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useAdminContext } from '@/components/admin/admin-context';

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
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';

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
    end_date: z
      .date({
        required_error: 'End date is required.',
      })
      .refine((data) => data >= new Date(), {
        message: 'End date cannot be in the past.',
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

const AdminEventCreate = () => {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState(null);

  // Set page title and subtitle
  const { setPageTitle, setPageSubtitle } = useAdminContext();
  useEffect(() => {
    setPageTitle('Create Event');
    // setPageSubtitle("Add a new event to your calendar");
  }, [setPageTitle, setPageSubtitle]);

  // Initialize form with validation
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
  });

  const onSubmit = (data) => {
    // Prepare data for API submission
    const formData = {
      ...data,
      id: Date.now().toString(), // Generate a unique ID for local storage
    };

    console.log('Creating event:', formData);

    // Store in localStorage for testing
    const existingEvents = JSON.parse(localStorage.getItem('events') || '[]');
    existingEvents.push(formData);
    localStorage.setItem('events', JSON.stringify(existingEvents));

    // Show success message
    toast.success('Event created successfully!');

    // Redirect to events list
    router.push('/admin/events');

    /* API Implementation (Commented out for future use)
    // For actual API implementation, we would use FormData to handle file uploads
    const apiFormData = new FormData();
    
    // Add all form fields to FormData
    Object.keys(data).forEach(key => {
      if (key === 'featured_image' && data[key]) {
        apiFormData.append(key, data[key]);
      } else if (key === 'start_date' || key === 'end_date') {
        apiFormData.append(key, data[key].toISOString());
      } else {
        apiFormData.append(key, data[key]);
      }
    });

    // API call
    fetch('/api/events', {
      method: 'POST',
      body: apiFormData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        toast.success("Event created successfully!");
        router.push('/admin/events');
      })
      .catch(error => {
        console.error('Error creating event:', error);
        toast.error("Failed to create event. Please try again.");
      });
    */
  };

  // Handle file upload and preview
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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <Card>
                    <CardHeader>
                      {/* <CardTitle>Event Information</CardTitle>
                      <CardDescription>
                        Enter the details for your new event
                      </CardDescription> */}
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Spring Fundraiser Gala" {...field} />
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
                              <Textarea
                                placeholder="Describe your event in detail..."
                                className="min-h-32"
                                {...field}
                              />
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
                              <Input placeholder="123 Main St, City, State" {...field} />
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
                      <Button variant="outline" type="button" onClick={() => form.reset()}>
                        Reset
                      </Button>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                        Create Event
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

export default AdminEventCreate;
