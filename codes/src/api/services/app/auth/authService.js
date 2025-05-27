import { apiService } from '@/api/services/app/apiService';
import { ENDPOINTS } from '@/api/config';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await apiService.post(ENDPOINTS.AUTH.LOGIN, { email, password });
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
}