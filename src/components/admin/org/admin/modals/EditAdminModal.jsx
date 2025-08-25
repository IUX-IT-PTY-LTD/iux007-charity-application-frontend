// components/admin/org/admin/modals/EditAdminModal.jsx

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { updateAdmin, getAvailableRoles } from '@/api/services/admin/adminService';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const EditAdminModal = ({ isOpen, onClose, admin, onAdminUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role_id: '',
    status: 1,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);

  // Load roles when modal opens
  useEffect(() => {
    if (isOpen) {
      loadRoles();
    }
  }, [isOpen]);

  // Populate form data when admin prop changes
  useEffect(() => {
    if (admin) {
      setFormData({
        name: admin.name || '',
        email: admin.email || '',
        role_id: admin.role_id ? admin.role_id.toString() : '',
        status: admin.status !== undefined ? admin.status : 1,
      });
    }
  }, [admin]);

  const loadRoles = async () => {
    setIsLoadingRoles(true);
    try {
      const rolesResponse = await getAvailableRoles();
      if (rolesResponse && rolesResponse.data) {
        setRoles(rolesResponse.data);
      }
    } catch (error) {
      console.error('Error loading roles:', error);
      toast.error('Failed to load roles');
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleRoleChange = (value) => {
    setFormData((prev) => ({ ...prev, role_id: value }));

    // Clear role error if exists
    if (errors.role_id) {
      setErrors((prev) => ({ ...prev, role_id: '' }));
    }
  };

  const handleStatusChange = (checked) => {
    setFormData((prev) => ({ ...prev, status: checked ? 1 : 0 }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.role_id) {
      newErrors.role_id = 'Role is required';
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
      const response = await updateAdmin(
        admin.id,
        formData.name,
        formData.email,
        parseInt(formData.role_id),
        formData.status
      );

      if (response.status === 'success') {
        toast.success('Admin updated successfully');
        onAdminUpdated(response.data);
        onClose();
      } else {
        throw new Error(response.message || 'Failed to update admin');
      }
    } catch (error) {
      console.error('Error updating admin:', error);

      // Handle API error messages
      if (error.response && error.response.data && error.response.data.errors) {
        const apiErrors = {};
        Object.entries(error.response.data.errors).forEach(([key, value]) => {
          apiErrors[key] = value[0];
        });
        setErrors(apiErrors);
      } else {
        toast.error(error.message || 'Failed to update admin');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get role display info
  const getSelectedRoleInfo = () => {
    const selectedRole = roles.find((role) => role.id.toString() === formData.role_id);
    if (selectedRole) {
      return (
        <p className="text-xs text-gray-500 mt-1">
          Current role: {selectedRole.name}
          {selectedRole.status === 0 && ' (Inactive Role)'}
        </p>
      );
    }
    return null;
  };

  // Get current role name for display
  const getCurrentRoleName = () => {
    if (admin && roles.length > 0) {
      const currentRole = roles.find((role) => role.id === admin.role_id);
      return currentRole ? currentRole.name : 'Unknown Role';
    }
    return '';
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Admin</DialogTitle>
          <DialogDescription>
            Update admin user information.
            {admin && (
              <span className="block text-sm text-gray-600 mt-1">
                Currently: {admin.name} ({getCurrentRoleName()})
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter admin name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter admin email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            {isLoadingRoles ? (
              <div className="flex items-center space-x-2 p-2 border rounded">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-gray-500">Loading roles...</span>
              </div>
            ) : (
              <Select value={formData.role_id} onValueChange={handleRoleChange}>
                <SelectTrigger className={errors.role_id ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      <div className="flex items-center justify-between w-full">
                        <span>{role.name}</span>
                        <div className="flex items-center space-x-2">
                          {role.status === 0 && (
                            <span className="text-xs text-orange-500">(Inactive)</span>
                          )}
                          {admin && role.id === admin.role_id && (
                            <span className="text-xs text-blue-500">(Current)</span>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {errors.role_id && <p className="text-xs text-red-500">{errors.role_id}</p>}
            {getSelectedRoleInfo()}
          </div>

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
                ? 'Admin is currently active and can access the system.'
                : 'Admin is currently inactive and cannot access the system.'}
            </p>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoadingRoles}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Admin'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAdminModal;
