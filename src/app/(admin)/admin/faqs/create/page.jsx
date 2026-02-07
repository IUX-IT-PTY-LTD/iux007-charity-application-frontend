// src/app/(admin)/admin/faqs/create/page.jsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { Save, ArrowLeft } from 'lucide-react';

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
import RichTextEditor from '@/components/ui/rich-text-editor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

// Import API services
import {
  createFaq,
  getAllFaqs,
  validateFaqData,
  formatFaqDataForSubmission,
  isOrderingInUse,
  getNextAvailableOrdering,
} from '@/api/services/admin/protected/faqService';
import { isAuthenticated } from '@/api/services/admin/authService';

// Define form schema with validation
const formSchema = z.object({
  question: z.string().min(5, {
    message: 'Question must be at least 5 characters.',
  }),
  answer: z.string()
    .min(1, { message: 'Answer is required.' })
    .refine((value) => {
      // Remove HTML tags and check text content length
      const textContent = value.replace(/<[^>]*>/g, '').trim();
      return textContent.length >= 10;
    }, {
      message: 'Answer must contain at least 10 characters of text content.',
    }),
  ordering: z.coerce.number().int().positive({
    message: 'Ordering must be a positive number.',
  }),
  status: z.string().default('1'),
});

const AdminCreateFAQ = () => {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingFaqs, setExistingFaqs] = useState([]);

  // Set page title and subtitle
  useEffect(() => {
    setPageTitle('Create New FAQ');
    setPageSubtitle('Add frequently asked questions for your users');
  }, [setPageTitle, setPageSubtitle]);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error('Authentication required. Please log in.');
      router.push('/admin/login');
    }
  }, [router]);

  // Fetch existing FAQs to get next available ordering
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await getAllFaqs();
        if (response.status === 'success' && response.data) {
          setExistingFaqs(response.data);

          // Set next available ordering number
          const nextOrdering = getNextAvailableOrdering(response.data);
          form.setValue('ordering', nextOrdering);
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      }
    };

    fetchFaqs();
  }, []);

  // Initialize form with validation
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
      answer: '',
      ordering: 1,
      status: '1',
    },
  });

  // For form preview
  const formPreview = form.watch();

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Validate FAQ data
      const { isValid, errors } = validateFaqData(data);
      if (!isValid) {
        errors.forEach((error) => toast.error(error));
        setIsSubmitting(false);
        return;
      }

      // Check if ordering is already in use
      if (isOrderingInUse(data.ordering, existingFaqs)) {
        toast.error('This ordering number is already in use. Please choose a different number.');
        setIsSubmitting(false);
        return;
      }

      // Format data for API submission
      const formattedData = formatFaqDataForSubmission(data);

      // Submit to API
      const response = await createFaq(formattedData);

      if (response.status === 'success') {
        toast.success('FAQ created successfully!');
        router.push('/admin/faqs');
      } else {
        toast.error(response.message || 'Failed to create FAQ');
      }
    } catch (error) {
      console.error('Error creating FAQ:', error);

      // Handle the ordering error from API
      if (error.message && error.message.includes('ordering has already been taken')) {
        toast.error('This ordering number is already in use. Please choose a different number.');
      } else {
        toast.error(error.message || 'An error occurred while creating the FAQ');
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
              onClick={() => router.push('/admin/faqs')}
              className="mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to FAQs
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Form Section */}
            <div className="md:col-span-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>FAQ Information</CardTitle>
                      <CardDescription>
                        Create a new frequently asked question for your website.
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
                              <Input placeholder="e.g. How do I reset my password?" {...field} />
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
                              <RichTextEditor
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Provide a clear and helpful answer..."
                                minHeight="300px"
                                className="w-full"
                              />
                            </FormControl>
                            <FormDescription>
                              The detailed response to the question above. Use the toolbar to format your text with bold, italic, lists, links, and more.
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
                              Lower numbers appear first in the FAQ list. Each FAQ must have a
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
                          <FormItem className="space-y-3">
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-row space-x-4"
                              >
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="1" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Active</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="0" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Inactive</FormLabel>
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
                            question: '',
                            answer: '',
                            ordering: getNextAvailableOrdering(existingFaqs),
                            status: '1',
                          });
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
                        {isSubmitting ? 'Creating...' : 'Create FAQ'}
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
                        {formPreview.question || 'Your Question'}
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
                      {formPreview.answer ? (
                        <div 
                          className="text-sm prose prose-sm max-w-none dark:prose-invert"
                          dangerouslySetInnerHTML={{ __html: formPreview.answer }}
                        />
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          Your answer will appear here...
                        </p>
                      )}
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

export default AdminCreateFAQ;
