/**
 * Custom Permission Error Classes
 * Standardized error handling for permission-related failures
 */

/**
 * Base permission error class
 */
export class PermissionError extends Error {
  constructor(message, permission = null, context = {}) {
    super(message);
    this.name = 'PermissionError';
    this.code = 'PERMISSION_DENIED';
    this.permission = permission;
    this.context = context;
    this.timestamp = new Date().toISOString();

    // Maintain proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PermissionError);
    }
  }

  /**
   * Get a user-friendly error message
   */
  getUserMessage() {
    if (this.permission) {
      const [module, action] = this.permission.split('_');
      const moduleFormatted = module.charAt(0).toUpperCase() + module.slice(1);
      const actionFormatted = action ? action.charAt(0).toUpperCase() + action.slice(1) : 'Access';

      return `You don't have permission to ${actionFormatted.toLowerCase()} ${moduleFormatted} records.`;
    }

    return "You don't have permission to perform this action.";
  }

  /**
   * Convert error to JSON for logging/debugging
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      permission: this.permission,
      context: this.context,
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }
}

/**
 * Error for when user is not authenticated
 */
export class AuthenticationError extends PermissionError {
  constructor(message = 'Authentication required', context = {}) {
    super(message, null, context);
    this.name = 'AuthenticationError';
    this.code = 'AUTHENTICATION_REQUIRED';
  }

  getUserMessage() {
    return 'Please log in to access this feature.';
  }
}

/**
 * Error for specific permission denials
 */
export class PermissionDeniedError extends PermissionError {
  constructor(permission, action = null, resource = null, context = {}) {
    const message = PermissionDeniedError.formatMessage(permission, action, resource);
    super(message, permission, { action, resource, ...context });
    this.name = 'PermissionDeniedError';
    this.code = 'PERMISSION_DENIED';
    this.action = action;
    this.resource = resource;
  }

  static formatMessage(permission, action, resource) {
    if (action && resource) {
      return `Access denied: Cannot ${action} ${resource}. Required permission: ${permission}`;
    }
    if (permission) {
      return `Access denied: Missing required permission: ${permission}`;
    }
    return 'Access denied: Insufficient permissions';
  }
}

/**
 * Error for module access denials
 */
export class ModuleAccessError extends PermissionError {
  constructor(module, context = {}) {
    const message = `Access denied to ${module} module. No permissions found for this module.`;
    super(message, null, { module, ...context });
    this.name = 'ModuleAccessError';
    this.code = 'MODULE_ACCESS_DENIED';
    this.module = module;
  }

  getUserMessage() {
    const moduleFormatted = this.module.charAt(0).toUpperCase() + this.module.slice(1);
    return `You don't have access to the ${moduleFormatted} module.`;
  }
}

/**
 * Error for role-related permission issues
 */
export class RolePermissionError extends PermissionError {
  constructor(roleId, message = null, context = {}) {
    const defaultMessage = `Role permissions error for role ID: ${roleId}`;
    super(message || defaultMessage, null, { roleId, ...context });
    this.name = 'RolePermissionError';
    this.code = 'ROLE_PERMISSION_ERROR';
    this.roleId = roleId;
  }

  getUserMessage() {
    return 'There was an issue with your role permissions. Please contact an administrator.';
  }
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Check if an error is a permission-related error
 * @param {Error} error - Error to check
 * @returns {boolean} True if it's a permission error
 */
export const isPermissionError = (error) => {
  return (
    error instanceof PermissionError ||
    error.code === 'PERMISSION_DENIED' ||
    error.code === 'AUTHENTICATION_REQUIRED' ||
    error.code === 'MODULE_ACCESS_DENIED' ||
    error.code === 'ROLE_PERMISSION_ERROR'
  );
};

/**
 * Get user-friendly message from any permission error
 * @param {Error} error - Error object
 * @returns {string} User-friendly error message
 */
export const getPermissionErrorMessage = (error) => {
  if (error instanceof PermissionError) {
    return error.getUserMessage();
  }

  if (isPermissionError(error)) {
    return "You don't have permission to perform this action.";
  }

  return error.message || 'An unexpected error occurred.';
};

/**
 * Create a permission error from a service response
 * @param {Object} response - API response object
 * @param {string} permission - Required permission
 * @returns {PermissionError} Appropriate permission error
 */
export const createPermissionErrorFromResponse = (response, permission = null) => {
  if (response.status === 401 || response.message?.includes('authentication')) {
    return new AuthenticationError(response.message);
  }

  if (response.status === 403 || response.message?.includes('permission')) {
    return new PermissionDeniedError(permission, null, null, { response });
  }

  return new PermissionError(response.message || 'Permission error', permission, { response });
};

/**
 * Handle permission errors with consistent logging
 * @param {Error} error - Permission error
 * @param {Object} context - Additional context for logging
 */
export const handlePermissionError = (error, context = {}) => {
  if (isPermissionError(error)) {
    console.warn('Permission Error:', {
      error: error.toJSON ? error.toJSON() : error,
      context,
    });
  } else {
    console.error('Unexpected Error in Permission Check:', error, context);
  }
};

/**
 * Create a permission wrapper that throws appropriate errors
 * @param {string} permission - Required permission
 * @param {Function} operation - Operation to wrap
 * @returns {Function} Wrapped operation
 */
export const createPermissionWrapper = (permission, operation) => {
  return async (...args) => {
    try {
      return await operation(...args);
    } catch (error) {
      // If it's already a permission error, re-throw it
      if (isPermissionError(error)) {
        throw error;
      }

      // Convert other errors to permission errors if they seem permission-related
      if (
        error.message?.includes('permission') ||
        error.message?.includes('unauthorized') ||
        error.message?.includes('forbidden')
      ) {
        throw new PermissionDeniedError(permission, null, null, { originalError: error });
      }

      // Re-throw other errors as-is
      throw error;
    }
  };
};
