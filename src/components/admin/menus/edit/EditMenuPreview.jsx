'use client';

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, Lock, Eye, AlertCircle, Edit, Trash2 } from 'lucide-react';

// Import permission hooks
import { useMenuPermissions } from '@/api/hooks/useModulePermissions';

const EditMenuPreview = ({ formValues, menuId, menuPermissions }) => {
  const { name, slug, status, ordering } = formValues;

  // Use passed permissions or hook (for flexibility)
  const permissions = menuPermissions || useMenuPermissions();

  // Check permission states
  const canEdit = permissions.canEdit;
  const canDelete = permissions.canDelete;
  const canView = permissions.canView;
  const isLoading = permissions.isLoading;

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
          {!canEdit && canView && <Eye className="h-4 w-4 text-blue-500" />}
          {!canView && <Lock className="h-4 w-4 text-gray-400" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Permission Status */}
          {(!canEdit || !canDelete) && (
            <div className="rounded-lg border p-3 mb-4">
              <div className="flex items-start gap-2">
                {!canEdit && !canDelete ? (
                  <Eye className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <p className="text-sm font-medium">
                    {!canEdit && !canDelete ? 'View Only Access' : 'Limited Access'}
                  </p>
                  <p className="text-xs mt-1 text-gray-600">
                    {!canEdit && !canDelete && 'You can view this menu but cannot make changes.'}
                    {canEdit && !canDelete && 'You can edit this menu but cannot delete it.'}
                    {!canEdit && canDelete && 'You can delete this menu but cannot edit it.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Menu Details */}
          <div
            className={`rounded-lg border p-4 ${
              canView ? 'bg-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-700 opacity-75'
            }`}
          >
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              {name || 'Menu Name'}
              {!canEdit && canView && <Eye className="h-4 w-4 text-blue-500" />}
              {!canView && <Lock className="h-4 w-4 text-gray-400" />}
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
              canView ? 'bg-gray-50 dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-700 opacity-75'
            }`}
          >
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              Form Status
              {!canEdit && canView && <Eye className="h-4 w-4 text-blue-500" />}
              {!canView && <Lock className="h-4 w-4 text-gray-400" />}
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
            </div>
          </div>

          {/* Permission Summary */}
          <div className="rounded-lg border p-4 bg-blue-50 dark:bg-blue-950">
            <h4 className="text-sm font-medium mb-3 text-blue-900 dark:text-blue-100">
              Your Permissions
            </h4>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">View Menu</span>
                </div>
                {canView ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Edit className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Edit Menu</span>
                </div>
                {canEdit ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Delete Menu</span>
                </div>
                {canDelete ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
          </div>

          {/* Ready to Update Indicator */}
          {canEdit && name && slug && ordering && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Ready to update</span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                All fields are valid and you have the necessary permissions to save changes.
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="text-xs text-gray-500">ID: {menuId}</span>
        <span className="text-xs text-gray-500">
          {canEdit
            ? 'Changes will be saved when you update'
            : 'Read-only mode - no changes possible'}
        </span>
      </CardFooter>
    </Card>
  );
};

export default EditMenuPreview;
