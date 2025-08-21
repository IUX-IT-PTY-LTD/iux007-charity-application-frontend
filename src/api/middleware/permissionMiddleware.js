/**
 * Permission Middleware
 * Provides utilities to wrap service operations with permission checking
 */

import { hasPermission, hasModuleAccess } from '../utils/permissionWrapper';
import {
  PermissionDeniedError,
  ModuleAccessError,
  AuthenticationError,
  handlePermissionError,
} from '../utils/permissionErrors';

// ==================== PERMISSION WRAPPER FUNCTIONS ====================

/**
 * Wrap a service operation with permission checking
 * @param {string} requiredPermission - Permission required to execute the operation
 * @param {Function} operation - The service operation to wrap
 * @param {Object} options - Additional options
 * @returns {Function} Wrapped operation
 */
export const withPermissionCheck = (requiredPermission, operation, options = {}) => {
  const {
    onDenied = null, // Custom handler for permission denied
    onError = null, // Custom error handler
    context = {}, // Additional context for error reporting
    skipAuthCheck = false, // Skip authentication check (for public operations)
  } = options;

  return async (...args) => {
    try {
      // Skip permission check if explicitly disabled
      if (skipAuthCheck) {
        return await operation(...args);
      }

      // Check if user has the required permission
      const hasRequiredPermission = await hasPermission(requiredPermission);

      if (!hasRequiredPermission) {
        const error = new PermissionDeniedError(requiredPermission, 'execute', 'operation', {
          ...context,
          args,
        });

        handlePermissionError(error, { requiredPermission, context });

        // Call custom denial handler if provided
        if (onDenied) {
          return await onDenied(error, ...args);
        }

        throw error;
      }

      // Execute the operation if permission check passes
      return await operation(...args);
    } catch (error) {
      // Handle permission errors
      if (error instanceof PermissionDeniedError) {
        throw error;
      }

      // Check for authentication errors
      if (
        error.message?.includes('Not authenticated') ||
        error.message?.includes('Authentication required')
      ) {
        const authError = new AuthenticationError(error.message, { originalError: error });
        handlePermissionError(authError, { requiredPermission, context });
        throw authError;
      }

      // Call custom error handler if provided
      if (onError) {
        return await onError(error, ...args);
      }

      // Re-throw other errors
      throw error;
    }
  };
};

/**
 * Wrap a service operation with module access checking
 * @param {string} module - Module name to check access for
 * @param {Function} operation - The service operation to wrap
 * @param {Object} options - Additional options
 * @returns {Function} Wrapped operation
 */
export const withModuleAccess = (module, operation, options = {}) => {
  const {
    onDenied = null,
    onError = null,
    context = {},
    requireSpecificPermission = null, // Require specific permission instead of any module access
  } = options;

  return async (...args) => {
    try {
      let hasAccess = false;

      if (requireSpecificPermission) {
        hasAccess = await hasPermission(requireSpecificPermission);
      } else {
        hasAccess = await hasModuleAccess(module);
      }

      if (!hasAccess) {
        const error = new ModuleAccessError(module, { ...context, args });
        handlePermissionError(error, { module, context });

        if (onDenied) {
          return await onDenied(error, ...args);
        }

        throw error;
      }

      return await operation(...args);
    } catch (error) {
      if (error instanceof ModuleAccessError) {
        throw error;
      }

      if (onError) {
        return await onError(error, ...args);
      }

      throw error;
    }
  };
};

// ==================== CONVENIENCE WRAPPERS ====================

/**
 * Create permission wrappers for common CRUD operations
 * @param {string} module - Module name
 * @returns {Object} Object with wrapped CRUD operation creators
 */
export const createCRUDPermissionWrappers = (module) => {
  return {
    /**
     * Wrap a create operation
     */
    withCreatePermission: (operation, options = {}) =>
      withPermissionCheck(`${module}_create`, operation, {
        context: { module, action: 'create' },
        ...options,
      }),

    /**
     * Wrap a view/read operation
     */
    withViewPermission: (operation, options = {}) =>
      withPermissionCheck(`${module}_view`, operation, {
        context: { module, action: 'view' },
        ...options,
      }),

    /**
     * Wrap an edit/update operation
     */
    withEditPermission: (operation, options = {}) =>
      withPermissionCheck(`${module}_edit`, operation, {
        context: { module, action: 'edit' },
        ...options,
      }),

    /**
     * Wrap a delete operation
     */
    withDeletePermission: (operation, options = {}) =>
      withPermissionCheck(`${module}_delete`, operation, {
        context: { module, action: 'delete' },
        ...options,
      }),

    /**
     * Wrap any operation with module access check
     */
    withModuleAccess: (operation, options = {}) =>
      withModuleAccess(module, operation, {
        context: { module },
        ...options,
      }),
  };
};

// ==================== PRE-CONFIGURED MODULE WRAPPERS ====================

// Admin module wrappers
export const adminPermissions = createCRUDPermissionWrappers('admin');

// Role module wrappers
export const rolePermissions = createCRUDPermissionWrappers('role');

// Event module wrappers
export const eventPermissions = createCRUDPermissionWrappers('event');

// FAQ module wrappers
export const faqPermissions = createCRUDPermissionWrappers('faq');

// Slider module wrappers
export const sliderPermissions = createCRUDPermissionWrappers('slider');

// Menu module wrappers
export const menuPermissions = createCRUDPermissionWrappers('menu');

// Contact module wrappers
export const contactPermissions = createCRUDPermissionWrappers('contact');

// User module wrappers
export const userPermissions = createCRUDPermissionWrappers('user');

// Permission module wrappers
export const permissionPermissions = createCRUDPermissionWrappers('permission');

// ==================== UTILITY FUNCTIONS ====================

/**
 * Create a service class with automatic permission wrapping
 * @param {string} module - Module name
 * @param {Object} serviceOperations - Object containing service operations
 * @returns {Object} Service object with wrapped operations
 */
export const createProtectedService = (module, serviceOperations) => {
  const wrappers = createCRUDPermissionWrappers(module);
  const protectedService = {};

  Object.entries(serviceOperations).forEach(([operationName, operation]) => {
    // Determine wrapper based on operation name
    if (
      operationName.toLowerCase().includes('create') ||
      operationName.toLowerCase().includes('add')
    ) {
      protectedService[operationName] = wrappers.withCreatePermission(operation);
    } else if (
      operationName.toLowerCase().includes('get') ||
      operationName.toLowerCase().includes('fetch') ||
      operationName.toLowerCase().includes('list')
    ) {
      protectedService[operationName] = wrappers.withViewPermission(operation);
    } else if (
      operationName.toLowerCase().includes('update') ||
      operationName.toLowerCase().includes('edit') ||
      operationName.toLowerCase().includes('modify')
    ) {
      protectedService[operationName] = wrappers.withEditPermission(operation);
    } else if (
      operationName.toLowerCase().includes('delete') ||
      operationName.toLowerCase().includes('remove')
    ) {
      protectedService[operationName] = wrappers.withDeletePermission(operation);
    } else {
      // Default to module access for other operations
      protectedService[operationName] = wrappers.withModuleAccess(operation);
    }
  });

  return protectedService;
};

/**
 * Batch wrap multiple operations with the same permission
 * @param {string} permission - Required permission
 * @param {Object} operations - Object containing operations to wrap
 * @returns {Object} Object with wrapped operations
 */
export const batchWrapWithPermission = (permission, operations) => {
  const wrapped = {};

  Object.entries(operations).forEach(([name, operation]) => {
    wrapped[name] = withPermissionCheck(permission, operation);
  });

  return wrapped;
};

/**
 * Create a conditional wrapper that checks permission only under certain conditions
 * @param {Function} condition - Function that returns true if permission check is needed
 * @param {string} permission - Permission to check if condition is true
 * @param {Function} operation - Operation to wrap
 * @returns {Function} Conditionally wrapped operation
 */
export const withConditionalPermission = (condition, permission, operation) => {
  return async (...args) => {
    const needsPermissionCheck = await condition(...args);

    if (needsPermissionCheck) {
      return await withPermissionCheck(permission, operation)(...args);
    } else {
      return await operation(...args);
    }
  };
};
