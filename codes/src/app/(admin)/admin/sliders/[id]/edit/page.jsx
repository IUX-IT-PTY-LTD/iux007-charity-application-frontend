"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAdminContext } from "@/components/admin/admin-context";
import { Save, ArrowLeft, ImageIcon } from "lucide-react";

// Import shadcn components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

// Define form schema with validation
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  ordering: z.coerce.number().int().positive({
    message: "Ordering must be a positive number.",
  }),
  status: z.string().default("1"),
  image: z.any().optional(),
});

// Component for the edit page
export default function EditSlider({ params }) {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();
  const [slider, setSlider] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      ordering: 1,
      status: "1",
      image: null,
    },
    mode: "onChange",
  });

  // Set page title and subtitle
  useEffect(() => {
    setPageTitle("Edit Slider");
    setPageSubtitle("Update slider content and settings");
  }, [setPageTitle, setPageSubtitle]);

  // Fetch slider data based on the ID
  useEffect(() => {
    const fetchSlider = async () => {
      setIsLoading(true);
      try {
        // For testing: Get sliders from localStorage
        const storedSliders = JSON.parse(
          localStorage.getItem("sliders") || "[]"
        );
        const foundSlider = storedSliders.find((s) => s.id === params.id);

        if (foundSlider) {
          setSlider(foundSlider);

          // Set form values
          form.reset({
            title: foundSlider.title,
            description: foundSlider.description,
            ordering: Number(foundSlider.ordering),
            status: foundSlider.status,
            image: foundSlider.image,
          });

          // Set image preview
          setImagePreview(foundSlider.image);
        } else {
          toast.error("Slider not found");
          router.push("/admin/sliders");
        }

        /* API Implementation (Commented out for future use)
        const response = await fetch(`/api/sliders/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch slider');
        }
        
        const sliderData = await response.json();
        setSlider(sliderData);
        
        form.reset({
          title: sliderData.title,
          description: sliderData.description,
          ordering: Number(sliderData.ordering),
          status: sliderData.status,
          image: sliderData.image,
        });
        
        setImagePreview(sliderData.image);
        */
      } catch (error) {
        console.error("Error fetching slider:", error);
        toast.error("Failed to load slider data");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchSlider();
    }
  }, [params.id, router, form]);

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
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      form.setValue("image", file);

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
  const onSubmit = (data) => {
    try {
      // Get all sliders
      const allSliders = JSON.parse(localStorage.getItem("sliders") || "[]");

      // Find the index of the slider to update
      const sliderIndex = allSliders.findIndex((s) => s.id === params.id);

      if (sliderIndex !== -1) {
        // Update the slider data
        const updatedSlider = {
          ...allSliders[sliderIndex],
          ...data,
          image: imagePreview, // Use the preview image for storage
        };

        // Update the array
        allSliders[sliderIndex] = updatedSlider;

        // Save back to localStorage
        localStorage.setItem("sliders", JSON.stringify(allSliders));

        // Show success message
        toast.success("Slider updated successfully");

        // Reset unsaved changes flag
        setHasUnsavedChanges(false);

        // Navigate back to sliders list
        router.push("/admin/sliders");
      } else {
        toast.error("Slider not found");
      }

      /* API Implementation (Commented out for future use)
      // For actual API implementation, we would use FormData to handle file uploads
      const apiFormData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(data).forEach(key => {
        if (key === 'image' && data[key] && data[key] instanceof File) {
          apiFormData.append(key, data[key]);
        } else {
          apiFormData.append(key, data[key]);
        }
      });

      // API call with PUT method for update
      fetch(`/api/sliders/${params.id}`, {
        method: 'PUT',
        body: apiFormData,
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          toast.success("Slider updated successfully");
          setHasUnsavedChanges(false);
          router.push('/admin/sliders');
        })
        .catch(error => {
          console.error('Error updating slider:', error);
          toast.error("Failed to update slider. Please try again.");
        });
      */
    } catch (error) {
      console.error("Error updating slider:", error);
      toast.error("Failed to update slider");
    }
  };

  // Handle slider deletion
  const handleDelete = () => {
    try {
      // Get all sliders
      const allSliders = JSON.parse(localStorage.getItem("sliders") || "[]");

      // Filter out the slider to delete
      const updatedSliders = allSliders.filter((s) => s.id !== params.id);

      // Save back to localStorage
      localStorage.setItem("sliders", JSON.stringify(updatedSliders));

      // Show success message
      toast.success("Slider deleted successfully");

      // Navigate back to sliders list
      router.push("/admin/sliders");

      /* API Implementation (Commented out for future use)
      fetch(`/api/sliders/${params.id}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(() => {
          toast.success("Slider deleted successfully");
          router.push('/admin/sliders');
        })
        .catch(error => {
          console.error('Error deleting slider:', error);
          toast.error("Failed to delete slider. Please try again.");
        });
      */
    } catch (error) {
      console.error("Error deleting slider:", error);
      toast.error("Failed to delete slider");
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
                  if (
                    window.confirm(
                      "You have unsaved changes. Are you sure you want to leave?"
                    )
                  ) {
                    router.push("/admin/sliders");
                  }
                } else {
                  router.push("/admin/sliders");
                }
              }}
              className="mb-2 sm:mb-0"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sliders
            </Button>

            <div className="flex items-center gap-2">
              <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  >
                    Delete Slider
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the "{slider?.title}" slider.
                      This action cannot be undone.
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
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Form Section */}
            <div className="md:col-span-2">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
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
                              Lower numbers appear first in the carousel.
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
                        onClick={() => {
                          form.reset({
                            title: slider.title,
                            description: slider.description,
                            ordering: Number(slider.ordering),
                            status: slider.status,
                          });
                          setImagePreview(slider.image);
                          setHasUnsavedChanges(false);
                          toast.info("Form reset to original values");
                        }}
                      >
                        Reset Changes
                      </Button>
                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Save Changes
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
                        {form.watch("title") || "Slider Title"}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={
                            form.watch("status") === "1"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            form.watch("status") === "1"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                          }
                        >
                          {form.watch("status") === "1" ? "Active" : "Inactive"}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Order: {form.watch("ordering")}
                        </span>
                      </div>
                    </div>

                    <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                      <p className="text-xs text-gray-500 mb-2">
                        Description Preview:
                      </p>
                      <p className="text-sm line-clamp-5">
                        {form.watch("description") || "No description..."}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between text-xs text-gray-500">
                  <span>ID: {params.id}</span>
                  <span>
                    {hasUnsavedChanges ? "Unsaved changes" : "No changes"}
                  </span>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
