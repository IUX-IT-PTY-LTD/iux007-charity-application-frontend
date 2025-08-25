// components/admin/org/roles/TableCells.jsx
import React from 'react';
import { Edit, Trash2, Eye, Shield, Lock } from 'lucide-react';
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
import { useAdminContext } from '@/components/admin/layout/admin-context';
import {
  canModifyRole,
  getCurrentUserRole,
  isProtectedRole,
  getPermissionDenialMessage,
  validateRoleOperation,
} from '@/api/utils/roleHierarchy';

export const StatusCell = ({ role, onStatusChange }) => {
  const { adminProfile } = useAdminContext();
  const currentUserRole = getCurrentUserRole(adminProfile);

  const canModify = canModifyRole(currentUserRole, role.name);
  const isProtected = isProtectedRole(role.name);

  const handleStatusToggle = async () => {
    // Check permissions before attempting
    const validation = validateRoleOperation.update(currentUserRole, role);
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2">
              <Switch
                checked={role.status === 1}
                onCheckedChange={handleStatusToggle}
                disabled={!canModify}
                aria-label={`Toggle status for ${role.name}`}
              />
              {isProtected && !canModify && <Lock className="h-3 w-3 text-gray-400" />}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {canModify
              ? `Click to ${role.status === 1 ? 'deactivate' : 'activate'} role`
              : getPermissionDenialMessage('modifyRole', role.name)}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

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

  // Check if this is a protected role
  const isProtected = isProtectedRole(role.name);

  return (
    <div className="flex items-center justify-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`cursor-help hover:bg-blue-100 ${
                  isProtected
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-blue-50 text-blue-700'
                }`}
              >
                {permissionCount} {permissionCount === 1 ? 'permission' : 'permissions'}
              </Badge>
              {isProtected && <Shield className="h-3 w-3 text-amber-500" />}
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div className="space-y-1">
              <p className="font-medium">
                Permissions:
                {isProtected && <span className="text-amber-500 ml-1">(Protected Role)</span>}
              </p>
              <p className="text-xs">{permissionNames}</p>
              {isProtected && (
                <p className="text-xs text-amber-600 mt-2">
                  This role has system-level permissions
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export const ActionsCell = ({ role, onEdit, onDelete, onViewPermissions }) => {
  const { adminProfile } = useAdminContext();
  const currentUserRole = getCurrentUserRole(adminProfile);

  const canModify = canModifyRole(currentUserRole, role.name);
  const canViewPerms = true; // Everyone can view permissions
  const isProtected = isProtectedRole(role.name);

  const handleEdit = () => {
    const validation = validateRoleOperation.update(currentUserRole, role);
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }
    onEdit();
  };

  const handleDelete = async () => {
    const validation = validateRoleOperation.delete(currentUserRole, role);
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

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
      {/* View Permissions - Always available */}
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

      {/* Edit Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEdit}
              disabled={!canModify}
              className={canModify ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}
            >
              <div className="flex items-center gap-1">
                <Edit className="h-4 w-4" />
                {isProtected && !canModify && <Lock className="h-2 w-2" />}
              </div>
              <span className="sr-only">Edit</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{canModify ? 'Edit Role' : getPermissionDenialMessage('modifyRole', role.name)}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Delete Button - Hidden for now as requested in original code */}
      {/* <AlertDialog>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!canModify}
                  className={`text-red-600 hover:text-red-800 hover:bg-red-100 ${
                    !canModify ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <Trash2 className="h-4 w-4" />
                    {isProtected && !canModify && <Lock className="h-2 w-2" />}
                  </div>
                  <span className="sr-only">Delete</span>
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {canModify 
                  ? 'Delete Role' 
                  : getPermissionDenialMessage('deleteRole', role.name)
                }
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the role "{role.name}" and remove all associated
              permissions. This action cannot be undone.
              {isProtected && (
                <span className="block mt-2 text-amber-600 font-medium">
                  Warning: This is a protected system role.
                </span>
              )}
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
