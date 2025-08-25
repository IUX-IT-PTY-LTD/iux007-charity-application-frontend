// src/api/hooks/usePermission.js

/**
 * Permission Hooks
 * React hooks for permission checking in components
 */

import { usePermissionContext } from '../contexts/PermissionContext';

/**
 * Hook to check if user has a specific permission
 * @param {string} permission - Permission name to check
 * @returns {Object} Permission check result
 */
export const usePermission = (permission) => {
  const { hasPermission, isLoading, isInitialized, error } = usePermissionContext();

  return {
    hasPermission: hasPermission(permission),
    isLoading,
    isInitialized,
    error,
    permission,
  };
};

/**
 * Hook to check if user has any of the provided permissions
 * @param {Array<string>} permissions - Array of permission names
 * @returns {Object} Permission check result
 */
export const useAnyPermission = (permissions) => {
  const { hasAnyPermission, isLoading, isInitialized, error } = usePermissionContext();

  return {
    hasPermission: hasAnyPermission(permissions),
    isLoading,
    isInitialized,
    error,
    permissions,
  };
};

/**
 * Hook to check if user has all of the provided permissions
 * @param {Array<string>} permissions - Array of permission names
 * @returns {Object} Permission check result
 */
export const useAllPermissions = (permissions) => {
  const { hasAllPermissions, isLoading, isInitialized, error } = usePermissionContext();

  return {
    hasPermission: hasAllPermissions(permissions),
    isLoading,
    isInitialized,
    error,
    permissions,
  };
};

/**
 * Hook to check module access and get module-specific permission info
 * @param {string} module - Module name
 * @returns {Object} Module permission information
 */
export const useModuleAccess = (module) => {
  const {
    hasModuleAccess,
    getModulePermissions,
    getAllowedActions,
    canCreate,
    canView,
    canEdit,
    canDelete,
    isLoading,
    isInitialized,
    error,
  } = usePermissionContext();

  return {
    hasAccess: hasModuleAccess(module),
    permissions: getModulePermissions(module),
    allowedActions: getAllowedActions(module),
    canCreate: canCreate(module),
    canView: canView(module),
    canEdit: canEdit(module),
    canDelete: canDelete(module),
    isLoading,
    isInitialized,
    error,
    module,
  };
};

/**
 * Hook for complete permission state (useful for debugging or advanced use)
 * @returns {Object} Complete permission context
 */
export const usePermissions = () => {
  return usePermissionContext();
};
