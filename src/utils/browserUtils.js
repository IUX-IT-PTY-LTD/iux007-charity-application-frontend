// Utility functions for browser detection and handling

/**
 * Check if the current browser is Facebook's in-app browser
 */
export function isFacebookBrowser() {
  if (typeof globalThis.window === 'undefined') return false;
  
  const userAgent = navigator.userAgent;
  return userAgent.includes('FBAN') || 
         userAgent.includes('FBAV') || 
         userAgent.includes('Instagram') ||
         userAgent.includes('FB_IAB') ||
         userAgent.includes('FBBV');
}

/**
 * Get Facebook-safe headers for API requests
 */
export function getFacebookSafeHeaders(baseHeaders = {}) {
  if (!isFacebookBrowser()) {
    return baseHeaders;
  }
  
  // Remove problematic headers for Facebook browser
  const { 
    'Access-Control-Allow-Origin': _,
    'Cache-Control': __,
    'Pragma': ___,
    'Expires': ____,
    ...safeHeaders 
  } = baseHeaders;
  
  return {
    ...safeHeaders,
    // Add Facebook-friendly headers
    'X-Requested-With': 'XMLHttpRequest',
  };
}

/**
 * Get Facebook-safe fetch options
 */
export function getFacebookSafeFetchOptions(options = {}) {
  if (!isFacebookBrowser()) {
    return options;
  }
  
  return {
    ...options,
    // Remove cache control for Facebook browser
    cache: 'no-store',
    // Add credentials if needed
    credentials: 'include',
    headers: getFacebookSafeHeaders(options.headers || {}),
  };
}