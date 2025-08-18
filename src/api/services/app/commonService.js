import { apiService } from '@/api/services/app/apiService';
import { ENDPOINTS } from '@/api/config';

export const commonService = {
  getMenus: async () => {
    try {
      const response = await apiService.get(ENDPOINTS.COMMON.MENUS);
      return response;
    } catch (error) {
      console.error('Menus error:', error);
      throw error;
    }
  },
  getSliders: async () => {
    try {
      const response = await apiService.get(ENDPOINTS.COMMON.SLIDERS);
      return response;
    } catch (error) {
      console.error('Sliders error:', error);
      throw error;
    }
  },

  getContactData: async () => {
    try {
      const response = await apiService.get(ENDPOINTS.COMMON.CONATCTUS);
      return response;
    } catch (error) {
      console.error('ContactUs error:', error);
      throw error;
    }
  },

  storeCustomerEnquiry: async (data) => {
    try {
      const response = await apiService.post(ENDPOINTS.COMMON.CUSTOMER_ENQUIRY, data);
      return response;
    } catch (error) {
      console.error('ContactUs error:', error);
      throw error;
    }
  },
}