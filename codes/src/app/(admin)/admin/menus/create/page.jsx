"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";

import AdminPageHeader from "@/components/admin-page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";

// Define form schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Menu name must be at least 2 characters.",
  }),
  slug: z.string().min(2, {
    message: "Slug must be at least 2 characters.",
  }),
  ordering: z.coerce.number().int().positive({
    message: "Ordering must be a positive number.",
  }),
  status: z.boolean().default(true),
});

const AdminMenus = () => {
  // Define form with zod validation
  const form = useForm({
    defaultValues: {
      name: "",
      slug: "",
      ordering: 1,
      status: true,
    },
    resolver: zodResolver(formSchema),
  });

  // For form preview - use the values directly from form.watch()
  // instead of creating a separate state that causes infinite loops
  const formPreview = form.watch();

  // Handle form submission
  const onSubmit = (data) => {
    // Convert status boolean to number for API
    const apiData = {
      ...data,
      status: data.status ? 1 : 0,
    };

    console.log("Submitted data:", apiData);
    // Send to backend API here

    // Show success toast
    toast({
      title: "Menu Created",
      description: `Successfully created menu: ${data.name}`,
    });
  };

  // Generate a slug from name
  const generateSlug = (name) => {
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w\-]+/g, "") // Remove all non-word chars
      .replace(/\-\-+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, ""); // Trim - from end of text

    form.setValue("slug", slug);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminPageHeader title="Create Menu" />

      <div className="container px-4 py-6 mx-auto max-w-5xl">
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
                    <CardTitle>Menu Information</CardTitle>
                    <CardDescription>
                      Create a new navigation menu for your website.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Menu Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Blog"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                if (!form.getValues("slug")) {
                                  generateSlug(e.target.value);
                                }
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            The name displayed in the admin panel.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <div className="flex items-center space-x-2">
                            <FormControl>
                              <Input placeholder="e.g. blog" {...field} />
                            </FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                generateSlug(form.getValues("name"))
                              }
                            >
                              Generate
                            </Button>
                          </div>
                          <FormDescription>
                            Used in URL and code references.
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
                            <Input
                              type="number"
                              min={1}
                              placeholder="1"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Lower numbers appear first in navigation.
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
                          <FormLabel>Menu Status</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(value === "1")
                            }
                            defaultValue={field.value ? "1" : "0"}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">Active</SelectItem>
                              <SelectItem value="0">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            When active, this menu will be available for use.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>

                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => form.reset()}
                    >
                      Reset
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Save Menu
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
                    <h3 className="text-lg font-semibold">
                      {formPreview.name || "Menu Name"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      /{formPreview.slug || "slug"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={formPreview.status ? "success" : "error"}
                      className={
                        formPreview.status
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {formPreview.status ? "Active" : "Inactive"}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Order: {formPreview.ordering}
                    </span>
                  </div>

                  <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                    <div className="text-xs text-gray-500 mb-2">
                      Menu items will appear here
                    </div>
                    <div className="h-24 border border-dashed rounded-md flex items-center justify-center">
                      <p className="text-xs text-gray-400">No items yet</p>
                    </div>
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
  );
};

export default AdminMenus;
