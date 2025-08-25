// src/api/utils/roleHierarchy.js

/**
 * Role Hierarchy System - ONLY for Role/Permission Management
 * This system is specifically designed for role and permission management pages.
 * All other parts of the application continue using the basic permission system.
 */

import { getRoleById } from '@/api/services/admin/roleService';
import { getAdminById } from '@/api/services/admin/adminService';
import { getUserId } from '@/api/services/admin/authService';

// Define role hierarchy levels
export const ROLE_LEVELS = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  OTHER: 'Other',
};

// Define role hierarchy order (higher number = more privileges)
export const ROLE_HIERARCHY = {
  [ROLE_LEVELS.SUPER_ADMIN]: 3,
  [ROLE_LEVELS.ADMIN]: 2,
  [ROLE_LEVELS.OTHER]: 1,
};

// Cache for user role to avoid repeated API calls
let userRoleCache = null;
let userRoleCacheTimestamp = null;
const ROLE_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get current user's complete profile with role information
 * @returns {Promise<Object>} Complete user profile with role
 */
export const getCurrentUserProfile = async () => {
  try {
    // Check cache first
    const now = Date.now();
    if (
      userRoleCache &&
      userRoleCacheTimestamp &&
      now - userRoleCacheTimestamp < ROLE_CACHE_DURATION
    ) {
      return userRoleCache;
    }

    // Get current user ID
    const userId = getUserId();
    if (!userId) {
      throw new Error('User not logged in');
    }

    // Get user details including role_id
    const userResponse = await getAdminById(userId);
    if (!userResponse || !userResponse.data || !userResponse.data.role_id) {
      throw new Error('Could not get user role information');
    }

    const userData = userResponse.data;
    const roleId = userData.role_id;

    // Get role details by role ID
    const roleResponse = await getRoleById(roleId);
    if (!roleResponse || !roleResponse.data) {
      throw new Error('Could not get role details');
    }

    const roleData = roleResponse.data;

    // Create complete profile
    const profile = {
      ...userData,
      role: {
        id: roleData.id,
        name: roleData.name,
        status: roleData.status,
      },
    };

    // Cache the result
    userRoleCache = profile;
    userRoleCacheTimestamp = now;

    return profile;
  } catch (error) {
    console.error('Error getting current user profile:', error);
    throw error;
  }
};

/**
 * Get current user's role name from admin profile (synchronous)
 * @param {Object} adminProfile - Admin profile object
 * @returns {string} Current user's role name
 */
export const getCurrentUserRole = (adminProfile) => {
  if (!adminProfile || !adminProfile.role) {
    return '';
  }
  return adminProfile.role.name || '';
};

/**
 * Get current user's role name by fetching from API (async)
 * @returns {Promise<string>} Current user's role name
 */
export const getCurrentUserRoleName = async () => {
  try {
    const profile = await getCurrentUserProfile();
    return profile.role?.name || '';
  } catch (error) {
    console.error('Error getting current user role name:', error);
    return '';
  }
};

/**
 * Clear user role cache (useful when user role changes)
 */
export const clearUserRoleCache = () => {
  userRoleCache = null;
  userRoleCacheTimestamp = null;
  console.log('User role cache cleared');
};

/**
 * Get role level based on role name
 * @param {string} roleName - Name of the role
 * @returns {string} Role level
 */
export const getRoleLevel = (roleName) => {
  if (!roleName) return ROLE_LEVELS.OTHER;

  const normalizedName = roleName.toLowerCase().trim();

  if (normalizedName === 'super admin' || normalizedName === 'superadmin') {
    return ROLE_LEVELS.SUPER_ADMIN;
  }

  if (normalizedName === 'admin') {
    return ROLE_LEVELS.ADMIN;
  }

  return ROLE_LEVELS.OTHER;
};

/**
 * Get current user's role level (async)
 * @returns {Promise<string>} Current user's role level
 */
export const getCurrentUserRoleLevel = async () => {
  try {
    const roleName = await getCurrentUserRoleName();
    return getRoleLevel(roleName);
  } catch (error) {
    console.error('Error getting current user role level:', error);
    return ROLE_LEVELS.OTHER;
  }
};

/**
 * Check if current user can modify target role
 * @param {string} currentUserRoleName - Current user's role name
 * @param {string} targetRoleName - Target role name to be modified
 * @returns {boolean} True if user can modify the role
 */
export const canModifyRole = (currentUserRoleName, targetRoleName) => {
  const currentUserRoleLevel = getRoleLevel(currentUserRoleName);

  // Super Admin can modify everything
  if (currentUserRoleLevel === ROLE_LEVELS.SUPER_ADMIN) {
    return true;
  }

  // Admin cannot modify Super Admin or Admin roles
  if (currentUserRoleLevel === ROLE_LEVELS.ADMIN) {
    const targetRoleLevel = getRoleLevel(targetRoleName);
    if (targetRoleLevel === ROLE_LEVELS.SUPER_ADMIN || targetRoleLevel === ROLE_LEVELS.ADMIN) {
      return false;
    }
    return true;
  }

  // Other roles cannot modify any roles
  return false;
};

/**
 * Check if current user can see permission module
 * @param {string} currentUserRoleName - Current user's role name
 * @returns {boolean} True if user can see permission module
 */
export const canSeePermissionModule = (currentUserRoleName) => {
  const roleLevel = getRoleLevel(currentUserRoleName);
  return roleLevel === ROLE_LEVELS.SUPER_ADMIN;
};

/**
 * Check if current user has role management access
 * @param {string} currentUserRoleName - Current user's role name
 * @returns {boolean} True if user can manage roles
 */
export const canManageRoles = (currentUserRoleName) => {
  const roleLevel = getRoleLevel(currentUserRoleName);
  return roleLevel === ROLE_LEVELS.SUPER_ADMIN || roleLevel === ROLE_LEVELS.ADMIN;
};

/**
 * Filter permissions based on user role level (ONLY for role management)
 * @param {Array} permissions - Array of all permissions
 * @param {string} currentUserRoleName - Current user's role name
 * @returns {Array} Filtered permissions
 */
export const filterPermissionsByUserRole = (permissions, currentUserRoleName) => {
  if (!permissions || permissions.length === 0) return [];

  const roleLevel = getRoleLevel(currentUserRoleName);

  // Super Admin sees all permissions
  if (roleLevel === ROLE_LEVELS.SUPER_ADMIN) {
    return permissions;
  }

  // Admin and others cannot see permission module permissions
  return permissions.filter((permission) => {
    const permissionName = permission.name || '';
    return !permissionName.startsWith('permission_');
  });
};

/**
 * Filter roles based on user access level (ONLY for role management)
 * @param {Array} roles - Array of all roles
 * @param {string} currentUserRoleName - Current user's role name
 * @returns {Array} Filtered roles that user can see/modify
 */
export const filterRolesByUserAccess = (roles, currentUserRoleName) => {
  if (!roles || roles.length === 0) return [];

  const roleLevel = getRoleLevel(currentUserRoleName);

  // Super Admin sees all roles
  if (roleLevel === ROLE_LEVELS.SUPER_ADMIN) {
    return roles;
  }

  // Admin sees all roles but can only modify non-Admin/non-Super Admin roles
  if (roleLevel === ROLE_LEVELS.ADMIN) {
    return roles.map((role) => ({
      ...role,
      canModify: canModifyRole(currentUserRoleName, role.name),
      canDelete: canModifyRole(currentUserRoleName, role.name),
    }));
  }

  // Other roles see no roles or very limited access
  return [];
};

/**
 * Get user-friendly error message for permission denial
 * @param {string} action - Action being attempted
 * @param {string} targetRole - Target role
 * @returns {string} Error message
 */
export const getPermissionDenialMessage = (action, targetRole = '') => {
  const messages = {
    modifyRole: `You don't have permission to modify ${targetRole ? `the ${targetRole}` : 'this'} role. Only Super Admin can modify Admin and Super Admin roles.`,
    deleteRole: `You don't have permission to delete ${targetRole ? `the ${targetRole}` : 'this'} role. Only Super Admin can delete Admin and Super Admin roles.`,
    viewPermissionModule: 'Permission management is only available to Super Admin users.',
    modifyOwnPermissions:
      'You cannot modify the permissions of your own role. Contact a Super Admin for assistance.',
    createRole: "You don't have permission to create roles.",
    assignPermissions: "You don't have permission to assign permissions to roles.",
    roleManagement: "You don't have access to role management.",
  };

  return messages[action] || "You don't have permission to perform this action.";
};

/**
 * Check if role is protected (Admin or Super Admin)
 * @param {string} roleName - Name of the role
 * @returns {boolean} True if role is protected
 */
export const isProtectedRole = (roleName) => {
  const roleLevel = getRoleLevel(roleName);
  return roleLevel === ROLE_LEVELS.ADMIN || roleLevel === ROLE_LEVELS.SUPER_ADMIN;
};

/**
 * Check if user is editing their own role
 * @param {Object} targetRole - Role being edited
 * @param {string} currentUserRoleName - Current user's role name
 * @returns {boolean} True if editing own role
 */
export const isEditingOwnRole = (targetRole, currentUserRoleName = null) => {
  if (!targetRole || !currentUserRoleName) return false;

  // Compare role names (case insensitive)
  return targetRole.name.toLowerCase().trim() === currentUserRoleName.toLowerCase().trim();
};

/**
 * Validation functions for role operations (ONLY for role management)
 */
export const validateRoleOperation = {
  /**
   * Validate role creation
   */
  create: (currentUserRoleName, newRoleName) => {
    const roleLevel = getRoleLevel(currentUserRoleName);

    if (roleLevel === ROLE_LEVELS.SUPER_ADMIN) {
      return { valid: true };
    }

    if (roleLevel === ROLE_LEVELS.ADMIN) {
      // Admin can create non-protected roles
      if (!isProtectedRole(newRoleName)) {
        return { valid: true };
      }
      return {
        valid: false,
        message: 'Only Super Admin can create Admin or Super Admin roles',
      };
    }

    return {
      valid: false,
      message: getPermissionDenialMessage('createRole'),
    };
  },

  /**
   * Validate role update
   */
  update: (currentUserRoleName, targetRole) => {
    if (canModifyRole(currentUserRoleName, targetRole.name)) {
      return { valid: true };
    }

    return {
      valid: false,
      message: getPermissionDenialMessage('modifyRole', targetRole.name),
    };
  },

  /**
   * Validate role deletion
   */
  delete: (currentUserRoleName, targetRole) => {
    if (canModifyRole(currentUserRoleName, targetRole.name)) {
      return { valid: true };
    }

    return {
      valid: false,
      message: getPermissionDenialMessage('deleteRole', targetRole.name),
    };
  },

  /**
   * Validate role management access
   */
  roleManagement: (currentUserRoleName) => {
    if (canManageRoles(currentUserRoleName)) {
      return { valid: true };
    }

    return {
      valid: false,
      message: getPermissionDenialMessage('roleManagement'),
    };
  },
};

// Export all functions for role management use
export default {
  ROLE_LEVELS,
  ROLE_HIERARCHY,
  getCurrentUserProfile,
  getCurrentUserRole,
  getCurrentUserRoleName,
  getCurrentUserRoleLevel,
  clearUserRoleCache,
  getRoleLevel,
  canModifyRole,
  canSeePermissionModule,
  canManageRoles,
  filterPermissionsByUserRole,
  filterRolesByUserAccess,
  getPermissionDenialMessage,
  isProtectedRole,
  isEditingOwnRole,
  validateRoleOperation,
};
