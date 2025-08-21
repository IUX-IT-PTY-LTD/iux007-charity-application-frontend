/**
 * Simple Permission Wrapper
 * Wraps service operations with permission checking
 */

import { getAdminById } from '../api/services/admin/adminService.js';
import { getRolePermissions } from '../api/services/admin/permissionService.js';
import { getUserId } from '../api/services/admin/authService.js';

// Cache for user permissions to avoid repeated API calls
let userPermissionsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get current user's permissions
 * @returns {Promise<Array<string>>} Array of permission names
 */
export const getCurrentUserPermissions = async () => {
  try {
    // Check cache first
    const now = Date.now();
    if (userPermissionsCache && cacheTimestamp && now - cacheTimestamp < CACHE_DURATION) {
      return userPermissionsCache;
    }

    // Get current user ID
    const userId = getUserId();
    if (!userId) {
      throw new Error('User not logged in');
    }

    // Get user details including role
    const userResponse = await getAdminById(userId);
    if (!userResponse || !userResponse.data || !userResponse.data.role_id) {
      throw new Error('Could not get user role information');
    }

    const roleId = userResponse.data.role_id;

    // Get role permissions
    const permissionsResponse = await getRolePermissions(roleId);
    if (!permissionsResponse || !permissionsResponse.data || !permissionsResponse.data[0]) {
      console.warn('No permissions found for user role');
      userPermissionsCache = [];
      cacheTimestamp = now;
      return [];
    }

    // Extract permission names
    const permissions = permissionsResponse.data[0].permissions || [];
    const permissionNames = permissions.map((p) => p.name);

    // Cache the result
    userPermissionsCache = permissionNames;
    cacheTimestamp = now;

    return permissionNames;
  } catch (error) {
    console.error('Error getting user permissions:', error);
    throw error;
  }
};

/**
 * Check if current user has a specific permission
 * @param {string} permissionName - Permission name to check
 * @returns {Promise<boolean>} True if user has permission
 */
export const hasPermission = async (permissionName) => {
  try {
    const userPermissions = await getCurrentUserPermissions();
    return userPermissions.includes(permissionName);
  } catch (error) {
    console.error('Error checking permission:', error);
    return false; // Deny access on error
  }
};

/**
 * Check if current user has any permission for a module
 * @param {string} module - Module name (e.g., 'admin', 'event')
 * @returns {Promise<boolean>} True if user has any permission for the module
 */
export const hasModuleAccess = async (module) => {
  try {
    const userPermissions = await getCurrentUserPermissions();
    return userPermissions.some((permission) => permission.startsWith(`${module}_`));
  } catch (error) {
    console.error('Error checking module access:', error);
    return false; // Deny access on error
  }
};

/**
 * Wrapper function to check permission before executing a service operation
 * @param {string} requiredPermission - Permission name required for the operation
 * @param {Function} operation - The service operation to execute
 * @returns {Function} Wrapped function that checks permission first
 */
export const withPermission = (requiredPermission, operation) => {
  return async (...args) => {
    try {
      // Check if user has the required permission
      const hasRequiredPermission = await hasPermission(requiredPermission);

      if (!hasRequiredPermission) {
        const error = new Error(`Access denied. Required permission: ${requiredPermission}`);
        error.code = 'PERMISSION_DENIED';
        error.permission = requiredPermission;
        throw error;
      }

      // Execute the operation if permission check passes
      return await operation(...args);
    } catch (error) {
      // Re-throw permission errors
      if (error.code === 'PERMISSION_DENIED') {
        throw error;
      }

      // For other errors, check if it's a permission-related error
      if (error.message.includes('permission') || error.message.includes('unauthorized')) {
        const permissionError = new Error(
          `Access denied. Required permission: ${requiredPermission}`
        );
        permissionError.code = 'PERMISSION_DENIED';
        permissionError.permission = requiredPermission;
        permissionError.originalError = error;
        throw permissionError;
      }

      // Re-throw other errors as-is
      throw error;
    }
  };
};

/**
 * Clear the permissions cache (useful when user role changes)
 */
export const clearPermissionsCache = () => {
  userPermissionsCache = null;
  cacheTimestamp = null;
  console.log('Permissions cache cleared');
};

/**
 * Force refresh user permissions (clears cache and fetches fresh data)
 * @returns {Promise<Array<string>>} Fresh array of permission names
 */
export const refreshUserPermissions = async () => {
  clearPermissionsCache();
  return await getCurrentUserPermissions();
};

/**
 * Get user's permissions for a specific module
 * @param {string} module - Module name
 * @returns {Promise<Array<string>>} Array of permission names for the module
 */
export const getModulePermissions = async (module) => {
  try {
    const userPermissions = await getCurrentUserPermissions();
    return userPermissions.filter((permission) => permission.startsWith(`${module}_`));
  } catch (error) {
    console.error('Error getting module permissions:', error);
    return [];
  }
};

/**
 * Check if user can perform a specific action on a module
 * @param {string} module - Module name
 * @param {string} action - Action name (create, view, edit, delete)
 * @returns {Promise<boolean>} True if user can perform the action
 */
export const canPerformAction = async (module, action) => {
  const permissionName = `${module}_${action}`;
  return await hasPermission(permissionName);
};

// Convenience functions for common actions
export const canCreate = (module) => canPerformAction(module, 'create');
export const canView = (module) => canPerformAction(module, 'view');
export const canEdit = (module) => canPerformAction(module, 'edit');
export const canDelete = (module) => canPerformAction(module, 'delete');
