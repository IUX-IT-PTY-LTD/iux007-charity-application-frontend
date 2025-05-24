'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, ImageIcon } from 'lucide-react';

// Import shadcn components
import { Card, CardContent, CardFooter } from '@/components/ui/card';
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
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';

const EventForm = ({ form, onSubmit, submitButtonText = 'Create Event', isSubmitting = false }) => {
  const [imagePreview, setImagePreview] = useState(null);

  // Handle file upload and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      form.setValue('featured_image', file);
      form.setValue('image_upload_type', 'file');

      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // If we already have an image (for edit mode)
  React.useEffect(() => {
    const featuredImage = form.getValues('featured_image');
    // Set default image upload type
    if (!form.getValues('image_upload_type')) {
      form.setValue('image_upload_type', 'file');
    }

    // Set image preview if available
    if (featuredImage && typeof featuredImage === 'string' && !imagePreview) {
      setImagePreview(featuredImage);
      if (featuredImage.startsWith('http')) {
        form.setValue('image_upload_type', 'url');
        form.setValue('feature_image_url', featuredImage);
      }
    }
  }, [form, imagePreview]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="space-y-6 pt-6">
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
                  <FormDescription>Provide a complete description of the event</FormDescription>
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
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
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
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
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
                  <FormDescription>Physical address or virtual meeting link</FormDescription>
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
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Fixed Donation</FormLabel>
                        <FormDescription>Attendees can only donate the fixed price</FormDescription>
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
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Featured Event</FormLabel>
                        <FormDescription>Highlight this event on the homepage</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <FormLabel>Featured Image</FormLabel>
              <div className="mt-2 space-y-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <FormField
                      control={form.control}
                      name="image_upload_type"
                      render={({ field }) => (
                        <>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <input
                                type="radio"
                                id="upload_file"
                                checked={field.value !== 'url'}
                                onChange={() => form.setValue('image_upload_type', 'file')}
                              />
                            </FormControl>
                            <Label htmlFor="upload_file">Upload Image</Label>
                          </FormItem>

                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <input
                                type="radio"
                                id="image_url"
                                checked={field.value === 'url'}
                                onChange={() => form.setValue('image_upload_type', 'url')}
                              />
                            </FormControl>
                            <Label htmlFor="image_url">Image URL</Label>
                          </FormItem>
                        </>
                      )}
                    />
                  </div>

                  {form.watch('image_upload_type') === 'url' ? (
                    <FormField
                      control={form.control}
                      name="feature_image_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="https://example.com/image.jpg"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                setImagePreview(e.target.value);
                                form.setValue('featured_image', e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <div>
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
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => form.reset()}>
              Reset
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : submitButtonText}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default EventForm;
