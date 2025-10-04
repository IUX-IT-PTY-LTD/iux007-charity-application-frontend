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
import { Checkbox } from '@/components/ui/checkbox';
import { Lock } from 'lucide-react';

// Import permission hooks
import { useMenuPermissions } from '@/api/hooks/useModulePermissions';

const MenuForm = ({ form, generateSlug, allMenus, loadingMenus, FormActions }) => {
  const menuPermissions = useMenuPermissions();

  // Check if form should be disabled
  const isFormDisabled = !menuPermissions.canCreate;

  const handleNameChange = (e, field) => {
    if (isFormDisabled) return;

    field.onChange(e);
    if (!form.getValues('slug')) {
      generateSlug(e.target.value);
    }
  };

  const handleGenerateSlug = () => {
    if (isFormDisabled) return;
    generateSlug(form.getValues('name'));
  };

  if (menuPermissions.isLoading) {
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
          {isFormDisabled && <Lock className="h-5 w-5 text-gray-400" />}
        </CardTitle>
        <CardDescription>
          Create a new navigation menu for your website.
          {isFormDisabled && (
            <span className="text-red-600 block mt-1">
              You don't have permission to create menus.
            </span>
          )}
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
                  disabled={isFormDisabled}
                  onChange={(e) => handleNameChange(e, field)}
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
              <FormLabel>Slug</FormLabel>
              <div className="flex items-center space-x-2">
                <FormControl>
                  <Input placeholder="e.g. blog" {...field} disabled={isFormDisabled} />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateSlug}
                  disabled={isFormDisabled}
                  title={
                    isFormDisabled
                      ? "You don't have permission to create menus"
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
          name="parent_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Menu</FormLabel>
              <Select
                onValueChange={(value) => !isFormDisabled && field.onChange(value)}
                value={field.value}
                disabled={isFormDisabled || loadingMenus}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingMenus ? "Loading menus..." : "Select parent menu (optional)"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">None (Top Level Menu)</SelectItem>
                  {allMenus.map((menu) => (
                    <SelectItem key={menu.id} value={menu.id.toString()}>
                      {menu.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Choose a parent menu to create a submenu, or leave empty for top-level menu.</FormDescription>
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
                <Input type="number" min={1} placeholder="1" {...field} disabled={isFormDisabled} />
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
              <FormLabel>Menu Status</FormLabel>
              <Select
                onValueChange={(value) => !isFormDisabled && field.onChange(parseInt(value, 10))}
                defaultValue={field.value.toString()}
                disabled={isFormDisabled}
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
              <FormDescription>When active, this menu will be available for use.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="show_in_page_builder"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isFormDisabled}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Show in Page Builder</FormLabel>
                <FormDescription>
                  When enabled, this menu will be available as an option in the Page Builder settings to auto-fill page title and slug.
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Permission Warning */}
        {isFormDisabled && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-4">
            <div className="flex items-center">
              <Lock className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Access Restricted</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  You don't have permission to create menus. Please contact your administrator if
                  you need access.
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

export default MenuForm;
