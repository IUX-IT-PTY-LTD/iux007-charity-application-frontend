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
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { logout } from '@/api/services/admin/authService';

// Menu data structure for easy modification
const navigationItems = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'users',
    name: 'Users',
    href: '/admin/users',
    icon: User,
  },
  {
    id: 'menus',
    name: 'Menus',
    href: '/admin/menus',
    icon: MenuIcon,
  },
  {
    id: 'events',
    name: 'Events',
    href: '/admin/events',
    icon: Calendar,
  },
  // {
  //   id: "pages",
  //   name: "Pages",
  //   href: "/admin/pages",
  //   icon: FileText,
  // },
  // {
  //   id: 'blogs',
  //   name: 'Blog Posts',
  //   href: '/admin/blogs',
  //   icon: FileText,
  // },
  {
    id: 'faqs',
    name: 'FAQs',
    href: '/admin/faqs',
    icon: HelpCircle,
  },
  {
    id: 'sliders',
    name: 'Sliders',
    href: '/admin/sliders',
    icon: Images,
  },
  {
    id: 'settings',
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const { adminProfile, isLoadingProfile } = useAdminContext();

  // Check if a path is active
  const isActive = (href) => {
    if (href === '/admin/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

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
          {navigationItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
                isActive(item.href) &&
                  'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
              )}
            >
              {item.icon && <item.icon className="h-5 w-5 flex-shrink-0 mr-3" />}
              <span>{item.name}</span>
            </Link>
          ))}
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
