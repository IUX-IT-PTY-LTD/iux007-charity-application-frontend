/**
 * Service file for handling slider-related API requests
 * Integrated with the application's apiService
 */

import { apiService } from './apiService';
import { getAuthToken } from './authService';

// API version - match what's in your environment
const version = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

/**
 * Create a new slider
 * @param {Object} sliderData - Slider data to be created
 * @returns {Promise} - Promise resolving to the created slider
 */
export const createSlider = async (sliderData) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    return await apiService.post(`/admin/${version}/sliders/create`, sliderData);
  } catch (error) {
    console.error('Error creating slider:', error);
    throw error;
  }
};

/**
 * Get all sliders
 * @returns {Promise} - Promise resolving to array of sliders
 */
export const getAllSliders = async () => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    return await apiService.get(`/admin/${version}/sliders`);
  } catch (error) {
    console.error('Error fetching sliders:', error);
    throw error;
  }
};

/**
 * Update an existing slider
 * @param {number|string} sliderId - ID of the slider to update
 * @param {Object} sliderData - Updated slider data
 * @returns {Promise} - Promise resolving to the updated slider
 */
export const updateSlider = async (sliderId, sliderData) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    return await apiService.put(`/admin/${version}/sliders/update/${sliderId}`, sliderData);
  } catch (error) {
    console.error('Error updating slider:', error);
    throw error;
  }
};

/**
 * Update the status of a slider
 * @param {number|string} sliderId - ID of the slider to update
 * @param {number} status - New status (0 for inactive, 1 for active)
 * @returns {Promise} - Promise resolving to the updated slider status
 */
export const updateSliderStatus = async (sliderId, status) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    return await apiService.patch(`/admin/${version}/sliders/${sliderId}/status`, { status });
  } catch (error) {
    console.error('Error updating slider status:', error);
    throw error;
  }
};

/**
 * Delete a slider
 * @param {number|string} sliderId - ID of the slider to delete
 * @returns {Promise} - Promise resolving to the deletion result
 */
export const deleteSlider = async (sliderId) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    return await apiService.delete(`/admin/${version}/sliders/delete/${sliderId}`);
  } catch (error) {
    console.error('Error deleting slider:', error);
    throw error;
  }
};

/**
 * Validate slider data before submission
 * @param {Object} sliderData - Slider data to validate
 * @returns {Object} - Object with isValid boolean and errors array
 */
export const validateSliderData = (sliderData) => {
  const errors = [];

  // Required fields
  const requiredFields = ['title', 'ordering', 'status'];
  requiredFields.forEach((field) => {
    if (sliderData[field] === undefined || sliderData[field] === null || sliderData[field] === '') {
      errors.push(`${field.replace('_', ' ')} is required`);
    }
  });

  // Ordering must be a positive integer
  if (sliderData.ordering !== undefined && sliderData.ordering !== null) {
    const ordering = Number(sliderData.ordering);
    if (isNaN(ordering) || ordering <= 0 || !Number.isInteger(ordering)) {
      errors.push('Ordering must be a positive integer');
    }
  }

  // Status validation
  if (sliderData.status !== undefined && sliderData.status !== null) {
    const status = Number(sliderData.status);
    if (isNaN(status) || (status !== 0 && status !== 1)) {
      errors.push('Status must be either 0 (inactive) or 1 (active)');
    }
  }

  // Image validation for new sliders
  if (!sliderData.id && !sliderData.image) {
    errors.push('Image is required for new sliders');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Format slider data for API submission
 * @param {Object} data - Slider data from form
 * @returns {Object} - Formatted data for API
 */
export const formatSliderDataForSubmission = (data) => {
  // Create a new object to avoid mutating the original
  const formattedData = { ...data };

  // Convert status to number if it's a string
  if (typeof formattedData.status === 'string') {
    formattedData.status = parseInt(formattedData.status, 10);
  }

  // Convert ordering to number if it's a string
  if (typeof formattedData.ordering === 'string') {
    formattedData.ordering = parseInt(formattedData.ordering, 10);
  }

  return formattedData;
};

/**
 * Checks if an ordering number is already in use
 * @param {number} ordering - The ordering number to check
 * @param {Array} existingSliders - Array of existing sliders
 * @param {number|string|null} currentSliderId - ID of the current slider (for updates)
 * @returns {boolean} - True if ordering is already in use
 */
export const isOrderingInUse = (ordering, existingSliders, currentSliderId = null) => {
  return existingSliders.some(
    (slider) =>
      slider.ordering === ordering &&
      (currentSliderId === null || slider.id !== parseInt(currentSliderId, 10))
  );
};

/**
 * Get the next available ordering number
 * @param {Array} existingSliders - Array of existing sliders
 * @returns {number} - Next available ordering number
 */
export const getNextAvailableOrdering = (existingSliders) => {
  if (!existingSliders || existingSliders.length === 0) {
    return 1;
  }

  const maxOrdering = Math.max(...existingSliders.map((slider) => slider.ordering));
  return maxOrdering + 1;
};

/**
 * Prepare image data for API submission
 * Either a base64 string for new uploads or the existing URL for unchanged images
 * @param {File|string|null} imageData - The image data (File object, base64 string, or URL)
 * @returns {string|null} - Formatted image data for API
 */
export const prepareImageForSubmission = async (imageData) => {
  // If no image data, return null
  if (!imageData) return null;

  // If image is already a string (URL or base64), return it as is
  if (typeof imageData === 'string') {
    // If it's a URL (not base64), return as is
    if (imageData.startsWith('http')) {
      return imageData;
    }
    // If it's already base64, return as is
    return imageData;
  }

  // If image is a File object, convert to base64
  if (imageData instanceof File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(imageData);
    });
  }

  return null;
};
