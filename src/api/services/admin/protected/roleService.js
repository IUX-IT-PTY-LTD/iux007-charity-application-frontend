// src/api/services/admin/protected/roleService.js

/**
 * Protected Role Service
 * Role service with automatic permission checking
 */

import { rolePermissions } from '@/api/middleware/permissionMiddleware';
import * as originalRoleService from '@/api/services/admin/roleService';

// ==================== PROTECTED ROLE OPERATIONS ====================

/**
 * Get list of all roles (requires role_view permission)
 */
export const getAllRoles = rolePermissions.withViewPermission(originalRoleService.getAllRoles, {
  context: { operation: 'getAllRoles' },
});

/**
 * Create a new role (requires role_create permission)
 */
export const createRole = rolePermissions.withCreatePermission(originalRoleService.createRole, {
  context: { operation: 'createRole' },
});

/**
 * Get role by ID (requires role_view permission)
 */
export const getRoleById = rolePermissions.withViewPermission(originalRoleService.getRoleById, {
  context: { operation: 'getRoleById' },
});

/**
 * Update role data (requires role_edit permission)
 */
export const updateRole = rolePermissions.withEditPermission(originalRoleService.updateRole, {
  context: { operation: 'updateRole' },
});

// ==================== PROTECTED PERMISSION OPERATIONS ====================

/**
 * Get list of all permissions (requires permission_view permission)
 * Note: Using role_view as fallback since permissions are closely related to roles
 */
export const getAllPermissions = rolePermissions.withViewPermission(
  originalRoleService.getAllPermissions,
  {
    context: { operation: 'getAllPermissions' },
  }
);

// ==================== PROTECTED ROLE-PERMISSION OPERATIONS ====================

/**
 * Create permissions for a role (requires role_edit permission)
 */
export const createRolePermissions = rolePermissions.withEditPermission(
  originalRoleService.createRolePermissions,
  {
    context: { operation: 'createRolePermissions' },
  }
);

/**
 * Get permissions by role ID (requires role_view permission)
 */
export const getRolePermissions = rolePermissions.withViewPermission(
  originalRoleService.getRolePermissions,
  {
    context: { operation: 'getRolePermissions' },
  }
);

// ==================== PROTECTED COMBINED OPERATIONS ====================

/**
 * Create a role with permissions (requires role_create permission)
 */
export const createRoleWithPermissions = rolePermissions.withCreatePermission(
  originalRoleService.createRoleWithPermissions,
  {
    context: { operation: 'createRoleWithPermissions' },
  }
);

/**
 * Update a role with permissions (requires role_edit permission)
 */
export const updateRoleWithPermissions = rolePermissions.withEditPermission(
  originalRoleService.updateRoleWithPermissions,
  {
    context: { operation: 'updateRoleWithPermissions' },
  }
);

/**
 * Get complete role data with permissions (requires role_view permission)
 */
export const getRoleWithPermissions = rolePermissions.withViewPermission(
  originalRoleService.getRoleWithPermissions,
  {
    context: { operation: 'getRoleWithPermissions' },
  }
);
