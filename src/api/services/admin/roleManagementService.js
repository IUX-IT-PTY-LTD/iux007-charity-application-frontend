// src/api/services/admin/roleManagementService.js

/**
 * Role Management Service with Hierarchy Support
 * This service is specifically for role/permission management pages.
 * It integrates role hierarchy validation with the existing role service.
 */

import * as roleService from './roleService';
import {
  getCurrentUserRoleName,
  validateRoleOperation,
  canManageRoles,
  filterRolesByUserAccess,
  filterPermissionsByUserRole,
  clearUserRoleCache,
} from '@/api/utils/roleHierarchy';

/**
 * Get roles with hierarchy filtering applied
 * @returns {Promise<Array>} Filtered roles based on user access
 */
export const getRolesForRoleManagement = async () => {
  try {
    // First validate user has role management access
    const currentUserRoleName = await getCurrentUserRoleName();
    const validation = validateRoleOperation.roleManagement(currentUserRoleName);

    if (!validation.valid) {
      throw new Error(validation.message);
    }

    // Get all roles using the original service
    const response = await roleService.getAllRoles();
    const roles = response.data || [];

    // Filter roles based on user access level
    return filterRolesByUserAccess(roles, currentUserRoleName);
  } catch (error) {
    console.error('Error getting roles for role management:', error);
    throw error;
  }
};

/**
 * Get permissions with hierarchy filtering applied
 * @returns {Promise<Array>} Filtered permissions based on user access
 */
export const getPermissionsForRoleManagement = async () => {
  try {
    const currentUserRoleName = await getCurrentUserRoleName();

    // Get all permissions using the original service
    const response = await roleService.getAllPermissions();
    const permissions = response.data || [];

    // Filter permissions based on user access level
    return filterPermissionsByUserRole(permissions, currentUserRoleName);
  } catch (error) {
    console.error('Error getting permissions for role management:', error);
    throw error;
  }
};

/**
 * Create role with hierarchy validation
 * @param {string} name - Role name
 * @param {number} status - Role status
 * @param {Array<number>} permissionIds - Permission IDs
 * @returns {Promise} Role creation result
 */
export const createRoleWithHierarchy = async (name, status = 1, permissionIds = []) => {
  try {
    const currentUserRoleName = await getCurrentUserRoleName();

    // Validate role creation permission
    const validation = validateRoleOperation.create(currentUserRoleName, name);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    // Create role using original service
    return await roleService.createRoleWithPermissions(name, status, permissionIds);
  } catch (error) {
    console.error('Error creating role with hierarchy validation:', error);
    throw error;
  }
};

/**
 * Update role with hierarchy validation
 * @param {number} roleId - Role ID
 * @param {string} name - Role name
 * @param {number} status - Role status
 * @param {Array<number>} permissionIds - Permission IDs
 * @returns {Promise} Role update result
 */
export const updateRoleWithHierarchy = async (roleId, name, status, permissionIds = []) => {
  try {
    const currentUserRoleName = await getCurrentUserRoleName();

    // Get the role being updated
    const roleResponse = await roleService.getRoleById(roleId);
    if (!roleResponse || !roleResponse.data) {
      throw new Error('Role not found');
    }

    const targetRole = roleResponse.data;

    // Validate role update permission
    const validation = validateRoleOperation.update(currentUserRoleName, targetRole);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    // Update role using original service
    return await roleService.updateRoleWithPermissions(roleId, name, status, permissionIds);
  } catch (error) {
    console.error('Error updating role with hierarchy validation:', error);
    throw error;
  }
};

/**
 * Update role status with hierarchy validation
 * @param {number} roleId - Role ID
 * @param {string} name - Role name
 * @param {number} status - New status
 * @returns {Promise} Role update result
 */
export const updateRoleStatusWithHierarchy = async (roleId, name, status) => {
  try {
    const currentUserRoleName = await getCurrentUserRoleName();

    // Create a role object for validation
    const targetRole = { id: roleId, name, status };

    // Validate role update permission
    const validation = validateRoleOperation.update(currentUserRoleName, targetRole);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    // Update role status using original service
    return await roleService.updateRole(roleId, name, status);
  } catch (error) {
    console.error('Error updating role status with hierarchy validation:', error);
    throw error;
  }
};

/**
 * Validate user access to role management
 * @returns {Promise<Object>} Validation result
 */
export const validateRoleManagementAccess = async () => {
  try {
    const currentUserRoleName = await getCurrentUserRoleName();
    return validateRoleOperation.roleManagement(currentUserRoleName);
  } catch (error) {
    console.error('Error validating role management access:', error);
    return {
      valid: false,
      message: 'Unable to validate access permissions',
    };
  }
};

/**
 * Get role with permissions using hierarchy validation
 * @param {number} roleId - Role ID
 * @returns {Promise} Role with permissions
 */
export const getRoleWithPermissionsForManagement = async (roleId) => {
  try {
    const currentUserRoleName = await getCurrentUserRoleName();

    // Validate role management access
    const validation = validateRoleOperation.roleManagement(currentUserRoleName);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    // Get role with permissions using original service
    return await roleService.getRoleWithPermissions(roleId);
  } catch (error) {
    console.error('Error getting role with permissions:', error);
    throw error;
  }
};

/**
 * Get role permissions using hierarchy validation
 * @param {number} roleId - Role ID
 * @returns {Promise} Role permissions
 */
export const getRolePermissionsForManagement = async (roleId) => {
  try {
    const currentUserRoleName = await getCurrentUserRoleName();

    // Validate role management access
    const validation = validateRoleOperation.roleManagement(currentUserRoleName);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    // Get role permissions using original service
    return await roleService.getRolePermissions(roleId);
  } catch (error) {
    console.error('Error getting role permissions:', error);
    throw error;
  }
};

/**
 * Clear all caches (useful when user role changes)
 */
export const clearRoleManagementCaches = () => {
  clearUserRoleCache();
};

// Convenience exports for components
export {
  // Direct re-exports from original service (no hierarchy needed)
  getRoleById,
  getAllPermissions,
  getRolePermissions,
} from './roleService';

// Re-export hierarchy utilities for components
export {
  getCurrentUserRole,
  validateRoleOperation,
  isProtectedRole,
  ROLE_LEVELS,
  getRoleLevel,
  canSeePermissionModule,
  getPermissionDenialMessage,
  canModifyRole,
  isEditingOwnRole,
} from '@/api/utils/roleHierarchy';
