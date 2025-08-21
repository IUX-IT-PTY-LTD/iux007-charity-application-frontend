// components/admin/org/roles/TableCells.jsx
import React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
import { updateRole } from '@/api/services/admin/roleService';

export const StatusCell = ({ role, onStatusChange }) => {
  const handleStatusToggle = async () => {
    try {
      // Create the updated role data with all required fields
      const updatedRole = {
        ...role,
        status: role.status === 1 ? 0 : 1,
      };

      // Call the API to update the status
      const response = await updateRole(role.id, updatedRole.name, updatedRole.status);

      if (response.status === 'success') {
        // Update UI with the response data
        onStatusChange(response.data);
        toast.success(`Role ${role.status === 1 ? 'deactivated' : 'activated'} successfully`);
      } else {
        throw new Error(response.message || 'Failed to update role status');
      }
    } catch (error) {
      console.error('Error updating role status:', error);
      toast.error('Failed to update role status');
    }
  };

  return (
    <div className="flex items-center justify-center gap-3">
      <Switch
        checked={role.status === 1}
        onCheckedChange={handleStatusToggle}
        aria-label={`Toggle status for ${role.name}`}
      />
      <Badge
        variant={role.status === 1 ? 'success' : 'destructive'}
        className={role.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
      >
        {role.status === 1 ? 'Active' : 'Inactive'}
      </Badge>
    </div>
  );
};

export const PermissionsCell = ({ role, rolePermissions }) => {
  // Find permissions for this role
  const permissions = rolePermissions[role.id] || [];
  const permissionCount = permissions.length;

  if (permissionCount === 0) {
    return (
      <div className="flex items-center justify-center">
        <Badge variant="outline" className="bg-gray-50 text-gray-600">
          No permissions
        </Badge>
      </div>
    );
  }

  const permissionNames = permissions.map((p) => p.name).join(', ');

  return (
    <div className="flex items-center justify-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 cursor-help hover:bg-blue-100"
            >
              {permissionCount} {permissionCount === 1 ? 'permission' : 'permissions'}
            </Badge>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div className="space-y-1">
              <p className="font-medium">Permissions:</p>
              <p className="text-xs">{permissionNames}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export const ActionsCell = ({ role, onEdit, onDelete, onViewPermissions }) => {
  const handleDelete = async () => {
    try {
      // Note: You might want to add a deleteRole function to your service
      // For now, just call the onDelete callback
      onDelete(role.id);
      toast.success('Role deleted successfully');
    } catch (error) {
      console.error('Error deleting role:', error);
      toast.error('Failed to delete role');
    }
  };

  return (
    <div className="flex justify-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onViewPermissions(role)}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">View Permissions</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View Permissions</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit Role</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* <AlertDialog>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
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
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete Role</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the role "{role.name}" and remove all associated
              permissions. This action cannot be undone.
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
      </AlertDialog> */}
    </div>
  );
};
