// src/api/services/admin/aboutUsService.js

import { apiService } from './apiService';
import { getAuthToken } from './authService';

// API version - match what's in your environment
const version = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

/**
 * Get About Us content
 * @returns {Promise} - Promise resolving to About Us content
 */
export const getAboutUsContent = async () => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    return await apiService.get(`/admin/${version}/about-us`);
  } catch (error) {
    console.error('Error fetching About Us content:', error);
    throw error;
  }
};

/**
 * Update About Us content
 * @param {Object} formData - Complete About Us data object
 * @returns {Promise} - Promise resolving to the update result
 */
export const updateAboutUsContent = async (formData) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    // Validate and clean the form data before submission
    const cleanedData = formatAboutUsDataForSubmission(formData);
    
    return await apiService.post(`/admin/${version}/about-us`, cleanedData);
  } catch (error) {
    console.error('Error updating About Us content:', error);
    throw error;
  }
};

/**
 * Validate About Us form data before submission
 * @param {Object} formData - Complete form data object
 * @returns {Object} - Object with isValid boolean and errors array
 */
export const validateAboutUsContent = (formData) => {
  const errors = [];

  // Required field validation
  if (!formData.title || formData.title.trim() === '') {
    errors.push('Organization title is required');
  }

  if (!formData.description || formData.description.trim() === '') {
    errors.push('Organization description is required');
  }

  // Length validations
  if (formData.title && formData.title.length > 255) {
    errors.push('Title cannot exceed 255 characters');
  }

  // Status validation
  if (formData.status !== undefined && ![0, 1].includes(formData.status)) {
    errors.push('Status must be 0 (inactive) or 1 (active)');
  }

  // Team members validation
  if (formData.members && formData.members.length > 50) {
    errors.push('Cannot have more than 50 team members');
  }

  // Validate individual team members
  if (formData.members) {
    formData.members.forEach((member, index) => {
      // Required fields when member exists
      if (member.name && member.name.trim() === '') {
        errors.push(`Team member ${index + 1}: Name is required`);
      }
      if (member.position && member.position.trim() === '') {
        errors.push(`Team member ${index + 1}: Position is required`);
      }
      
      // Length validations
      if (member.name && member.name.length > 255) {
        errors.push(`Team member ${index + 1}: Name cannot exceed 255 characters`);
      }
      if (member.position && member.position.length > 255) {
        errors.push(`Team member ${index + 1}: Position cannot exceed 255 characters`);
      }
      if (member.email && member.email.length > 255) {
        errors.push(`Team member ${index + 1}: Email cannot exceed 255 characters`);
      }
      if (member.phone && member.phone.length > 20) {
        errors.push(`Team member ${index + 1}: Phone cannot exceed 20 characters`);
      }
      if (member.linkedin && member.linkedin.length > 255) {
        errors.push(`Team member ${index + 1}: LinkedIn URL cannot exceed 255 characters`);
      }
      if (member.twitter && member.twitter.length > 255) {
        errors.push(`Team member ${index + 1}: Twitter URL cannot exceed 255 characters`);
      }
      
      // Format validations
      if (member.email && !isValidEmail(member.email)) {
        errors.push(`Team member ${index + 1}: Invalid email format`);
      }
      if (member.linkedin && !isValidUrl(member.linkedin)) {
        errors.push(`Team member ${index + 1}: Invalid LinkedIn URL format`);
      }
      if (member.twitter && !isValidUrl(member.twitter)) {
        errors.push(`Team member ${index + 1}: Invalid Twitter URL format`);
      }
      
      // Sort order validation
      if (member.sort_order !== undefined && (member.sort_order < 0 || !Number.isInteger(member.sort_order))) {
        errors.push(`Team member ${index + 1}: Sort order must be a non-negative integer`);
      }
      
      // Status validation
      if (member.status !== undefined && ![0, 1].includes(member.status)) {
        errors.push(`Team member ${index + 1}: Status must be 0 (inactive) or 1 (active)`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
const isValidEmail = (email) => {
  if (!email) return true; // Email is optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid URL
 */
const isValidUrl = (url) => {
  if (!url) return true; // URL is optional
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Clean and format About Us form data for submission
 * @param {Object} formData - Raw form data
 * @returns {Object} - Cleaned data for API
 */
export const formatAboutUsDataForSubmission = (formData) => {
  if (!formData) return {};

  const cleanedData = {
    title: sanitizeText(formData.title),
    description: sanitizeText(formData.description),
    mission: sanitizeText(formData.mission) || null,
    vision: sanitizeText(formData.vision) || null,
    values: sanitizeText(formData.values) || null,
    image: formData.image || null,
    status: formData.status !== undefined ? formData.status : 1,
    members: (formData.members || []).map(member => ({
      id: member.id || null,
      name: sanitizeText(member.name),
      position: sanitizeText(member.position),
      bio: sanitizeText(member.bio) || null,
      image: member.image || null,
      email: sanitizeEmail(member.email) || null,
      phone: sanitizeText(member.phone) || null,
      linkedin: sanitizeUrl(member.linkedin) || null,
      twitter: sanitizeUrl(member.twitter) || null,
      sort_order: member.sort_order || 0,
      status: member.status !== undefined ? member.status : 1
    }))
  };

  return cleanedData;
};

/**
 * Sanitize text content
 * @param {string} text - Text to sanitize
 * @returns {string} - Sanitized text
 */
const sanitizeText = (text) => {
  if (!text) return '';
  
  // Remove any HTML tags for security
  let cleanText = text.replace(/<[^>]*>/gi, '');
  
  // Remove any script-like content
  cleanText = cleanText.replace(/javascript:/gi, '');
  
  // Trim whitespace
  cleanText = cleanText.trim();

  return cleanText;
};

/**
 * Sanitize email content
 * @param {string} email - Email to sanitize
 * @returns {string} - Sanitized email
 */
const sanitizeEmail = (email) => {
  if (!email) return '';
  
  // Remove any non-email characters except @, ., -, _
  let cleanEmail = email.replace(/[^a-zA-Z0-9@.\-_]/g, '').toLowerCase();
  
  return cleanEmail;
};

/**
 * Sanitize URL content
 * @param {string} url - URL to sanitize
 * @returns {string} - Sanitized URL
 */
const sanitizeUrl = (url) => {
  if (!url) return '';
  
  // Basic URL sanitization - remove dangerous protocols
  let cleanUrl = url.replace(/javascript:/gi, '').replace(/data:/gi, '');
  
  return cleanUrl.trim();
};

/**
 * Generate a preview summary from About Us data
 * @param {Object} formData - About Us form data
 * @returns {string} - Preview text
 */
export const generateAboutUsPreview = (formData) => {
  if (!formData) return '';
  
  let preview = '';
  
  if (formData.title) {
    preview += formData.title;
  }
  
  if (formData.description) {
    if (preview) preview += ' - ';
    preview += formData.description.substring(0, 200);
  }
  
  return preview.trim();
};

/**
 * Get total content length for About Us data
 * @param {Object} formData - About Us form data
 * @returns {number} - Total character count
 */
export const getTotalContentLength = (formData) => {
  if (!formData) return 0;
  
  let totalLength = 0;
  
  // Basic content
  totalLength += (formData.title || '').length;
  totalLength += (formData.description || '').length;
  totalLength += (formData.mission || '').length;
  totalLength += (formData.vision || '').length;
  totalLength += (formData.values || '').length;
  
  // Team member content
  if (formData.members) {
    totalLength += formData.members.reduce((sum, member) => {
      return sum + 
        (member.name || '').length + 
        (member.position || '').length + 
        (member.bio || '').length;
    }, 0);
  }
  
  return totalLength;
};

/**
 * Check if About Us data is complete
 * @param {Object} formData - About Us form data
 * @returns {Object} - Completion status and missing fields
 */
export const checkAboutUsCompletion = (formData) => {
  const missingFields = [];
  const recommendedFields = [];
  
  // Required fields
  if (!formData.title || formData.title.trim() === '') {
    missingFields.push('Organization Title');
  }
  
  if (!formData.description || formData.description.trim() === '') {
    missingFields.push('Organization Description');
  }
  
  // Recommended fields
  if (!formData.mission || formData.mission.trim() === '') {
    recommendedFields.push('Mission Statement');
  }
  
  if (!formData.vision || formData.vision.trim() === '') {
    recommendedFields.push('Vision Statement');
  }
  
  if (!formData.image) {
    recommendedFields.push('Hero Image');
  }
  
  if (!formData.members || formData.members.length === 0) {
    recommendedFields.push('Team Members');
  }
  
  const isComplete = missingFields.length === 0;
  const completionPercentage = Math.round(
    ((6 - missingFields.length - recommendedFields.length) / 6) * 100
  );
  
  return {
    isComplete,
    completionPercentage,
    missingFields,
    recommendedFields
  };
};