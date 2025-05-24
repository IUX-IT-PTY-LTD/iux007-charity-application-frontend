/**
 * Service file for handling event-related API requests
 * Integrated with the application's apiService
 */

import { apiService } from './apiService';
import { getAuthToken } from './authService';

// API version - match what's in your environment
const version = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

/**
 * Create a new event
 * @param {Object|FormData} eventData - Event data to be created
 * @returns {Promise} - Promise resolving to the created event
 */
export const createEvent = async (eventData) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    // If eventData is already FormData, use it directly
    if (eventData instanceof FormData) {
      return await apiService.post(`/admin/${version}/events`, eventData, {
        headers: {
          // Remove Content-Type to let browser set it with boundary
          'Content-Type': null,
        },
      });
    }

    // If eventData contains File objects, convert to FormData
    if (hasFileFields(eventData)) {
      const formData = convertToFormData(eventData);
      return await apiService.post(`/admin/${version}/events`, formData, {
        headers: {
          // Remove Content-Type to let browser set it with boundary
          'Content-Type': null,
        },
      });
    }

    // Otherwise use regular JSON
    return await apiService.post(`/admin/${version}/events`, eventData);
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

/**
 * Get all events
 * @returns {Promise} - Promise resolving to array of events
 */
export const getAllEvents = async () => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    return await apiService.get(`/admin/${version}/events`);
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

/**
 * Get a single event by ID
 * @param {number|string} eventId - ID of the event to fetch
 * @returns {Promise} - Promise resolving to the event
 */
export const getEventById = async (eventId) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    return await apiService.get(`/admin/${version}/events/${eventId}`);
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

/**
 * Update an existing event
 * @param {number|string} eventId - ID of the event to update
 * @param {Object|FormData} eventData - Updated event data
 * @returns {Promise} - Promise resolving to the updated event
 */
export const updateEvent = async (eventId, eventData) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    // If eventData is already FormData, use it directly with method spoofing
    if (eventData instanceof FormData) {
      // Add _method=PUT for Laravel to handle it properly if not already added
      if (!eventData.has('_method')) {
        eventData.append('_method', 'PUT');
      }

      return await apiService.post(`/admin/${version}/events/${eventId}`, eventData, {
        headers: {
          // Remove Content-Type to let browser set it with boundary
          'Content-Type': null,
        },
      });
    }

    // If eventData contains File objects, convert to FormData with method spoofing
    if (hasFileFields(eventData)) {
      const formData = convertToFormData(eventData);

      // Add _method=PUT for Laravel to handle it properly
      formData.append('_method', 'PUT');

      return await apiService.post(`/admin/${version}/events/${eventId}`, formData, {
        headers: {
          // Remove Content-Type to let browser set it with boundary
          'Content-Type': null,
        },
      });
    }

    // Otherwise use regular JSON with PUT
    return await apiService.put(`/admin/${version}/events/${eventId}`, eventData);
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
 */
export const updateEventStatus = async (eventId, status) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    return await apiService.patch(`/admin/${version}/events/status/${eventId}`, { status });
  } catch (error) {
    console.error('Error updating event status:', error);
    throw error;
  }
};

/**
 * Delete an event
 * @param {number|string} eventId - ID of the event to delete
 * @returns {Promise} - Promise resolving to the deletion result
 */
export const deleteEvent = async (eventId) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    // Using apiService directly
    return await apiService.delete(`/admin/${version}/events/${eventId}`);
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
  } else if (data.featured_image instanceof File) {
    // Rename to match backend expectation
    formattedData.feature_image = data.featured_image;
    delete formattedData.featured_image;
  }

  // Clean up temporary fields
  delete formattedData.image_upload_type;
  delete formattedData.feature_image_url;

  return formattedData;
};

/**
 * Helper to check if object contains any File objects (for determining if FormData is needed)
 * @param {Object} obj - Object to check
 * @returns {boolean} - True if object contains File objects
 */
const hasFileFields = (obj) => {
  return Object.values(obj).some(
    (value) =>
      value instanceof File ||
      value instanceof FileList ||
      (value instanceof Array && value.some((item) => item instanceof File))
  );
};

/**
 * Convert an object to FormData
 * @param {Object} obj - Object to convert
 * @returns {FormData} - FormData object
 */
const convertToFormData = (obj) => {
  const formData = new FormData();

  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (value instanceof FileList) {
      // Handle FileList objects
      for (let i = 0; i < value.length; i++) {
        formData.append(`${key}[${i}]`, value[i]);
      }
    } else if (Array.isArray(value) && value.some((item) => item instanceof File)) {
      // Handle arrays with File objects
      value.forEach((item, index) => {
        if (item instanceof File) {
          formData.append(`${key}[${index}]`, item);
        } else {
          formData.append(`${key}[${index}]`, item);
        }
      });
    } else if (value instanceof File) {
      // Handle single File objects
      formData.append(key, value);
    } else if (typeof value === 'object' && value !== null && !(value instanceof File)) {
      // Handle nested objects
      formData.append(key, JSON.stringify(value));
    } else {
      // Handle primitive values
      formData.append(key, value);
    }
  });

  return formData;
};
