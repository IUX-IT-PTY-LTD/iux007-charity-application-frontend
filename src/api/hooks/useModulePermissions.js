// src/api/hooks/useModulePermissions.js

/**
 * Fixed Module-Specific Permission Hooks
 * Added missing modules and updated combined hooks
 */

import { useModuleAccess } from './usePermission';

// ==================== EXISTING MODULE HOOKS ====================

export const useAdminPermissions = () => {
  return useModuleAccess('admin');
};

export const useRolePermissions = () => {
  return useModuleAccess('role');
};

export const useEventPermissions = () => {
  return useModuleAccess('event');
};

export const useFaqPermissions = () => {
  return useModuleAccess('faq');
};

export const useSliderPermissions = () => {
  return useModuleAccess('slider');
};

export const useMenuPermissions = () => {
  return useModuleAccess('menu');
};

export const useContactPermissions = () => {
  return useModuleAccess('contact');
};

export const useUserPermissions = () => {
  return useModuleAccess('user');
};

export const usePermissionManagement = () => {
  return useModuleAccess('permission');
};

export const useProfilePermissions = () => {
  return useModuleAccess('profile');
};

export const useSettingsPermissions = () => {
  return useModuleAccess('settings');
};

// ==================== COMBINED HOOKS ====================

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
  const profilePerms = useProfilePermissions();

  return {
    admins: adminPerms,
    roles: rolePerms,
    users: userPerms,
    profiles: profilePerms,
    hasAnyUserManagementAccess:
      adminPerms.hasAccess || rolePerms.hasAccess || userPerms.hasAccess || profilePerms.hasAccess,
  };
};

/**
 * Hook for system management permissions
 */
export const useSystemPermissions = () => {
  const permissionPerms = usePermissionManagement();
  const contactPerms = useContactPermissions();
  const settingsPerms = useSettingsPermissions();

  return {
    permissions: permissionPerms,
    contacts: contactPerms,
    settings: settingsPerms,
    hasAnySystemAccess:
      permissionPerms.hasAccess || contactPerms.hasAccess || settingsPerms.hasAccess,
  };
};
