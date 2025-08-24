// API Base URL
export const API_BASE_URL = 'https://polished-dusk-oxhdccceltzf.on-vapor.com/api';
// export const API_BASE_URL = 'http://localhost:9094/api';
export const API_VERSION = 'v1';

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
  },
  // Auth endpoints
  AUTH: {
    EMAIL_VERIFICATION: '/email-verification',
    CODE_VERIFICATION: '/code-verification',
    LOGIN: '/login',
    REGISTER: '/registration',
    LOGOUT: '/logout',
    CHANGE_PASSWORD: '/change-password',
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
};
