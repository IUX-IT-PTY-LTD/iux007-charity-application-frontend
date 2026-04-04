// src/api/services/admin/donationService.js

import { apiService } from './apiService';
import { API_BASE_URL, API_VERSION } from '@/api/config';
import { getAuthToken } from './authService';

class DonationService {
  constructor() {
    this.baseEndpoint = `admin/${API_VERSION}`;
  }

  /**
   * Add a bank transfer donation
   * @param {number|string} eventId - Event ID
   * @param {Object} donationData - Donation data
   * @param {number} donationData.total_amount - Total donation amount
   * @param {number} donationData.transaction_count - Number of transactions
   * @param {string} [donationData.notes] - Optional notes
   * @returns {Promise<Object>} - Created donation data
   */
  async addBankTransferDonation(eventId, donationData) {
    try {
      if (!getAuthToken()) {
        throw new Error('Authentication required. Please log in.');
      }

      if (!eventId) {
        throw new Error('Event ID is required');
      }

      if (!donationData.total_amount || donationData.total_amount <= 0) {
        throw new Error('Valid amount is required');
      }

      if (!donationData.transaction_count || donationData.transaction_count < 1) {
        throw new Error('Transaction count is required and must be at least 1');
      }

      const endpoint = `/${this.baseEndpoint}/bank-transfer-donations`;

      // Format the data for submission according to API spec
      const formattedData = {
        event_id: eventId,
        total_amount: Number(donationData.total_amount),
        transaction_count: Number(donationData.transaction_count),
        notes: donationData.notes?.trim() || null,
      };

      const response = await apiService.post(endpoint, formattedData);
      return response;
    } catch (error) {
      console.error('Error adding bank transfer donation:', error);
      throw error;
    }
  }

  /**
   * Get donations for an event
   * @param {number|string} eventId - Event ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - Donations data
   */
  async getEventDonations(eventId, params = {}) {
    try {
      if (!getAuthToken()) {
        throw new Error('Authentication required. Please log in.');
      }

      if (!eventId) {
        throw new Error('Event ID is required');
      }

      // Build query string
      const queryString = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryString.append(key, value);
        }
      });

      const endpoint = `/${this.baseEndpoint}/events/${eventId}/donations?${queryString.toString()}`;

      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      console.error(`Error fetching donations for event ${eventId}:`, error);
      throw error;
    }
  }

  /**
   * Get bank transfer donations for an event
   * @param {number|string} eventId - Event ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - Bank transfer donations data
   */
  async getBankTransferDonations(eventId, params = {}) {
    try {
      if (!getAuthToken()) {
        throw new Error('Authentication required. Please log in.');
      }

      if (!eventId) {
        throw new Error('Event ID is required');
      }

      // Build query string
      const queryString = new URLSearchParams();
      queryString.append('event_id', eventId);
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryString.append(key, value);
        }
      });

      const endpoint = `/${this.baseEndpoint}/bank-transfer-donations?${queryString.toString()}`;

      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      console.error(`Error fetching bank transfer donations for event ${eventId}:`, error);
      throw error;
    }
  }

  /**
   * Update donation status
   * @param {number|string} donationId - Donation ID
   * @param {string} status - New status
   * @returns {Promise<Object>} - Update response
   */
  async updateDonationStatus(donationId, status) {
    try {
      if (!getAuthToken()) {
        throw new Error('Authentication required. Please log in.');
      }

      if (!donationId) {
        throw new Error('Donation ID is required');
      }

      const endpoint = `/${this.baseEndpoint}/donations/${donationId}/status`;
      const response = await apiService.patch(endpoint, { status });
      return response;
    } catch (error) {
      console.error(`Error updating donation status for ID ${donationId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a donation
   * @param {number|string} donationId - Donation ID
   * @returns {Promise<Object>} - Delete response
   */
  async deleteDonation(donationId) {
    try {
      if (!getAuthToken()) {
        throw new Error('Authentication required. Please log in.');
      }

      if (!donationId) {
        throw new Error('Donation ID is required');
      }

      const endpoint = `/${this.baseEndpoint}/donations/${donationId}`;
      const response = await apiService.delete(endpoint);
      return response;
    } catch (error) {
      console.error(`Error deleting donation with ID ${donationId}:`, error);
      throw error;
    }
  }

  /**
   * Validate donation data
   * @param {Object} donationData - Donation data to validate
   * @returns {Object} - Object with isValid boolean and errors array
   */
  validateDonationData(donationData) {
    const errors = [];

    // Amount validation
    if (!donationData.total_amount) {
      errors.push('Total amount is required');
    } else if (isNaN(Number(donationData.total_amount)) || Number(donationData.total_amount) <= 0) {
      errors.push('Total amount must be a positive number');
    }

    // Transaction count validation
    if (!donationData.transaction_count) {
      errors.push('Transaction count is required');
    } else if (isNaN(Number(donationData.transaction_count)) || Number(donationData.transaction_count) < 1) {
      errors.push('Transaction count must be at least 1');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export const donationService = new DonationService();