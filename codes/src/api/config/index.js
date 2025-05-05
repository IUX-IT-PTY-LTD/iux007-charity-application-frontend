// API Base URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION;

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
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  
  // Events endpoints
  EVENTS: {
    LIST: '/events',
    DETAILS: (id) => `/events/${id}`,
    CREATE: '/events',
    UPDATE: (id) => `/events/${id}`,
    DELETE: (id) => `/events/${id}`,
  },
  
  // Donations endpoints
  DONATIONS: {
    LIST: '/donations',
    CREATE: '/donations',
    DETAILS: (id) => `/donations/${id}`,
  },

  // User endpoints
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile/update',
    DONATION_HISTORY: '/user/donations',
  },
};