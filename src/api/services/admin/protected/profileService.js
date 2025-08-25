// src/api/services/admin/protected/profileService.js

/**
 * Protected Profile Service
 * Profile service with automatic permission checking
 */

import { adminPermissions } from '@/api/middleware/permissionMiddleware';
import { withPermissionCheck } from '@/api/middleware/permissionMiddleware';
import * as originalProfileService from '@/api/services/admin/profileService';

// ==================== PROTECTED PROFILE OPERATIONS ====================

/**
 * Get current user's profile information
 * This operation typically doesn't require special permissions since users can view their own profile
 * However, we'll check for admin_view permission as a safety measure
 */
export const getCurrentUserProfile = adminPermissions.withViewPermission(
  originalProfileService.getCurrentUserProfile,
  {
    context: { operation: 'getCurrentUserProfile' },
    // Allow users to view their own profile even without admin permissions
    skipAuthCheck: false,
  }
);

/**
 * Get user profile by ID (requires admin_view permission)
 * This is for viewing other users' profiles
 */
export const getUserProfileById = adminPermissions.withViewPermission(
  originalProfileService.getUserProfileById,
  {
    context: { operation: 'getUserProfileById' },
  }
);

/**
 * Update current user's profile
 * Users should be able to update their own profile, but we'll still check for basic permissions
 */
export const updateCurrentUserProfile = withPermissionCheck(
  'admin_edit', // Use admin_edit permission for profile updates
  originalProfileService.updateCurrentUserProfile,
  {
    context: { operation: 'updateCurrentUserProfile', description: 'Update own profile' },
    // Custom handler for permission denied - allow users to update their own basic info
    onDenied: async (error, profileData) => {
      // In a real implementation, you might want to allow limited profile updates
      // for users updating their own profiles, even without full admin permissions
      console.warn('User attempted to update profile without admin_edit permission:', error);
      throw error;
    },
  }
);

/**
 * Update user profile by ID (requires admin_edit permission)
 * This is for updating other users' profiles - requires full admin permissions
 */
export const updateUserProfile = adminPermissions.withEditPermission(
  originalProfileService.updateUserProfile,
  {
    context: { operation: 'updateUserProfile', description: 'Update other user profile' },
  }
);

// ==================== ALTERNATIVE: ROLE-BASED PROFILE OPERATIONS ====================

/**
 * Alternative implementation with more granular permission checking
 * Update current user's profile with role-based restrictions
 */
export const updateCurrentUserProfileWithRoleCheck = async (profileData) => {
  try {
    // First, check if user can edit their own profile (more lenient check)
    const canEditOwnProfile = await withPermissionCheck(
      'admin_view', // Only require view permission for own profile updates
      async (data) => data,
      {
        context: { operation: 'updateOwnProfile' },
        onDenied: async () => {
          throw new Error('You do not have permission to update your profile');
        },
      }
    )(profileData);

    // If user is trying to change role_id, require admin_edit permission
    if (profileData.role_id !== undefined) {
      await withPermissionCheck('admin_edit', async (data) => data, {
        context: { operation: 'updateOwnRole' },
        onDenied: async (error, data) => {
          // Remove role_id from update if user doesn't have permission
          delete data.role_id;
          console.warn('User attempted to change role without permission, role change ignored');
          return data;
        },
      })(profileData);
    }

    // If user is trying to change status, require admin_edit permission
    if (profileData.status !== undefined) {
      await withPermissionCheck('admin_edit', async (data) => data, {
        context: { operation: 'updateOwnStatus' },
        onDenied: async (error, data) => {
          // Remove status from update if user doesn't have permission
          delete data.status;
          console.warn('User attempted to change status without permission, status change ignored');
          return data;
        },
      })(profileData);
    }

    return await originalProfileService.updateCurrentUserProfile(profileData);
  } catch (error) {
    console.error('Error in protected profile update:', error);
    throw error;
  }
};

// ==================== UTILITY FUNCTIONS (NO PERMISSION REQUIRED) ====================

/**
 * Validate profile data before submission (utility function - no permission required)
 */
export const validateProfileData = originalProfileService.validateProfileData;

/**
 * Format profile data for API submission (utility function - no permission required)
 */
export const formatProfileDataForSubmission = originalProfileService.formatProfileDataForSubmission;

/**
 * Prepare profile data for form editing (utility function - no permission required)
 */
export const prepareProfileDataForForm = originalProfileService.prepareProfileDataForForm;

/**
 * Check if profile data has changes (utility function - no permission required)
 */
export const hasProfileChanges = originalProfileService.hasProfileChanges;

/**
 * Get profile update summary (utility function - no permission required)
 */
export const getProfileUpdateSummary = originalProfileService.getProfileUpdateSummary;

// ==================== CONVENIENCE FUNCTIONS ====================

/**
 * Safe profile update that automatically handles permission restrictions
 * This function attempts to update the profile but gracefully handles permission denials
 * by removing restricted fields and continuing with allowed updates
 */
export const safeUpdateCurrentUserProfile = async (profileData) => {
  try {
    // Clone the data to avoid modifying the original
    const safeData = { ...profileData };

    // Always allow name and email updates for own profile
    const allowedFields = ['name', 'email'];
    const restrictedFields = ['role_id', 'status'];

    // Check if user has admin permissions for restricted fields
    let hasAdminPermissions = false;
    try {
      await withPermissionCheck('admin_edit', async () => true, {
        onDenied: () => {
          hasAdminPermissions = false;
        },
      })();
      hasAdminPermissions = true;
    } catch (error) {
      hasAdminPermissions = false;
    }

    // Remove restricted fields if user doesn't have admin permissions
    if (!hasAdminPermissions) {
      restrictedFields.forEach((field) => {
        if (safeData[field] !== undefined) {
          console.warn(`Removing restricted field '${field}' from profile update`);
          delete safeData[field];
        }
      });
    }

    // Proceed with the update using allowed fields
    return await originalProfileService.updateCurrentUserProfile(safeData);
  } catch (error) {
    console.error('Error in safe profile update:', error);
    throw error;
  }
};
