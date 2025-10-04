// src/api/services/admin/pageBuilderService.js

import { apiService } from './apiService';
import { API_BASE_URL, API_VERSION } from '@/api/config';
import { getAuthToken } from './authService';

class PageBuilderService {
  constructor() {
    this.baseEndpoint = `admin/${API_VERSION}`;
  }

  /**
   * Get all pages
   * @returns {Promise<Object>} - Pages data
   */
  async getPages() {
    try {
      if (!getAuthToken()) {
        throw new Error('Authentication required. Please log in.');
      }

      const endpoint = `/${this.baseEndpoint}/page-builder`;

      console.log('Fetching pages with endpoint:', endpoint); // Debug log

      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching pages:', error);
      throw error;
    }
  }

  /**
   * Get page details by ID
   * @param {number} pageId - Page ID
   * @returns {Promise<Object>} - Page details
   */
  async getPageDetails(pageId) {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    if (!pageId) {
      throw new Error('Page ID is required');
    }

    try {
      const endpoint = `/${this.baseEndpoint}/page-builder/edit/${pageId}`;
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      console.error(`Error fetching page details for ID ${pageId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new page
   * @param {Object} pageData - Page data
   * @param {string} pageData.title - Page title
   * @param {string} pageData.slug - Page slug
   * @param {Array} pageData.content_data - Page content data (components)
   * @param {string} pageData.meta_title - Meta title (optional)
   * @param {string} pageData.meta_description - Meta description (optional)
   * @param {boolean} pageData.status - Page status
   * @returns {Promise<Object>} - Created page data
   */
  async createPage(pageData) {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    try {
      const endpoint = `/${this.baseEndpoint}/page-builder/create`;

      if (!pageData.title || !pageData.slug || !pageData.content_data) {
        throw new Error('Title, slug, and content_data are required');
      }

      // Ensure content_data is an array
      if (!Array.isArray(pageData.content_data)) {
        throw new Error('content_data must be an array');
      }

      const response = await apiService.post(endpoint, pageData);
      return response;
    } catch (error) {
      console.error('Error creating page:', error);
      throw error;
    }
  }

  /**
   * Update an existing page
   * @param {number} pageId - Page ID
   * @param {Object} pageData - Page data to update
   * @param {string} pageData.title - Page title
   * @param {string} pageData.slug - Page slug
   * @param {Array} pageData.content_data - Page content data (components)
   * @param {string} pageData.meta_title - Meta title (optional)
   * @param {string} pageData.meta_description - Meta description (optional)
   * @param {boolean} pageData.status - Page status
   * @returns {Promise<Object>} - Updated page data
   */
  async updatePage(pageId, pageData) {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    if (!pageId) {
      throw new Error('Page ID is required');
    }

    try {
      const endpoint = `/${this.baseEndpoint}/page-builder/update/${pageId}`;

      if (!pageData.title || !pageData.slug || !pageData.content_data) {
        throw new Error('Title, slug, and content_data are required');
      }

      // Ensure content_data is an array
      if (!Array.isArray(pageData.content_data)) {
        throw new Error('content_data must be an array');
      }

      const response = await apiService.put(endpoint, pageData);
      return response;
    } catch (error) {
      console.error(`Error updating page with ID ${pageId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a page
   * @param {number} pageId - Page ID
   * @returns {Promise<Object>} - Deletion response
   */
  async deletePage(pageId) {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }
    
    if (!pageId) {
      throw new Error('Page ID is required');
    }

    try {
      const endpoint = `/${this.baseEndpoint}/page-builder/delete/${pageId}`;
      const response = await apiService.delete(endpoint);
      return response;
    } catch (error) {
      console.error(`Error deleting page with ID ${pageId}:`, error);
      throw error;
    }
  }

  /**
   * Get page by slug (for public viewing)
   * @param {string} slug - Page slug
   * @returns {Promise<Object>} - Page data
   */
  async getPageBySlug(slug) {
    if (!slug) {
      throw new Error('Page slug is required');
    }

    try {
      // Use public endpoint for page viewing (apiService already includes /api/v1)
      const endpoint = `/page-builder/view/${slug}`;
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      console.error(`Error fetching page with slug ${slug}:`, error);
      throw error;
    }
  }
}

export const pageBuilderService = new PageBuilderService();

// Export individual functions for easier imports (bound to maintain context)
export const getPages = pageBuilderService.getPages.bind(pageBuilderService);
export const getPageDetails = pageBuilderService.getPageDetails.bind(pageBuilderService);
export const createPage = pageBuilderService.createPage.bind(pageBuilderService);
export const updatePage = pageBuilderService.updatePage.bind(pageBuilderService);
export const deletePage = pageBuilderService.deletePage.bind(pageBuilderService);
export const getPageBySlug = pageBuilderService.getPageBySlug.bind(pageBuilderService);