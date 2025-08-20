import { API_BASE_URL, API_VERSION } from '@/api/config';
import axios from 'axios';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Generic GET request
  async get(endpoint, options = {}) {
    try {
      const response = await axios.get(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          ...this.getAuthHeader(),
          ...options.headers,
        },
      });
      return response.data;
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  }

  // Generic POST request
  async post(endpoint, data, options = {}) {
    try {
      // Check if data is FormData
      const isFormData = data instanceof FormData;

      // Set headers appropriately
      const headers = {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
        ...this.getAuthHeader(),
        ...options.headers,
      };

      // Only add Content-Type if not FormData or if explicitly set in options
      if (!isFormData && options.headers?.['Content-Type'] !== null) {
        headers['Content-Type'] = 'application/json';
      }

      // Prepare request body based on data type
      const body = isFormData ? data : JSON.stringify(data);

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers,
        body,
      });

      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `Failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  }

  // Generic PUT request
  async put(endpoint, data, options = {}) {
    try {
      // Check if data is FormData
      const isFormData = data instanceof FormData;

      // Set headers appropriately
      const headers = {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
        ...this.getAuthHeader(),
        ...options.headers,
      };

      // Only add Content-Type if not FormData or if explicitly set in options
      if (!isFormData && options.headers?.['Content-Type'] !== null) {
        headers['Content-Type'] = 'application/json';
      }

      // Prepare request body based on data type
      const body = isFormData ? data : JSON.stringify(data);

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers,
        body,
      });

      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `Failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API PUT Error:', error);
      throw error;
    }
  }

  // Generic PATCH request
  async patch(endpoint, data, options = {}) {
    try {
      // Check if data is FormData
      const isFormData = data instanceof FormData;

      // Set headers appropriately
      const headers = {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
        ...this.getAuthHeader(),
        ...options.headers,
      };

      // Only add Content-Type if not FormData or if explicitly set in options
      if (!isFormData && options.headers?.['Content-Type'] !== null) {
        headers['Content-Type'] = 'application/json';
      }

      // Prepare request body based on data type
      const body = isFormData ? data : JSON.stringify(data);

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PATCH',
        headers,
        body,
      });

      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `Failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API PATCH Error:', error);
      throw error;
    }
  }

  // Generic DELETE request (adding for completeness)
  async delete(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
          ...this.getAuthHeader(),
          ...options.headers,
        },
      });

      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `Failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API DELETE Error:', error);
      throw error;
    }
  }

  // Get auth header
  getAuthHeader() {
    // Use try-catch to handle cases where localStorage is not available (SSR)
    try {
      const token = localStorage.getItem('adminAccessToken');
      return token ? { Authorization: `${token}` } : {};
    } catch (error) {
      console.warn('Could not access localStorage');
      return {};
    }
  }
}

export const apiService = new ApiService();
