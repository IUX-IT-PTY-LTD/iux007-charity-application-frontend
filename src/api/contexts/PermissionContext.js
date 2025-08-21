/**
 * Permission Context Provider
 * Global state management for user permissions
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUserPermissions, clearPermissionsCache } from '@/api/utils/permissionWrapper';
import { getUserId } from '@/api/services/admin/authService';

// Create the context
const PermissionContext = createContext();

// Provider component
export const PermissionProvider = ({ children }) => {
  const [permissionState, setPermissionState] = useState({
    permissions: [],
    isLoading: true,
    isInitialized: false,
    error: null,
    user: null,
  });

  // Load user permissions
  const loadPermissions = async () => {
    try {
      setPermissionState((prev) => ({ ...prev, isLoading: true, error: null }));

      const userId = getUserId();
      if (!userId) {
        // User not logged in
        setPermissionState({
          permissions: [],
          isLoading: false,
          isInitialized: true,
          error: null,
          user: null,
        });
        return;
      }

      // Get user permissions
      const permissions = await getCurrentUserPermissions();

      setPermissionState({
        permissions,
        isLoading: false,
        isInitialized: true,
        error: null,
        user: { id: userId },
      });

      console.log(`Loaded ${permissions.length} permissions for user ${userId}`);
    } catch (error) {
      console.error('Error loading permissions:', error);
      setPermissionState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message,
        permissions: [], // Clear permissions on error
      }));
    }
  };

  // Refresh permissions (useful when user role changes)
  const refreshPermissions = async () => {
    clearPermissionsCache();
    await loadPermissions();
  };

  // Check if user has specific permission
  const hasPermission = (permissionName) => {
    if (!permissionState.isInitialized || permissionState.isLoading) {
      return false; // Deny access while loading
    }
    return permissionState.permissions.includes(permissionName);
  };

  // Check if user has any permission for a module
  const hasModuleAccess = (module) => {
    if (!permissionState.isInitialized || permissionState.isLoading) {
      return false; // Deny access while loading
    }
    return permissionState.permissions.some((permission) => permission.startsWith(`${module}_`));
  };

  // Check if user has any of the provided permissions
  const hasAnyPermission = (permissionList) => {
    if (!permissionState.isInitialized || permissionState.isLoading) {
      return false;
    }
    return permissionList.some((permission) => permissionState.permissions.includes(permission));
  };

  // Check if user has all of the provided permissions
  const hasAllPermissions = (permissionList) => {
    if (!permissionState.isInitialized || permissionState.isLoading) {
      return false;
    }
    return permissionList.every((permission) => permissionState.permissions.includes(permission));
  };

  // Get user's permissions for a specific module
  const getModulePermissions = (module) => {
    if (!permissionState.isInitialized || permissionState.isLoading) {
      return [];
    }
    return permissionState.permissions.filter((permission) => permission.startsWith(`${module}_`));
  };

  // Get allowed actions for a module
  const getAllowedActions = (module) => {
    const modulePermissions = getModulePermissions(module);
    return modulePermissions.map((permission) => {
      const parts = permission.split('_');
      return parts.slice(1).join('_'); // Remove module part, keep action
    });
  };

  // Check specific actions
  const canCreate = (module) => hasPermission(`${module}_create`);
  const canView = (module) => hasPermission(`${module}_view`);
  const canEdit = (module) => hasPermission(`${module}_edit`);
  const canDelete = (module) => hasPermission(`${module}_delete`);

  // Clear permissions (on logout)
  const clearPermissions = () => {
    clearPermissionsCache();
    setPermissionState({
      permissions: [],
      isLoading: false,
      isInitialized: true,
      error: null,
      user: null,
    });
  };

  // Load permissions on mount and when user changes
  useEffect(() => {
    loadPermissions();
  }, []);

  // Context value
  const contextValue = {
    // State
    ...permissionState,

    // Actions
    loadPermissions,
    refreshPermissions,
    clearPermissions,

    // Permission checking methods
    hasPermission,
    hasModuleAccess,
    hasAnyPermission,
    hasAllPermissions,
    getModulePermissions,
    getAllowedActions,

    // Convenience methods
    canCreate,
    canView,
    canEdit,
    canDelete,
  };

  return <PermissionContext.Provider value={contextValue}>{children}</PermissionContext.Provider>;
};

// Hook to use the permission context
export const usePermissionContext = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissionContext must be used within a PermissionProvider');
  }
  return context;
};

// Export the context for direct access if needed
export { PermissionContext };
