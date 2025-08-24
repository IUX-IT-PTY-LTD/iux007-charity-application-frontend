// src/api/services/admin/profileService.js

import { apiService } from './apiService';
import { getAuthToken, getUserId } from './authService';

// API version - match what's in your environment
const version = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

/**
 * Get current user's profile information
 * @returns {Promise} - Promise resolving to the user's profile data
 */
export const getCurrentUserProfile = async () => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    const userId = getUserId();
    if (!userId) {
      throw new Error('User ID not found. Please log in again.');
    }

    return await apiService.get(`/admin/${version}/admins/${userId}`);
  } catch (error) {
    console.error('Error fetching current user profile:', error);
    throw error;
  }
};

/**
 * Get user profile by ID
 * @param {number|string} userId - ID of the user to fetch
 * @returns {Promise} - Promise resolving to the user's profile data
 */
export const getUserProfileById = async (userId) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    if (!userId) {
      throw new Error('User ID is required.');
    }

    return await apiService.get(`/admin/${version}/admins/${userId}`);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

/**
 * Update current user's profile
 * @param {Object} profileData - Profile data to be updated
 * @returns {Promise} - Promise resolving to the updated profile
 */
export const updateCurrentUserProfile = async (profileData) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    const userId = getUserId();
    if (!userId) {
      throw new Error('User ID not found. Please log in again.');
    }

    // Validate required fields
    const validation = validateProfileData(profileData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Format data for API submission
    const formattedData = formatProfileDataForSubmission(profileData);

    return await apiService.put(`/admin/${version}/admins/${userId}`, formattedData);
  } catch (error) {
    console.error('Error updating current user profile:', error);
    throw error;
  }
};

/**
 * Update user profile by ID
 * @param {number|string} userId - ID of the user to update
 * @param {Object} profileData - Profile data to be updated
 * @returns {Promise} - Promise resolving to the updated profile
 */
export const updateUserProfile = async (userId, profileData) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    if (!userId) {
      throw new Error('User ID is required.');
    }

    // Validate required fields
    const validation = validateProfileData(profileData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Format data for API submission
    const formattedData = formatProfileDataForSubmission(profileData);

    return await apiService.put(`/admin/${version}/admins/${userId}`, formattedData);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Validate profile data before submission
 * @param {Object} profileData - Profile data to validate
 * @returns {Object} - Object with isValid boolean and errors array
 */
export const validateProfileData = (profileData) => {
  const errors = [];

  // Required fields based on API specification
  const requiredFields = ['name', 'email', 'role_id', 'status'];
  requiredFields.forEach((field) => {
    if (
      profileData[field] === undefined ||
      profileData[field] === null ||
      profileData[field] === ''
    ) {
      errors.push(`${field.replace('_', ' ')} is required`);
    }
  });

  // Email validation
  if (profileData.email && profileData.email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email.trim())) {
      errors.push('Please enter a valid email address');
    }
  }

  // Name validation
  if (profileData.name && profileData.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  // Role ID validation
  if (profileData.role_id !== undefined && profileData.role_id !== null) {
    const roleId = Number(profileData.role_id);
    if (isNaN(roleId) || roleId <= 0 || !Number.isInteger(roleId)) {
      errors.push('Role ID must be a positive integer');
    }
  }

  // Status validation
  if (profileData.status !== undefined && profileData.status !== null) {
    const status = Number(profileData.status);
    if (isNaN(status) || (status !== 0 && status !== 1)) {
      errors.push('Status must be either 0 (inactive) or 1 (active)');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Format profile data for API submission
 * @param {Object} data - Profile data from form
 * @returns {Object} - Formatted data for API
 */
export const formatProfileDataForSubmission = (data) => {
  // Create a new object to avoid mutating the original
  const formattedData = { ...data };

  // Trim string fields
  if (formattedData.name && typeof formattedData.name === 'string') {
    formattedData.name = formattedData.name.trim();
  }

  if (formattedData.email && typeof formattedData.email === 'string') {
    formattedData.email = formattedData.email.trim().toLowerCase();
  }

  // Convert role_id to number if it's a string
  if (typeof formattedData.role_id === 'string') {
    formattedData.role_id = parseInt(formattedData.role_id, 10);
  }

  // Convert status to number if it's a string
  if (typeof formattedData.status === 'string') {
    formattedData.status = parseInt(formattedData.status, 10);
  }

  return formattedData;
};

/**
 * Prepare profile data for form editing
 * @param {Object} profileData - Raw profile data from API
 * @returns {Object} - Formatted data for form
 */
export const prepareProfileDataForForm = (profileData) => {
  if (!profileData) return {};

  return {
    name: profileData.name || '',
    email: profileData.email || '',
    role_id: profileData.role_id || '',
    status: profileData.status !== undefined ? profileData.status : 1,
    // Include read-only fields for reference
    id: profileData.id,
    role: profileData.role || null,
  };
};

/**
 * Check if profile data has changes compared to original
 * @param {Object} originalData - Original profile data
 * @param {Object} newData - New profile data
 * @returns {boolean} - True if there are changes
 */
export const hasProfileChanges = (originalData, newData) => {
  if (!originalData || !newData) return false;

  const fieldsToCompare = ['name', 'email', 'role_id', 'status'];

  return fieldsToCompare.some((field) => {
    const original = originalData[field];
    const updated = newData[field];

    // Handle string vs number comparison for role_id and status
    if (field === 'role_id' || field === 'status') {
      return Number(original) !== Number(updated);
    }

    // Handle string comparison (trim for name and email)
    if (typeof original === 'string' && typeof updated === 'string') {
      return original.trim() !== updated.trim();
    }

    return original !== updated;
  });
};

/**
 * Extract profile update summary for logging/display
 * @param {Object} originalData - Original profile data
 * @param {Object} updatedData - Updated profile data
 * @returns {Object} - Summary of changes
 */
export const getProfileUpdateSummary = (originalData, updatedData) => {
  const changes = {};
  const fieldsToCheck = ['name', 'email', 'role_id', 'status'];

  fieldsToCheck.forEach((field) => {
    const original = originalData[field];
    const updated = updatedData[field];

    if (field === 'role_id' || field === 'status') {
      if (Number(original) !== Number(updated)) {
        changes[field] = { from: original, to: updated };
      }
    } else if (typeof original === 'string' && typeof updated === 'string') {
      if (original.trim() !== updated.trim()) {
        changes[field] = { from: original, to: updated };
      }
    } else if (original !== updated) {
      changes[field] = { from: original, to: updated };
    }
  });

  return {
    hasChanges: Object.keys(changes).length > 0,
    changes,
    changedFields: Object.keys(changes),
  };
};
