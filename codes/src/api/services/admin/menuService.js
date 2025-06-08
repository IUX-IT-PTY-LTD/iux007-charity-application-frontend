import { apiService } from './apiService';
import { API_BASE_URL, API_VERSION } from '@/api/config';

class MenuService {
  constructor() {
    this.baseEndpoint = `admin/${API_VERSION}`;
  }

  /**
   * Get all menus
   * @returns {Promise<Object>} - Menus data
   */
  async getMenus() {
    try {
      const endpoint = `/${this.baseEndpoint}/menus`;

      console.log('Fetching menus with endpoint:', endpoint); // Debug log

      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching menus:', error);
      throw error;
    }
  }

  /**
   * Get menu details by ID
   * @param {number} menuId - Menu ID
   * @returns {Promise<Object>} - Menu details
   */
  async getMenuDetails(menuId) {
    if (!menuId) {
      throw new Error('Menu ID is required');
    }

    try {
      const endpoint = `/${this.baseEndpoint}/menus/edit/${menuId}`;
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      console.error(`Error fetching menu details for ID ${menuId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new menu
   * @param {Object} menuData - Menu data
   * @param {string} menuData.name - Menu name
   * @param {string} menuData.slug - Menu slug
   * @param {number} menuData.ordering - Menu ordering
   * @param {number} menuData.status - Menu status (0 or 1)
   * @returns {Promise<Object>} - Created menu data
   */
  async createMenu(menuData) {
    try {
      const endpoint = `/${this.baseEndpoint}/menus/create`;

      if (
        !menuData.name ||
        !menuData.slug ||
        menuData.ordering === undefined ||
        menuData.status === undefined
      ) {
        throw new Error('Name, slug, ordering, and status are required');
      }

      const response = await apiService.post(endpoint, menuData);
      return response;
    } catch (error) {
      console.error('Error creating menu:', error);
      throw error;
    }
  }

  /**
   * Update an existing menu
   * @param {number} menuId - Menu ID
   * @param {Object} menuData - Menu data to update
   * @param {string} menuData.name - Menu name
   * @param {number} menuData.ordering - Menu ordering
   * @param {number} menuData.status - Menu status (0 or 1)
   * @returns {Promise<Object>} - Updated menu data
   */
  async updateMenu(menuId, menuData) {
    if (!menuId) {
      throw new Error('Menu ID is required');
    }

    try {
      const endpoint = `/${this.baseEndpoint}/menus/update/${menuId}`;

      if (!menuData.name || menuData.ordering === undefined || menuData.status === undefined) {
        throw new Error('Name, ordering, and status are required');
      }

      const response = await apiService.put(endpoint, menuData);
      return response;
    } catch (error) {
      console.error(`Error updating menu with ID ${menuId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a menu
   * @param {number} menuId - Menu ID
   * @returns {Promise<Object>} - Deletion response
   */
  async deleteMenu(menuId) {
    if (!menuId) {
      throw new Error('Menu ID is required');
    }

    try {
      const endpoint = `/${this.baseEndpoint}/menus/delete/${menuId}`;
      const response = await apiService.delete(endpoint);
      return response;
    } catch (error) {
      console.error(`Error deleting menu with ID ${menuId}:`, error);
      throw error;
    }
  }
}

export const menuService = new MenuService();
