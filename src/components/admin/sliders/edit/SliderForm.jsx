'use client';

import { ImageIcon, Save } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
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
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';

const SliderForm = ({
  form,
  onSubmit,
  isSubmitting,
  onReset,
  onImageChange,
  imagePreview,
  slider,
}) => {
  // Handle image input change
  const handleImageInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageChange(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Edit Slider: {slider?.title}</CardTitle>
            <CardDescription>Update the content and settings for this slider</CardDescription>
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
                  <FormDescription>The main title displayed on the slider.</FormDescription>
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
                  <FormDescription>Additional text to display on the slider.</FormDescription>
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
                    Lower numbers appear first in the carousel. Each slider must have a unique
                    ordering number.
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
                  onChange={handleImageInputChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={onReset} disabled={isSubmitting}>
              Reset Changes
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default SliderForm;
