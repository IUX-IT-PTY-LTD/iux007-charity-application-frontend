// components/admin/org/admin/modals/CreateAdminModal.jsx

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  createAdmin,
  getAvailableRoles,
  getDefaultRoleId,
} from '@/api/services/admin/adminService';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const CreateAdminModal = ({ isOpen, onClose, onAdminCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role_id: '',
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

  const loadRoles = async () => {
    setIsLoadingRoles(true);
    try {
      const [rolesResponse, defaultRoleId] = await Promise.all([
        getAvailableRoles(),
        getDefaultRoleId(),
      ]);

      if (rolesResponse && rolesResponse.data) {
        setRoles(rolesResponse.data);
        // Set default role ID
        setFormData((prev) => ({ ...prev, role_id: defaultRoleId.toString() }));
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

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      const response = await createAdmin(
        formData.name,
        formData.email,
        formData.password,
        parseInt(formData.role_id)
      );

      if (response.status === 'success') {
        toast.success('Admin created successfully');
        onAdminCreated(response.data);
        resetForm();
        onClose();
      } else {
        throw new Error(response.message || 'Failed to create admin');
      }
    } catch (error) {
      console.error('Error creating admin:', error);

      // Handle API error messages
      if (error.response && error.response.data && error.response.data.errors) {
        const apiErrors = {};
        Object.entries(error.response.data.errors).forEach(([key, value]) => {
          apiErrors[key] = value[0];
        });
        setErrors(apiErrors);
      } else {
        toast.error(error.message || 'Failed to create admin');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role_id: '',
    });
    setErrors({});
  };

  // Get role display info
  const getSelectedRoleInfo = () => {
    const selectedRole = roles.find((role) => role.id.toString() === formData.role_id);
    if (selectedRole) {
      return (
        <p className="text-xs text-gray-500 mt-1">
          Role: {selectedRole.name}
          {selectedRole.status === 0 && ' (Inactive)'}
        </p>
      );
    }
    return null;
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Admin</DialogTitle>
          <DialogDescription>Add a new admin user to the system.</DialogDescription>
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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter admin password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
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
                    <SelectItem
                      key={role.id}
                      value={role.id.toString()}
                      disabled={role.status === 0}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{role.name}</span>
                        {role.status === 0 && (
                          <span className="text-xs text-gray-400 ml-2">(Inactive)</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {errors.role_id && <p className="text-xs text-red-500">{errors.role_id}</p>}
            {getSelectedRoleInfo()}
          </div>

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
            <Button type="submit" disabled={isSubmitting || isLoadingRoles}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Admin'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAdminModal;
