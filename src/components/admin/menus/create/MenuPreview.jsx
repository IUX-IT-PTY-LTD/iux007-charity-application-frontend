'use client';

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, Lock, AlertCircle } from 'lucide-react';

// Import permission hooks
import { useMenuPermissions } from '@/api/hooks/useModulePermissions';

const MenuPreview = ({ formValues }) => {
  const { name, slug, status, ordering } = formValues;
  const menuPermissions = useMenuPermissions();

  // Check if user can create menus
  const canCreate = menuPermissions.canCreate;
  const isLoading = menuPermissions.isLoading;

  if (isLoading) {
    return (
      <Card className="sticky top-6">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          Summary
          {!canCreate && <Lock className="h-4 w-4 text-gray-400" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Permission Warning */}
          {!canCreate && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800">Access Restricted</p>
                  <p className="text-xs text-red-700 mt-1">
                    You don't have permission to create menus.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Menu Details */}
          <div
            className={`rounded-lg border p-4 ${
              canCreate ? 'bg-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-700 opacity-75'
            }`}
          >
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              {name || 'Menu Name'}
              {!canCreate && <Lock className="h-4 w-4 text-gray-400" />}
            </h3>

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

          {/* Form Validation Summary */}
          <div
            className={`rounded-lg border p-4 ${
              canCreate ? 'bg-gray-50 dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-700 opacity-75'
            }`}
          >
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              Form Status
              {!canCreate && <Lock className="h-4 w-4 text-gray-400" />}
            </h4>

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

              {/* Permission Status */}
              <div className="flex items-center">
                {canCreate ? (
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <X className="h-4 w-4 text-red-500 mr-2" />
                )}
                <span className="text-sm">
                  {canCreate ? 'Create permission granted' : 'Create permission denied'}
                </span>
              </div>
            </div>
          </div>

          {/* Ready to Submit Indicator */}
          {canCreate && name && slug && ordering && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Ready to create</span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                All required fields are filled and you have the necessary permissions.
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-xs text-gray-500">
        {canCreate
          ? 'Changes will not be saved until form is submitted'
          : 'Contact your administrator for create permissions'}
      </CardFooter>
    </Card>
  );
};

export default MenuPreview;
