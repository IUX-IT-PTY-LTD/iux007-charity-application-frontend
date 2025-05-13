"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAdminContext } from "@/components/admin/admin-context";
import { Save, ArrowLeft } from "lucide-react";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  question: z.string().min(5, {
    message: "Question must be at least 5 characters.",
  }),
  answer: z.string().min(10, {
    message: "Answer must be at least 10 characters.",
  }),
  ordering: z.coerce.number().int().positive({
    message: "Ordering must be a positive number.",
  }),
  status: z.string().default("1"),
});

// Component for the edit page
export default function EditFAQ({ params }) {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();
  const [faq, setFaq] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      answer: "",
      ordering: 1,
      status: "1",
    },
    mode: "onChange",
  });

  // Set page title and subtitle
  useEffect(() => {
    setPageTitle("Edit FAQ");
    setPageSubtitle("Update frequently asked question details");
  }, [setPageTitle, setPageSubtitle]);

  // Fetch FAQ data based on the ID
  useEffect(() => {
    const fetchFaq = async () => {
      setIsLoading(true);
      try {
        // For testing: Get FAQs from localStorage
        const storedFaqs = JSON.parse(localStorage.getItem("faqs") || "[]");
        const foundFaq = storedFaqs.find((f) => f.id === params.id);

        if (foundFaq) {
          setFaq(foundFaq);

          // Set form values
          form.reset({
            question: foundFaq.question,
            answer: foundFaq.answer,
            ordering: Number(foundFaq.ordering),
            status: foundFaq.status,
          });
        } else {
          toast.error("FAQ not found");
          router.push("/admin/faqs");
        }

        /* API Implementation (Commented out for future use)
        const response = await fetch(`/api/faqs/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch FAQ');
        }
        
        const faqData = await response.json();
        setFaq(faqData);
        
        form.reset({
          question: faqData.question,
          answer: faqData.answer,
          ordering: Number(faqData.ordering),
          status: faqData.status,
        });
        */
      } catch (error) {
        console.error("Error fetching FAQ:", error);
        toast.error("Failed to load FAQ data");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchFaq();
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

  // Handle form submission
  const onSubmit = (data) => {
    try {
      // Get all FAQs
      const allFaqs = JSON.parse(localStorage.getItem("faqs") || "[]");

      // Find the index of the FAQ to update
      const faqIndex = allFaqs.findIndex((f) => f.id === params.id);

      if (faqIndex !== -1) {
        // Update the FAQ data
        const updatedFaq = {
          ...allFaqs[faqIndex],
          ...data,
        };

        // Update the array
        allFaqs[faqIndex] = updatedFaq;

        // Save back to localStorage
        localStorage.setItem("faqs", JSON.stringify(allFaqs));

        // Show success message
        toast.success("FAQ updated successfully");

        // Reset unsaved changes flag
        setHasUnsavedChanges(false);

        // Navigate back to FAQs list
        router.push("/admin/faqs");
      } else {
        toast.error("FAQ not found");
      }

      /* API Implementation (Commented out for future use)
      // API call with PUT method for update
      fetch(`/api/faqs/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          toast.success("FAQ updated successfully");
          setHasUnsavedChanges(false);
          router.push('/admin/faqs');
        })
        .catch(error => {
          console.error('Error updating FAQ:', error);
          toast.error("Failed to update FAQ. Please try again.");
        });
      */
    } catch (error) {
      console.error("Error updating FAQ:", error);
      toast.error("Failed to update FAQ");
    }
  };

  // Handle FAQ deletion
  const handleDelete = () => {
    try {
      // Get all FAQs
      const allFaqs = JSON.parse(localStorage.getItem("faqs") || "[]");

      // Filter out the FAQ to delete
      const updatedFaqs = allFaqs.filter((f) => f.id !== params.id);

      // Save back to localStorage
      localStorage.setItem("faqs", JSON.stringify(updatedFaqs));

      // Show success message
      toast.success("FAQ deleted successfully");

      // Navigate back to FAQs list
      router.push("/admin/faqs");

      /* API Implementation (Commented out for future use)
      fetch(`/api/faqs/${params.id}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(() => {
          toast.success("FAQ deleted successfully");
          router.push('/admin/faqs');
        })
        .catch(error => {
          console.error('Error deleting FAQ:', error);
          toast.error("Failed to delete FAQ. Please try again.");
        });
      */
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      toast.error("Failed to delete FAQ");
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
                    router.push("/admin/faqs");
                  }
                } else {
                  router.push("/admin/faqs");
                }
              }}
              className="mb-2 sm:mb-0"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to FAQs
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
                    Delete FAQ
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete this FAQ. This action cannot
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
                      <CardTitle>Edit FAQ</CardTitle>
                      <CardDescription>
                        Update this frequently asked question
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="question"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Question</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              Enter the question as it should appear to users.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="answer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Answer</FormLabel>
                            <FormControl>
                              <Textarea className="min-h-32" {...field} />
                            </FormControl>
                            <FormDescription>
                              The detailed response to the question above.
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
                              Lower numbers appear first in the FAQ list.
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
                          <FormItem className="space-y-3">
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                value={field.value}
                                className="flex flex-row space-x-4"
                              >
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="1" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Active
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="0" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Inactive
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormDescription>
                              Only active FAQs are visible to users.
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
                        onClick={() => {
                          form.reset({
                            question: faq.question,
                            answer: faq.answer,
                            ordering: Number(faq.ordering),
                            status: faq.status,
                          });
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
                    <div>
                      <h3 className="text-lg font-semibold">
                        {form.watch("question") || "Your Question"}
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
                      <p className="text-sm whitespace-pre-wrap">
                        {form.watch("answer") ||
                          "Your answer will appear here..."}
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
