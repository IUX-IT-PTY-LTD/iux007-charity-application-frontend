# Permission System Integration Guide

## Overview

This guide explains how to integrate the role-based permission system when adding or modifying services in the application. Follow these steps to ensure proper permission checking is implemented.

## Table of Contents

1. [Adding a New Service](#adding-a-new-service)
2. [Modifying an Existing Service](#modifying-an-existing-service)
3. [File Structure](#file-structure)
4. [Step-by-Step Implementation](#step-by-step-implementation)
5. [Testing and Validation](#testing-and-validation)
6. [Troubleshooting](#troubleshooting)

---

## File Structure

```
src/api/
├── config/
│   └── permissions.js                     # Permission configuration
├── hooks/
│   ├── useModulePermissions.js           # Module-specific hooks
│   └── usePermission.js                  # Base permission hooks
├── middleware/
│   └── permissionMiddleware.js           # Permission wrappers
├── scripts/
│   ├── permission-generator.js           # Auto-generate permissions
│   └── permission-audit.js               # Audit permissions
├── services/admin/
│   ├── newService.js                     # Raw service (no protection)
│   └── protected/
│       └── newService.js                 # Protected service wrapper
└── utils/
    ├── permissionWrapper.js              # Permission utilities
    └── permissionErrors.js               # Error handling
```

---

## Adding a New Service

### Step 1: Create the Raw Service

**File:** `src/api/services/admin/blogService.js`

```javascript
// src/api/services/admin/blogService.js
import { apiService } from './apiService';
import { getAuthToken } from './authService';

const version = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

/**
 * Blog Service - Raw operations without permission checking
 */

// CREATE operation
export const createBlog = async (blogData) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    return await apiService.post(`/admin/${version}/blogs/create`, blogData);
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};

// READ operations
export const getAllBlogs = async (params = {}) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/admin/${version}/blogs${queryString ? `?${queryString}` : ''}`;

    return await apiService.get(endpoint);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};

export const getBlogById = async (blogId) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    return await apiService.get(`/admin/${version}/blogs/edit/${blogId}`);
  } catch (error) {
    console.error(`Error fetching blog ${blogId}:`, error);
    throw error;
  }
};

// UPDATE operation
export const updateBlog = async (blogId, blogData) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    return await apiService.put(`/admin/${version}/blogs/update/${blogId}`, blogData);
  } catch (error) {
    console.error(`Error updating blog ${blogId}:`, error);
    throw error;
  }
};

// DELETE operation
export const deleteBlog = async (blogId) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    return await apiService.delete(`/admin/${version}/blogs/delete/${blogId}`);
  } catch (error) {
    console.error(`Error deleting blog ${blogId}:`, error);
    throw error;
  }
};

// UTILITY functions (no permission needed)
export const validateBlogData = (blogData) => {
  const errors = [];

  if (!blogData.title) errors.push('Title is required');
  if (!blogData.content) errors.push('Content is required');

  return {
    isValid: errors.length === 0,
    errors,
  };
};
```

### Step 2: Update Permission Configuration

**File:** `src/api/config/permissions.js`

```javascript
// src/api/config/permissions.js
export const MODULE_PERMISSIONS = {
  // ... existing modules

  // ADD: New blog module
  blog: ['create', 'view', 'edit', 'delete'],
};
```

### Step 3: Generate Permissions

**Ask super admin to visit `/admin/pms` and use the UI:**

1. Navigate to `/admin/pms` (Permission Management System)
2. Click **"Generate All Permissions"** button to create all missing permissions
3. Or use **"Generate Module Permissions"** and specify `blog` module
4. Verify generation with **"Audit Permissions"** button

**Alternative - Run in browser console:**

```javascript
// Generate permissions for the new module
await generateModulePermissions('blog');

// Or generate all permissions
await generateAllPermissions();
```

### Step 4: Create Module Hook

**File:** `src/api/hooks/useModulePermissions.js`

```javascript
// src/api/hooks/useModulePermissions.js

// ADD: New blog permissions hook
export const useBlogPermissions = () => {
  return useModuleAccess('blog');
};

// UPDATE: Add to combined hooks if relevant
export const useContentPermissions = () => {
  const eventPerms = useEventPermissions();
  const faqPerms = useFaqPermissions();
  const sliderPerms = useSliderPermissions();
  const menuPerms = useMenuPermissions();
  const blogPerms = useBlogPermissions(); // ADD

  return {
    events: eventPerms,
    faqs: faqPerms,
    sliders: sliderPerms,
    menus: menuPerms,
    blogs: blogPerms, // ADD
    hasAnyContentAccess:
      eventPerms.hasAccess ||
      faqPerms.hasAccess ||
      sliderPerms.hasAccess ||
      menuPerms.hasAccess ||
      blogPerms.hasAccess, // ADD
  };
};
```

### Step 5: Update Permission Middleware

**File:** `src/api/middleware/permissionMiddleware.js`

```javascript
// src/api/middleware/permissionMiddleware.js

// ADD: Blog module wrapper
export const blogPermissions = createCRUDPermissionWrappers('blog');
```

### Step 6: Create Protected Service

**File:** `src/api/services/admin/protected/blogService.js`

```javascript
// src/api/services/admin/protected/blogService.js

/**
 * Protected Blog Service
 * Blog service with automatic permission checking
 */

import { blogPermissions } from '@/api/middleware/permissionMiddleware';
import * as originalBlogService from '@/api/services/admin/blogService';

// ==================== PROTECTED BLOG OPERATIONS ====================

/**
 * Create a new blog (requires blog_create permission)
 */
export const createBlog = blogPermissions.withCreatePermission(originalBlogService.createBlog, {
  context: { operation: 'createBlog' },
});

/**
 * Get all blogs (requires blog_view permission)
 */
export const getAllBlogs = blogPermissions.withViewPermission(originalBlogService.getAllBlogs, {
  context: { operation: 'getAllBlogs' },
});

/**
 * Get blog by ID (requires blog_view permission)
 */
export const getBlogById = blogPermissions.withViewPermission(originalBlogService.getBlogById, {
  context: { operation: 'getBlogById' },
});

/**
 * Update blog (requires blog_edit permission)
 */
export const updateBlog = blogPermissions.withEditPermission(originalBlogService.updateBlog, {
  context: { operation: 'updateBlog' },
});

/**
 * Delete blog (requires blog_delete permission)
 */
export const deleteBlog = blogPermissions.withDeletePermission(originalBlogService.deleteBlog, {
  context: { operation: 'deleteBlog' },
});

// ==================== UTILITY FUNCTIONS (NO PERMISSION REQUIRED) ====================

/**
 * Validate blog data (utility function - no permission required)
 */
export const validateBlogData = originalBlogService.validateBlogData;
```

### Step 7: Verify and Test

**Ask super admin to verify using `/admin/pms` UI:**

1. Navigate to `/admin/pms`
2. Click **"Audit Permissions"** button
3. Review the audit report to ensure all `blog_*` permissions are created
4. Check for any missing or extra permissions

**Alternative - Run audit script in console:**

```javascript
// Verify all permissions are created and synced
await auditPermissions();
```

---

## Modifying an Existing Service

### Scenario 1: Adding New Actions to Existing Service

**Example:** Adding `publish` and `archive` actions to `blog` service

#### Step 1: Update Permission Configuration

**File:** `src/api/config/permissions.js`

```javascript
export const MODULE_PERMISSIONS = {
  // Update existing module
  blog: ['create', 'view', 'edit', 'delete', 'publish', 'archive'], // ADD new actions
};
```

#### Step 2: Add New Service Methods

**File:** `src/api/services/admin/blogService.js`

```javascript
// ADD: New operations to existing service
export const publishBlog = async (blogId) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    return await apiService.patch(`/admin/${version}/blogs/${blogId}/publish`);
  } catch (error) {
    console.error(`Error publishing blog ${blogId}:`, error);
    throw error;
  }
};

export const archiveBlog = async (blogId) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    return await apiService.patch(`/admin/${version}/blogs/${blogId}/archive`);
  } catch (error) {
    console.error(`Error archiving blog ${blogId}:`, error);
    throw error;
  }
};
```

#### Step 3: Generate New Permissions

**Ask super admin to use `/admin/pms` UI:**

1. Navigate to `/admin/pms`
2. Click **"Generate Module Permissions"**
3. Enter `blog` in the module field
4. Click **"Generate"** to create new permissions
5. Use **"Audit Permissions"** to verify

**Alternative:**

```javascript
// Generate permissions for updated module
await generateModulePermissions('blog');
```

#### Step 4: Add Protected Methods

**File:** `src/api/services/admin/protected/blogService.js`

```javascript
// ADD: New protected methods
import { withPermissionCheck } from '@/api/middleware/permissionMiddleware';

/**
 * Publish blog (requires blog_publish permission)
 */
export const publishBlog = withPermissionCheck('blog_publish', originalBlogService.publishBlog, {
  context: { operation: 'publishBlog' },
});

/**
 * Archive blog (requires blog_archive permission)
 */
export const archiveBlog = withPermissionCheck('blog_archive', originalBlogService.archiveBlog, {
  context: { operation: 'archiveBlog' },
});
```

### Scenario 2: Changing Permission Requirements

**Example:** Making `blog_view` require `blog_read` instead

#### Step 1: Update Permission Configuration

**File:** `src/api/config/permissions.js`

```javascript
export const MODULE_PERMISSIONS = {
  blog: ['create', 'read', 'edit', 'delete'], // CHANGED: view → read
};
```

#### Step 2: Update Protected Service

**File:** `src/api/services/admin/protected/blogService.js`

```javascript
// UPDATE: Change permission names
export const getAllBlogs = blogPermissions.withPermissionCheck(
  'blog_read', // CHANGED: from blog_view
  originalBlogService.getAllBlogs,
  {
    context: { operation: 'getAllBlogs' },
  }
);

export const getBlogById = blogPermissions.withPermissionCheck(
  'blog_read', // CHANGED: from blog_view
  originalBlogService.getBlogById,
  {
    context: { operation: 'getBlogById' },
  }
);
```

#### Step 3: Generate Updated Permissions

**Ask super admin to use `/admin/pms` UI:**

1. Navigate to `/admin/pms`
2. Click **"Generate All Permissions"** to create `blog_read`
3. Click **"Audit Permissions"** to check for deprecated `blog_view`
4. If needed, manually clean up old permissions from database

**Alternative:**

```javascript
// This will create blog_read and mark blog_view as potentially deprecated
await generateModulePermissions('blog');
await auditPermissions(); // Check for deprecated permissions
```

---

## Advanced Use Cases

### Custom Permission Logic

**File:** `src/api/services/admin/protected/blogService.js`

```javascript
import {
  withPermissionCheck,
  withConditionalPermission,
} from '@/api/middleware/permissionMiddleware';

/**
 * Update blog with ownership check
 * Users can edit their own blogs with blog_edit_own, or any blog with blog_edit
 */
export const updateBlogWithOwnership = withConditionalPermission(
  // Condition function
  async (blogId, blogData, currentUserId) => {
    const blog = await originalBlogService.getBlogById(blogId);
    return blog.data.author_id !== currentUserId; // Requires permission if not owner
  },
  'blog_edit', // Required permission
  async (blogId, blogData) => {
    // Check for ownership-based permission as fallback
    try {
      return await originalBlogService.updateBlog(blogId, blogData);
    } catch (error) {
      // Try with ownership permission
      return await withPermissionCheck('blog_edit_own', originalBlogService.updateBlog)(
        blogId,
        blogData
      );
    }
  }
);
```

### Multiple Permission Requirements

**File:** `src/api/services/admin/protected/blogService.js`

```javascript
import { useAllPermissions } from '@/api/hooks/usePermission';

/**
 * Bulk operations requiring multiple permissions
 */
export const bulkPublishBlogs = withPermissionCheck(
  ['blog_edit', 'blog_publish'], // Multiple permissions required
  originalBlogService.bulkPublishBlogs,
  {
    context: { operation: 'bulkPublishBlogs' },
  }
);
```

---

## Testing and Validation

### 1. Permission Generation Test

**Using `/admin/pms` UI (Recommended):**

1. Navigate to `/admin/pms`
2. Click **"Generate Module Permissions"**, enter `blog`
3. Click **"Audit Permissions"** to verify creation
4. Review the audit report for any issues

**Alternative - Browser console:**

```javascript
// Test in browser console
console.log('Testing permission generation...');

// Generate permissions
await generateModulePermissions('blog');

// Verify creation
const audit = await auditPermissions();
console.log('Audit result:', audit);

// Check specific permissions
const allPerms = await getAllPermissions();
const blogPerms = allPerms.data.filter((p) => p.name.startsWith('blog_'));
console.log('Blog permissions:', blogPerms);
```

### 2. Permission Checking Test

```javascript
// Test permission checking
import { hasPermission } from '@/api/utils/permissionWrapper';

// Test individual permissions
const canCreateBlog = await hasPermission('blog_create');
const canViewBlog = await hasPermission('blog_view');
console.log('Can create blog:', canCreateBlog);
console.log('Can view blog:', canViewBlog);
```

### 3. Hook Testing

```javascript
// Test in React component
import { useBlogPermissions } from '@/api/hooks/useModulePermissions';

function BlogManagement() {
  const blogPerms = useBlogPermissions();

  console.log('Blog permissions:', {
    hasAccess: blogPerms.hasAccess,
    canCreate: blogPerms.canCreate,
    canView: blogPerms.canView,
    canEdit: blogPerms.canEdit,
    canDelete: blogPerms.canDelete,
  });

  return (
    <div>
      {blogPerms.canCreate && <CreateBlogButton />}
      {blogPerms.canView && <BlogList />}
    </div>
  );
}
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Permission Not Found Error

**Error:** `Access denied: Missing required permission: blog_create`

**Solution:**

1. **Using `/admin/pms` UI (Recommended):**

   - Ask super admin to navigate to `/admin/pms`
   - Click **"Audit Permissions"** to see missing permissions
   - Click **"Generate All Permissions"** to create missing ones

2. **Alternative - Browser console:**

```javascript
// Check if permission exists in database
const allPerms = await getAllPermissions();
const blogCreatePerm = allPerms.data.find((p) => p.name === 'blog_create');

if (!blogCreatePerm) {
  // Generate missing permission
  await generateModulePermissions('blog');
}
```

#### 2. User Has No Permissions

**Error:** `No permissions found for user role`

**Solution:**

```javascript
// Check user role and permissions
import { getCurrentUserPermissions } from '@/api/utils/permissionWrapper';

const userPerms = await getCurrentUserPermissions();
console.log('User permissions:', userPerms);

// If empty, assign permissions to user's role
// Use admin panel or API to assign permissions
```

#### 3. Protected Service Not Working

**Error:** Service methods not checking permissions

**Solution:**

```javascript
// Ensure you're importing from protected service
// ❌ Wrong
import { createBlog } from '@/api/services/admin/blogService';

// ✅ Correct
import { createBlog } from '@/api/services/admin/protected/blogService';
```

#### 4. Permission Cache Issues

**Error:** Permissions not updating after role change

**Solution:**

```javascript
// Clear permission cache
import { clearPermissionsCache } from '@/api/utils/permissionWrapper';

clearPermissionsCache();
// Or refresh in React context
const { refreshPermissions } = usePermissionContext();
await refreshPermissions();
```

---

## Checklist for New Services

### Before Implementation:

- [ ] Determine required actions (create, view, edit, delete, custom)
- [ ] Decide on module name (consistent with naming convention)
- [ ] Plan any custom permission logic needed

### During Implementation:

- [ ] Create raw service in `/services/admin/`
- [ ] Update `permissions.js` configuration
- [ ] **Ask super admin to visit `/admin/pms` and generate permissions**
- [ ] Add module hook to `useModulePermissions.js`
- [ ] Update `permissionMiddleware.js` with module wrapper
- [ ] Create protected service in `/services/admin/protected/`

### After Implementation:

- [ ] **Ask super admin to run audit via `/admin/pms` UI**
- [ ] Test permission checking in browser console
- [ ] Test React hooks in components
- [ ] Verify error handling works correctly
- [ ] Update documentation if needed

---

## Quick Reference Commands

**Using `/admin/pms` UI (Recommended for Super Admins):**

- Navigate to `/admin/pms` for Permission Management System
- **Generate All Permissions** - Creates all missing permissions
- **Generate Module Permissions** - Creates permissions for specific module
- **Audit Permissions** - Shows sync status and missing permissions

**Browser Console Commands (Alternative):**

```javascript
// Generate permissions for specific module
await generateModulePermissions('moduleName');

// Generate all missing permissions
await generateAllPermissions();

// Audit permission sync status
await auditPermissions();

// Check specific permission
await hasPermission('module_action');

// Clear permission cache
clearPermissionsCache();

// Get user permissions
await getCurrentUserPermissions();
```

---

## File Templates

### Raw Service Template

```javascript
// src/api/services/admin/[moduleName]Service.js
import { apiService } from './apiService';
import { getAuthToken } from './authService';

const version = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

export const create[ModuleName] = async (data) => {
  if (!getAuthToken()) throw new Error('Authentication required');
  return await apiService.post(`/admin/${version}/[module]s/create`, data);
};

export const getAll[ModuleName]s = async (params = {}) => {
  if (!getAuthToken()) throw new Error('Authentication required');
  const qs = new URLSearchParams(params).toString();
  return await apiService.get(`/admin/${version}/[module]s${qs ? `?${qs}` : ''}`);
};

export const get[ModuleName]ById = async (id) => {
  if (!getAuthToken()) throw new Error('Authentication required');
  return await apiService.get(`/admin/${version}/[module]s/edit/${id}`);
};

export const update[ModuleName] = async (id, data) => {
  if (!getAuthToken()) throw new Error('Authentication required');
  return await apiService.put(`/admin/${version}/[module]s/update/${id}`, data);
};

export const delete[ModuleName] = async (id) => {
  if (!getAuthToken()) throw new Error('Authentication required');
  return await apiService.delete(`/admin/${version}/[module]s/delete/${id}`);
};
```

### Protected Service Template

```javascript
// src/api/services/admin/protected/[moduleName]Service.js
import { [module]Permissions } from '@/api/middleware/permissionMiddleware';
import * as original[ModuleName]Service from '@/api/services/admin/[module]Service';

export const create[ModuleName] = [module]Permissions.withCreatePermission(
  original[ModuleName]Service.create[ModuleName],
  { context: { operation: 'create[ModuleName]' } }
);

export const getAll[ModuleName]s = [module]Permissions.withViewPermission(
  original[ModuleName]Service.getAll[ModuleName]s,
  { context: { operation: 'getAll[ModuleName]s' } }
);

export const get[ModuleName]ById = [module]Permissions.withViewPermission(
  original[ModuleName]Service.get[ModuleName]ById,
  { context: { operation: 'get[ModuleName]ById' } }
);

export const update[ModuleName] = [module]Permissions.withEditPermission(
  original[ModuleName]Service.update[ModuleName],
  { context: { operation: 'update[ModuleName]' } }
);

export const delete[ModuleName] = [module]Permissions.withDeletePermission(
  original[ModuleName]Service.delete[ModuleName],
  { context: { operation: 'delete[ModuleName]' } }
);
```

---

_This guide ensures consistent implementation of the permission system across all services. Follow these patterns and your permission system will remain maintainable and secure._
