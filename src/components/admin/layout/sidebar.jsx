'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Menu as MenuIcon,
  Calendar,
  FileText,
  HelpCircle,
  Images,
  LogOut,
  Settings,
  User,
  Building,
  ChevronDown,
  ChevronRight,
  Contact,
  Shield,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { logout } from '@/api/services/admin/authService';

// Import permission hooks
import { PermissionProvider, usePermissionContext } from '@/api/contexts/PermissionContext';
import {
  useUserPermissions,
  useMenuPermissions,
  useEventPermissions,
  useFaqPermissions,
  useSliderPermissions,
  useContactPermissions,
  useAdminPermissions,
  useRolePermissions,
  usePermissionManagement,
} from '@/api/hooks/useModulePermissions';

// Navigation items with permission checks
const getNavigationItems = (permissions) => {
  const items = [];

  // Dashboard - always visible (no permission required)
  items.push({
    id: 'dashboard',
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    visible: true,
  });

  // Users module
  if (permissions.users.hasAccess) {
    items.push({
      id: 'users',
      name: 'Users',
      href: '/admin/users',
      icon: User,
      visible: true,
    });
  }

  // Menus module
  if (permissions.menus.hasAccess) {
    items.push({
      id: 'menus',
      name: 'Menus',
      href: '/admin/menus',
      icon: MenuIcon,
      visible: true,
    });
  }

  // Events module
  if (permissions.events.hasAccess) {
    items.push({
      id: 'events',
      name: 'Events',
      href: '/admin/events',
      icon: Calendar,
      visible: true,
    });
  }

  // FAQs module
  if (permissions.faqs.hasAccess) {
    items.push({
      id: 'faqs',
      name: 'FAQs',
      href: '/admin/faqs',
      icon: HelpCircle,
      visible: true,
    });
  }

  // Sliders module
  if (permissions.sliders.hasAccess) {
    items.push({
      id: 'sliders',
      name: 'Sliders',
      href: '/admin/sliders',
      icon: Images,
      visible: true,
    });
  }

  // Contact module
  if (permissions.contacts.hasAccess) {
    items.push({
      id: 'contact',
      name: 'Contact',
      href: '/admin/contact',
      icon: Contact,
      visible: true,
    });
  }

  // Settings - always visible (application level)
  items.push({
    id: 'settings',
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    visible: true,
  });

  // Organization submenu - only show if user has access to any org-related permissions
  const orgSubmenuItems = [];

  // Admin Management
  if (permissions.admins.hasAccess) {
    orgSubmenuItems.push({
      id: 'org-admins',
      name: 'Admin Management',
      href: '/admin/org/admin',
    });
  }

  // Role Management
  if (permissions.roles.hasAccess) {
    orgSubmenuItems.push({
      id: 'org-roles',
      name: 'Role Management',
      href: '/admin/org/roles',
    });
  }

  // Permission Management
  // if (permissions.permissions.hasAccess) {
  //   orgSubmenuItems.push({
  //     id: 'org-permissions',
  //     name: 'Permission Management',
  //     href: '/admin/org/permissions',
  //   });
  // }

  // Only show Organization menu if user has access to any org feature
  if (orgSubmenuItems.length > 0) {
    items.push({
      id: 'organization',
      name: 'Organization',
      icon: Building,
      submenu: orgSubmenuItems,
      visible: true,
    });
  }

  return items.filter((item) => item.visible);
};

// Component to get all permissions
const useAllModulePermissions = () => {
  const users = useUserPermissions();
  const menus = useMenuPermissions();
  const events = useEventPermissions();
  const faqs = useFaqPermissions();
  const sliders = useSliderPermissions();
  const contacts = useContactPermissions();
  const admins = useAdminPermissions();
  const roles = useRolePermissions();
  const permissions = usePermissionManagement();

  const isLoading =
    users.isLoading ||
    menus.isLoading ||
    events.isLoading ||
    faqs.isLoading ||
    sliders.isLoading ||
    contacts.isLoading ||
    admins.isLoading ||
    roles.isLoading ||
    permissions.isLoading;

  return {
    users,
    menus,
    events,
    faqs,
    sliders,
    contacts,
    admins,
    roles,
    permissions,
    isLoading,
  };
};

// Main sidebar component with permission logic
function AdminSidebarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [expandedMenus, setExpandedMenus] = React.useState(new Set());
  const { adminProfile, isLoadingProfile, clearProfile } = useAdminContext();

  // Get all module permissions
  const modulePermissions = useAllModulePermissions();

  // Get permission context for overall loading state
  const { isLoading: permissionContextLoading, isInitialized } = usePermissionContext();

  // Generate navigation items based on permissions
  const navigationItems = React.useMemo(() => {
    if (modulePermissions.isLoading || !isInitialized) {
      return []; // Return empty array while loading
    }
    return getNavigationItems(modulePermissions);
  }, [modulePermissions, isInitialized]);

  // Check if a path is active
  const isActive = (href) => {
    if (href === '/admin/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Check if any submenu item is active
  const isSubmenuActive = (submenu) => {
    return submenu.some((item) => isActive(item.href));
  };

  // Toggle submenu expansion
  const toggleSubmenu = (itemId) => {
    setExpandedMenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Auto-expand menus that have active items
  React.useEffect(() => {
    navigationItems.forEach((item) => {
      if (item.submenu && isSubmenuActive(item.submenu)) {
        setExpandedMenus((prev) => new Set(prev).add(item.id));
      }
    });
  }, [pathname, navigationItems]);

  // Handle logout
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Clear the admin profile from context immediately
      clearProfile();

      // Use the authService logout function
      const response = await logout();

      // Show success message
      toast.success(response.message || 'Logged out successfully');

      // Redirect to login page
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout');

      // Redirect to login page even if logout fails
      router.push('/admin/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Get admin initials for avatar fallback
  const getInitials = () => {
    if (!adminProfile || !adminProfile.name) return 'SA';

    const nameParts = adminProfile.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase();

    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  };

  const renderNavigationItem = (item) => {
    // If item has submenu, render collapsible menu
    if (item.submenu) {
      const isExpanded = expandedMenus.has(item.id);
      const hasActiveSubmenu = isSubmenuActive(item.submenu);

      return (
        <div key={item.id}>
          <button
            onClick={() => toggleSubmenu(item.id)}
            className={cn(
              'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
              hasActiveSubmenu && 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
            )}
          >
            <div className="flex items-center">
              {item.icon && <item.icon className="h-5 w-5 flex-shrink-0 mr-3" />}
              <span>{item.name}</span>
            </div>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

          {isExpanded && (
            <div className="ml-6 mt-1 space-y-1">
              {item.submenu.map((subItem) => (
                <Link
                  key={subItem.id}
                  href={subItem.href}
                  className={cn(
                    'block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
                    isActive(subItem.href) &&
                      'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  )}
                >
                  {subItem.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Regular menu item with href
    return (
      <Link
        key={item.id}
        href={item.href}
        className={cn(
          'flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
          isActive(item.href) && 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
        )}
      >
        {item.icon && <item.icon className="h-5 w-5 flex-shrink-0 mr-3" />}
        <span>{item.name}</span>
      </Link>
    );
  };

  // Show loading state while permissions are being loaded
  if (modulePermissions.isLoading || permissionContextLoading || !isInitialized) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-gray-800">
        {/* Sidebar Header */}
        <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center flex-1 gap-3">
            <Avatar className="h-8 w-8 border border-gray-200 dark:border-gray-700">
              <AvatarImage src="/assets/img/avatar.jpg" alt="Admin" />
              <AvatarFallback className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                {isLoadingProfile ? 'SA' : getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-sm">
              <span className="font-medium text-gray-900 dark:text-white">
                {isLoadingProfile ? 'Loading...' : adminProfile?.name || 'Super Admin'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {isLoadingProfile ? '' : adminProfile?.email || 'Administrator'}
              </span>
            </div>
          </div>
        </div>

        {/* Loading Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-2">
            {/* Show skeleton for menu items */}
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center px-3 py-2">
                  <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded mr-3"></div>
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 mt-auto border-t border-gray-200 dark:border-gray-700">
          <div className="flex w-full items-center px-3 py-2">
            <LogOut className="h-5 w-5 flex-shrink-0 mr-3 text-gray-400" />
            <span className="text-sm text-gray-400">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Sidebar Header */}
      <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center flex-1 gap-3">
          <Avatar className="h-8 w-8 border border-gray-200 dark:border-gray-700">
            <AvatarImage src="/assets/img/avatar.jpg" alt="Admin" />
            <AvatarFallback className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
              {isLoadingProfile ? 'SA' : getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-sm">
            <span className="font-medium text-gray-900 dark:text-white">
              {isLoadingProfile ? 'Loading...' : adminProfile?.name || 'Super Admin'}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {isLoadingProfile ? '' : adminProfile?.email || 'Administrator'}
            </span>
          </div>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          {navigationItems.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No modules available</p>
            </div>
          ) : (
            navigationItems.map(renderNavigationItem)
          )}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 mt-auto border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={cn(
            'flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20',
            isLoggingOut && 'opacity-70 cursor-not-allowed'
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0 mr-3" />
          <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
        </button>
      </div>
    </div>
  );
}

// Wrapper component that provides permission context
export function AdminSidebar() {
  return (
    <PermissionProvider>
      <AdminSidebarContent />
    </PermissionProvider>
  );
}
