/**
 * Service file for handling role and permission management API requests
 * Integrated with the application's apiService
 */

import { apiService } from './apiService';
import { getAuthToken } from './authService';

const version = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

// ==================== ROLE MANAGEMENT FUNCTIONS ====================

/**
 * Get list of all roles
 * @returns {Promise} - Promise resolving to list of all roles
 */
export const getAllRoles = async () => {
  try {
    // Check authentication
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    console.log('Fetching all roles...');
    return await apiService.get(`/admin/${version}/roles`);
  } catch (error) {
    console.error('Get all roles error:', error);
    throw error;
  }
};

/**
 * Create a new role
 * @param {string} name - Role name
 * @param {number} status - Role status (1 for active, 0 for inactive)
 * @returns {Promise} - Promise resolving to created role data
 */
export const createRole = async (name, status = 1) => {
  try {
    // Check authentication
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    console.log('Creating role with:', { name, status });

    const data = await apiService.post(`/admin/${version}/roles/create`, {
      name,
      status,
    });

    return data;
  } catch (error) {
    console.error('Create role error:', error);
    throw error;
  }
};

/**
 * Get role by ID
 * @param {number} id - Role ID
 * @returns {Promise} - Promise resolving to role data
 */
export const getRoleById = async (id) => {
  try {
    // Check authentication
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    console.log('Fetching role by ID:', id);
    return await apiService.get(`/admin/${version}/roles/edit/${id}`);
  } catch (error) {
    console.error(`Get role ${id} error:`, error);
    throw error;
  }
};

/**
 * Update role data
 * @param {number} id - Role ID
 * @param {string} name - Role name
 * @param {number} status - Role status
 * @returns {Promise} - Promise resolving to updated role data
 */
export const updateRole = async (id, name, status) => {
  try {
    // Check authentication
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    console.log('Updating role:', id, { name, status });

    // All fields are required when sending the request per API requirements
    return await apiService.put(`/admin/${version}/roles/update/${id}`, {
      name,
      status,
    });
  } catch (error) {
    console.error(`Update role ${id} error:`, error);
    throw error;
  }
};

// ==================== PERMISSION MANAGEMENT FUNCTIONS ====================

/**
 * Get list of all permissions
 * @returns {Promise} - Promise resolving to list of all permissions
 */
export const getAllPermissions = async () => {
  try {
    // Check authentication
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    console.log('Fetching all permissions...');
    return await apiService.get(`/admin/${version}/permissions`);
  } catch (error) {
    console.error('Get all permissions error:', error);
    throw error;
  }
};

// ==================== ROLE-PERMISSION MANAGEMENT FUNCTIONS ====================

/**
 * Create permissions for a role
 * @param {number} roleId - Role ID
 * @param {Array<number>} permissionIds - Array of permission IDs
 * @returns {Promise} - Promise resolving to role permission data
 */
export const createRolePermissions = async (roleId, permissionIds = []) => {
  try {
    // Check authentication
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    console.log('Creating role permissions:', { roleId, permissionIds });

    const data = await apiService.post(`/admin/${version}/role-based-permission/create`, {
      role_id: roleId,
      permission_ids: permissionIds,
    });

    return data;
  } catch (error) {
    console.error('Create role permissions error:', error);
    throw error;
  }
};

/**
 * Get permissions by role ID
 * @param {number} roleId - Role ID
 * @returns {Promise} - Promise resolving to role permissions data
 */
export const getRolePermissions = async (roleId) => {
  try {
    // Check authentication
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    console.log('Fetching permissions for role:', roleId);
    return await apiService.get(`/admin/${version}/role-based-permission/${roleId}`);
  } catch (error) {
    console.error(`Get role ${roleId} permissions error:`, error);
    throw error;
  }
};

// ==================== COMBINED OPERATIONS ====================

/**
 * Create a role with permissions in one operation
 * This function creates a role first, then assigns permissions to it
 * @param {string} name - Role name
 * @param {number} status - Role status (1 for active, 0 for inactive)
 * @param {Array<number>} permissionIds - Array of permission IDs to assign
 * @returns {Promise} - Promise resolving to complete role with permissions data
 */
export const createRoleWithPermissions = async (name, status = 1, permissionIds = []) => {
  try {
    // Check authentication
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    console.log('Creating role with permissions:', { name, status, permissionIds });

    // Step 1: Create the role
    const roleResponse = await createRole(name, status);

    if (!roleResponse || !roleResponse.data || !roleResponse.data.id) {
      throw new Error('Failed to create role - invalid response');
    }

    const createdRole = roleResponse.data;
    console.log('Role created successfully:', createdRole);

    // Step 2: Assign permissions to the newly created role (if any permissions provided)
    let permissionResponse = null;
    if (permissionIds && permissionIds.length > 0) {
      permissionResponse = await createRolePermissions(createdRole.id, permissionIds);
      console.log('Permissions assigned successfully:', permissionResponse);
    }

    // Return combined result
    return {
      status: 'success',
      data: {
        role: createdRole,
        permissions: permissionResponse ? permissionResponse.data : null,
      },
      message: 'Role created with permissions successfully',
    };
  } catch (error) {
    console.error('Create role with permissions error:', error);
    throw error;
  }
};

/**
 * Update a role with permissions
 * This function updates role details and then updates its permissions
 * @param {number} roleId - Role ID to update
 * @param {string} name - Role name
 * @param {number} status - Role status
 * @param {Array<number>} permissionIds - Array of permission IDs to assign
 * @returns {Promise} - Promise resolving to complete updated role with permissions data
 */
export const updateRoleWithPermissions = async (roleId, name, status, permissionIds = []) => {
  try {
    // Check authentication
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    console.log('Updating role with permissions:', { roleId, name, status, permissionIds });

    // Step 1: Update the role
    const roleResponse = await updateRole(roleId, name, status);

    if (!roleResponse || !roleResponse.data) {
      throw new Error('Failed to update role - invalid response');
    }

    const updatedRole = roleResponse.data;
    console.log('Role updated successfully:', updatedRole);

    // Step 2: Update permissions for the role
    let permissionResponse = null;
    if (permissionIds && permissionIds.length >= 0) {
      // Allow empty array to clear permissions
      permissionResponse = await createRolePermissions(roleId, permissionIds);
      console.log('Permissions updated successfully:', permissionResponse);
    }

    // Return combined result
    return {
      status: 'success',
      data: {
        role: updatedRole,
        permissions: permissionResponse ? permissionResponse.data : null,
      },
      message: 'Role updated with permissions successfully',
    };
  } catch (error) {
    console.error('Update role with permissions error:', error);
    throw error;
  }
};

/**
 * Get complete role data with permissions
 * @param {number} roleId - Role ID
 * @returns {Promise} - Promise resolving to role data with permissions
 */
export const getRoleWithPermissions = async (roleId) => {
  try {
    // Check authentication
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    console.log('Fetching complete role data with permissions:', roleId);

    // Fetch role details and permissions in parallel
    const [roleResponse, permissionsResponse] = await Promise.all([
      getRoleById(roleId),
      getRolePermissions(roleId),
    ]);

    return {
      status: 'success',
      data: {
        role: roleResponse.data,
        permissions: permissionsResponse.data,
      },
      message: 'Role data fetched successfully',
    };
  } catch (error) {
    console.error('Get role with permissions error:', error);
    throw error;
  }
};
