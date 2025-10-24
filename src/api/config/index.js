// src/api/config/index.js
import { getDomainConfig, getConfigValue } from '../../utils/domainConfig';

// API Base URL - Now supports domain-based configuration
// Legacy fallback for backward compatibility
export const API_BASE_URL = getConfigValue('API_BASE_URL') || process.env.NEXT_PUBLIC_BASE_URL;
export const API_VERSION = 'v1';

// Domain-aware configuration helper
export const getDomainApiConfig = () => {
  const config = getDomainConfig();
  return {
    ...config,
    API_BASE_URL: config.API_BASE_URL,
    API_VERSION: 'v1'
  };
};

// API Endpoints
export const ENDPOINTS = {
  // Common endpoints
  COMMON: {
    MENUS: '/menus',
    SLIDERS: '/sliders',
    FAQ: '/faqs',
    CONATCTUS: '/contact-us',
    SETTINGS: '/settings',
    CUSTOMER_ENQUIRY: '/customer-inquiry',
    COUNTRIES: '/countries',
    FUNDRAISING_CATEGORIES: '/fundraising-categories',
    ABOUT_US: '/about-us',
    
  },
  // Auth endpoints
  AUTH: {
    EMAIL_VERIFICATION: '/email-verification',
    CODE_VERIFICATION: '/code-verification',
    LOGIN: '/login',
    REGISTER: '/registration',
    LOGOUT: '/logout',
    CHANGE_PASSWORD: '/change-password',
    SOCIAL_LOGIN: '/auth/social-login',
  },

  // Forgot password endpoints
  FORGOT_PASSWORD: {
    EMAIL_VERIFICATION: '/forgot-password/email-verification',
    CODE_VERIFICATION: '/forgot-password/code-verification',
    RESET_PASSWORD: '/forgot-password/reset-password',
  },

  // Events endpoints
  EVENTS: {
    FEATURED: '/events?featured=1',
    LIST: '/events',
    DETAILS: (id) => `/events/${id}`,
  },

  // Donations endpoints
  DONATIONS: {
    LIST: '/donations',
    CREATE: '/donations',
    DETAILS: (id) => `/donations/${id}`,
  },

  // Payments endpoints
  PAYMENTS: {
    STRIPE_PAYMENT_INTENT: '/stripe/payment-intent',
  },

  // User endpoints
  USER: {
    PROFILE: '/profile',
    UPDATE_PROFILE: '/profile',
    DONATION_HISTORY: '/donations',
  },

  //FundRaising Request
  FUND_RAISING: {
    REQUEST: '/fund-raising/requests',
    REQUEST_DETAILS: (uuid) => `/fund-raising/requests/${uuid}`,
  }
};
