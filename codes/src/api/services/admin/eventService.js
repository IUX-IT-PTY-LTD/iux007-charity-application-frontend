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
 * @param {Object} eventData - Event data to be created
 * @returns {Promise} - Promise resolving to the created event
 */
export const createEvent = async (eventData) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

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
 * @param {Object} eventData - Updated event data
 * @returns {Promise} - Promise resolving to the updated event
 */
export const updateEvent = async (eventId, eventData) => {
  try {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

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

  return formattedData;
};
