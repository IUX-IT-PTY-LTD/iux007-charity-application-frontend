// src/api/services/admin/fileUploadService.js

import { apiService } from './apiService';
import { getAuthToken } from './authService';

// API version - match what's in your environment
const version = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

export const ALLOWED_FILE_EXTENSIONS = [
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'zip',
  'jpeg', 'jpg', 'png', 'gif', 'webp', 'svg',
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB, matches backend validation

const getExtension = (name = '') => name.split('.').pop().toLowerCase();

/**
 * Validate a page builder file before upload
 * @param {File} file
 * @returns {Object} - Validation result with isValid boolean and error message
 */
export const validatePageFile = (file) => {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }

  if (!ALLOWED_FILE_EXTENSIONS.includes(getExtension(file.name))) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed: ${ALLOWED_FILE_EXTENSIONS.join(', ').toUpperCase()}`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: 'File size too large. Maximum size is 5MB' };
  }

  return { isValid: true, error: null };
};

/**
 * Upload a file (PDF, image, document, etc.) to storage
 * @param {File} file
 * @returns {Promise} - Promise resolving to upload response with file path
 */
export const uploadPageFile = async (file) => {
  if (!getAuthToken()) {
    throw new Error('Authentication required. Please log in.');
  }

  const validation = validatePageFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const formData = new FormData();
  formData.append('file', file);

  return await apiService.post(`/admin/${version}/upload/file`, formData);
};

/**
 * Delete an uploaded page builder file from storage
 * @param {string} filePath
 */
export const deletePageFile = async (filePath) => {
  if (!getAuthToken()) {
    throw new Error('Authentication required. Please log in.');
  }

  if (!filePath) {
    throw new Error('No file path provided for deletion');
  }

  return await apiService.post(`/admin/${version}/upload/file/delete`, { filePath });
};
