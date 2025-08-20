// components/admin/org/roles/modals/ViewPermissionsModal.jsx
import React, { useState, useEffect } from 'react';
import { getRolePermissions } from '@/api/services/admin/roleService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Shield, User } from 'lucide-react';
import { toast } from 'sonner';

const ViewPermissionsModal = ({ isOpen, onClose, role }) => {
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (role && isOpen) {
      fetchRolePermissions(role.id);
    }
  }, [role, isOpen]);

  const fetchRolePermissions = async (roleId) => {
    setIsLoading(true);
    try {
      const response = await getRolePermissions(roleId);

      if (response.status === 'success' && response.data && response.data.length > 0) {
        const rolePermissions = response.data[0].permissions || [];
        setPermissions(rolePermissions);
      } else {
        setPermissions([]);
      }
    } catch (error) {
      console.error('Error fetching role permissions:', error);
      toast.error('Failed to load role permissions');
      setPermissions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Group permissions by module
  const groupedPermissions = permissions.reduce((groups, permission) => {
    const parts = permission.name.split('_');
    const module = parts[0] || 'general';

    if (!groups[module]) {
      groups[module] = [];
    }
    groups[module].push(permission);

    return groups;
  }, {});

  const formatPermissionName = (permissionName) => {
    return permissionName.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatModuleName = (moduleName) => {
    return moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
  };

  const getModuleIcon = (moduleName) => {
    switch (moduleName.toLowerCase()) {
      case 'user':
      case 'users':
        return <User className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Role Permissions: {role?.name}
          </DialogTitle>
          <DialogDescription>View all permissions assigned to this role.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading permissions...</span>
            </div>
          ) : permissions.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Permissions</h3>
              <p className="text-gray-500">This role has no permissions assigned.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-blue-900">Permission Summary</h4>
                    <p className="text-sm text-blue-700">Total permissions: {permissions.length}</p>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    {Object.keys(groupedPermissions).length} modules
                  </Badge>
                </div>
              </div>

              {/* Permissions by module */}
              <div className="space-y-4">
                {Object.entries(groupedPermissions).map(([moduleName, modulePermissions]) => (
                  <div key={moduleName} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      {getModuleIcon(moduleName)}
                      <h4 className="font-medium text-gray-900">{formatModuleName(moduleName)}</h4>
                      <Badge variant="outline" className="ml-auto">
                        {modulePermissions.length}{' '}
                        {modulePermissions.length === 1 ? 'permission' : 'permissions'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {modulePermissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-center gap-2 p-2 bg-gray-50 rounded border"
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">
                            {formatPermissionName(permission.name)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPermissionsModal;
