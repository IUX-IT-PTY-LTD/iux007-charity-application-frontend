// src/api/hooks/useModulePermissions.js

/**
 * Module-Specific Permission Hooks
 * Convenience hooks for each module's permissions
 */

import { useModuleAccess } from './usePermission';

// ==================== ADMIN MODULE HOOKS ====================

export const useAdminPermissions = () => {
  return useModuleAccess('admin');
};

// ==================== ROLE MODULE HOOKS ====================

export const useRolePermissions = () => {
  return useModuleAccess('role');
};

// ==================== EVENT MODULE HOOKS ====================

export const useEventPermissions = () => {
  return useModuleAccess('event');
};

// ==================== FAQ MODULE HOOKS ====================

export const useFaqPermissions = () => {
  return useModuleAccess('faq');
};

// ==================== SLIDER MODULE HOOKS ====================

export const useSliderPermissions = () => {
  return useModuleAccess('slider');
};

// ==================== MENU MODULE HOOKS ====================

export const useMenuPermissions = () => {
  return useModuleAccess('menu');
};

// ==================== CONTACT MODULE HOOKS ====================

export const useContactPermissions = () => {
  return useModuleAccess('contact');
};

// ==================== USER MODULE HOOKS ====================

export const useUserPermissions = () => {
  return useModuleAccess('user');
};

// ==================== PERMISSION MODULE HOOKS ====================

export const usePermissionManagement = () => {
  return useModuleAccess('permission');
};

// ==================== COMBINED HOOKS FOR COMMON USE CASES ====================

/**
 * Hook for content management permissions (events, faqs, sliders, menus)
 */
export const useContentPermissions = () => {
  const eventPerms = useEventPermissions();
  const faqPerms = useFaqPermissions();
  const sliderPerms = useSliderPermissions();
  const menuPerms = useMenuPermissions();

  return {
    events: eventPerms,
    faqs: faqPerms,
    sliders: sliderPerms,
    menus: menuPerms,
    hasAnyContentAccess:
      eventPerms.hasAccess || faqPerms.hasAccess || sliderPerms.hasAccess || menuPerms.hasAccess,
  };
};

/**
 * Hook for admin/user management permissions
 */
export const useUserManagementPermissions = () => {
  const adminPerms = useAdminPermissions();
  const rolePerms = useRolePermissions();
  const userPerms = useUserPermissions();

  return {
    admins: adminPerms,
    roles: rolePerms,
    users: userPerms,
    hasAnyUserManagementAccess: adminPerms.hasAccess || rolePerms.hasAccess || userPerms.hasAccess,
  };
};

/**
 * Hook for system management permissions
 */
export const useSystemPermissions = () => {
  const permissionPerms = usePermissionManagement();
  const contactPerms = useContactPermissions();

  return {
    permissions: permissionPerms,
    contacts: contactPerms,
    hasAnySystemAccess: permissionPerms.hasAccess || contactPerms.hasAccess,
  };
};
