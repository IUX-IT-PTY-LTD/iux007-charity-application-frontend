// src/api/services/admin/protected/menuService.js

/**
 * Protected Menu Service
 * Menu service with automatic permission checking
 */

import { menuPermissions } from '@/api/middleware/permissionMiddleware';
import { menuService } from '@/api/services/admin/menuService';

// ==================== PROTECTED MENU OPERATIONS ====================

/**
 * Get all menus (requires menu_view permission)
 */
export const getMenus = menuPermissions.withViewPermission(menuService.getMenus.bind(menuService), {
  context: { operation: 'getMenus' },
});

/**
 * Get menu details by ID (requires menu_view permission)
 */
export const getMenuDetails = menuPermissions.withViewPermission(
  menuService.getMenuDetails.bind(menuService),
  {
    context: { operation: 'getMenuDetails' },
  }
);

/**
 * Create a new menu (requires menu_create permission)
 */
export const createMenu = menuPermissions.withCreatePermission(
  menuService.createMenu.bind(menuService),
  {
    context: { operation: 'createMenu' },
  }
);

/**
 * Update an existing menu (requires menu_edit permission)
 */
export const updateMenu = menuPermissions.withEditPermission(
  menuService.updateMenu.bind(menuService),
  {
    context: { operation: 'updateMenu' },
  }
);

/**
 * Delete a menu (requires menu_delete permission)
 */
export const deleteMenu = menuPermissions.withDeletePermission(
  menuService.deleteMenu.bind(menuService),
  {
    context: { operation: 'deleteMenu' },
  }
);

/**
 * Get menus for page builder (requires menu_view permission)
 */
export const getPageBuilderMenus = menuPermissions.withViewPermission(
  menuService.getPageBuilderMenus.bind(menuService),
  {
    context: { operation: 'getPageBuilderMenus' },
  }
);

// ==================== DIRECT EXPORT OF MENU SERVICE INSTANCE ====================

/**
 * Export the menu service instance for utility access
 * Note: Direct usage bypasses permission checks - use protected methods above
 */
export { menuService };
