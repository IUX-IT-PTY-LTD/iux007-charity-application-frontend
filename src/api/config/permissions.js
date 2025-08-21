/**
 * Simple Permission Configuration
 * Defines modules and their required permissions
 */

// ==================== MODULE CONFIGURATIONS ====================

/**
 * Define modules and their required permissions
 * Each module specifies the actions it needs
 */
export const MODULE_PERMISSIONS = {
  admin: ['create', 'view', 'edit', 'delete'],
  role: ['create', 'view', 'edit', 'delete'],
  permission: ['create', 'view', 'edit', 'delete'],
  event: ['create', 'view', 'edit', 'delete'],
  faq: ['create', 'view', 'edit', 'delete'],
  slider: ['create', 'view', 'edit', 'delete'],
  menu: ['create', 'view', 'edit', 'delete'],
  contact: ['view', 'edit'],
  user: ['view', 'details'],
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
