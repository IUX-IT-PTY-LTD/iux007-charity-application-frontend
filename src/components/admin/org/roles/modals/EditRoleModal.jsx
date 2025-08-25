// components/admin/org/roles/modals/EditRoleModal.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { updateRoleWithPermissions, getRolePermissions } from '@/api/services/admin/roleService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, AlertTriangle, Lock } from 'lucide-react';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import PermissionSelector from '../PermissionSelector';
import {
  getCurrentUserRole,
  validateRoleOperation,
  isProtectedRole,
  ROLE_LEVELS,
  getRoleLevel,
  canModifyOwnRolePermissions,
} from '@/api/utils/roleHierarchy';

const EditRoleModal = ({ isOpen, onClose, role, onRoleUpdated, permissions = [] }) => {
  const { adminProfile } = useAdminContext();
  const currentUserRole = getCurrentUserRole(adminProfile);
  const currentRoleLevel = getRoleLevel(currentUserRole);

  const [formData, setFormData] = useState({
    name: '',
    status: 1,
    permissionIds: [],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);

  // Check if user is editing their own role
  const isEditingOwnRole = role && adminProfile?.role && role.id === adminProfile.role.id;
  const canModifyThisRole = role
    ? validateRoleOperation.update(currentUserRole, role).valid
    : false;
  const isRoleProtected = role ? isProtectedRole(role.name) : false;

  // Populate form data when role prop changes
  useEffect(() => {
    if (role && isOpen) {
      setFormData({
        name: role.name || '',
        status: role.status || 1,
        permissionIds: [],
      });

      // Fetch current role permissions
      fetchRolePermissions(role.id);
    }
  }, [role, isOpen]);

  const fetchRolePermissions = async (roleId) => {
    setIsLoadingPermissions(true);
    try {
      const response = await getRolePermissions(roleId);

      if (response.status === 'success' && response.data && response.data.length > 0) {
        const currentPermissions = response.data[0].permissions || [];
        const permissionIds = currentPermissions.map((p) => p.id);
        setFormData((prev) => ({ ...prev, permissionIds }));
      }
    } catch (error) {
      console.error('Error fetching role permissions:', error);
      toast.error('Failed to load role permissions');
    } finally {
      setIsLoadingPermissions(false);
    }
  };

  const handleChange = (e) => {
    if (!canModifyThisRole) {
      toast.error("You don't have permission to modify this role");
      return;
    }

    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    // Check if trying to change to protected role name
    if (name === 'name' && value.trim() && value.trim() !== role?.name) {
      const wouldBeProtected = isProtectedRole(value.trim());
      if (wouldBeProtected && currentRoleLevel !== ROLE_LEVELS.SUPER_ADMIN) {
        setErrors((prev) => ({
          ...prev,
          name: 'Only Super Admin can rename roles to Admin or Super Admin',
        }));
      }
    }
  };

  const handleStatusChange = (checked) => {
    if (!canModifyThisRole) {
      toast.error("You don't have permission to modify this role");
      return;
    }

    if (isEditingOwnRole && !checked) {
      toast.error('You cannot deactivate your own role');
      return;
    }

    setFormData((prev) => ({ ...prev, status: checked ? 1 : 0 }));
  };

  const handlePermissionChange = (selectedPermissionIds) => {
    if (!canModifyThisRole) {
      toast.error("You don't have permission to modify this role");
      return;
    }

    if (isEditingOwnRole && currentRoleLevel !== ROLE_LEVELS.SUPER_ADMIN) {
      toast.error(
        'You cannot modify the permissions of your own role. Contact a Super Admin for assistance.'
      );
      return;
    }

    setFormData((prev) => ({ ...prev, permissionIds: selectedPermissionIds }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!canModifyThisRole) {
      newErrors.general = "You don't have permission to modify this role";
      setErrors(newErrors);
      return false;
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Role name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Role name must be at least 2 characters';
    } else {
      // Check if renaming to protected role
      if (formData.name.trim() !== role?.name) {
        if (isProtectedRole(formData.name.trim()) && currentRoleLevel !== ROLE_LEVELS.SUPER_ADMIN) {
          newErrors.name = 'Only Super Admin can rename roles to Admin or Super Admin';
        }
      }
    }

    // Check if trying to deactivate own role
    if (isEditingOwnRole && formData.status === 0) {
      newErrors.status = 'You cannot deactivate your own role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isEditingOwnRole && currentRoleLevel !== ROLE_LEVELS.SUPER_ADMIN) {
      // Show confirmation for editing own role
      const confirmMessage = 'You are editing your own role. Are you sure you want to continue?';
      if (!window.confirm(confirmMessage)) {
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const response = await updateRoleWithPermissions(
        role.id,
        formData.name.trim(),
        formData.status,
        formData.permissionIds
      );

      if (response.status === 'success') {
        toast.success('Role updated successfully');
        onRoleUpdated(response.data);
        onClose();
      } else {
        throw new Error(response.message || 'Failed to update role');
      }
    } catch (error) {
      console.error('Error updating role:', error);

      // Handle API error messages
      if (error.response && error.response.data && error.response.data.errors) {
        const apiErrors = {};
        Object.entries(error.response.data.errors).forEach(([key, value]) => {
          apiErrors[key] = value[0];
        });
        setErrors(apiErrors);
      } else {
        toast.error(error.message || 'Failed to update role');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      status: 1,
      permissionIds: [],
    });
    setErrors({});
  };

  if (!role) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetForm();
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Edit Role: {role.name}
            {isRoleProtected && <Lock className="h-4 w-4 text-amber-500" />}
          </DialogTitle>
          <DialogDescription>
            Update role information and permissions.
            {isEditingOwnRole && (
              <span className="text-amber-600 font-medium"> (Editing your own role)</span>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Permission warnings */}
        {!canModifyThisRole && (
          <Alert className="border-red-200 bg-red-50">
            <Lock className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Access Denied:</strong> You don't have permission to modify this role. Only
              Super Admin can modify Admin and Super Admin roles.
            </AlertDescription>
          </Alert>
        )}

        {isEditingOwnRole && currentRoleLevel !== ROLE_LEVELS.SUPER_ADMIN && (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Self-Edit Warning:</strong> You are editing your own role. You cannot modify
              your own permissions or deactivate your role.
            </AlertDescription>
          </Alert>
        )}

        {isRoleProtected && (
          <Alert className="border-purple-200 bg-purple-50">
            <Shield className="h-4 w-4 text-purple-600" />
            <AlertDescription className="text-purple-800">
              <strong>Protected Role:</strong> This is a system-level role with elevated
              permissions.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Role Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Role Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter role name (e.g., Manager, Editor)"
              value={formData.name}
              onChange={handleChange}
              disabled={!canModifyThisRole}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="status" className="flex-grow">
                Active Status
              </Label>
              <div className="flex items-center gap-2">
                <Switch
                  id="status"
                  checked={formData.status === 1}
                  onCheckedChange={handleStatusChange}
                  disabled={!canModifyThisRole || (isEditingOwnRole && formData.status === 1)}
                />
                {isEditingOwnRole && <Lock className="h-3 w-3 text-amber-500" />}
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {formData.status === 1
                ? 'Role is active and can be assigned to users.'
                : 'Role is inactive and cannot be assigned to users.'}
              {isEditingOwnRole && (
                <span className="text-amber-600 ml-1">(Cannot deactivate your own role)</span>
              )}
            </p>
            {errors.status && <p className="text-xs text-red-500">{errors.status}</p>}
          </div>

          {/* Permissions */}
          {isLoadingPermissions ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading current permissions...</span>
            </div>
          ) : (
            <PermissionSelector
              permissions={permissions}
              selectedPermissions={formData.permissionIds}
              onSelectionChange={handlePermissionChange}
              disabled={
                !canModifyThisRole ||
                isSubmitting ||
                (isEditingOwnRole && currentRoleLevel !== ROLE_LEVELS.SUPER_ADMIN)
              }
              targetRole={role}
            />
          )}

          {errors.general && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{errors.general}</AlertDescription>
            </Alert>
          )}

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onClose();
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                isLoadingPermissions ||
                !canModifyThisRole ||
                Object.keys(errors).length > 0
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Role'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRoleModal;
