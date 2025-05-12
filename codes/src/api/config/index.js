// API Base URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
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

  // User endpoints
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile/update',
    DONATION_HISTORY: '/user/donations',
  },
};