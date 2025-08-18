// src/app/(admin)/admin/menus/create/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useAdminContext } from '@/components/admin/layout/admin-context';

import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';

// Import services
import { menuService } from '@/api/services/admin/menuService';

// Import components
import MenuForm from '@/components/admin/menus/create/MenuForm';
import MenuPreview from '@/components/admin/menus/create/MenuPreview';
import FormActions from '@/components/admin/menus/create/FormActions';

// Define form schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Menu name must be at least 2 characters.',
  }),
  slug: z.string().min(2, {
    message: 'Slug must be at least 2 characters.',
  }),
  ordering: z.coerce.number().int().positive({
    message: 'Ordering must be a positive number.',
  }),
  status: z.number().int().min(0).max(1).default(1),
});

const CreateMenuPage = () => {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setPageTitle('Create New Menu Item');
    setPageSubtitle('Add a new navigation menu to your website');
  }, [setPageTitle, setPageSubtitle]);

  // Define form with zod validation
  const form = useForm({
    defaultValues: {
      name: '',
      slug: '',
      ordering: 1,
      status: 1,
    },
    resolver: zodResolver(formSchema),
  });

  // For form preview - use the values directly from form.watch()
  const formValues = form.watch();

  // Generate a slug from name
  const generateSlug = (name) => {
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text

    form.setValue('slug', slug);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const response = await menuService.createMenu(data);

      if (response.status === 'success') {
        toast.success('Menu created successfully!');
        router.push('/admin/menus');
      } else {
        throw new Error(response.message || 'Failed to create menu');
      }
    } catch (error) {
      console.error('Error creating menu:', error);

      // Extract validation errors from the response
      // This handles different error response formats
      const validationErrors =
        error.errors ||
        error.response?.data?.errors ||
        (error.response?.data && error.response.data);

      if (validationErrors) {
        // Handle slug error
        if (validationErrors.slug) {
          const slugError = Array.isArray(validationErrors.slug)
            ? validationErrors.slug[0]
            : validationErrors.slug;

          form.setError('slug', {
            type: 'manual',
            message: slugError,
          });
          toast.error(`Slug error: ${slugError}`, {
            description: 'Please choose a different slug name.',
          });
        }

        // Handle ordering error
        if (validationErrors.ordering) {
          const orderingError = Array.isArray(validationErrors.ordering)
            ? validationErrors.ordering[0]
            : validationErrors.ordering;

          form.setError('ordering', {
            type: 'manual',
            message: orderingError,
          });

          // Only show ordering toast if there's no slug error (to avoid multiple toasts)
          if (!validationErrors.slug) {
            toast.error(`Ordering error: ${orderingError}`, {
              description: 'Please choose a different ordering value.',
            });
          }
        }
      } else if (typeof error.message === 'string') {
        // Check for common error messages in the string
        if (
          error.message.includes('slug') &&
          (error.message.includes('taken') || error.message.includes('unique'))
        ) {
          form.setError('slug', {
            type: 'manual',
            message: 'This slug is already in use.',
          });
          toast.error('This slug is already in use', {
            description: 'Please choose a different slug name.',
          });
        } else if (
          error.message.includes('ordering') &&
          (error.message.includes('taken') || error.message.includes('unique'))
        ) {
          form.setError('ordering', {
            type: 'manual',
            message: 'This ordering position is already taken.',
          });
          toast.error('This ordering position is already taken', {
            description: 'Please choose a different ordering value.',
          });
        } else {
          toast.error('Failed to create menu', {
            description: error.message,
          });
        }
      } else {
        // Fallback to generic error
        toast.error('Failed to create menu. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 py-6 mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Form Section */}
          <div className="md:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <MenuForm
                  form={form}
                  generateSlug={generateSlug}
                  FormActions={() => <FormActions form={form} isSubmitting={isSubmitting} />}
                />
              </form>
            </Form>
          </div>

          {/* Preview Section */}
          <div className="md:col-span-1">
            <MenuPreview formValues={formValues} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMenuPage;
