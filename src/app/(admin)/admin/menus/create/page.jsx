'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { Lock } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Import protected services
import { createMenu, getMenus } from '@/api/services/admin/protected/menuService';
import { isAuthenticated } from '@/api/services/admin/authService';

// Import permission hooks and context
import { PermissionProvider } from '@/api/contexts/PermissionContext';
import { useMenuPermissions } from '@/api/hooks/useModulePermissions';
import { isPermissionError, getPermissionErrorMessage } from '@/api/utils/permissionErrors';

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
  parent_id: z.string().optional(),
  show_in_page_builder: z.boolean().default(false),
});

// Main Create Menu Page Component
const CreateMenuPageContent = () => {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();
  const menuPermissions = useMenuPermissions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allMenus, setAllMenus] = useState([]);
  const [loadingMenus, setLoadingMenus] = useState(true);

  // Set page title
  useEffect(() => {
    setPageTitle('Create New Menu Item');
    setPageSubtitle('Add a new navigation menu to your website');
  }, [setPageTitle, setPageSubtitle]);

  // Fetch all menus for parent selection
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoadingMenus(true);
        const response = await getMenus();
        if (response.status === 'success') {
          setAllMenus(response.data || []);
        }
      } catch (error) {
        console.error('Error fetching menus:', error);
        toast.error('Failed to load menus for parent selection');
      } finally {
        setLoadingMenus(false);
      }
    };

    if (menuPermissions.hasAccess) {
      fetchMenus();
    }
  }, [menuPermissions.hasAccess]);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error('Authentication required. Please log in.');
      router.push('/admin/login');
    }
  }, [router]);

  // Check if user has create permission
  useEffect(() => {
    if (!menuPermissions.isLoading && !menuPermissions.canCreate) {
      toast.error("You don't have permission to create menus.");
      router.push('/admin/menus');
    }
  }, [menuPermissions.isLoading, menuPermissions.canCreate, router]);

  // Define form with zod validation
  const form = useForm({
    defaultValues: {
      name: '',
      slug: '',
      ordering: 1,
      status: 1,
      parent_id: 'none',
      show_in_page_builder: false,
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

  // Handle form submission with permission checking
  const onSubmit = async (data) => {
    if (!menuPermissions.canCreate) {
      toast.error("You don't have permission to create menus");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for API
      const submitData = {
        ...data,
        parent_id: data.parent_id === 'none' ? null : data.parent_id, // Convert 'none' to null
      };

      const response = await createMenu(submitData);

      if (response.status === 'success') {
        toast.success('Menu created successfully!');
        router.push('/admin/menus');
      } else {
        throw new Error(response.message || 'Failed to create menu');
      }
    } catch (error) {
      console.error('Error creating menu:', error);

      // Handle permission errors
      if (isPermissionError(error)) {
        toast.error(getPermissionErrorMessage(error));
        return;
      }

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

  // Show loading state while permissions are loading
  if (menuPermissions.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading permissions...</p>
        </div>
      </div>
    );
  }

  // Show access denied if user doesn't have create permission
  if (!menuPermissions.canCreate) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to create menus.</p>
          <div className="space-x-2">
            <Button onClick={() => router.push('/admin/menus')}>Back to Menus</Button>
            <Button variant="outline" onClick={() => router.push('/admin/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
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
                <MenuForm
                  form={form}
                  generateSlug={generateSlug}
                  allMenus={allMenus}
                  loadingMenus={loadingMenus}
                  FormActions={() => (
                    <FormActions
                      form={form}
                      isSubmitting={isSubmitting}
                      menuPermissions={menuPermissions}
                    />
                  )}
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

// Wrapper component that provides permission context
const CreateMenuPage = () => {
  return (
    <PermissionProvider>
      <CreateMenuPageContent />
    </PermissionProvider>
  );
};

export default CreateMenuPage;
