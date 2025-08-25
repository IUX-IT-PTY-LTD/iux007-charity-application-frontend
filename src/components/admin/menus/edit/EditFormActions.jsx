'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { Lock, ArrowLeft, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Import permission hooks
import { useMenuPermissions } from '@/api/hooks/useModulePermissions';

const EditFormActions = ({ isSubmitting, handleDelete, menuPermissions }) => {
  const router = useRouter();

  // Use passed permissions or hook (for flexibility)
  const permissions = menuPermissions || useMenuPermissions();

  const handleCancel = () => {
    router.push('/admin/menus');
  };

  const handleDeleteClick = () => {
    if (!permissions.canDelete) {
      return; // Don't allow delete if no permission
    }
    handleDelete();
  };

  return (
    <CardFooter className="flex justify-between">
      {/* Left side - Cancel and Delete buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          type="button"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Cancel
        </Button>

        {/* Delete Button with Permission Check */}
        {permissions.canDelete ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                type="button"
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Menu
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the menu and all
                  associated items.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteClick}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button
            variant="destructive"
            type="button"
            disabled
            className="opacity-50 cursor-not-allowed flex items-center gap-2"
            title="You don't have permission to delete menus"
          >
            <Lock className="h-4 w-4" />
            Delete Menu
          </Button>
        )}
      </div>

      {/* Right side - Update button */}
      {permissions.canEdit ? (
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Updating...' : 'Update Menu'}
        </Button>
      ) : (
        <Button
          type="button"
          disabled
          className="opacity-50 cursor-not-allowed flex items-center gap-2"
          title="You don't have permission to edit menus"
        >
          <Lock className="h-4 w-4" />
          Update Menu
        </Button>
      )}
    </CardFooter>
  );
};

export default EditFormActions;
