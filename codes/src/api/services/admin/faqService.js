/**
 * Service file for handling FAQ-related API requests
 * Integrated with the application's apiService
 */

import { apiService } from './apiService';
import { getAuthToken } from './authService';

// API version - match what's in your environment
const version = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

/**
 * Create a new FAQ
 * @param {Object} faqData - FAQ data to be created
 * @returns {Promise} - Promise resolving to the created FAQ
 */
export const createFaq = async (faqData) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    return await apiService.post(`/admin/${version}/faqs/create`, faqData);
  } catch (error) {
    console.error('Error creating FAQ:', error);
    throw error;
  }
};

/**
 * Get all FAQs
 * @returns {Promise} - Promise resolving to array of FAQs
 */
export const getAllFaqs = async () => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    return await apiService.get(`/admin/${version}/faqs`);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    throw error;
  }
};

/**
 * Get a single FAQ by ID
 * @param {number|string} faqId - ID of the FAQ to fetch
 * @returns {Promise} - Promise resolving to the FAQ
 */
export const getFaqById = async (faqId) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    return await apiService.get(`/admin/${version}/faqs/edit/${faqId}`);
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    throw error;
  }
};

/**
 * Update an existing FAQ
 * @param {number|string} faqId - ID of the FAQ to update
 * @param {Object} faqData - Updated FAQ data
 * @returns {Promise} - Promise resolving to the updated FAQ
 */
export const updateFaq = async (faqId, faqData) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    return await apiService.post(`/admin/${version}/faqs/edit/${faqId}`, faqData);
  } catch (error) {
    console.error('Error updating FAQ:', error);
    throw error;
  }
};

/**
 * Delete a FAQ
 * @param {number|string} faqId - ID of the FAQ to delete
 * @returns {Promise} - Promise resolving to the deletion result
 */
export const deleteFaq = async (faqId) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    return await apiService.delete(`/admin/${version}/faqs/delete/${faqId}`);
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    throw error;
  }
};

/**
 * Validate FAQ data before submission
 * @param {Object} faqData - FAQ data to validate
 * @returns {Object} - Object with isValid boolean and errors array
 */
export const validateFaqData = (faqData) => {
  const errors = [];

  // Required fields
  const requiredFields = ['question', 'answer', 'ordering', 'status'];
  requiredFields.forEach((field) => {
    if (faqData[field] === undefined || faqData[field] === null || faqData[field] === '') {
      errors.push(`${field.replace('_', ' ')} is required`);
    }
  });

  // Question validation
  if (faqData.question && faqData.question.length < 5) {
    errors.push('Question must be at least 5 characters long');
  }

  // Answer validation
  if (faqData.answer && faqData.answer.length < 5) {
    errors.push('Answer must be at least 5 characters long');
  }

  // Ordering must be a positive integer
  if (faqData.ordering !== undefined && faqData.ordering !== null) {
    const ordering = Number(faqData.ordering);
    if (isNaN(ordering) || ordering <= 0 || !Number.isInteger(ordering)) {
      errors.push('Ordering must be a positive integer');
    }
  }

  // Status validation
  if (faqData.status !== undefined && faqData.status !== null) {
    const status = Number(faqData.status);
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
 * Format FAQ data for API submission
 * @param {Object} data - FAQ data from form
 * @returns {Object} - Formatted data for API
 */
export const formatFaqDataForSubmission = (data) => {
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
 * @param {Array} existingFaqs - Array of existing FAQs
 * @param {number|string|null} currentFaqId - ID of the current FAQ (for updates)
 * @returns {boolean} - True if ordering is already in use
 */
export const isOrderingInUse = (ordering, existingFaqs, currentFaqId = null) => {
  return existingFaqs.some(
    (faq) =>
      faq.ordering === ordering && (currentFaqId === null || faq.id !== parseInt(currentFaqId, 10))
  );
};

/**
 * Get the next available ordering number
 * @param {Array} existingFaqs - Array of existing FAQs
 * @returns {number} - Next available ordering number
 */
export const getNextAvailableOrdering = (existingFaqs) => {
  if (!existingFaqs || existingFaqs.length === 0) {
    return 1;
  }

  const maxOrdering = Math.max(...existingFaqs.map((faq) => faq.ordering));
  return maxOrdering + 1;
};

/**
 * Sort FAQs by ordering
 * @param {Array} faqs - Array of FAQs to sort
 * @param {string} direction - Sort direction ('asc' or 'desc')
 * @returns {Array} - Sorted array of FAQs
 */
export const sortFaqsByOrdering = (faqs, direction = 'asc') => {
  return [...faqs].sort((a, b) => {
    const modifier = direction === 'asc' ? 1 : -1;
    return (Number(a.ordering) - Number(b.ordering)) * modifier;
  });
};

/**
 * Group FAQs by status
 * @param {Array} faqs - Array of FAQs to group
 * @returns {Object} - Object with active and inactive FAQ arrays
 */
export const groupFaqsByStatus = (faqs) => {
  const active = faqs.filter((faq) => faq.status === 1 || faq.status === '1');
  const inactive = faqs.filter((faq) => faq.status === 0 || faq.status === '0');

  return {
    active,
    inactive,
  };
};

/**
 * Search FAQs by query
 * @param {Array} faqs - Array of FAQs to search
 * @param {string} query - Search query
 * @returns {Array} - Filtered array of FAQs
 */
export const searchFaqs = (faqs, query) => {
  if (!query || query.trim() === '') {
    return faqs;
  }

  const normalizedQuery = query.toLowerCase().trim();

  return faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(normalizedQuery) ||
      faq.answer.toLowerCase().includes(normalizedQuery)
  );
};
