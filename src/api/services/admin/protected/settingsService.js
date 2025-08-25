// src/api/services/admin/protected/settingsService.js

/**
 * Protected Settings Service
 * Settings service with automatic permission checking
 */

import { contactPermissions } from '@/api/middleware/permissionMiddleware';
import { withPermissionCheck } from '@/api/middleware/permissionMiddleware';
import * as originalSettingsService from '@/api/services/admin/settingsService';

// ==================== PROTECTED CONTACT OPERATIONS ====================

/**
 * Get all contact options (requires contact_view permission)
 */
export const getAllContacts = contactPermissions.withViewPermission(
  originalSettingsService.getAllContacts,
  {
    context: { operation: 'getAllContacts' },
  }
);

/**
 * Get contact details by ID (requires contact_view permission)
 */
export const getContactById = contactPermissions.withViewPermission(
  originalSettingsService.getContactById,
  {
    context: { operation: 'getContactById' },
  }
);

/**
 * Update contact information (requires contact_edit permission)
 */
export const updateContact = contactPermissions.withEditPermission(
  originalSettingsService.updateContact,
  {
    context: { operation: 'updateContact' },
  }
);

// ==================== PROTECTED GENERAL SETTINGS OPERATIONS ====================

/**
 * Get all settings (requires admin_view permission for general settings access)
 */
export const getAllSettings = withPermissionCheck(
  'admin_view',
  originalSettingsService.getAllSettings,
  {
    context: { operation: 'getAllSettings', module: 'settings' },
  }
);

/**
 * Create a new setting (requires admin_create permission)
 */
export const createSetting = withPermissionCheck(
  'admin_create',
  originalSettingsService.createSetting,
  {
    context: { operation: 'createSetting', module: 'settings' },
  }
);

/**
 * Get setting details by ID (requires admin_view permission)
 */
export const getSettingById = withPermissionCheck(
  'admin_view',
  originalSettingsService.getSettingById,
  {
    context: { operation: 'getSettingById', module: 'settings' },
  }
);

/**
 * Update setting by ID (requires admin_edit permission)
 */
export const updateSetting = withPermissionCheck(
  'admin_edit',
  originalSettingsService.updateSetting,
  {
    context: { operation: 'updateSetting', module: 'settings' },
  }
);

// ==================== SPECIALIZED PROTECTED OPERATIONS ====================

/**
 * Update company information (requires admin_edit permission)
 * For updating company-specific settings like company_name, company_logo, etc.
 */
export const updateCompanySetting = withPermissionCheck(
  'admin_edit',
  originalSettingsService.updateSetting,
  {
    context: { operation: 'updateCompanySetting', module: 'company' },
    onDenied: (error, settingId, settingData) => {
      throw new Error('You do not have permission to update company settings');
    },
  }
);

/**
 * Update social media settings (requires admin_edit permission)
 * For updating social media links
 */
export const updateSocialMediaSetting = withPermissionCheck(
  'admin_edit',
  originalSettingsService.updateSetting,
  {
    context: { operation: 'updateSocialMediaSetting', module: 'social_media' },
    onDenied: (error, settingId, settingData) => {
      throw new Error('You do not have permission to update social media settings');
    },
  }
);

/**
 * Create social media setting (requires admin_create permission)
 */
export const createSocialMediaSetting = withPermissionCheck(
  'admin_create',
  originalSettingsService.createSetting,
  {
    context: { operation: 'createSocialMediaSetting', module: 'social_media' },
    onDenied: (error, settingData) => {
      throw new Error('You do not have permission to create social media settings');
    },
  }
);

/**
 * Update accreditation settings (requires admin_edit permission)
 * For updating ACNC logo and link
 */
export const updateAccreditationSetting = withPermissionCheck(
  'admin_edit',
  originalSettingsService.updateSetting,
  {
    context: { operation: 'updateAccreditationSetting', module: 'accreditation' },
    onDenied: (error, settingId, settingData) => {
      throw new Error('You do not have permission to update accreditation settings');
    },
  }
);

// ==================== CONVENIENCE WRAPPER FUNCTIONS ====================

/**
 * Safe contact update that handles permission gracefully
 * @param {number|string} contactId - Contact ID to update
 * @param {Object} contactData - Contact data to update
 * @returns {Promise} - Promise resolving to update result
 */
export const safeUpdateContact = async (contactId, contactData) => {
  try {
    return await updateContact(contactId, contactData);
  } catch (error) {
    if (error.message?.includes('permission')) {
      throw new Error(
        'You do not have permission to update contact information. Please contact an administrator.'
      );
    }
    throw error;
  }
};

/**
 * Safe setting update with automatic permission detection
 * @param {number|string} settingId - Setting ID to update
 * @param {Object} settingData - Setting data to update
 * @returns {Promise} - Promise resolving to update result
 */
export const safeUpdateSetting = async (settingId, settingData) => {
  try {
    // Determine which type of setting this is based on the key
    const key = settingData.key?.toLowerCase() || '';

    const companyKeys = ['company_name', 'company_logo', 'customer_inquiry_email'];
    const socialKeys = ['facebook_link', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok'];
    const accreditationKeys = ['acnc_logo', 'acnc_link'];

    if (companyKeys.some((companyKey) => key.includes(companyKey))) {
      return await updateCompanySetting(settingId, settingData);
    } else if (socialKeys.some((socialKey) => key.includes(socialKey))) {
      return await updateSocialMediaSetting(settingId, settingData);
    } else if (accreditationKeys.some((accKey) => key.includes(accKey))) {
      return await updateAccreditationSetting(settingId, settingData);
    } else {
      // Default to general setting update
      return await updateSetting(settingId, settingData);
    }
  } catch (error) {
    if (error.message?.includes('permission')) {
      throw new Error(
        'You do not have permission to update this setting. Please contact an administrator.'
      );
    }
    throw error;
  }
};

/**
 * Safe setting creation with automatic permission detection
 * @param {Object} settingData - Setting data to create
 * @returns {Promise} - Promise resolving to creation result
 */
export const safeCreateSetting = async (settingData) => {
  try {
    const key = settingData.key?.toLowerCase() || '';
    const socialKeys = ['facebook_link', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok'];

    if (socialKeys.some((socialKey) => key.includes(socialKey))) {
      return await createSocialMediaSetting(settingData);
    } else {
      // Default to general setting creation
      return await createSetting(settingData);
    }
  } catch (error) {
    if (error.message?.includes('permission')) {
      throw new Error(
        'You do not have permission to create this setting. Please contact an administrator.'
      );
    }
    throw error;
  }
};

// ==================== UTILITY FUNCTIONS (NO PERMISSION REQUIRED) ====================

/**
 * Validate contact data before submission (utility function - no permission required)
 */
export const validateContactData = originalSettingsService.validateContactData;

/**
 * Validate setting data before submission (utility function - no permission required)
 */
export const validateSettingData = originalSettingsService.validateSettingData;

/**
 * Format contact data for API submission (utility function - no permission required)
 */
export const formatContactDataForSubmission =
  originalSettingsService.formatContactDataForSubmission;

/**
 * Format setting data for API submission (utility function - no permission required)
 */
export const formatSettingDataForSubmission =
  originalSettingsService.formatSettingDataForSubmission;

/**
 * Check if URL is valid (utility function - no permission required)
 */
export const isValidUrl = originalSettingsService.isValidUrl;

/**
 * Get settings by key (utility function - no permission required)
 */
export const getSettingByKey = originalSettingsService.getSettingByKey;

/**
 * Get settings by type (utility function - no permission required)
 */
export const getSettingsByType = originalSettingsService.getSettingsByType;

/**
 * Get social media settings (utility function - no permission required)
 */
export const getSocialMediaSettings = originalSettingsService.getSocialMediaSettings;

/**
 * Get accreditation settings (utility function - no permission required)
 */
export const getAccreditationSettings = originalSettingsService.getAccreditationSettings;

/**
 * Prepare contact data for form editing (utility function - no permission required)
 */
export const prepareContactDataForForm = originalSettingsService.prepareContactDataForForm;

/**
 * Prepare setting data for form editing (utility function - no permission required)
 */
export const prepareSettingDataForForm = originalSettingsService.prepareSettingDataForForm;
