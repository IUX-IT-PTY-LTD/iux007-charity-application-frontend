// src/api/services/app/pageBuilderService.js

import { apiService } from './apiService';
import { API_VERSION } from '@/api/config';

class PageBuilderService {
  constructor() {
    // No need for baseEndpoint since apiService already includes the version
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
      // The apiService already includes /api/v1, so we just need the page-builder path
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
export const getPageBySlug = pageBuilderService.getPageBySlug.bind(pageBuilderService);