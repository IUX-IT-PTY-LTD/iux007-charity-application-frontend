/**
 * Service file for handling admin authentication API requests
 */

// Make sure these environment variables are properly set in your .env.local file
const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://polished-dusk-oxhdccceltzf.on-vapor.com/api';
const version = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

// Auth token key in localStorage
const AUTH_TOKEN_KEY = 'admin_token';

/**
 * Log configuration details - helpful for debugging
 */
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('Auth API Configuration:', {
    baseUrl,
    version,
    tokenKey: AUTH_TOKEN_KEY,
  });
}

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
 * Handle API response
 * @param {Response} response - Fetch API response
 * @returns {Promise} - Promise resolving to JSON data or throwing detailed error
 */
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    // Create a more detailed error object
    const error = new Error(data.message || 'API request failed');
    error.status = response.status;
    error.statusText = response.statusText;
    error.data = data;
    throw error;
  }

  return data;
};

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - Promise resolving to user data with token
 */
export const login = async (email, password) => {
  try {
    console.log('Attempting login with:', { email, url: `${baseUrl}/admin/${version}/login` });

    const response = await fetch(`${baseUrl}/admin/${version}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      mode: 'cors',
    });

    const data = await handleResponse(response);

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
    const response = await fetch(`${baseUrl}/admin/${version}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      mode: 'cors',
    });

    const data = await handleResponse(response);

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
    const response = await fetch(`${baseUrl}/admin/${version}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
      mode: 'cors',
    });

    return await handleResponse(response);
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
    const response = await fetch(`${baseUrl}/admin/${version}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        password,
        password_confirmation: passwordConfirmation,
      }),
      mode: 'cors',
    });

    return await handleResponse(response);
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

    const response = await fetch(`${baseUrl}/admin/${version}/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      mode: 'cors',
    });

    const data = await handleResponse(response);

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

    const response = await fetch(`${baseUrl}/admin/${version}/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      mode: 'cors',
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};
