import { API_BASE_URL, API_VERSION } from '../config';
import axios from 'axios';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL + '/' + API_VERSION;
  }

  // Generic GET request
  async get(endpoint, options = {}) {
    try {
      const response = await axios.get(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          ...this.getAuthHeader(),
          ...options.headers,
        },
      });
      return response.data;
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  }

  // Generic POST request
  async post(endpoint, data, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
          ...this.getAuthHeader(),
          ...options.headers,
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  }

  // Generic PUT request
  async put(endpoint, data, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
          ...this.getAuthHeader(),
          ...options.headers,
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('API PUT Error:', error);
      throw error;
    }
  }

  // Generic PATCH request
  async patch(endpoint, data, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
          ...this.getAuthHeader(),
          ...options.headers,
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('API PATCH Error:', error);
      throw error;
    }
  }

  // Get auth header
  getAuthHeader() {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `${token}` } : {};
  }
}

export const apiService = new ApiService();
