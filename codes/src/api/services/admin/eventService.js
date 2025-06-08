import { apiService } from './apiService';
import { API_BASE_URL, API_VERSION } from '@/api/config';

class EventService {
  constructor() {
    this.baseEndpoint = `admin/${API_VERSION}`;
  }

  /**
   * Get all events with optional pagination and filters
   * @param {Object} params - Query parameters
   * @param {number} [params.current_page=1] - Current page number
   * @param {number} [params.per_page=10] - Items per page
   * @param {string} [params.search] - Optional search query
   * @param {number} [params.status] - Filter by status (0 or 1)
   * @param {number} [params.is_featured] - Filter by featured status (0 or 1)
   * @returns {Promise<Object>} - Events data with pagination
   */
  async getEvents(params = {}) {
    try {
      // Ensure pagination parameters are always included with correct naming
      const queryParams = {
        current_page: 1, // Default to page 1
        per_page: 10, // Default to 10 items per page
        ...params, // Override with any provided values
      };

      // Map search parameter to title if search is present
      if (queryParams.search) {
        queryParams.title = queryParams.search;
        delete queryParams.search; // Remove the search parameter as the API expects title
      }

      // Build query string
      const queryString = new URLSearchParams();
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryString.append(key, value);
        }
      });

      const endpoint = `/${this.baseEndpoint}/events?${queryString.toString()}`;

      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  /**
   * Get event details by ID
   * @param {number|string} eventId - Event ID
   * @returns {Promise<Object>} - Event details
   */
  async getEventDetails(eventId) {
    if (!eventId) {
      throw new Error('Event ID is required');
    }

    try {
      const endpoint = `/${this.baseEndpoint}/events/view/${eventId}`;
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      console.error(`Error fetching event details for ID ${eventId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new event
   * @param {Object} eventData - Event data
   * @returns {Promise<Object>} - Created event data
   */
  async createEvent(eventData) {
    try {
      const endpoint = `/${this.baseEndpoint}/events`;

      // Format the data for submission
      const formattedData = this.formatEventDataForSubmission(eventData);

      const response = await apiService.post(endpoint, formattedData);
      return response;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  /**
   * Update an existing event
   * @param {number|string} eventId - Event ID
   * @param {Object} eventData - Updated event data
   * @returns {Promise<Object>} - Updated event data
   */
  async updateEvent(eventId, eventData) {
    if (!eventId) {
      throw new Error('Event ID is required');
    }

    try {
      const endpoint = `/${this.baseEndpoint}/events/${eventId}`;

      // Format the data for submission
      const formattedData = this.formatEventDataForSubmission(eventData);

      const response = await apiService.put(endpoint, formattedData);
      return response;
    } catch (error) {
      console.error(`Error updating event with ID ${eventId}:`, error);
      throw error;
    }
  }

  /**
   * Update event status
   * @param {number|string} eventId - Event ID
   * @param {number} status - New status (0 for inactive, 1 for active)
   * @returns {Promise<Object>} - Status update result
   */
  async updateEventStatus(eventId, status) {
    if (!eventId) {
      throw new Error('Event ID is required');
    }

    try {
      const endpoint = `/${this.baseEndpoint}/events/status/${eventId}`;
      const response = await apiService.patch(endpoint, { status });
      return response;
    } catch (error) {
      console.error(`Error updating status for event with ID ${eventId}:`, error);
      throw error;
    }
  }

  /**
   * Delete an event
   * @param {number|string} eventId - Event ID
   * @returns {Promise<Object>} - Deletion response
   */
  async deleteEvent(eventId) {
    if (!eventId) {
      throw new Error('Event ID is required');
    }

    try {
      const endpoint = `/${this.baseEndpoint}/events/${eventId}`;
      const response = await apiService.delete(endpoint);
      return response;
    } catch (error) {
      console.error(`Error deleting event with ID ${eventId}:`, error);
      throw error;
    }
  }

  /**
   * Validate event data before submission
   * @param {Object} eventData - Event data to validate
   * @returns {Object} - Object with isValid boolean and errors array
   */
  validateEventData(eventData) {
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
  }

  /**
   * Format event data for API submission
   * @param {Object} data - Event data from form
   * @returns {Object} - Formatted data for API
   */
  formatEventDataForSubmission(data) {
    // Format dates to YYYY-MM-DD strings
    const formattedData = {
      ...data,
      start_date:
        data.start_date instanceof Date
          ? data.start_date.toISOString().split('T')[0]
          : data.start_date,
      end_date:
        data.end_date instanceof Date ? data.end_date.toISOString().split('T')[0] : data.end_date,
      is_fixed_donation:
        typeof data.is_fixed_donation === 'boolean'
          ? data.is_fixed_donation
            ? 1
            : 0
          : data.is_fixed_donation,
      is_featured:
        typeof data.is_featured === 'boolean' ? (data.is_featured ? 1 : 0) : data.is_featured,
    };

    return formattedData;
  }
}

export const eventService = new EventService();
