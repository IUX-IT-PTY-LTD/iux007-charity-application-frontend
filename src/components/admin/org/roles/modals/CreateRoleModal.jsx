// components/admin/org/roles/modals/CreateRoleModal.jsx
import React, { useState } from 'react';
import { toast } from 'sonner';
import { createRoleWithPermissions } from '@/api/services/admin/roleService';
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
import { Loader2 } from 'lucide-react';
import PermissionSelector from '../PermissionSelector';

const CreateRoleModal = ({ isOpen, onClose, onRoleCreated, permissions = [] }) => {
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
      const response = await createRoleWithPermissions(
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

      // Handle API error messages
      if (error.response && error.response.data && error.response.data.errors) {
        const apiErrors = {};
        Object.entries(error.response.data.errors).forEach(([key, value]) => {
          apiErrors[key] = value[0];
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
          <DialogTitle>Create New Role</DialogTitle>
          <DialogDescription>Create a new role and assign permissions to it.</DialogDescription>
        </DialogHeader>

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
            <Button type="submit" disabled={isSubmitting}>
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
