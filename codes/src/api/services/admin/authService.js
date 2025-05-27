/**
 * Service file for handling admin authentication API requests
 * Integrated with the application's apiService
 */

import { apiService } from './apiService';

// Make sure these variables match what the backend expects
const version = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

// Auth token key in localStorage - using what apiService expects
const AUTH_TOKEN_KEY = 'accessToken';

/**
 * Get auth token from localStorage
 * @returns {string|null} - Auth token or null if not found
 */
export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
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
 * Remove auth token from localStorage
 */
export const removeAuthToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
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

    // Set token in localStorage if login successful
    if (data.status === 'success' && data.data && data.data.access_token) {
      setAuthToken(data.data.access_token);
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} - Promise resolving to registration result
 */
export const register = async (userData) => {
  try {
    const data = await apiService.post(`/admin/${version}/register`, userData);

    // Set token in localStorage if returned with registration
    if (data.status === 'success' && data.data && data.data.access_token) {
      setAuthToken(data.data.access_token);
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Send password reset request
 * @param {string} email - User email for password reset
 * @returns {Promise} - Promise resolving to password reset request result
 */
export const forgotPassword = async (email) => {
  try {
    return await apiService.post(`/admin/${version}/forgot-password`, { email });
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};

/**
 * Reset password with token
 * @param {string} token - Reset token from email
 * @param {string} password - New password
 * @param {string} passwordConfirmation - Password confirmation
 * @returns {Promise} - Promise resolving to password reset result
 */
export const resetPassword = async (token, password, passwordConfirmation) => {
  try {
    return await apiService.post(`/admin/${version}/reset-password`, {
      token,
      password,
      password_confirmation: passwordConfirmation,
    });
  } catch (error) {
    console.error('Reset password error:', error);
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

    // Remove token on successful logout
    removeAuthToken();

    return data;
  } catch (error) {
    console.error('Logout error:', error);
    // Remove token even if logout API fails
    removeAuthToken();
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

    return await apiService.get(`/admin/${version}/me`);
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};
