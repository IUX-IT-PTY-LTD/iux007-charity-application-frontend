// components/admin/menus/create/MenuForm.jsx
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

const MenuForm = ({ form, generateSlug, FormActions }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Menu Information</CardTitle>
        <CardDescription>Create a new navigation menu for your website.</CardDescription>
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
                    if (!form.getValues('slug')) {
                      generateSlug(e.target.value);
                    }
                  }}
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
                  <Input placeholder="e.g. blog" {...field} />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => generateSlug(form.getValues('name'))}
                >
                  Generate
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
              <FormLabel>Order Priority</FormLabel>
              <FormControl>
                <Input type="number" min={1} placeholder="1" {...field} />
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
                onValueChange={(value) => field.onChange(parseInt(value, 10))}
                defaultValue={field.value.toString()}
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
      </CardContent>

      <FormActions form={form} />
    </Card>
  );
};

export default MenuForm;
