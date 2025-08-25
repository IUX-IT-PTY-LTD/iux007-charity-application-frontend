// components/admin/org/roles/modals/CreateRoleModal.jsx

import React, { useState } from 'react';
import { toast } from 'sonner';
// Import from role management service instead of direct role service
import { createRoleWithHierarchy } from '@/api/services/admin/roleManagementService';
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
import { Loader2, Shield, AlertTriangle } from 'lucide-react';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import PermissionSelector from '../PermissionSelector';
import {
  getCurrentUserRole,
  validateRoleOperation,
  isProtectedRole,
  ROLE_LEVELS,
  getRoleLevel,
} from '@/api/services/admin/roleManagementService';

const CreateRoleModal = ({ isOpen, onClose, onRoleCreated, permissions = [] }) => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    // Check if trying to create protected role name
    if (name === 'name' && value.trim()) {
      const wouldBeProtected = isProtectedRole(value.trim());
      if (wouldBeProtected && currentRoleLevel !== ROLE_LEVELS.SUPER_ADMIN) {
        setErrors((prev) => ({
          ...prev,
          name: 'Only Super Admin can create Admin or Super Admin roles',
        }));
      }
    }
  };

  const handleStatusChange = (checked) => {
    setFormData((prev) => ({ ...prev, status: checked ? 1 : 0 }));
  };

  const handlePermissionChange = (selectedPermissionIds) => {
    setFormData((prev) => ({ ...prev, permissionIds: selectedPermissionIds }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Role name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Role name must be at least 2 characters';
    } else {
      // Check role creation permissions using hierarchy validation
      const validation = validateRoleOperation.create(currentUserRole, formData.name.trim());
      if (!validation.valid) {
        newErrors.name = validation.message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Use the hierarchy-aware service which includes validation
      const response = await createRoleWithHierarchy(
        formData.name.trim(),
        formData.status,
        formData.permissionIds
      );

      if (response.status === 'success') {
        toast.success('Role created successfully');
        onRoleCreated(response.data);
        resetForm();
        onClose();
      } else {
        throw new Error(response.message || 'Failed to create role');
      }
    } catch (error) {
      console.error('Error creating role:', error);

      // Handle different types of errors
      if (error.message.includes('permission') || error.message.includes('access')) {
        toast.error(error.message);
      } else if (error.response && error.response.data && error.response.data.errors) {
        // Handle API validation errors
        const apiErrors = {};
        Object.entries(error.response.data.errors).forEach(([key, value]) => {
          apiErrors[key] = Array.isArray(value) ? value[0] : value;
        });
        setErrors(apiErrors);
      } else {
        toast.error(error.message || 'Failed to create role');
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

  const isProtectedRoleName = formData.name.trim() && isProtectedRole(formData.name.trim());
  const canCreateProtectedRole = currentRoleLevel === ROLE_LEVELS.SUPER_ADMIN;

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
            Create New Role
          </DialogTitle>
          <DialogDescription>
            Create a new role and assign permissions to it.
            <div className="mt-1 text-xs text-gray-500">
              Current Access Level: {currentRoleLevel}
            </div>
          </DialogDescription>
        </DialogHeader>

        {/* Access level warning */}
        {currentRoleLevel !== ROLE_LEVELS.SUPER_ADMIN && (
          <Alert className="border-blue-200 bg-blue-50">
            <Shield className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Access Level:</strong> You can create custom roles but cannot create Admin or
              Super Admin roles. Some permissions may be restricted based on your access level.
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
              className={errors.name ? 'border-red-500' : ''}
            />
            {isProtectedRoleName && !canCreateProtectedRole && (
              <Alert className="border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  <strong>Warning:</strong> This role name is reserved for system administrators.
                  Only Super Admin can create roles with this name.
                </AlertDescription>
              </Alert>
            )}
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="status" className="flex-grow">
                Active Status
              </Label>
              <Switch
                id="status"
                checked={formData.status === 1}
                onCheckedChange={handleStatusChange}
              />
            </div>
            <p className="text-xs text-gray-500">
              {formData.status === 1
                ? 'Role is active and can be assigned to users.'
                : 'Role is inactive and cannot be assigned to users.'}
            </p>
          </div>

          {/* Permissions */}
          <PermissionSelector
            permissions={permissions}
            selectedPermissions={formData.permissionIds}
            onSelectionChange={handlePermissionChange}
            disabled={isSubmitting}
            targetRole={null}
          />

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
              disabled={isSubmitting || Object.keys(errors).length > 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Role'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoleModal;
