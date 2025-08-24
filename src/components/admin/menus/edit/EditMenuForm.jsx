'use client';

import React from 'react';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Eye } from 'lucide-react';

// Import permission hooks
import { useMenuPermissions } from '@/api/hooks/useModulePermissions';

const EditMenuForm = ({ form, generateSlug, originalSlug, menuPermissions, FormActions }) => {
  // Use passed permissions or hook (for flexibility)
  const permissions = menuPermissions || useMenuPermissions();

  // Check if form should be disabled based on permissions
  const isFormDisabled = !permissions.canEdit;
  const isViewOnly = permissions.canView && !permissions.canEdit;

  const handleNameChange = (e, field) => {
    if (isFormDisabled) return;

    field.onChange(e);
    if (originalSlug === form.getValues('slug')) {
      generateSlug(e.target.value);
    }
  };

  const handleGenerateSlug = () => {
    if (isFormDisabled) return;
    generateSlug(form.getValues('name'));
  };

  if (permissions.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Menu Information</CardTitle>
          <CardDescription>Loading form...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Menu Information
          {isViewOnly && <Eye className="h-5 w-5 text-blue-500" />}
          {isFormDisabled && !isViewOnly && <Lock className="h-5 w-5 text-gray-400" />}
        </CardTitle>
        <CardDescription>
          {isViewOnly
            ? 'View menu details (read-only access).'
            : isFormDisabled
              ? "You don't have permission to edit this menu."
              : 'Update this navigation menu for your website.'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Menu Name
                {isFormDisabled && <Lock className="h-4 w-4 text-gray-400" />}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Blog"
                  {...field}
                  disabled={isFormDisabled}
                  onChange={(e) => handleNameChange(e, field)}
                  className={isFormDisabled ? 'bg-gray-100 dark:bg-gray-800' : ''}
                />
              </FormControl>
              <FormDescription>The name displayed in the admin panel.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Slug
                {isFormDisabled && <Lock className="h-4 w-4 text-gray-400" />}
              </FormLabel>
              <div className="flex items-center space-x-2">
                <FormControl>
                  <Input
                    placeholder="e.g. blog"
                    {...field}
                    disabled={isFormDisabled}
                    className={isFormDisabled ? 'bg-gray-100 dark:bg-gray-800' : ''}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateSlug}
                  disabled={isFormDisabled}
                  title={
                    isFormDisabled
                      ? "You don't have permission to edit menus"
                      : 'Generate slug from name'
                  }
                >
                  {isFormDisabled ? <Lock className="h-4 w-4" /> : 'Generate'}
                </Button>
              </div>
              <FormDescription>Used in URL and code references.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ordering"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                Order Priority
                {isFormDisabled && <Lock className="h-4 w-4 text-gray-400" />}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  placeholder="1"
                  {...field}
                  disabled={isFormDisabled}
                  className={isFormDisabled ? 'bg-gray-100 dark:bg-gray-800' : ''}
                />
              </FormControl>
              <FormDescription>Lower numbers appear first in navigation.</FormDescription>
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
              <FormLabel className="flex items-center gap-2">
                Menu Status
                {isFormDisabled && <Lock className="h-4 w-4 text-gray-400" />}
              </FormLabel>
              <Select
                onValueChange={(value) => !isFormDisabled && field.onChange(parseInt(value, 10))}
                value={field.value.toString()}
                disabled={isFormDisabled}
              >
                <FormControl>
                  <SelectTrigger className={isFormDisabled ? 'bg-gray-100 dark:bg-gray-800' : ''}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Active</SelectItem>
                  <SelectItem value="0">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>When active, this menu will be available for use.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Permission Warning */}
        {isViewOnly && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4">
            <div className="flex items-center">
              <Eye className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">View Only Access</h3>
                <p className="text-sm text-blue-700 mt-1">
                  You have read-only access to this menu. Contact your administrator if you need
                  edit permissions.
                </p>
              </div>
            </div>
          </div>
        )}

        {isFormDisabled && !isViewOnly && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-4">
            <div className="flex items-center">
              <Lock className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Access Restricted</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  You don't have permission to edit menus. Please contact your administrator if you
                  need access.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <FormActions />
    </Card>
  );
};

export default EditMenuForm;
