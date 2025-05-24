/**
 * Service file for handling event-related API requests
 */

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const version = process.env.NEXT_PUBLIC_API_VERSION;

/**
 * Get auth token from localStorage
 * @returns {string|null} - Auth token or null if not found
 */
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

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
      data: data
    });
    throw error;
  }
  
  return data;
};

/**
 * Create a new event
 * @param {Object} eventData - Event data to be created
 * @returns {Promise} - Promise resolving to the created event
 * @throws {Error} - Detailed error with status and message
 */
export const createEvent = async (eventData) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }
    
    const formData = new FormData();
    
    // Append all event data to FormData
    Object.keys(eventData).forEach(key => {
      formData.append(key, eventData[key]);
    });
    
    const response = await fetch(`${baseUrl}/admin/${version}/events`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error creating event:', error);
    // Re-throw with more context if needed
    if (!error.status) {
      error.message = `Network or client error: ${error.message}`;
    }
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
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }
    
    const response = await fetch(`${baseUrl}/admin/${version}/events`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching events:', error);
    if (!error.status) {
      error.message = `Network or client error: ${error.message}`;
    }
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
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }
    
    const formData = new FormData();
    
    // Append all event data to FormData
    Object.keys(eventData).forEach(key => {
      formData.append(key, eventData[key]);
    });
    
    const response = await fetch(`${baseUrl}/admin/${version}/events/${eventId}`, {
      method: 'PUT',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error updating event:', error);
    if (!error.status) {
      error.message = `Network or client error: ${error.message}`;
    }
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
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }
    
    const formData = new FormData();
    formData.append('status', status);
    
    const response = await fetch(`${baseUrl}/admin/${version}/events/status/${eventId}`, {
      method: 'PATCH',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error updating event status:', error);
    if (!error.status) {
      error.message = `Network or client error: ${error.message}`;
    }
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
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }
    
    const response = await fetch(`${baseUrl}/admin/${version}/events/${eventId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching event:', error);
    if (!error.status) {
      error.message = `Network or client error: ${error.message}`;
    }
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
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }
    
    const response = await fetch(`${baseUrl}/admin/${version}/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error deleting event:', error);
    if (!error.status) {
      error.message = `Network or client error: ${error.message}`;
    }
    throw error;
  }
};

/**
 * Helper function to check if a user is authenticated
 * @returns {boolean} - True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

/**
 * Validate event data before submission
 * @param {Object} eventData - Event data to validate
 * @returns {Object} - Object with isValid boolean and errors array
 */
export const validateEventData = (eventData) => {
  const errors = [];
  
  // Required fields
  const requiredFields = ['title', 'description', 'start_date', 'end_date', 'price', 'target_amount'];
  requiredFields.forEach(field => {
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
    errors
  };
};