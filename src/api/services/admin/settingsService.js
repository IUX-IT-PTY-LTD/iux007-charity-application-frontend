// src/api/services/admin/settingsService.js

import { apiService } from './apiService';
import { getAuthToken } from './authService';

// API version - match what's in your environment
const version = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

// ==================== CONTACT US OPERATIONS ====================

/**
 * Get all contact options
 * @returns {Promise} - Promise resolving to array of contact options
 */
export const getAllContacts = async () => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    return await apiService.get(`/admin/${version}/contact-us`);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
};

/**
 * Get contact details by ID
 * @param {number|string} contactId - ID of the contact to fetch
 * @returns {Promise} - Promise resolving to contact details
 */
export const getContactById = async (contactId) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    if (!contactId) {
      throw new Error('Contact ID is required.');
    }

    return await apiService.get(`/admin/${version}/contact-us/edit/${contactId}`);
  } catch (error) {
    console.error('Error fetching contact details:', error);
    throw error;
  }
};

/**
 * Update contact information
 * @param {number|string} contactId - ID of the contact to update
 * @param {Object} contactData - Contact data to be updated
 * @returns {Promise} - Promise resolving to the updated contact
 */
export const updateContact = async (contactId, contactData) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    if (!contactId) {
      throw new Error('Contact ID is required.');
    }

    // Validate required fields
    const validation = validateContactData(contactData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Format data for API submission
    const formattedData = formatContactDataForSubmission(contactData);

    return await apiService.put(`/admin/${version}/contact-us/update/${contactId}`, formattedData);
  } catch (error) {
    console.error('Error updating contact:', error);
    throw error;
  }
};

// ==================== GENERAL SETTINGS OPERATIONS ====================

/**
 * Get all settings
 * @returns {Promise} - Promise resolving to array of settings
 */
export const getAllSettings = async () => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    return await apiService.get(`/admin/${version}/settings`);
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};

/**
 * Create a new setting (only for social links)
 * @param {Object} settingData - Setting data to be created
 * @returns {Promise} - Promise resolving to the created setting
 */
export const createSetting = async (settingData) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    // Validate required fields
    const validation = validateSettingData(settingData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Format data for API submission
    const formattedData = formatSettingDataForSubmission(settingData);

    return await apiService.post(`/admin/${version}/settings/create`, formattedData);
  } catch (error) {
    console.error('Error creating setting:', error);
    throw error;
  }
};

/**
 * Get setting details by ID
 * @param {number|string} settingId - ID of the setting to fetch
 * @returns {Promise} - Promise resolving to setting details
 */
export const getSettingById = async (settingId) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    if (!settingId) {
      throw new Error('Setting ID is required.');
    }

    return await apiService.get(`/admin/${version}/settings/edit/${settingId}`);
  } catch (error) {
    console.error('Error fetching setting details:', error);
    throw error;
  }
};

/**
 * Update setting by ID
 * @param {number|string} settingId - ID of the setting to update
 * @param {Object} settingData - Setting data to be updated
 * @returns {Promise} - Promise resolving to the updated setting
 */
export const updateSetting = async (settingId, settingData) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    if (!settingId) {
      throw new Error('Setting ID is required.');
    }

    // Validate required fields
    const validation = validateSettingData(settingData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Format data for API submission
    const formattedData = formatSettingDataForSubmission(settingData);

    return await apiService.put(`/admin/${version}/settings/update/${settingId}`, formattedData);
  } catch (error) {
    console.error('Error updating setting:', error);
    throw error;
  }
};

// ==================== VALIDATION FUNCTIONS ====================

/**
 * Validate contact data before submission
 * @param {Object} contactData - Contact data to validate
 * @returns {Object} - Object with isValid boolean and errors array
 */
export const validateContactData = (contactData) => {
  const errors = [];

  // Required fields based on API specification
  const requiredFields = ['name', 'value', 'status'];
  requiredFields.forEach((field) => {
    if (
      contactData[field] === undefined ||
      contactData[field] === null ||
      contactData[field] === ''
    ) {
      errors.push(`${field.replace('_', ' ')} is required`);
    }
  });

  // Name validation
  if (contactData.name && contactData.name.trim().length < 2) {
    errors.push('Contact name must be at least 2 characters long');
  }

  // Value validation
  if (contactData.value && contactData.value.trim().length < 1) {
    errors.push('Contact value cannot be empty');
  }

  // Status validation
  if (contactData.status !== undefined && contactData.status !== null) {
    const status = Number(contactData.status);
    if (isNaN(status) || (status !== 0 && status !== 1)) {
      errors.push('Status must be either 0 (inactive) or 1 (active)');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate setting data before submission
 * @param {Object} settingData - Setting data to validate
 * @returns {Object} - Object with isValid boolean and errors array
 */
export const validateSettingData = (settingData) => {
  const errors = [];

  // Required fields based on API specification
  const requiredFields = ['key', 'value', 'type', 'status'];
  requiredFields.forEach((field) => {
    if (
      settingData[field] === undefined ||
      settingData[field] === null ||
      settingData[field] === ''
    ) {
      errors.push(`${field.replace('_', ' ')} is required`);
    }
  });

  // Key validation
  if (settingData.key && settingData.key.trim().length < 2) {
    errors.push('Setting key must be at least 2 characters long');
  }

  // Value validation
  if (settingData.value && settingData.value.trim().length < 1) {
    errors.push('Setting value cannot be empty');
  }

  // URL validation for specific keys
  const urlKeys = ['facebook_link', 'instagram', 'twitter', 'linkedin', 'youtube', 'acnc_link'];
  if (settingData.key && urlKeys.includes(settingData.key.toLowerCase())) {
    if (settingData.value && !isValidUrl(settingData.value)) {
      errors.push('Please enter a valid URL');
    }
  }

  // Status validation
  if (settingData.status !== undefined && settingData.status !== null) {
    const status = Number(settingData.status);
    if (isNaN(status) || (status !== 0 && status !== 1)) {
      errors.push('Status must be either 0 (inactive) or 1 (active)');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ==================== FORMATTING FUNCTIONS ====================

/**
 * Format contact data for API submission
 * @param {Object} data - Contact data from form
 * @returns {Object} - Formatted data for API
 */
export const formatContactDataForSubmission = (data) => {
  const formattedData = { ...data };

  // Trim string fields
  if (formattedData.name && typeof formattedData.name === 'string') {
    formattedData.name = formattedData.name.trim();
  }

  if (formattedData.value && typeof formattedData.value === 'string') {
    formattedData.value = formattedData.value.trim();
  }

  // Ensure icon field exists (can be empty string or null)
  if (!formattedData.hasOwnProperty('icon')) {
    formattedData.icon = '';
  }

  // Convert status to number if it's a string
  if (typeof formattedData.status === 'string') {
    formattedData.status = parseInt(formattedData.status, 10);
  }

  return formattedData;
};

/**
 * Format setting data for API submission
 * @param {Object} data - Setting data from form
 * @returns {Object} - Formatted data for API
 */
export const formatSettingDataForSubmission = (data) => {
  const formattedData = { ...data };

  // Trim string fields
  if (formattedData.key && typeof formattedData.key === 'string') {
    formattedData.key = formattedData.key.trim();
  }

  if (formattedData.value && typeof formattedData.value === 'string') {
    formattedData.value = formattedData.value.trim();
  }

  if (formattedData.type && typeof formattedData.type === 'string') {
    formattedData.type = formattedData.type.trim();
  }

  // Convert status to number if it's a string
  if (typeof formattedData.status === 'string') {
    formattedData.status = parseInt(formattedData.status, 10);
  }

  return formattedData;
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Check if a string is a valid URL
 * @param {string} string - String to validate
 * @returns {boolean} - True if valid URL
 */
export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

/**
 * Get settings by key
 * @param {Array} settings - Array of settings
 * @param {string} key - Setting key to find
 * @returns {Object|null} - Setting object or null if not found
 */
export const getSettingByKey = (settings, key) => {
  if (!Array.isArray(settings) || !key) return null;
  return settings.find((setting) => setting.key === key) || null;
};

/**
 * Filter settings by type
 * @param {Array} settings - Array of settings
 * @param {string} type - Type to filter by
 * @returns {Array} - Filtered settings array
 */
export const getSettingsByType = (settings, type) => {
  if (!Array.isArray(settings)) return [];
  return settings.filter((setting) => setting.type === type);
};

/**
 * Get social media settings
 * @param {Array} settings - Array of settings
 * @returns {Array} - Social media settings
 */
export const getSocialMediaSettings = (settings) => {
  if (!Array.isArray(settings)) return [];
  const socialKeys = ['facebook_link', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok'];
  return settings.filter((setting) =>
    socialKeys.some((key) => setting.key.toLowerCase().includes(key.toLowerCase()))
  );
};

/**
 * Get accreditation settings (ACNC)
 * @param {Array} settings - Array of settings
 * @returns {Object} - Object with acnc_logo and acnc_link settings
 */
export const getAccreditationSettings = (settings) => {
  if (!Array.isArray(settings)) return { logo: null, link: null };

  const acncLogo = settings.find((setting) => setting.key === 'acnc_logo');
  const acncLink = settings.find((setting) => setting.key === 'acnc_link');

  return {
    logo: acncLogo || null,
    link: acncLink || null,
  };
};

/**
 * Prepare contact data for form editing
 * @param {Object} contactData - Raw contact data from API
 * @returns {Object} - Formatted data for form
 */
export const prepareContactDataForForm = (contactData) => {
  if (!contactData) return {};

  return {
    name: contactData.name || '',
    value: contactData.value || '',
    icon: contactData.icon || '',
    status: contactData.status !== undefined ? contactData.status : 1,
    id: contactData.id,
  };
};

/**
 * Prepare setting data for form editing
 * @param {Object} settingData - Raw setting data from API
 * @returns {Object} - Formatted data for form
 */
export const prepareSettingDataForForm = (settingData) => {
  if (!settingData) return {};

  return {
    key: settingData.key || '',
    value: settingData.value || '',
    type: settingData.type || 'text',
    status: settingData.status !== undefined ? settingData.status : 1,
    id: settingData.id,
  };
};
