'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

// Import permission hooks
import { useMenuPermissions } from '@/api/hooks/useModulePermissions';

// Permission-aware action button component
const PermissionAwareActionButton = ({ permission, children, disabledFallback, ...props }) => {
  const menuPermissions = useMenuPermissions();

  if (menuPermissions.isLoading) {
    return (
      <Button {...props} disabled>
        Loading...
      </Button>
    );
  }

  const hasPermission =
    permission === 'edit'
      ? menuPermissions.canEdit
      : permission === 'delete'
        ? menuPermissions.canDelete
        : permission === 'view'
          ? menuPermissions.canView
          : false;

  if (!hasPermission) {
    if (disabledFallback) {
      return (
        <Button
          {...props}
          disabled
          title="You don't have permission for this action"
          className="opacity-50 cursor-not-allowed"
        >
          {disabledFallback}
        </Button>
      );
    }
    return (
      <Button
        {...props}
        disabled
        title="You don't have permission for this action"
        className="opacity-50 cursor-not-allowed"
      >
        <Lock className="h-4 w-4" />
      </Button>
    );
  }

  return <Button {...props}>{children}</Button>;
};

export const StatusCell = ({ menu, onStatusChange, menuPermissions }) => {
  const handleStatusToggle = async () => {
    if (!menuPermissions.canEdit) {
      toast.error("You don't have permission to edit menus");
      return;
    }

    // Call the parent handler which already has permission checking and API logic
    onStatusChange(menu.id, menu.status);
  };

  return (
    <div className="flex items-center justify-center gap-3">
      <Switch
        checked={menu.status === 1}
        onCheckedChange={handleStatusToggle}
        aria-label={`Toggle status for ${menu.name}`}
        className="data-[state=checked]:bg-black data-[state=checked]:text-white"
        disabled={!menuPermissions.canEdit}
        title={!menuPermissions.canEdit ? "You don't have permission to edit menus" : ''}
      />
      <Badge
        variant={menu.status === 1 ? 'success' : 'destructive'}
        className={menu.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
      >
        {menu.status === 1 ? 'Active' : 'Inactive'}
      </Badge>
    </div>
  );
};

export const ActionsCell = ({ menu, onDelete, menuPermissions }) => {
  const router = useRouter();

  const handleDelete = async () => {
    if (!menuPermissions.canDelete) {
      toast.error("You don't have permission to delete menus");
      return;
    }

    // Call the parent handler which already has permission checking and API logic
    onDelete(menu.id);
  };

  const handleEdit = () => {
    if (menuPermissions.canEdit) {
      router.push(`/admin/menus/${menu.id}/edit`);
    }
  };

  return (
    <div className="flex justify-center gap-2">
      <PermissionAwareActionButton
        permission="edit"
        variant="ghost"
        size="icon"
        onClick={handleEdit}
        disabledFallback={<Edit className="h-4 w-4" />}
      >
        <Edit className="h-4 w-4" />
        <span className="sr-only">Edit</span>
      </PermissionAwareActionButton>

      {/* Delete button with permission checking */}
      {menuPermissions.canDelete ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-600 hover:text-red-800 hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the "{menu.name}" menu and all its items. This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          disabled
          title="You don't have permission to delete menus"
          className="opacity-50 cursor-not-allowed text-red-600"
        >
          <Lock className="h-4 w-4" />
          <span className="sr-only">Delete (No Permission)</span>
        </Button>
      )}
    </div>
  );
};
