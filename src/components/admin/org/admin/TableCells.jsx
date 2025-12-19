// components/admin/org/admin/AdminsPagination.jsx

import React from 'react';
import { Edit, Trash2, Key } from 'lucide-react';
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
import { updateAdmin, deleteAdmin } from '@/api/services/admin/adminService';

export const StatusCell = ({ admin, onStatusChange }) => {
  const handleStatusToggle = async () => {
    try {
      // Create the updated admin data with all required fields
      const updatedAdmin = {
        ...admin,
        status: admin.status === 1 ? 0 : 1,
      };

      // Call the API to update the status
      const response = await updateAdmin(
        admin.id,
        updatedAdmin.name,
        updatedAdmin.email,
        updatedAdmin.role_id,
        updatedAdmin.status
      );

      if (response.status === 'success') {
        // Update UI with the response data
        onStatusChange(response.data);
        toast.success(`Admin ${admin.status === 1 ? 'deactivated' : 'activated'} successfully`);
      } else {
        throw new Error(response.message || 'Failed to update admin status');
      }
    } catch (error) {
      console.error('Error updating admin status:', error);
      toast.error('Failed to update admin status');
    }
  };

  return (
    <div className="flex items-center justify-center gap-3">
      <Switch
        checked={admin.status === 1}
        onCheckedChange={handleStatusToggle}
        aria-label={`Toggle status for ${admin.name}`}
      />
      <Badge
        variant={admin.status === 1 ? 'success' : 'destructive'}
        className={admin.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
      >
        {admin.status === 1 ? 'Active' : 'Inactive'}
      </Badge>
    </div>
  );
};

export const ActionsCell = ({ admin, onEdit, onDelete, onResetPassword }) => {
  const handleDelete = async () => {
    try {
      const response = await deleteAdmin(admin.id);

      if (response.status === 'success') {
        onDelete(admin.id);
        toast.success('Admin deleted successfully');
      } else {
        throw new Error(response.message || 'Failed to delete admin');
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      toast.error('Failed to delete admin');
    }
  };

  return (
    <div className="flex justify-center gap-2">
      <Button variant="ghost" size="icon" onClick={onEdit}>
        <Edit className="h-4 w-4" />
        <span className="sr-only">Edit</span>
      </Button>

      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onResetPassword(admin)}
        className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
        title="Reset Password"
      >
        <Key className="h-4 w-4" />
        <span className="sr-only">Reset Password</span>
      </Button>

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
              This will permanently delete the admin user "{admin.name}". This action cannot be
              undone.
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
    </div>
  );
};
