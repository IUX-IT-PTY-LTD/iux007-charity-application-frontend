// src/api/services/admin/contactService.js

import { apiService } from './apiService';
import { API_VERSION } from '@/api/config';
import { getAuthToken } from './authService';

class ContactService {
  constructor() {
    this.baseEndpoint = `admin/${API_VERSION}`;
  }

  /**
   * Get all contact information
   * @returns {Promise<Object>} - Contact information data
   */
  async getAllContacts() {
    try {
      if (!getAuthToken()) {
        throw new Error('Authentication required. Please log in.');
      }

      const endpoint = `/${this.baseEndpoint}/contact-us`;
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching contact information:', error);
      throw error;
    }
  }

  /**
   * Get contact details by ID
   * @param {number} contactId - Contact ID
   * @returns {Promise<Object>} - Contact details
   */
  async getContactDetails(contactId) {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    if (!contactId) {
      throw new Error('Contact ID is required');
    }

    try {
      const endpoint = `/${this.baseEndpoint}/contact-us/edit/${contactId}`;
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      console.error(`Error fetching contact details for ID ${contactId}:`, error);
      throw error;
    }
  }

  /**
   * Update contact information
   * @param {number} contactId - Contact ID
   * @param {Object} contactData - Updated contact data
   * @param {string} [contactData.name] - Contact name (e.g., "Visit office")
   * @param {string} [contactData.value] - Contact value (e.g., address, phone number, email)
   * @param {string} [contactData.icon] - Icon for the contact (optional)
   * @param {number} [contactData.status] - Status (1 for active, 0 for inactive)
   * @returns {Promise<Object>} - Updated contact information
   */
  async updateContact(contactId, contactData) {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }

    if (!contactId) {
      throw new Error('Contact ID is required');
    }

    if (!contactData || Object.keys(contactData).length === 0) {
      throw new Error('Contact data is required');
    }

    try {
      const endpoint = `/${this.baseEndpoint}/contact-us/update/${contactId}`;
      const response = await apiService.put(endpoint, contactData);
      return response;
    } catch (error) {
      console.error(`Error updating contact with ID ${contactId}:`, error);
      throw error;
    }
  }

  /**
   * Toggle contact status (active/inactive)
   * @param {number} contactId - Contact ID
   * @param {number} status - New status (1 for active, 0 for inactive)
   * @returns {Promise<Object>} - Updated contact
   */
  async toggleContactStatus(contactId, status) {
    if (!getAuthToken()) {
      throw new Error('Authentication required. Please log in.');
    }
    
    if (!contactId) {
      throw new Error('Contact ID is required');
    }

    if (status !== 0 && status !== 1) {
      throw new Error('Status must be 0 (inactive) or 1 (active)');
    }

    try {
      // First, get the current contact details
      const contactResponse = await this.getContactDetails(contactId);

      if (contactResponse.status !== 'success' || !contactResponse.data) {
        throw new Error('Failed to fetch contact details for status update');
      }

      // Get the current contact data
      const contactData = contactResponse.data;

      // Update the status while preserving all other fields
      const updatedContactData = {
        ...contactData,
        status: status,
      };

      // Send the complete data back to the server with the updated status
      return await this.updateContact(contactId, updatedContactData);
    } catch (error) {
      console.error(`Error toggling status for contact ID ${contactId}:`, error);
      throw error;
    }
  }
}

export const contactService = new ContactService();
