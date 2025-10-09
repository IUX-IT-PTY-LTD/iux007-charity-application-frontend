// src/api/services/admin/imageUploadService.js

import { apiService } from './apiService';
import { getAuthToken } from './authService';

// API version - match what's in your environment
const version = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

/**
 * Upload an image file to S3 storage
 * @param {File} file - Image file to upload
 * @returns {Promise} - Promise resolving to upload response with file path
 */
export const uploadImage = async (file) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    if (!file) {
      throw new Error('No file provided for upload');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload an image file (JPEG, PNG, GIF, WebP, SVG)');
    }

    // Validate file size (max 2MB for base64 upload)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 2MB');
    }

    // Convert file to base64
    const base64String = await convertFileToBase64(file);

    // Send base64 data to backend
    return await apiService.post(`/admin/${version}/upload/image`, {
      image: base64String
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Convert file to base64 string (fallback method)
 * @param {File} file - Image file to convert
 * @returns {Promise<string>} - Promise resolving to base64 string
 */
export const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Validate image file before upload
 * @param {File} file - Image file to validate
 * @returns {Object} - Validation result with isValid boolean and error message
 */
export const validateImageFile = (file) => {
  if (!file) {
    return {
      isValid: false,
      error: 'No file selected'
    };
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Please upload an image file (JPEG, PNG, GIF, WebP, SVG)'
    };
  }

  // Check file size (max 2MB for base64 upload)
  const maxSize = 2 * 1024 * 1024; // 2MB in bytes
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size too large. Maximum size is 2MB'
    };
  }

  return {
    isValid: true,
    error: null
  };
};

/**
 * Delete an uploaded image from S3 storage
 * @param {string} filePath - Path of the image to delete
 * @returns {Promise} - Promise resolving to deletion response
 */
export const deleteImage = async (filePath) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    if (!filePath) {
      throw new Error('No file path provided for deletion');
    }

    // Call delete API - use POST method for deletion with JSON body
    return await apiService.post(`/admin/${version}/upload/image/delete`, {
      filePath: filePath
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};