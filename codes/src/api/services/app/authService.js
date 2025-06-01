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

  forgotPasswordEmailVerification: async (email) => {
    try {
      const response = await apiService.post(ENDPOINTS.FORGOT_PASSWORD.EMAIL_VERIFICATION, { email });
      
      if (response.status === 'success') {
        return response;
      }
      throw new Error('Failed to send verification code');
    } catch (error) {
      throw error;
    }
  },

  forgotPasswordCodeVerification: async (email, code) => {
    try {
      const response = await apiService.post(ENDPOINTS.FORGOT_PASSWORD.CODE_VERIFICATION, { email, code });
      if(response.status === 'success') {
        return response;
      }
      throw new Error('Failed to verify code');
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (email, new_password, password_confirmation) => {
    try {
      const response = await apiService.patch(ENDPOINTS.FORGOT_PASSWORD.RESET_PASSWORD, { email, new_password, password_confirmation });
      return response;
    } catch (error) {
      throw error;
    }
  },
}