// API Base URL
export const API_BASE_URL = 'http://localhost:9094/api';
export const API_VERSION = 'v1';

// API Endpoints
export const ENDPOINTS = {
  // Common endpoints
  COMMON: {
    MENUS: '/menus',
    SLIDERS: '/sliders',
    FAQ: '/faq',
    CONATCTUS: '/contactus',
    SETTINGS: '/settings',
  },
  // Auth endpoints
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/registration',
    LOGOUT: '/logout',
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
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile/update',
    DONATION_HISTORY: '/user/donations',
  },
};
