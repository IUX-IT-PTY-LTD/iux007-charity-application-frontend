/**
 * Service file for handling event-related API requests
 */

import { getAuthToken } from './MainauthService';

// Make sure these environment variables are properly set in your .env.local file
const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://polished-dusk-oxhdccceltzf.on-vapor.com/api';
const version = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

/**
 * Log configuration details - helpful for debugging
 */
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('API Configuration:', {
    baseUrl,
    version,
    fullUrl: `${baseUrl}/admin/${version}/events`,
  });
}

/**
 * Handle API response
 * @param {Response} response - Fetch API response
 * @returns {Promise} - Promise resolving to JSON data or throwing detailed error
 */
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    // Create a more detailed error object
    const error = new Error(data.message || 'API request failed');
    error.status = response.status;
    error.statusText = response.statusText;
    error.data = data;

    console.error('API Error:', {
      endpoint: response.url,
      status: response.status,
      message: data.message || 'Unknown error',
      data: data,
    });

    throw error;
  }

  return data;
};

/**
 * Get headers with authentication
 * @returns {Object} - Headers object with Authorization if authenticated
 */
const getAuthHeaders = () => {
  const token = getAuthToken();
  const headers = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Check if user is authenticated and throw error if not
 * @throws {Error} - If not authenticated
 */
const requireAuth = () => {
  if (!getAuthToken()) {
    throw new Error('Authentication required. Please log in.');
  }
};

/**
 * Create a new event
 * @param {Object|FormData} eventData - Event data to be created (can be object or FormData)
 * @returns {Promise} - Promise resolving to the created event
 * @throws {Error} - Detailed error with status and message
 */
export const createEvent = async (eventData) => {
  try {
    requireAuth();

    let formData;

    // If eventData is already FormData, use it directly
    if (eventData instanceof FormData) {
      formData = eventData;
    } else {
      // Otherwise create a new FormData and append all event data
      formData = new FormData();
      Object.keys(eventData).forEach((key) => {
        formData.append(key, eventData[key]);
      });
    }

    // Log request details for debugging
    console.log('Creating event:', {
      url: `${baseUrl}/admin/${version}/events`,
      method: 'POST',
      headers: getAuthHeaders(),
      formDataKeys: [...formData.keys()],
    });

    const response = await fetch(`${baseUrl}/admin/${version}/events`, {
      method: 'POST',
      body: formData,
      headers: getAuthHeaders(),
      // Important for CORS
      mode: 'cors',
      credentials: 'include',
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

/**
 * Get all events
 * @returns {Promise} - Promise resolving to array of events
 * @throws {Error} - Detailed error with status and message
 */
export const getAllEvents = async () => {
  try {
    requireAuth();

    const response = await fetch(`${baseUrl}/admin/${version}/events`, {
      method: 'GET',
      headers: getAuthHeaders(),
      mode: 'cors',
      credentials: 'include',
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

/**
 * Get a single event by ID
 * @param {number|string} eventId - ID of the event to fetch
 * @returns {Promise} - Promise resolving to the event
 * @throws {Error} - Detailed error with status and message
 */
export const getEventById = async (eventId) => {
  try {
    requireAuth();

    const response = await fetch(`${baseUrl}/admin/${version}/events/${eventId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      mode: 'cors',
      credentials: 'include',
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

/**
 * Update an existing event
 * @param {number|string} eventId - ID of the event to update
 * @param {Object} eventData - Updated event data
 * @returns {Promise} - Promise resolving to the updated event
 * @throws {Error} - Detailed error with status and message
 */
export const updateEvent = async (eventId, eventData) => {
  try {
    requireAuth();

    let formData;

    // If eventData is already FormData, use it directly
    if (eventData instanceof FormData) {
      formData = eventData;
    } else {
      // Otherwise create a new FormData and append all event data
      formData = new FormData();
      Object.keys(eventData).forEach((key) => {
        formData.append(key, eventData[key]);
      });
    }

    const response = await fetch(`${baseUrl}/admin/${version}/events/${eventId}`, {
      method: 'PUT',
      body: formData,
      headers: getAuthHeaders(),
      mode: 'cors',
      credentials: 'include',
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

/**
 * Update the status of an event
 * @param {number|string} eventId - ID of the event to update status
 * @param {string|number} status - New status (0 for inactive, 1 for active)
 * @returns {Promise} - Promise resolving to the status update result
 * @throws {Error} - Detailed error with status and message
 */
export const updateEventStatus = async (eventId, status) => {
  try {
    requireAuth();

    const formData = new FormData();
    formData.append('status', status);

    const response = await fetch(`${baseUrl}/admin/${version}/events/status/${eventId}`, {
      method: 'PATCH',
      body: formData,
      headers: getAuthHeaders(),
      mode: 'cors',
      credentials: 'include',
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error updating event status:', error);
    throw error;
  }
};

/**
 * Delete an event
 * @param {number|string} eventId - ID of the event to delete
 * @returns {Promise} - Promise resolving to the deletion result
 * @throws {Error} - Detailed error with status and message
 */
export const deleteEvent = async (eventId) => {
  try {
    requireAuth();

    const response = await fetch(`${baseUrl}/admin/${version}/events/${eventId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      mode: 'cors',
      credentials: 'include',
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

/**
 * Validate event data before submission
 * @param {Object} eventData - Event data to validate
 * @returns {Object} - Object with isValid boolean and errors array
 */
export const validateEventData = (eventData) => {
  const errors = [];

  // Required fields
  const requiredFields = [
    'title',
    'description',
    'start_date',
    'end_date',
    'price',
    'target_amount',
  ];
  requiredFields.forEach((field) => {
    if (!eventData[field]) {
      errors.push(`${field.replace('_', ' ')} is required`);
    }
  });

  // Date validation
  if (eventData.start_date && eventData.end_date) {
    const startDate = new Date(eventData.start_date);
    const endDate = new Date(eventData.end_date);

    if (isNaN(startDate.getTime())) {
      errors.push('Start date is invalid');
    }

    if (isNaN(endDate.getTime())) {
      errors.push('End date is invalid');
    }

    if (startDate > endDate) {
      errors.push('End date must be after start date');
    }
  }

  // Numeric fields
  if (eventData.price && isNaN(Number(eventData.price))) {
    errors.push('Price must be a number');
  }

  if (eventData.target_amount && isNaN(Number(eventData.target_amount))) {
    errors.push('Target amount must be a number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Format event data for API submission
 * @param {Object} data - Event data from form
 * @returns {Object} - Formatted data for API
 */
export const formatEventDataForSubmission = (data) => {
  // Format dates to YYYY-MM-DD strings
  const formattedData = {
    ...data,
    start_date:
      data.start_date instanceof Date
        ? data.start_date.toISOString().split('T')[0]
        : data.start_date,
    end_date:
      data.end_date instanceof Date ? data.end_date.toISOString().split('T')[0] : data.end_date,
    is_fixed_donation: data.is_fixed_donation ? '1' : '0',
    is_featured: data.is_featured ? '1' : '0',
  };

  // Handle image differently based on upload type
  if (data.image_upload_type === 'url' && data.feature_image_url) {
    formattedData.feature_image = data.feature_image_url;
    // Remove the file if it exists
    delete formattedData.featured_image;
  }

  // Clean up temporary fields
  delete formattedData.image_upload_type;
  delete formattedData.feature_image_url;

  return formattedData;
};
