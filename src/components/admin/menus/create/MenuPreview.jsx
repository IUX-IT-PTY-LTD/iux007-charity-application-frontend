// components/admin/menus/create/MenuPreview.jsx
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, ArrowDown } from 'lucide-react';

const MenuPreview = ({ formValues }) => {
  const { name, slug, status, ordering } = formValues;

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Menu Details */}
          <div className="rounded-lg border p-4 bg-white dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-3">{name || 'Menu Name'}</h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-500">Slug:</span>
                <span className="font-medium text-sm">{slug || '—'}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-500">Position:</span>
                <span className="font-medium text-sm">{ordering}</span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-500">Status:</span>
                <Badge
                  variant={status === 1 ? 'success' : 'error'}
                  className={
                    status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }
                >
                  {status === 1 ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4 bg-gray-50 dark:bg-gray-800">
            <h4 className="text-sm font-medium mb-3">Summary</h4>

            <div className="space-y-2">
              <div className="flex items-center">
                {name ? (
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <X className="h-4 w-4 text-red-500 mr-2" />
                )}
                <span className="text-sm">Menu name {name ? 'provided' : 'required'}</span>
              </div>

              <div className="flex items-center">
                {slug ? (
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <X className="h-4 w-4 text-red-500 mr-2" />
                )}
                <span className="text-sm">Slug {slug ? 'provided' : 'required'}</span>
              </div>

              <div className="flex items-center">
                {ordering ? (
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <X className="h-4 w-4 text-red-500 mr-2" />
                )}
                <span className="text-sm">Order position set to {ordering || 'none'}</span>
              </div>

              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">
                  Status set to {status === 1 ? 'active' : 'inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-gray-500">
        Changes will not be saved until form is submitted
      </CardFooter>
    </Card>
  );
};

export default MenuPreview;
