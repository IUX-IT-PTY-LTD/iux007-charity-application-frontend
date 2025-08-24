// src/api/config/permissions.js

/**
 * Fixed Permission Configuration
 * Defines modules and their required permissions
 */

// ==================== MODULE CONFIGURATIONS ====================

export const MODULE_PERMISSIONS = {
  // Core admin modules
  admin: ['create', 'view', 'edit', 'delete'],
  role: ['create', 'view', 'edit', 'delete'],
  permission: ['create', 'view', 'edit', 'delete'],

  // Content management modules
  event: ['create', 'view', 'edit', 'delete'],
  faq: ['create', 'view', 'edit', 'delete'],
  slider: ['create', 'view', 'edit', 'delete'],
  menu: ['create', 'view', 'edit', 'delete'],
  contact: ['create', 'view', 'edit', 'delete'],

  // User management
  user: ['view', 'details'],
  profile: ['view', 'edit'],
  settings: ['create', 'view', 'edit', 'delete'],
};

/**
 * Get all required permissions for the application
 * @returns {Array<string>} Array of all permission names needed
 */
export const getAllRequiredPermissions = () => {
  const permissions = [];

  Object.entries(MODULE_PERMISSIONS).forEach(([module, actions]) => {
    actions.forEach((action) => {
      permissions.push(`${module}_${action}`);
    });
  });

  return permissions.sort();
};

/**
 * Get permissions for a specific module
 * @param {string} module - Module name
 * @returns {Array<string>} Array of permission names for the module
 */
export const getModulePermissions = (module) => {
  const actions = MODULE_PERMISSIONS[module] || [];
  return actions.map((action) => `${module}_${action}`);
};
