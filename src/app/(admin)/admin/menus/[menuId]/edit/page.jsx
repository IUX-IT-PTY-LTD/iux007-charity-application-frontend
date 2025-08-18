// src/app/(admin)/admin/menus/[menuId]/edit/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAdminContext } from '@/components/admin/layout/admin-context';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';

// Import services
import { menuService } from '@/api/services/admin/menuService';

// Import components
import EditMenuForm from '@/components/admin/menus/edit/EditMenuForm';
import EditMenuPreview from '@/components/admin/menus/edit/EditMenuPreview';
import EditFormActions from '@/components/admin/menus/edit/EditFormActions';

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

const EditMenuPage = () => {
  const params = useParams();
  const router = useRouter();
  const { menuId } = params;
  const { setPageTitle, setPageSubtitle } = useAdminContext();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [originalSlug, setOriginalSlug] = useState('');
  const [originalOrdering, setOriginalOrdering] = useState(null);

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

  useEffect(() => {
    setPageTitle(`Edit Menu: ${formValues.name || 'Loading...'}`);
    setPageSubtitle('Update your website navigation menu');
  }, [formValues.name, setPageTitle, setPageSubtitle]);

  // Fetch menu data
  useEffect(() => {
    const fetchMenuData = async () => {
      setIsLoading(true);
      try {
        const response = await menuService.getMenuDetails(menuId);

        if (response.status === 'success') {
          const menuData = response.data;

          // Set original values to track changes
          setOriginalSlug(menuData.slug);
          setOriginalOrdering(menuData.ordering);

          // Update form with fetched data
          form.reset(menuData);
        } else {
          throw new Error(response.message || 'Failed to fetch menu details');
        }
      } catch (error) {
        console.error('Error fetching menu:', error);
        setError('Failed to load menu. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuData();
  }, [menuId, form]);

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
      const response = await menuService.updateMenu(menuId, data);

      if (response.status === 'success') {
        toast.success('Menu updated successfully!');
        router.push('/admin/menus');
      } else {
        throw new Error(response.message || 'Failed to update menu');
      }
    } catch (error) {
      console.error('Error updating menu:', error);

      // Extract validation errors from the response
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
          toast.error('Failed to update menu', {
            description: error.message,
          });
        }
      } else {
        toast.error('Failed to update menu. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle menu deletion
  const handleDelete = async () => {
    try {
      const response = await menuService.deleteMenu(menuId);

      if (response.status === 'success') {
        toast.success('Menu deleted successfully!');
        router.push('/admin/menus');
      } else {
        throw new Error(response.message || 'Failed to delete menu');
      }
    } catch (error) {
      console.error('Error deleting menu:', error);
      toast.error('Failed to delete menu. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="mt-2 text-gray-600 dark:text-gray-400">Loading menu data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 py-6 mx-auto max-w-5xl">
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-800">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600">{error}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => router.push('/admin/menus')} variant="outline">
                Back to Menus
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 py-6 mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Form Section */}
          <div className="md:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <EditMenuForm
                  form={form}
                  generateSlug={generateSlug}
                  originalSlug={originalSlug}
                  FormActions={() => (
                    <EditFormActions isSubmitting={isSubmitting} handleDelete={handleDelete} />
                  )}
                />
              </form>
            </Form>
          </div>

          {/* Preview Section */}
          <div className="md:col-span-1">
            <EditMenuPreview formValues={formValues} menuId={menuId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMenuPage;
