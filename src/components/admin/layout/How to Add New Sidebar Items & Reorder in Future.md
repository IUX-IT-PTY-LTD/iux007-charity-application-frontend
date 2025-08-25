# Sidebar Menu Management Guide

## Overview

This guide explains how to add new menu items and reorder existing ones in the admin sidebar. The sidebar uses a permission-based system with an order property for easy management.

---

## 1. Adding a New Menu Item

### Step 1: Import the New Permission Hook (if needed)

**File:** `src/components/admin/layout/sidebar.jsx`

```javascript
import {
  // ... existing imports
  useUserPermissions,
  useMenuPermissions,
  useEventPermissions,
  useFaqPermissions,
  useSliderPermissions,
  useProfilePermissions,
  useAdminPermissions,
  useRolePermissions,
  usePermissionManagement,
  useBlogPermissions, // ADD: New hook for blog module
} from '@/api/hooks/useModulePermissions';
```

### Step 2: Add to `useAllModulePermissions()` Function

```javascript
const useAllModulePermissions = () => {
  const users = useUserPermissions();
  const menus = useMenuPermissions();
  const events = useEventPermissions();
  const faqs = useFaqPermissions();
  const sliders = useSliderPermissions();
  const profiles = useProfilePermissions();
  const admins = useAdminPermissions();
  const roles = useRolePermissions();
  const permissions = usePermissionManagement();
  const blogs = useBlogPermissions(); // ADD: New permission

  const isLoading =
    users.isLoading ||
    menus.isLoading ||
    events.isLoading ||
    faqs.isLoading ||
    sliders.isLoading ||
    profiles.isLoading ||
    admins.isLoading ||
    roles.isLoading ||
    permissions.isLoading ||
    blogs.isLoading; // ADD: Include in loading check

  return {
    users,
    menus,
    events,
    faqs,
    sliders,
    profiles,
    admins,
    roles,
    permissions,
    blogs, // ADD: Return new permission
    isLoading,
  };
};
```

### Step 3: Add Menu Item to `getNavigationItems()` Function

```javascript
const getNavigationItems = (permissions) => {
  const items = [];

  // Dashboard - always visible (no permission required)
  items.push({
    id: 'dashboard',
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    visible: true,
    order: 1,
  });

  // ... existing items ...

  // ADD: New blog menu item
  if (permissions.blogs.hasAccess) {
    items.push({
      id: 'blogs',
      name: 'Blog Posts',
      href: '/admin/blogs',
      icon: FileText, // Choose appropriate icon from lucide-react
      visible: true,
      order: 4.5, // Position between Events (4) and Menus (5)
    });
  }

  // ... rest of existing items ...

  return items.filter((item) => item.visible).sort((a, b) => a.order - b.order);
};
```

### Step 4: Add to `useMemo` Dependencies

```javascript
const navigationItems = React.useMemo(() => {
  if (modulePermissions.isLoading || !isInitialized) {
    return [];
  }
  return getNavigationItems(modulePermissions);
}, [
  modulePermissions.isLoading,
  isInitialized,
  modulePermissions.users.hasAccess,
  modulePermissions.menus.hasAccess,
  modulePermissions.events.hasAccess,
  modulePermissions.faqs.hasAccess,
  modulePermissions.sliders.hasAccess,
  modulePermissions.profiles.hasAccess,
  modulePermissions.admins.hasAccess,
  modulePermissions.roles.hasAccess,
  modulePermissions.permissions.hasAccess,
  modulePermissions.blogs.hasAccess, // ADD: New dependency
]);
```

---

## 2. Reordering Menu Items

Simply change the `order` values in `getNavigationItems()`:

```javascript
const getNavigationItems = (permissions) => {
  const items = [];

  // Dashboard - always first
  items.push({
    id: 'dashboard',
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    visible: true,
    order: 1, // Always keep as 1
  });

  // CHANGE THESE ORDER VALUES TO REORDER:

  // Move Events to position 2 (was 4)
  if (permissions.events.hasAccess) {
    items.push({
      id: 'events',
      name: 'Events',
      href: '/admin/events',
      icon: Calendar,
      visible: true,
      order: 2, // CHANGED: Moved up from 4
    });
  }

  // Move Profile to position 3 (was 2)
  if (permissions.profiles.hasAccess) {
    items.push({
      id: 'profile',
      name: 'Profile',
      href: '/admin/profile',
      icon: UserCircle,
      visible: true,
      order: 3, // CHANGED: Moved down from 2
    });
  }

  // Move Users to position 4 (was 3)
  if (permissions.users.hasAccess) {
    items.push({
      id: 'users',
      name: 'Users',
      href: '/admin/users',
      icon: User,
      visible: true,
      order: 4, // CHANGED: Moved down from 3
    });
  }

  // ... continue with other items
};
```

**Result:** The sidebar will now show: Dashboard → Events → Profile → Users

---

## 3. Adding Submenu Items

### Adding to Existing Submenu (Organization)

```javascript
// Inside getNavigationItems() function, in the Organization section:

const orgSubmenuItems = [];

// Existing items...
if (permissions.admins.hasAccess) {
  orgSubmenuItems.push({
    id: 'org-admins',
    name: 'Admin Management',
    href: '/admin/org/admin',
    order: 1,
  });
}

// ADD: New submenu item
if (permissions.departments.hasAccess) {
  orgSubmenuItems.push({
    id: 'org-departments',
    name: 'Departments',
    href: '/admin/org/departments',
    order: 4, // Position in submenu
  });
}

// Sort submenu items by order
orgSubmenuItems.sort((a, b) => a.order - b.order);
```

### Creating New Submenu Group

```javascript
// ADD: New Content Management submenu
const contentSubmenuItems = [];

if (permissions.blogs.hasAccess) {
  contentSubmenuItems.push({
    id: 'content-blogs',
    name: 'Blog Posts',
    href: '/admin/content/blogs',
    order: 1,
  });
}

if (permissions.pages.hasAccess) {
  contentSubmenuItems.push({
    id: 'content-pages',
    name: 'Pages',
    href: '/admin/content/pages',
    order: 2,
  });
}

if (permissions.media.hasAccess) {
  contentSubmenuItems.push({
    id: 'content-media',
    name: 'Media Library',
    href: '/admin/content/media',
    order: 3,
  });
}

// Sort and add to main menu if items exist
contentSubmenuItems.sort((a, b) => a.order - b.order);

if (contentSubmenuItems.length > 0) {
  items.push({
    id: 'content',
    name: 'Content Management',
    icon: FileText,
    submenu: contentSubmenuItems,
    visible: true,
    order: 5, // Position in main menu
  });
}
```

---

## 4. Menu Item Configuration Options

### Basic Menu Item Structure

```javascript
{
  id: 'unique-id',              // Unique identifier
  name: 'Display Name',         // Text shown in sidebar
  href: '/admin/path',          // Navigation path
  icon: IconComponent,          // Lucide React icon
  visible: true,                // Show/hide item
  order: 5,                     // Sort order (lower = higher)
}
```

### Submenu Item Structure

```javascript
{
  id: 'parent-menu',
  name: 'Parent Menu',
  icon: IconComponent,
  submenu: [                    // Array of submenu items
    {
      id: 'sub-item-1',
      name: 'Sub Item 1',
      href: '/admin/sub/path1',
      order: 1,
    },
    // ... more submenu items
  ],
  visible: true,
  order: 5,
}
```

---

## 5. Permission-Based Visibility

### With Permission Check

```javascript
if (permissions.moduleName.hasAccess) {
  items.push({
    id: 'module',
    name: 'Module Name',
    href: '/admin/module',
    icon: Icon,
    visible: true,
    order: 5,
  });
}
```

### Always Visible (No Permission Required)

```javascript
items.push({
  id: 'reports',
  name: 'Reports',
  href: '/admin/reports',
  icon: BarChart,
  visible: true, // Always show
  order: 10,
});
```

### Conditional Visibility (Custom Logic)

```javascript
// Show only for super admin
if (adminProfile?.role === 'super_admin') {
  items.push({
    id: 'debug',
    name: 'Debug Tools',
    href: '/admin/debug',
    icon: Bug,
    visible: true,
    order: 999,
  });
}

// Show based on feature flag
if (featureFlags.enableAnalytics) {
  items.push({
    id: 'analytics',
    name: 'Analytics',
    href: '/admin/analytics',
    icon: TrendingUp,
    visible: true,
    order: 8,
  });
}
```

---

## 6. Available Icons (from lucide-react)

### Common Admin Icons

```javascript
import {
  // Navigation & Layout
  LayoutDashboard, // Dashboard
  Menu, // Menu/Navigation
  Home, // Home

  // User Management
  User, // Single user
  Users, // Multiple users
  UserCircle, // Profile
  UserPlus, // Add user

  // Content
  FileText, // Documents/Articles
  File, // Files
  Folder, // Folders
  Image, // Single image
  Images, // Multiple images

  // Communication
  Mail, // Email
  MessageSquare, // Messages/Chat
  Phone, // Phone

  // Events & Calendar
  Calendar, // Calendar/Events
  Clock, // Time

  // Help & Support
  HelpCircle, // FAQ/Help
  Info, // Information

  // Settings & Config
  Settings, // Settings
  Cog, // Configuration
  Sliders, // Controls

  // Business
  Building, // Organization
  Building2, // Company
  Briefcase, // Business

  // Security
  Shield, // Security/Permissions
  Lock, // Locked/Private
  Key, // Authentication

  // Analytics
  BarChart, // Charts
  TrendingUp, // Growth
  PieChart, // Statistics

  // E-commerce
  ShoppingCart, // Cart
  Package, // Products
  CreditCard, // Payments

  // Media
  Video, // Videos
  Music, // Audio
  Camera, // Photos

  // Development
  Code, // Code
  Database, // Database
  Server, // Server
  Bug, // Debug/Issues
} from 'lucide-react';
```

---

## 7. Common Patterns

### Content Management Group

```javascript
// Group related content features
if (permissions.blogs.hasAccess || permissions.pages.hasAccess || permissions.media.hasAccess) {
  const contentItems = [];

  if (permissions.blogs.hasAccess) contentItems.push({...});
  if (permissions.pages.hasAccess) contentItems.push({...});
  if (permissions.media.hasAccess) contentItems.push({...});

  items.push({
    id: 'content',
    name: 'Content',
    icon: FileText,
    submenu: contentItems,
    visible: true,
    order: 5,
  });
}
```

### Admin Tools Group

```javascript
// Group administrative functions
const adminItems = [];
if (permissions.admins.hasAccess) adminItems.push({...});
if (permissions.roles.hasAccess) adminItems.push({...});
if (permissions.permissions.hasAccess) adminItems.push({...});
if (permissions.logs.hasAccess) adminItems.push({...});

if (adminItems.length > 0) {
  items.push({
    id: 'administration',
    name: 'Administration',
    icon: Shield,
    submenu: adminItems,
    visible: true,
    order: 9,
  });
}
```

### Quick Order Reference

```
1   - Dashboard (always first)
2   - Profile (user-specific)
3-4 - Core features (Users, Events, etc.)
5-7 - Content management (Menus, FAQs, Sliders)
8   - Settings (application settings)
9   - Organization/Admin (system management)
999 - Debug/Development tools (always last)
```

---

## 8. Testing Your Changes

### 1. Check Console for Errors

After making changes, check the browser console for any import or permission errors.

### 2. Test Permission Visibility

- Create a test role with limited permissions
- Assign it to a test user
- Verify menu items appear/hide correctly

### 3. Test Navigation

- Click each menu item to ensure routes work
- Check submenu expansion/collapse
- Verify active states highlight correctly

### 4. Test Ordering

- Menu items should appear in the order specified
- Submenu items should be properly ordered
- No gaps or overlaps in navigation

---

_This system makes it easy to manage sidebar navigation without complex configurations. Just update the order numbers to rearrange items, and add permission checks for new features!_
