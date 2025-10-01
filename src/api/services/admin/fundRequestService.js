// src/api/services/admin/fundRequestService.js

/**
 * Service file for handling Fundraising Request-related API requests
 * Integrated with the application's apiService
 */

import { apiService } from './apiService';
import { getAuthToken } from './authService';

// API version - match what's in your environment
const version = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

// Fundraising request status constants
export const FUND_REQUEST_STATUS = {
  SUBMITTED: 'Submitted',
  RESUBMITTED: 'Resubmitted',
  INFORMATION_NEEDED: 'Information Needed',
  IN_REVIEW: 'In Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  PUBLISHED: 'Published',
  EXPIRED: 'Expired',
};

/**
 * Get all fundraising requests
 * @param {Array<string>} statuses - Optional array of status filters
 * @returns {Promise} - Promise resolving to array of fundraising requests
 */
export const getAllFundRequests = async (statuses = []) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    // Build query string if statuses are provided
    let endpoint = `/admin/${version}/fundraising-requests`;

    if (statuses && statuses.length > 0) {
      const statusQuery = statuses.join(', ');
      endpoint += `?status=${statusQuery}`;
    }

    return await apiService.get(endpoint);
  } catch (error) {
    console.error('Error fetching fundraising requests:', error);
    throw error;
  }
};

/**
 * Get a single fundraising request by UUID
 * @param {string} uuid - UUID of the fundraising request to fetch
 * @returns {Promise} - Promise resolving to the fundraising request details
 */
export const getFundRequestByUuid = async (uuid) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    if (!uuid || uuid.trim() === '') {
      throw new Error('UUID is required');
    }

    return await apiService.get(`/admin/${version}/fundraising-requests/${uuid}`);
  } catch (error) {
    console.error('Error fetching fundraising request:', error);
    throw error;
  }
};

/**
 * Filter fundraising requests by status
 * @param {Array} requests - Array of fundraising requests
 * @param {string|Array<string>} status - Status or array of statuses to filter by
 * @returns {Array} - Filtered array of fundraising requests
 */
export const filterByStatus = (requests, status) => {
  if (!status || (Array.isArray(status) && status.length === 0)) {
    return requests;
  }

  const statusArray = Array.isArray(status) ? status : [status];

  return requests.filter((request) => statusArray.includes(request.status));
};

/**
 * Filter fundraising requests by fund type
 * @param {Array} requests - Array of fundraising requests
 * @param {string} fundType - Fund type to filter by ('individual' or 'organization')
 * @returns {Array} - Filtered array of fundraising requests
 */
export const filterByFundType = (requests, fundType) => {
  if (!fundType || fundType.trim() === '') {
    return requests;
  }

  return requests.filter((request) => request.fund_type === fundType);
};

/**
 * Search fundraising requests by query
 * @param {Array} requests - Array of fundraising requests to search
 * @param {string} query - Search query
 * @returns {Array} - Filtered array of fundraising requests
 */
export const searchFundRequests = (requests, query) => {
  if (!query || query.trim() === '') {
    return requests;
  }

  const normalizedQuery = query.toLowerCase().trim();

  return requests.filter(
    (request) =>
      request.title?.toLowerCase().includes(normalizedQuery) ||
      request.request_number?.toLowerCase().includes(normalizedQuery) ||
      request.fundraising_for?.toLowerCase().includes(normalizedQuery) ||
      request.name?.toLowerCase().includes(normalizedQuery) ||
      request.email?.toLowerCase().includes(normalizedQuery) ||
      request.fundraising_category?.toLowerCase().includes(normalizedQuery)
  );
};

/**
 * Sort fundraising requests by created date
 * @param {Array} requests - Array of fundraising requests to sort
 * @param {string} direction - Sort direction ('asc' or 'desc')
 * @returns {Array} - Sorted array of fundraising requests
 */
export const sortByDate = (requests, direction = 'desc') => {
  return [...requests].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);

    const modifier = direction === 'asc' ? 1 : -1;
    return (dateA - dateB) * modifier;
  });
};

/**
 * Sort fundraising requests by target amount
 * @param {Array} requests - Array of fundraising requests to sort
 * @param {string} direction - Sort direction ('asc' or 'desc')
 * @returns {Array} - Sorted array of fundraising requests
 */
export const sortByAmount = (requests, direction = 'desc') => {
  return [...requests].sort((a, b) => {
    const modifier = direction === 'asc' ? 1 : -1;
    return (Number(a.target_amount) - Number(b.target_amount)) * modifier;
  });
};

/**
 * Group fundraising requests by status
 * @param {Array} requests - Array of fundraising requests to group
 * @returns {Object} - Object with status as keys and arrays of requests as values
 */
export const groupByStatus = (requests) => {
  return requests.reduce((grouped, request) => {
    const status = request.status;
    if (!grouped[status]) {
      grouped[status] = [];
    }
    grouped[status].push(request);
    return grouped;
  }, {});
};

/**
 * Group fundraising requests by category
 * @param {Array} requests - Array of fundraising requests to group
 * @returns {Object} - Object with category as keys and arrays of requests as values
 */
export const groupByCategory = (requests) => {
  return requests.reduce((grouped, request) => {
    const category = request.fundraising_category || 'Uncategorized';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(request);
    return grouped;
  }, {});
};

/**
 * Calculate approval progress percentage
 * @param {Object} approvalSummary - Approval summary object from request
 * @returns {number} - Percentage of approvals completed (0-100)
 */
export const calculateApprovalProgress = (approvalSummary) => {
  if (!approvalSummary || !approvalSummary.total_approvers_needed) {
    return 0;
  }

  const { approved = 0, total_approvers_needed } = approvalSummary;
  return Math.round((approved / total_approvers_needed) * 100);
};

/**
 * Check if a fundraising request needs attention
 * @param {Object} request - Fundraising request object
 * @returns {boolean} - True if request needs attention
 */
export const needsAttention = (request) => {
  const attentionStatuses = [
    FUND_REQUEST_STATUS.SUBMITTED,
    FUND_REQUEST_STATUS.RESUBMITTED,
    FUND_REQUEST_STATUS.INFORMATION_NEEDED,
  ];

  return attentionStatuses.includes(request.status);
};

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Submit a review for a fundraising request
 * @param {string} uuid - UUID of the fundraising request
 * @param {Object} reviewData - Review data containing status, comments, and deadline
 * @param {string} reviewData.status - Review status ('information_needed' or 'in_review')
 * @param {string} reviewData.comments - Review comments
 * @param {string} reviewData.deadline - Deadline in YYYY-MM-DD format
 * @returns {Promise} - Promise resolving to the review result
 */
export const submitReview = async (uuid, reviewData) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    if (!uuid || uuid.trim() === '') {
      throw new Error('UUID is required');
    }

    // Validate review data
    const validation = validateReviewData(reviewData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    return await apiService.post(
      `/admin/${version}/fundraising-requests/${uuid}/review`,
      reviewData
    );
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};

/**
 * Submit an approval action for a fundraising request
 * @param {string} uuid - UUID of the fundraising request
 * @param {Object} approvalData - Approval data containing action and comments
 * @param {string} approvalData.action - Approval action ('accepted' or 'rejected')
 * @param {string} approvalData.comments - Approval comments
 * @returns {Promise} - Promise resolving to the approval result
 */
export const submitApproval = async (uuid, approvalData) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    if (!uuid || uuid.trim() === '') {
      throw new Error('UUID is required');
    }

    // Validate approval data
    const validation = validateApprovalData(approvalData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    return await apiService.post(
      `/admin/${version}/fundraising-requests/${uuid}/approval`,
      approvalData
    );
  } catch (error) {
    console.error('Error submitting approval:', error);
    throw error;
  }
};

/**
 * Validate review data before submission
 * @param {Object} reviewData - Review data to validate
 * @returns {Object} - Object with isValid boolean and errors array
 */
export const validateReviewData = (reviewData) => {
  const errors = [];

  // Required fields
  const requiredFields = ['status', 'comments', 'deadline'];
  requiredFields.forEach((field) => {
    if (reviewData[field] === undefined || reviewData[field] === null || reviewData[field] === '') {
      errors.push(`${field.replace('_', ' ')} is required`);
    }
  });

  // Status validation
  const validStatuses = ['information_needed', 'in_review'];
  if (reviewData.status && !validStatuses.includes(reviewData.status)) {
    errors.push('Status must be either "information_needed" or "in_review"');
  }

  // Comments validation
  if (reviewData.comments && reviewData.comments.length < 5) {
    errors.push('Comments must be at least 5 characters long');
  }

  // Deadline validation
  if (reviewData.deadline) {
    const deadlineRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!deadlineRegex.test(reviewData.deadline)) {
      errors.push('Deadline must be in YYYY-MM-DD format');
    } else {
      const deadlineDate = new Date(reviewData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (deadlineDate < today) {
        errors.push('Deadline must be today or a future date');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate approval data before submission
 * @param {Object} approvalData - Approval data to validate
 * @returns {Object} - Object with isValid boolean and errors array
 */
export const validateApprovalData = (approvalData) => {
  const errors = [];

  // Required fields
  const requiredFields = ['action', 'comments'];
  requiredFields.forEach((field) => {
    if (
      approvalData[field] === undefined ||
      approvalData[field] === null ||
      approvalData[field] === ''
    ) {
      errors.push(`${field} is required`);
    }
  });

  // Action validation
  const validActions = ['accepted', 'rejected'];
  if (approvalData.action && !validActions.includes(approvalData.action)) {
    errors.push('Action must be either "accepted" or "rejected"');
  }

  // Comments validation
  if (approvalData.comments && approvalData.comments.length < 5) {
    errors.push('Comments must be at least 5 characters long');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Format review data for API submission
 * @param {Object} data - Review data from form
 * @returns {Object} - Formatted data for API
 */
export const formatReviewDataForSubmission = (data) => {
  const formattedData = { ...data };

  // Ensure status is lowercase with underscore
  if (formattedData.status) {
    formattedData.status = formattedData.status.toLowerCase().replace(/\s+/g, '_');
  }

  // Trim comments
  if (formattedData.comments) {
    formattedData.comments = formattedData.comments.trim();
  }

  return formattedData;
};

/**
 * Format approval data for API submission
 * @param {Object} data - Approval data from form
 * @returns {Object} - Formatted data for API
 */
export const formatApprovalDataForSubmission = (data) => {
  const formattedData = { ...data };

  // Ensure action is lowercase
  if (formattedData.action) {
    formattedData.action = formattedData.action.toLowerCase();
  }

  // Trim comments
  if (formattedData.comments) {
    formattedData.comments = formattedData.comments.trim();
  }

  return formattedData;
};

/**
 * Publish a fundraising request by connecting it with an event
 * Note: Only approved fundraising requests can be published
 * @param {string} uuid - UUID of the fundraising request
 * @param {Object} publishData - Publish data containing event_id
 * @param {number} publishData.event_id - ID of the event to connect with
 * @returns {Promise} - Promise resolving to the publish result
 */
export const publishFundRequest = async (uuid, publishData) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    if (!uuid || uuid.trim() === '') {
      throw new Error('UUID is required');
    }

    // Validate publish data
    const validation = validatePublishData(publishData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    return await apiService.patch(
      `/admin/${version}/fundraising-requests/${uuid}/publish`,
      publishData
    );
  } catch (error) {
    console.error('Error publishing fundraising request:', error);
    throw error;
  }
};

/**
 * Validate publish data before submission
 * @param {Object} publishData - Publish data to validate
 * @returns {Object} - Object with isValid boolean and errors array
 */
export const validatePublishData = (publishData) => {
  const errors = [];

  // Event ID is required
  if (
    publishData.event_id === undefined ||
    publishData.event_id === null ||
    publishData.event_id === ''
  ) {
    errors.push('Event ID is required');
  }

  // Event ID must be a positive integer
  if (publishData.event_id !== undefined && publishData.event_id !== null) {
    const eventId = Number(publishData.event_id);
    if (isNaN(eventId) || eventId <= 0 || !Number.isInteger(eventId)) {
      errors.push('Event ID must be a positive integer');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Format publish data for API submission
 * @param {Object} data - Publish data from form
 * @returns {Object} - Formatted data for API
 */
export const formatPublishDataForSubmission = (data) => {
  const formattedData = { ...data };

  // Convert event_id to number if it's a string
  if (typeof formattedData.event_id === 'string') {
    formattedData.event_id = parseInt(formattedData.event_id, 10);
  }

  return formattedData;
};

/**
 * Check if a fundraising request can be published
 * @param {Object} request - Fundraising request object
 * @returns {boolean} - True if request can be published
 */
export const canBePublished = (request) => {
  return request.status === FUND_REQUEST_STATUS.APPROVED;
};

/**
 * Check if a fundraising request is fully approved
 * @param {Object} approvalSummary - Approval summary object from request
 * @returns {boolean} - True if fully approved
 */
export const isFullyApproved = (approvalSummary) => {
  if (!approvalSummary) {
    return false;
  }

  const { approved = 0, total_approvers_needed = 0 } = approvalSummary;
  return approved === total_approvers_needed && total_approvers_needed > 0;
};
