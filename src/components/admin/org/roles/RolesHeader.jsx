// components/admin/org/roles/RolesHeader.jsx
import React from 'react';
import { PlusCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import {
  getCurrentUserRole,
  validateRoleOperation,
  ROLE_LEVELS,
  getRoleLevel,
} from '@/api/utils/roleHierarchy';
import { toast } from 'sonner';

const RolesHeader = ({ onCreateClick }) => {
  const { adminProfile } = useAdminContext();
  const currentUserRole = getCurrentUserRole(adminProfile);
  const currentRoleLevel = getRoleLevel(currentUserRole);

  // Check if user can create roles
  const canCreateRoles = validateRoleOperation.create(currentUserRole, '').valid;

  const handleCreateClick = () => {
    const validation = validateRoleOperation.create(currentUserRole, '');
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }
    onCreateClick();
  };

  return (
    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Role Management
          </CardTitle>
          <Badge
            variant="outline"
            className={`text-xs ${
              currentRoleLevel === ROLE_LEVELS.SUPER_ADMIN
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : currentRoleLevel === ROLE_LEVELS.ADMIN
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-gray-50 text-gray-700 border-gray-200'
            }`}
          >
            {currentRoleLevel} Access
          </Badge>
        </div>

        <CardDescription>
          {currentRoleLevel === ROLE_LEVELS.SUPER_ADMIN &&
            'Full access: Manage all roles and permissions'}
          {currentRoleLevel === ROLE_LEVELS.ADMIN &&
            'Admin access: Manage custom roles (Admin and Super Admin roles are protected)'}
          {currentRoleLevel === ROLE_LEVELS.OTHER && 'Limited access: View-only permissions'}
        </CardDescription>
      </div>

      <div className="flex items-center gap-3">
        {/* Access level indicator */}
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
          <Shield className="h-4 w-4" />
          <span>
            {currentRoleLevel === ROLE_LEVELS.SUPER_ADMIN && 'Full Control'}
            {currentRoleLevel === ROLE_LEVELS.ADMIN && 'Limited Control'}
            {currentRoleLevel === ROLE_LEVELS.OTHER && 'View Only'}
          </span>
        </div>

        {/* Create Role Button */}
        <Button
          onClick={handleCreateClick}
          disabled={!canCreateRoles}
          className={`${
            canCreateRoles
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'opacity-50 cursor-not-allowed'
          }`}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Role
        </Button>
      </div>
    </CardHeader>
  );
};

export default RolesHeader;
