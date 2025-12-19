// src/api/services/admin/adminService.js

/**
 * Service file for handling admin management API requests
 * Integrated with the application's apiService
 * Updated to support dynamic role assignment
 */

import { apiService } from './apiService';
import { getAuthToken } from './authService';
import { getAllRoles } from './roleService';

const version = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

/**
 * Get available roles for admin assignment
 * @returns {Promise} - Promise resolving to list of available roles
 */
export const getAvailableRoles = async () => {
  try {
    console.log('Fetching available roles for admin assignment...');
    const rolesResponse = await getAllRoles();
    return rolesResponse;
  } catch (error) {
    console.error('Get available roles error:', error);
    throw error;
  }
};

/**
 * Get default role ID (first active role or fallback to role ID 1)
 * @returns {Promise<number>} - Promise resolving to default role ID
 */
export const getDefaultRoleId = async () => {
  try {
    const rolesResponse = await getAvailableRoles();

    if (rolesResponse && rolesResponse.data && rolesResponse.data.length > 0) {
      // Find first active role (status = 1) or return first role
      const activeRole = rolesResponse.data.find((role) => role.status === 1);
      if (activeRole) {
        console.log('Using default active role:', activeRole.id, activeRole.name);
        return activeRole.id;
      }

      // If no active role found, use first available role
      const firstRole = rolesResponse.data[0];
      console.log('Using first available role as default:', firstRole.id, firstRole.name);
      return firstRole.id;
    }

    // Fallback to role ID 1 if no roles found
    console.warn('No roles found, falling back to role ID 1');
    return 1;
  } catch (error) {
    console.error('Error getting default role ID:', error);
    // Fallback to role ID 1 if there's an error
    console.warn('Falling back to role ID 1 due to error');
    return 1;
  }
};

/**
 * Create a new admin user
 * @param {string} name - Admin name
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @param {number|null} roleId - Admin role ID (if null, will use default role)
 * @param {number} status - Admin status (default: 1 for active)
 * @returns {Promise} - Promise resolving to created admin data
 */
export const createAdmin = async (name, email, password, roleId = null, status = 1) => {
  try {
    // Check authentication
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    // Get role ID - use provided roleId or get default
    let finalRoleId = roleId;
    if (finalRoleId === null || finalRoleId === undefined) {
      finalRoleId = await getDefaultRoleId();
    }

    console.log('Creating admin with:', { name, email, roleId: finalRoleId, status });

    const data = await apiService.post(`/admin/${version}/admins`, {
      name,
      email,
      password,
      role_id: finalRoleId,
      status,
    });

    return data;
  } catch (error) {
    console.error('Create admin error:', error);
    throw error;
  }
};

/**
 * Create admin with role validation
 * This function validates that the role exists before creating the admin
 * @param {string} name - Admin name
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @param {number} roleId - Admin role ID
 * @param {number} status - Admin status (default: 1 for active)
 * @returns {Promise} - Promise resolving to created admin data
 */
export const createAdminWithRoleValidation = async (name, email, password, roleId, status = 1) => {
  try {
    // Check authentication
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    // Validate that the role exists and is active
    const rolesResponse = await getAvailableRoles();
    const roleExists = rolesResponse.data?.find((role) => role.id === roleId);

    if (!roleExists) {
      throw new Error(`Role with ID ${roleId} does not exist`);
    }

    if (roleExists.status !== 1) {
      console.warn(`Warning: Assigning admin to inactive role: ${roleExists.name}`);
    }

    console.log('Creating admin with validated role:', {
      name,
      email,
      roleId,
      roleName: roleExists.name,
      status,
    });

    const data = await apiService.post(`/admin/${version}/admins`, {
      name,
      email,
      password,
      role_id: roleId,
      status,
    });

    return data;
  } catch (error) {
    console.error('Create admin with role validation error:', error);
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
 * Get admin with role details
 * @param {number} id - Admin ID
 * @returns {Promise} - Promise resolving to admin data with role information
 */
export const getAdminWithRole = async (id) => {
  try {
    // Check authentication
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    // Fetch admin details and available roles in parallel
    const [adminResponse, rolesResponse] = await Promise.all([
      getAdminById(id),
      getAvailableRoles(),
    ]);

    // Find the role details for this admin
    const adminRole = rolesResponse.data?.find((role) => role.id === adminResponse.data.role_id);

    return {
      status: adminResponse.status,
      data: {
        ...adminResponse.data,
        role_details: adminRole || null,
      },
      message: 'Admin data with role fetched successfully',
    };
  } catch (error) {
    console.error(`Get admin with role ${id} error:`, error);
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
export const updateAdmin = async (id, name, email, roleId, status = 1) => {
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
 * Update admin with role validation
 * This function validates that the role exists before updating the admin
 * @param {number} id - Admin ID
 * @param {string} name - Admin name
 * @param {string} email - Admin email
 * @param {number} roleId - Admin role ID
 * @param {number} status - Admin status
 * @returns {Promise} - Promise resolving to updated admin data
 */
export const updateAdminWithRoleValidation = async (id, name, email, roleId, status = 1) => {
  try {
    // Check authentication
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    // Validate that the role exists
    const rolesResponse = await getAvailableRoles();
    const roleExists = rolesResponse.data?.find((role) => role.id === roleId);

    if (!roleExists) {
      throw new Error(`Role with ID ${roleId} does not exist`);
    }

    if (roleExists.status !== 1) {
      console.warn(`Warning: Assigning admin to inactive role: ${roleExists.name}`);
    }

    console.log('Updating admin with validated role:', id, {
      name,
      email,
      roleId,
      roleName: roleExists.name,
      status,
    });

    return await apiService.put(`/admin/${version}/admins/${id}`, {
      name,
      email,
      role_id: roleId,
      status,
    });
  } catch (error) {
    console.error(`Update admin with role validation ${id} error:`, error);
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

/**
 * Get admins by role ID
 * @param {number} roleId - Role ID to filter by
 * @returns {Promise} - Promise resolving to list of admins with specified role
 */
export const getAdminsByRole = async (roleId) => {
  try {
    console.log('Fetching admins by role ID:', roleId);

    // Get all admins and filter by role_id
    const allAdminsResponse = await getAllAdmins();

    if (allAdminsResponse && allAdminsResponse.data) {
      const filteredAdmins = allAdminsResponse.data.filter((admin) => admin.role_id === roleId);

      return {
        status: allAdminsResponse.status,
        data: filteredAdmins,
        message: `Found ${filteredAdmins.length} admins with role ID ${roleId}`,
      };
    }
    return allAdminsResponse;
  }catch (error) {
    console.error(`Get admins by role ${roleId} error:`, error);
  } 
}
 /* Get dashboard statistics
 * @returns {Promise} - Promise resolving to dashboard statistics data
 */
export const getStatistics = async () => {
  try {
    // Check authentication
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    return await apiService.get(`/admin/${version}/statistics`);

  } catch (error) {
    console.error('Get statistics error:', error);
    throw error;
  }
};

/**
 * Get events statistics
 * @returns {Promise} - Promise resolving to events statistics data
 */
export const getEventsStatistics = async () => {
  try {
    // Check authentication
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    return await apiService.get(`/admin/${version}/events/statistics`);
  } catch (error) {
    console.error('Get events statistics error:', error);
    throw error;
  }
};

/**
 * Get monthly donations statistics
 * @returns {Promise} - Promise resolving to monthly donations statistics data
 */
export const getMonthlyDonationsStatistics = async () => {
  try {
    // Check authentication
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    return await apiService.get(`/admin/${version}/statistics/monthly-donations`);
  } catch (error) {
    console.error('Get monthly donations statistics error:', error);
    throw error;
  }
};

/**
 * Reset admin password
 * @param {number} id - Admin ID
 * @param {string} newPassword - New password for the admin
 * @returns {Promise} - Promise resolving to password reset result
 */
export const resetAdminPassword = async (id, newPassword) => {
  try {
    // Check authentication
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    console.log('Resetting password for admin:', id);

    return await apiService.patch(`/admin/${version}/admins/reset-password`, {
      admin_id: id,
      password: newPassword,
    });
  } catch (error) {
    console.error(`Reset admin password ${id} error:`, error);
    throw error;
  }
};
