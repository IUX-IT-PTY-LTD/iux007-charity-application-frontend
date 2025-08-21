/**
 * Service file for handling admin authentication API requests
 * Integrated with the application's apiService
 */

import { apiService } from './apiService';

// Make sure these variables match what the backend expects
const version = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

// Auth token key in localStorage - using what apiService expects
const AUTH_TOKEN_KEY = 'adminAccessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_ID_KEY = 'adminUserId';

/**
 * Get auth token from localStorage
 * @returns {string|null} - Auth token or null if not found
 */
export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Get refresh token from localStorage
 * @returns {string|null} - Refresh token or null if not found
 */
export const getRefreshToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Set auth token in localStorage
 * @param {string} token - Auth token to set
 */
export const setAuthToken = (token) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

/**
 * Set refresh token in localStorage
 * @param {string} token - Refresh token to set
 */
export const setRefreshToken = (token) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

/**
 * Remove auth token from localStorage
 */
export const removeAuthToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

/**
 * Remove refresh token from localStorage
 */
export const removeRefreshToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Set user ID in localStorage
 * @param {string} userId - User ID to set
 */
export const setUserId = (userId) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_ID_KEY, userId);
};

/**
 * Get user ID from localStorage
 * @returns {string|null} - User ID or null if not found
 */
export const getUserId = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(USER_ID_KEY);
};

/**
 * Remove user ID from localStorage
 */
export const removeUserId = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_ID_KEY);
};

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - Promise resolving to user data with token
 */
export const login = async (email, password) => {
  try {
    console.log('Attempting login with:', { email });

    const data = await apiService.post(`/admin/${version}/login`, {
      email,
      password,
    });

    // Set tokens in localStorage if login successful
    if (data.status === 'success' && data.data && data.data.access_token) {
      setAuthToken(data.data.access_token);

      if (data.data.refresh_token) {
        setRefreshToken(data.data.refresh_token);
      }

      // Store user ID if available in response
      if (data.data.id) {
        setUserId(data.data.id);
      }
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Logout user
 * @returns {Promise} - Promise resolving to logout result
 */
export const logout = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const data = await apiService.post(`/admin/${version}/logout`, {});

    // Remove tokens and user ID on successful logout
    removeAuthToken();
    removeRefreshToken();
    removeUserId();

    return data;
  } catch (error) {
    console.error('Logout error:', error);
    // Remove tokens and user ID even if logout API fails
    removeAuthToken();
    removeRefreshToken();
    removeUserId();
    throw error;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

/**
 * Get current user profile
 * @returns {Promise} - Promise resolving to user profile data
 */
export const getCurrentUser = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    // Try to get user ID from localStorage first
    const userId = getUserId();
    if (userId) {
      return await apiService.get(`/admin/${version}/profile/${userId}`);
    }
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

/**
 * Update user profile
 * @param {Object} profileData - Profile data to update
 * @returns {Promise} - Promise resolving to updated profile data
 */
export const updateProfile = async (profileData) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    // Try to get user ID from localStorage first
    const userId = getUserId();
    if (userId) {
      return await apiService.put(`/admin/${version}/profile/${userId}`, profileData);
    }

    // Fallback to generic profile endpoint if no user ID stored
    return await apiService.put(`/admin/${version}/profile/me`, profileData);
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};
