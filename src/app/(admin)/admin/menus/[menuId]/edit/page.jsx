'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, Lock } from 'lucide-react';
import { useAdminContext } from '@/components/admin/layout/admin-context';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';

// Import protected services
import { getMenuDetails, updateMenu, deleteMenu, getMenus } from '@/api/services/admin/protected/menuService';
import { isAuthenticated } from '@/api/services/admin/authService';

// Import permission hooks and context
import { PermissionProvider } from '@/api/contexts/PermissionContext';
import { useMenuPermissions } from '@/api/hooks/useModulePermissions';
import { isPermissionError, getPermissionErrorMessage } from '@/api/utils/permissionErrors';

// Import components
import EditMenuForm from '@/components/admin/menus/edit/EditMenuForm';
import EditMenuPreview from '@/components/admin/menus/edit/EditMenuPreview';
import EditFormActions from '@/components/admin/menus/edit/EditFormActions';

// Define form schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Menu name must be at least 2 characters.',
  }),
  slug: z.string().optional(),
  parent_id: z.coerce.number().nullable().optional(),
  ordering: z.coerce.number().int().positive({
    message: 'Ordering must be a positive number.',
  }),
  status: z.number().int().min(0).max(1).default(1),
  show_in_page_builder: z.coerce.boolean().default(false),
});

// Main Edit Menu Page Component
const EditMenuPageContent = () => {
  const params = useParams();
  const router = useRouter();
  const { menuId } = params;
  const { setPageTitle, setPageSubtitle } = useAdminContext();
  const menuPermissions = useMenuPermissions();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [originalSlug, setOriginalSlug] = useState('');
  const [originalOrdering, setOriginalOrdering] = useState(null);
  const [parentMenus, setParentMenus] = useState([]);

  // Define form with zod validation
  const form = useForm({
    defaultValues: {
      name: '',
      slug: '',
      parent_id: null,
      ordering: 1,
      status: 1,
      show_in_page_builder: false,
    },
    resolver: zodResolver(formSchema),
  });

  // For form preview - use the values directly from form.watch()
  const formValues = form.watch();

  useEffect(() => {
    setPageTitle(`Edit Menu: ${formValues.name || 'Loading...'}`);
    setPageSubtitle('Update your website navigation menu');
  }, [formValues.name, setPageTitle, setPageSubtitle]);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error('Authentication required. Please log in.');
      router.push('/admin/login');
    }
  }, [router]);

  // Check if user has edit permission (view is also needed to see the data)
  useEffect(() => {
    if (!menuPermissions.isLoading && !menuPermissions.canView) {
      toast.error("You don't have permission to view menus.");
      router.push('/admin/menus');
    }
  }, [menuPermissions.isLoading, menuPermissions.canView, router]);

  // Fetch parent menus for dropdown
  useEffect(() => {
    const fetchParentMenus = async () => {
      if (menuPermissions.isLoading || !menuPermissions.canView) {
        return;
      }

      try {
        const response = await getMenus();
        if (response.status === 'success') {
          // Filter out the current menu to prevent self-parent assignment
          const availableParents = response.data.filter(menu => menu.id.toString() !== menuId);
          setParentMenus(availableParents);
        }
      } catch (error) {
        console.error('Error fetching parent menus:', error);
      }
    };

    fetchParentMenus();
  }, [menuId, menuPermissions.isLoading, menuPermissions.canView]);

  // Fetch menu data with permission handling
  useEffect(() => {
    const fetchMenuData = async () => {
      // Don't fetch if permissions are still loading or user doesn't have view permission
      if (menuPermissions.isLoading || !menuPermissions.canView) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await getMenuDetails(menuId);

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

        if (isPermissionError(error)) {
          setError(getPermissionErrorMessage(error));
          toast.error(getPermissionErrorMessage(error));
        } else {
          setError('Failed to load menu. Please try again later.');
          toast.error('Failed to load menu data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuData();
  }, [menuId, form, menuPermissions.isLoading, menuPermissions.canView]);

  // Generate a slug from name
  const generateSlug = (name) => {
    if (!menuPermissions.canEdit) {
      toast.error("You don't have permission to edit menus");
      return;
    }

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
    if (!menuPermissions.canEdit) {
      toast.error("You don't have permission to edit menus");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await updateMenu(menuId, data);

      if (response.status === 'success') {
        toast.success('Menu updated successfully!');
        router.push('/admin/menus');
      } else {
        throw new Error(response.message || 'Failed to update menu');
      }
    } catch (error) {
      console.error('Error updating menu:', error);

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

  // Handle menu deletion with permission checking
  const handleDelete = async () => {
    if (!menuPermissions.canDelete) {
      toast.error("You don't have permission to delete menus");
      return;
    }

    try {
      const response = await deleteMenu(menuId);

      if (response.status === 'success') {
        toast.success('Menu deleted successfully!');
        router.push('/admin/menus');
      } else {
        throw new Error(response.message || 'Failed to delete menu');
      }
    } catch (error) {
      console.error('Error deleting menu:', error);

      if (isPermissionError(error)) {
        toast.error(getPermissionErrorMessage(error));
      } else {
        toast.error('Failed to delete menu. Please try again.');
      }
    }
  };

  // Show loading state while permissions are loading
  if (menuPermissions.isLoading || (isLoading && !error)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {menuPermissions.isLoading ? 'Loading permissions...' : 'Loading menu data...'}
        </p>
      </div>
    );
  }

  // Show access denied if user doesn't have view permission
  if (!menuPermissions.canView) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to view or edit menus.</p>
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

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 py-6 mx-auto max-w-5xl">
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600">{error}</p>
            </CardContent>
            <CardFooter>
              <div className="space-x-2">
                <Button onClick={() => window.location.reload()} variant="outline">
                  Try Again
                </Button>
                <Button onClick={() => router.push('/admin/menus')}>Back to Menus</Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 py-6 mx-auto max-w-5xl">
        {/* Permission Status Banner */}
        {(!menuPermissions.canEdit || !menuPermissions.canDelete) && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Lock className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-900">Limited Access</h4>
                <p className="text-sm text-yellow-800 mt-1">
                  {!menuPermissions.canEdit &&
                    !menuPermissions.canDelete &&
                    'You have view-only access. You cannot edit or delete this menu.'}
                  {menuPermissions.canEdit &&
                    !menuPermissions.canDelete &&
                    'You can edit this menu but cannot delete it.'}
                  {!menuPermissions.canEdit &&
                    menuPermissions.canDelete &&
                    'You can delete this menu but cannot edit it.'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Form Section */}
          <div className="md:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <EditMenuForm
                  form={form}
                  generateSlug={generateSlug}
                  originalSlug={originalSlug}
                  menuPermissions={menuPermissions}
                  parentMenus={parentMenus}
                  FormActions={() => (
                    <EditFormActions
                      isSubmitting={isSubmitting}
                      handleDelete={handleDelete}
                      menuPermissions={menuPermissions}
                    />
                  )}
                />
              </form>
            </Form>
          </div>

          {/* Preview Section */}
          <div className="md:col-span-1">
            <EditMenuPreview
              formValues={formValues}
              menuId={menuId}
              menuPermissions={menuPermissions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrapper component that provides permission context
const EditMenuPage = () => {
  return (
    <PermissionProvider>
      <EditMenuPageContent />
    </PermissionProvider>
  );
};

export default EditMenuPage;
