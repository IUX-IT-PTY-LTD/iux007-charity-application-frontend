// src/api/services/app/aboutUsService.js
import { ENDPOINTS } from '@/api/config';

import { apiService } from './apiService';

const version = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

/**
 * Get About Us content for frontend display
 * @returns {Promise} - Promise resolving to About Us content
 */
export const getAboutUsContent = async () => {
  try {
    return await apiService.get(`${ENDPOINTS.COMMON.ABOUT_US}`);
  } catch (error) {
    console.error('Error fetching About Us content:', error);
    throw error;
  }
};