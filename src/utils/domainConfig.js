/**
 * Domain-based configuration utility
 * This allows you to use different environment variables based on the domain
 * Perfect for deploying the same codebase to multiple domains with different configs
 */

// Domain configurations
const DOMAIN_CONFIGS = {
  // Primary domain configuration
  'hafcai.org': {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL_HAFCAI_PROD,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_HAFCAI_PROD,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_CLIENT_SECRET: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
  },

  'admin.hafcai.org': {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL_HAFCAI_PROD,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_HAFCAI_PROD,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_CLIENT_SECRET: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
  },
  
  // Secondary domain configuration
  'staging.hafcai.org': {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL_HAFCAI_STAGING,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_HAFCAI_STAGING,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_CLIENT_SECRET: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
  },

  // Custom domain configuration
  'bicnsw.iuxit.com.au': {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL_BICNSW,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_BICNSW,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_CLIENT_SECRET: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
  },

  'bicnsw.org.au': {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL_BICNSW_PROD,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_BICNSW_PROD,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_CLIENT_SECRET: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
  },

  'localhost:3000': {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_CLIENT_SECRET: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
  },

};

// Default configuration (fallback)
const DEFAULT_CONFIG = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || '',
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: '',
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  NEXT_PUBLIC_GOOGLE_CLIENT_SECRET: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || ''
};

/**
 * Get the current domain from window.location or headers
 * Works both client-side and server-side
 */
function getCurrentDomain() {
  // Client-side
  if (typeof window !== 'undefined') {
    return window.location.host;
  }
  
  // Server-side (during SSR)
  // You can also get this from headers in getServerSideProps or API routes
  const host = process.env.VERCEL_URL || 'localhost:3000';
  return host;
}

/**
 * Get configuration based on current domain
 * @param {string} domain - Optional domain override
 * @returns {object} Domain-specific configuration
 */
export function getDomainConfig(domain = null) {
  const currentDomain = domain || getCurrentDomain();
  
  // Find exact match first
  if (DOMAIN_CONFIGS[currentDomain]) {
    return DOMAIN_CONFIGS[currentDomain];
  }
  
  // Find partial match (useful for Vercel preview deployments)
  const matchingDomain = Object.keys(DOMAIN_CONFIGS).find(configDomain => 
    currentDomain.includes(configDomain.split('.')[0]) || 
    configDomain.includes(currentDomain.split('.')[0])
  );
  
  if (matchingDomain) {
    return DOMAIN_CONFIGS[matchingDomain];
  }
  
  // Return default config if no match found
  return DEFAULT_CONFIG;
}

/**
 * Get a specific config value by key
 * @param {string} key - Configuration key
 * @param {string} domain - Optional domain override
 * @returns {any} Configuration value
 */
export function getConfigValue(key, domain = null) {
  const config = getDomainConfig(domain);
  return config[key];
}

/**
 * Check if current domain matches a specific domain
 * @param {string} targetDomain - Domain to check against
 * @returns {boolean} Whether domains match
 */
export function isDomain(targetDomain) {
  const currentDomain = getCurrentDomain();
  return currentDomain === targetDomain || currentDomain.includes(targetDomain);
}

/**
 * Hook for React components to get domain config
 * @returns {object} Domain-specific configuration
 */
export function useDomainConfig() {
  const [config, setConfig] = React.useState(DEFAULT_CONFIG);
  
  React.useEffect(() => {
    setConfig(getDomainConfig());
  }, []);
  
  return config;
}

// Export the configurations for direct access if needed
export { DOMAIN_CONFIGS, DEFAULT_CONFIG };