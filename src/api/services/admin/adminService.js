/**
 * Service file for handling admin management API requests
 * Integrated with the application's apiService
 */

import { apiService } from './apiService';
import { getAuthToken } from './authService';

const version = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

/**
 * Create a new admin user
 * @param {string} name - Admin name
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @returns {Promise} - Promise resolving to created admin data
 */
export const createAdmin = async (name, email, password) => {
  try {
    // Check authentication
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    console.log('Creating admin with:', { name, email });

    // Always include role_id and status with default values
    const data = await apiService.post(`/admin/${version}/admins`, {
      name,
      email,
      password,
      role_id: 1, // Default role_id as per requirements
      status: 1, // Default status as per requirements
    });

    return data;
  } catch (error) {
    console.error('Create admin error:', error);
    throw error;
  }
};

/**
 * Get list of all admins
 * @returns {Promise} - Promise resolving to list of all admins
 */
export const getAllAdmins = async () => {
  try {
    // Check authentication
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    return await apiService.get(`/admin/${version}/admins`);
  } catch (error) {
    console.error('Get all admins error:', error);
    throw error;
  }
};

/**
 * Get admin by ID
 * @param {number} id - Admin ID
 * @returns {Promise} - Promise resolving to admin data
 */
export const getAdminById = async (id) => {
  try {
    // Check authentication
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    return await apiService.get(`/admin/${version}/admins/${id}`);
  } catch (error) {
    console.error(`Get admin ${id} error:`, error);
    throw error;
  }
};

/**
 * Update admin data
 * @param {number} id - Admin ID
 * @param {string} name - Admin name
 * @param {string} email - Admin email
 * @param {number} roleId - Admin role ID
 * @param {number} status - Admin status
 * @returns {Promise} - Promise resolving to updated admin data
 */
export const updateAdmin = async (id, name, email, roleId = 1, status = 1) => {
  try {
    // Check authentication
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    console.log('Updating admin:', id, { name, email, roleId, status });

    // All fields are required when sending the request per API requirements
    return await apiService.put(`/admin/${version}/admins/${id}`, {
      name,
      email,
      role_id: roleId,
      status,
    });
  } catch (error) {
    console.error(`Update admin ${id} error:`, error);
    throw error;
  }
};

/**
 * Delete admin
 * @param {number} id - Admin ID
 * @returns {Promise} - Promise resolving to delete result
 */
export const deleteAdmin = async (id) => {
  try {
    // Check authentication
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    console.log('Deleting admin:', id);

    return await apiService.delete(`/admin/${version}/admins/${id}`);
  } catch (error) {
    console.error(`Delete admin ${id} error:`, error);
    throw error;
  }
};
