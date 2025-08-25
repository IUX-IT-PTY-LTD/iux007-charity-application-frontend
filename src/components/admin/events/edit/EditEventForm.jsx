'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, ImageIcon, Lock } from 'lucide-react';

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

// Import permission hooks
import { useEventPermissions } from '@/api/hooks/useModulePermissions';

const EditEventForm = ({
  form,
  onSubmit,
  isSubmitting = false,
  onReset,
  onImageChange,
  eventPermissions: passedPermissions,
}) => {
  const [imagePreview, setImagePreview] = useState(null);

  // Use passed permissions if available, otherwise use hook
  const hookPermissions = useEventPermissions();
  const eventPermissions = passedPermissions || hookPermissions;

  // Handle file upload and preview
  const handleImageChange = (e) => {
    if (!eventPermissions.canEdit) return;

    const file = e.target.files[0];
    if (file) {
      // Convert image file to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
        form.setValue('featured_image', base64String);

        // Notify parent component that image has been changed
        if (onImageChange) {
          onImageChange(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // If we already have an image (for edit mode)
  React.useEffect(() => {
    const featuredImage = form.getValues('featured_image');

    // Set image preview if available
    if (featuredImage && typeof featuredImage === 'string' && !imagePreview) {
      setImagePreview(featuredImage);
    }
  }, [form, imagePreview]);

  // Check if form should be disabled based on permissions
  const isFormDisabled = eventPermissions.isLoading || !eventPermissions.canEdit;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="space-y-6 pt-6">
            {/* Show permission warning if user doesn't have edit permission */}
            {!eventPermissions.isLoading && !eventPermissions.canEdit && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-2">
                <Lock className="h-4 w-4 text-orange-600" />
                <p className="text-sm text-orange-600">
                  You don't have permission to edit events. Form is read-only.
                </p>
              </div>
            )}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Spring Fundraiser Gala"
                      disabled={isFormDisabled}
                      {...field}
                    />
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
                      disabled={isFormDisabled}
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
                            disabled={isFormDisabled}
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
                          disabled={isFormDisabled}
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
                            disabled={isFormDisabled}
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
                          disabled={(date) => date < form.getValues('start_date') || isFormDisabled}
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
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        disabled={isFormDisabled}
                        {...field}
                      />
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
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        disabled={isFormDisabled}
                        {...field}
                      />
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
                    <Input
                      placeholder="123 Main St, City, State"
                      disabled={isFormDisabled}
                      {...field}
                      value={field.value || ''}
                    />
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
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value, 10))}
                      value={field.value.toString()}
                      disabled={isFormDisabled}
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
                          checked={field.value === 1}
                          onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)}
                          disabled={isFormDisabled}
                        />
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
                        <Checkbox
                          checked={field.value === 1}
                          onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)}
                          disabled={isFormDisabled}
                        />
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
                <div>
                  <Label
                    htmlFor="featured_image"
                    className={`cursor-pointer ${isFormDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center">
                      {imagePreview ? (
                        <div className="w-full">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-48 object-cover rounded-md mx-auto"
                          />
                          <p className="text-sm text-center mt-2 text-muted-foreground">
                            {isFormDisabled ? 'Image upload disabled' : 'Click to change image'}
                          </p>
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="h-10 w-10 text-gray-400" />
                          <p className="mt-2 text-sm text-muted-foreground">
                            {isFormDisabled
                              ? 'Image upload disabled'
                              : 'Click to upload an image (PNG, JPG)'}
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
                    disabled={isFormDisabled}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={onReset}
              disabled={isFormDisabled}
              title={!eventPermissions.canEdit ? "You don't have permission to edit events" : ''}
            >
              {!eventPermissions.canEdit && <Lock className="mr-2 h-4 w-4" />}
              Reset Changes
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting || isFormDisabled}
            >
              {isFormDisabled ? (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  No Permission
                </>
              ) : isSubmitting ? (
                'Saving...'
              ) : (
                'Save Changes'
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default EditEventForm;
