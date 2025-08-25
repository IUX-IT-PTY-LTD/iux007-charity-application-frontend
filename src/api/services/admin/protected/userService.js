// src/api/services/admin/protected/userService.js

/**
 * Protected User Service
 * User service with automatic permission checking
 */

import { userPermissions } from '@/api/middleware/permissionMiddleware';
import { userService } from '@/api/services/admin/userService';

// ==================== PROTECTED USER OPERATIONS ====================

/**
 * Get users with pagination and filters (requires user_view permission)
 */
export const getUsers = userPermissions.withViewPermission(userService.getUsers.bind(userService), {
  context: { operation: 'getUsers' },
});

/**
 * Get user details by ID (requires user_details permission, fallback to user_view)
 */
export const getUserDetails = userPermissions.withViewPermission(
  userService.getUserDetails.bind(userService),
  {
    context: { operation: 'getUserDetails' },
  }
);

// ==================== DIRECT EXPORT OF USER SERVICE INSTANCE ====================

/**
 * Export the user service instance for utility access
 * Note: Direct usage bypasses permission checks - use protected methods above
 */
export { userService };
