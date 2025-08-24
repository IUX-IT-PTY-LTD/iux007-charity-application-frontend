// src/api/middleware/permissionMiddleware.js

import { hasPermission, hasModuleAccess } from '@/api/utils/permissionWrapper';
import {
  PermissionDeniedError,
  ModuleAccessError,
  AuthenticationError,
  handlePermissionError,
} from '@/api/utils/permissionErrors';

// ==================== PERMISSION WRAPPER FUNCTIONS ====================

export const withPermissionCheck = (requiredPermission, operation, options = {}) => {
  const { onDenied = null, onError = null, context = {}, skipAuthCheck = false } = options;

  return async (...args) => {
    try {
      if (skipAuthCheck) {
        return await operation(...args);
      }

      const hasRequiredPermission = await hasPermission(requiredPermission);

      if (!hasRequiredPermission) {
        const error = new PermissionDeniedError(requiredPermission, 'execute', 'operation', {
          ...context,
          args,
        });

        handlePermissionError(error, { requiredPermission, context });

        if (onDenied) {
          return await onDenied(error, ...args);
        }

        throw error;
      }

      return await operation(...args);
    } catch (error) {
      if (error instanceof PermissionDeniedError) {
        throw error;
      }

      if (
        error.message?.includes('Not authenticated') ||
        error.message?.includes('Authentication required')
      ) {
        const authError = new AuthenticationError(error.message, { originalError: error });
        handlePermissionError(authError, { requiredPermission, context });
        throw authError;
      }

      if (onError) {
        return await onError(error, ...args);
      }

      throw error;
    }
  };
};

export const withModuleAccess = (module, operation, options = {}) => {
  const {
    onDenied = null,
    onError = null,
    context = {},
    requireSpecificPermission = null,
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

export const createCRUDPermissionWrappers = (module) => {
  return {
    withCreatePermission: (operation, options = {}) =>
      withPermissionCheck(`${module}_create`, operation, {
        context: { module, action: 'create' },
        ...options,
      }),

    withViewPermission: (operation, options = {}) =>
      withPermissionCheck(`${module}_view`, operation, {
        context: { module, action: 'view' },
        ...options,
      }),

    withEditPermission: (operation, options = {}) =>
      withPermissionCheck(`${module}_edit`, operation, {
        context: { module, action: 'edit' },
        ...options,
      }),

    withDeletePermission: (operation, options = {}) =>
      withPermissionCheck(`${module}_delete`, operation, {
        context: { module, action: 'delete' },
        ...options,
      }),

    withModuleAccess: (operation, options = {}) =>
      withModuleAccess(module, operation, {
        context: { module },
        ...options,
      }),
  };
};

// ==================== PRE-CONFIGURED MODULE WRAPPERS ====================

// Existing module wrappers
export const adminPermissions = createCRUDPermissionWrappers('admin');
export const rolePermissions = createCRUDPermissionWrappers('role');
export const eventPermissions = createCRUDPermissionWrappers('event');
export const faqPermissions = createCRUDPermissionWrappers('faq');
export const sliderPermissions = createCRUDPermissionWrappers('slider');
export const menuPermissions = createCRUDPermissionWrappers('menu');
export const contactPermissions = createCRUDPermissionWrappers('contact');
export const userPermissions = createCRUDPermissionWrappers('user');
export const permissionPermissions = createCRUDPermissionWrappers('permission');
export const profilePermissions = createCRUDPermissionWrappers('profile');
export const settingsPermissions = createCRUDPermissionWrappers('settings');

// ==================== UTILITY FUNCTIONS ====================

export const createProtectedService = (module, serviceOperations) => {
  const wrappers = createCRUDPermissionWrappers(module);
  const protectedService = {};

  Object.entries(serviceOperations).forEach(([operationName, operation]) => {
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
      protectedService[operationName] = wrappers.withModuleAccess(operation);
    }
  });

  return protectedService;
};

export const batchWrapWithPermission = (permission, operations) => {
  const wrapped = {};

  Object.entries(operations).forEach(([name, operation]) => {
    wrapped[name] = withPermissionCheck(permission, operation);
  });

  return wrapped;
};

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
