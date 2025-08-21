// src/api/services/admin/protected/adminService.js

/**
 * Protected Admin Service
 * Admin service with automatic permission checking
 */

import { adminPermissions } from '@/api/middleware/permissionMiddleware';
import * as originalAdminService from '@/api/services/admin/adminService';

// ==================== PROTECTED ADMIN OPERATIONS ====================

/**
 * Create a new admin user (requires admin_create permission)
 */
export const createAdmin = adminPermissions.withCreatePermission(originalAdminService.createAdmin, {
  context: { operation: 'createAdmin' },
});

/**
 * Create admin with role validation (requires admin_create permission)
 */
export const createAdminWithRoleValidation = adminPermissions.withCreatePermission(
  originalAdminService.createAdminWithRoleValidation,
  {
    context: { operation: 'createAdminWithRoleValidation' },
  }
);

/**
 * Get all admins (requires admin_view permission)
 */
export const getAllAdmins = adminPermissions.withViewPermission(originalAdminService.getAllAdmins, {
  context: { operation: 'getAllAdmins' },
});

/**
 * Get admin by ID (requires admin_view permission)
 */
export const getAdminById = adminPermissions.withViewPermission(originalAdminService.getAdminById, {
  context: { operation: 'getAdminById' },
});

/**
 * Get admin with role details (requires admin_view permission)
 */
export const getAdminWithRole = adminPermissions.withViewPermission(
  originalAdminService.getAdminWithRole,
  {
    context: { operation: 'getAdminWithRole' },
  }
);

/**
 * Update admin data (requires admin_edit permission)
 */
export const updateAdmin = adminPermissions.withEditPermission(originalAdminService.updateAdmin, {
  context: { operation: 'updateAdmin' },
});

/**
 * Update admin with role validation (requires admin_edit permission)
 */
export const updateAdminWithRoleValidation = adminPermissions.withEditPermission(
  originalAdminService.updateAdminWithRoleValidation,
  {
    context: { operation: 'updateAdminWithRoleValidation' },
  }
);

/**
 * Delete admin (requires admin_delete permission)
 */
export const deleteAdmin = adminPermissions.withDeletePermission(originalAdminService.deleteAdmin, {
  context: { operation: 'deleteAdmin' },
});

/**
 * Get admins by role ID (requires admin_view permission)
 */
export const getAdminsByRole = adminPermissions.withViewPermission(
  originalAdminService.getAdminsByRole,
  {
    context: { operation: 'getAdminsByRole' },
  }
);

// ==================== UTILITY FUNCTIONS (NO PERMISSION REQUIRED) ====================

/**
 * Get available roles for admin assignment (utility function - no permission required)
 * Note: This function calls roleService internally which has its own permission checks
 */
export const getAvailableRoles = originalAdminService.getAvailableRoles;

/**
 * Get default role ID (utility function - no permission required)
 * Note: This function calls getAvailableRoles internally which has its own permission checks
 */
export const getDefaultRoleId = originalAdminService.getDefaultRoleId;
