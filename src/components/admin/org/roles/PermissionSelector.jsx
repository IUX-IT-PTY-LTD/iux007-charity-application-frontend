// components/admin/org/roles/PermissionSelector.jsx
import React, { useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Shield, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import {
  filterPermissionsByUserRole,
  getCurrentUserRole,
  canSeePermissionModule,
  getPermissionDenialMessage,
} from '@/api/utils/roleHierarchy';

const PermissionSelector = ({
  permissions = [],
  selectedPermissions = [],
  onSelectionChange,
  disabled = false,
  targetRole = null, // The role being edited (for self-permission protection)
}) => {
  const { adminProfile } = useAdminContext();
  const currentUserRole = getCurrentUserRole(adminProfile);

  // Filter permissions based on user role
  const filteredPermissions = useMemo(() => {
    return filterPermissionsByUserRole(permissions, currentUserRole);
  }, [permissions, currentUserRole]);

  // Check if user is editing their own role
  const isEditingOwnRole = useMemo(() => {
    if (!targetRole || !adminProfile?.role) return false;
    return targetRole.id === adminProfile.role.id;
  }, [targetRole, adminProfile]);

  // Group permissions by module/category
  const groupedPermissions = useMemo(() => {
    const groups = {};

    filteredPermissions.forEach((permission) => {
      // Extract module name from permission name (e.g., "user_view" -> "user")
      const parts = permission.name.split('_');
      const module = parts[0] || 'general';

      if (!groups[module]) {
        groups[module] = [];
      }
      groups[module].push(permission);
    });

    return groups;
  }, [filteredPermissions]);

  // Track expanded state for each group
  const [expandedGroups, setExpandedGroups] = React.useState(
    () => new Set(Object.keys(groupedPermissions))
  );

  // Toggle group expansion
  const toggleGroup = (groupName) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };

  // Handle individual permission toggle
  const handlePermissionToggle = (permissionId, checked) => {
    if (disabled) return;

    let newSelection;
    if (checked) {
      newSelection = [...selectedPermissions, permissionId];
    } else {
      newSelection = selectedPermissions.filter((id) => id !== permissionId);
    }
    onSelectionChange(newSelection);
  };

  // Handle group selection (select all/none in group)
  const handleGroupToggle = (groupPermissions, checked) => {
    if (disabled) return;

    const groupPermissionIds = groupPermissions.map((p) => p.id);
    let newSelection;

    if (checked) {
      // Add all group permissions that aren't already selected
      const toAdd = groupPermissionIds.filter((id) => !selectedPermissions.includes(id));
      newSelection = [...selectedPermissions, ...toAdd];
    } else {
      // Remove all group permissions
      newSelection = selectedPermissions.filter((id) => !groupPermissionIds.includes(id));
    }

    onSelectionChange(newSelection);
  };

  // Handle select all/none
  const handleSelectAll = () => {
    if (disabled) return;
    const allPermissionIds = filteredPermissions.map((p) => p.id);
    onSelectionChange(allPermissionIds);
  };

  const handleSelectNone = () => {
    if (disabled) return;
    onSelectionChange([]);
  };

  // Check if group is fully/partially selected
  const getGroupSelectionState = (groupPermissions) => {
    const groupPermissionIds = groupPermissions.map((p) => p.id);
    const selectedInGroup = groupPermissionIds.filter((id) => selectedPermissions.includes(id));

    if (selectedInGroup.length === 0) return 'none';
    if (selectedInGroup.length === groupPermissionIds.length) return 'all';
    return 'partial';
  };

  const formatGroupName = (groupName) => {
    return groupName.charAt(0).toUpperCase() + groupName.slice(1);
  };

  const formatPermissionName = (permissionName) => {
    return permissionName.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Show warning if editing own role
  const showOwnRoleWarning = isEditingOwnRole && !canSeePermissionModule(currentUserRole);

  if (filteredPermissions.length === 0) {
    return (
      <div className="space-y-4">
        <Label className="text-base font-medium">Permissions</Label>
        <div className="text-center py-8 text-gray-500">
          <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p>No permissions available for your access level</p>
          {!canSeePermissionModule(currentUserRole) && (
            <p className="text-xs text-gray-400 mt-2">
              Contact Super Admin to manage advanced permissions
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Self-editing warning */}
      {showOwnRoleWarning && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Notice:</strong> You are editing your own role. Some advanced permissions may
            not be visible. Contact a Super Admin if you need to modify permission-related access.
          </AlertDescription>
        </Alert>
      )}

      {/* Permission module restriction notice */}
      {!canSeePermissionModule(currentUserRole) && (
        <Alert className="border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Access Level:</strong> Permission management module is restricted to Super Admin
            users. You can assign other available permissions to roles.
          </AlertDescription>
        </Alert>
      )}

      {/* Header with select all/none */}
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">
          Permissions
          {filteredPermissions.length !== permissions.length && (
            <Badge variant="outline" className="ml-2 text-xs">
              Filtered: {filteredPermissions.length} of {permissions.length}
            </Badge>
          )}
        </Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            disabled={disabled}
          >
            Select All
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSelectNone}
            disabled={disabled}
          >
            Select None
          </Button>
        </div>
      </div>

      {/* Selection summary */}
      <div className="flex items-center gap-2">
        <Badge variant="outline">
          {selectedPermissions.length} of {filteredPermissions.length} selected
        </Badge>
        {filteredPermissions.length !== permissions.length && (
          <Badge variant="secondary" className="text-xs">
            {permissions.length - filteredPermissions.length} permissions hidden by access level
          </Badge>
        )}
      </div>

      {/* Permission groups */}
      <div className="space-y-3 max-h-96 overflow-y-auto border rounded-lg p-4">
        {Object.entries(groupedPermissions).map(([groupName, groupPermissions]) => {
          const selectionState = getGroupSelectionState(groupPermissions);
          const isExpanded = expandedGroups.has(groupName);

          return (
            <Collapsible
              key={groupName}
              open={isExpanded}
              onOpenChange={() => toggleGroup(groupName)}
            >
              <div className="space-y-2">
                {/* Group header */}
                <div className="flex items-center justify-between">
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 p-0 h-auto font-medium hover:bg-transparent"
                      disabled={disabled}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      {formatGroupName(groupName)}
                      <Badge variant="outline" className="ml-2">
                        {groupPermissions.length}
                      </Badge>
                    </Button>
                  </CollapsibleTrigger>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectionState === 'all'}
                      ref={(el) => {
                        if (el) el.indeterminate = selectionState === 'partial';
                      }}
                      onCheckedChange={(checked) => handleGroupToggle(groupPermissions, checked)}
                      disabled={disabled}
                    />
                    <span className="text-sm text-gray-600">
                      {selectionState === 'all' && 'All selected'}
                      {selectionState === 'partial' && 'Partial'}
                      {selectionState === 'none' && 'None selected'}
                    </span>
                  </div>
                </div>

                {/* Group permissions */}
                <CollapsibleContent className="space-y-2">
                  <div className="ml-6 space-y-2">
                    {groupPermissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`permission-${permission.id}`}
                          checked={selectedPermissions.includes(permission.id)}
                          onCheckedChange={(checked) =>
                            handlePermissionToggle(permission.id, checked)
                          }
                          disabled={disabled}
                        />
                        <Label
                          htmlFor={`permission-${permission.id}`}
                          className="text-sm font-normal cursor-pointer flex-1"
                        >
                          {formatPermissionName(permission.name)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}
      </div>

      {/* Footer info */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Permissions control access to different modules and features</p>
        <p>• Select only the permissions needed for this role's responsibilities</p>
        {!canSeePermissionModule(currentUserRole) && (
          <p className="text-amber-600">
            • Advanced permission management requires Super Admin access
          </p>
        )}
      </div>
    </div>
  );
};

export default PermissionSelector;
