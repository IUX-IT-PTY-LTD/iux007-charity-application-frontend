import { apiService } from './apiService';
import { API_BASE_URL, API_VERSION } from '@/api/config';
import { getAuthToken } from './authService';

class UserService {
  constructor() {
    this.baseEndpoint = `admin/${API_VERSION}`;
  }

  /**
   * Get users with pagination and optional name filter
   * @param {Object} params - Query parameters
   * @param {number} [params.current_page=1] - Current page number
   * @param {number} [params.per_page=10] - Items per page
   * @param {string} [params.name] - Optional name filter
   * @returns {Promise<Object>} - Users data with pagination
   */
  async getUsers(params = {}) {
    try {
      if (!getAuthToken()) {
        throw new Error('Authentication required. Please log in.');
      }

      // Set default values
      const queryParams = {
        current_page: 1,
        per_page: 10,
        ...params,
      };

      // Build query string
      const queryString = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryString.append(key, value);
        }
      });

      const endpoint = `/${this.baseEndpoint}/users${queryString.toString() ? `?${queryString.toString()}` : ''}`;

      console.log('Fetching users with endpoint:', endpoint); // Debug log

      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Get user details by ID
   * @param {number} userId - User ID
   * @returns {Promise<Object>} - User details
   */
  async getUserDetails(userId) {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const endpoint = `/${this.baseEndpoint}/users/details/${userId}`;
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      console.error(`Error fetching user details for ID ${userId}:`, error);
      throw error;
    }
  }
}

export const userService = new UserService();
