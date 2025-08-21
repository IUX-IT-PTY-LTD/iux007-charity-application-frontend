// src/api/services/admin/permissionService.js

/**
 * Simple Permission Service
 * Basic CRUD operations for permissions
 */

import { apiService } from './apiService';
import { getAuthToken } from './authService';

const version = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

// ==================== BASIC PERMISSION OPERATIONS ====================

/**
 * Get all permissions
 */
export const getAllPermissions = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    return await apiService.get(`/admin/${version}/permissions`);
  } catch (error) {
    console.error('Get all permissions error:', error);
    throw error;
  }
};

/**
 * Create a permission
 */
export const createPermission = async (name, status = 1) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    return await apiService.post(`/admin/${version}/permissions/create`, {
      name,
      status,
    });
  } catch (error) {
    console.error('Create permission error:', error);
    throw error;
  }
};

/**
 * Get permission by ID
 */
export const getPermissionById = async (id) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    return await apiService.get(`/admin/${version}/permissions/edit/${id}`);
  } catch (error) {
    console.error(`Get permission ${id} error:`, error);
    throw error;
  }
};

/**
 * Update permission
 */
export const updatePermission = async (id, name, status) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    return await apiService.put(`/admin/${version}/permissions/update/${id}`, {
      name,
      status,
    });
  } catch (error) {
    console.error(`Update permission ${id} error:`, error);
    throw error;
  }
};

/**
 * Delete permission
 */
export const deletePermission = async (id) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    return await apiService.delete(`/admin/${version}/permissions/delete/${id}`);
  } catch (error) {
    console.error(`Delete permission ${id} error:`, error);
    throw error;
  }
};

// ==================== PERMISSION CREATION HELPERS ====================

/**
 * Create permissions for a module if they don't exist
 * @param {string} module - Module name (e.g., 'admin', 'event')
 * @param {Array<string>} actions - Actions for the module (e.g., ['create', 'view', 'edit', 'delete'])
 * @returns {Promise} - Creation results
 */
export const createModulePermissions = async (module, actions) => {
  try {
    // Get existing permissions
    const existingResponse = await getAllPermissions();
    const existingPermissions = existingResponse.data || [];
    const existingNames = existingPermissions.map((p) => p.name);

    const results = [];

    // Create permissions for each action
    for (const action of actions) {
      const permissionName = `${module}_${action}`;

      // Only create if it doesn't exist
      if (!existingNames.includes(permissionName)) {
        try {
          const result = await createPermission(permissionName, 1);
          results.push({
            permission: permissionName,
            status: 'created',
            data: result.data,
          });
          console.log(`Created permission: ${permissionName}`);
        } catch (error) {
          results.push({
            permission: permissionName,
            status: 'error',
            error: error.message,
          });
          console.error(`Failed to create permission: ${permissionName}`, error);
        }
      } else {
        results.push({
          permission: permissionName,
          status: 'exists',
        });
        console.log(`Permission already exists: ${permissionName}`);
      }
    }

    return {
      status: 'success',
      module,
      results,
      created: results.filter((r) => r.status === 'created').length,
      existing: results.filter((r) => r.status === 'exists').length,
      errors: results.filter((r) => r.status === 'error').length,
    };
  } catch (error) {
    console.error(`Error creating permissions for module ${module}:`, error);
    throw error;
  }
};

/**
 * Get user's role permissions
 * @param {number} roleId - Role ID
 * @returns {Promise} - Role permissions
 */
export const getRolePermissions = async (roleId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    return await apiService.get(`/admin/${version}/role-based-permission/${roleId}`);
  } catch (error) {
    console.error(`Get role permissions error for role ${roleId}:`, error);
    throw error;
  }
};
