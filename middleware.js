import { NextResponse } from 'next/server';

// Facebook and other tracking parameters to remove
const TRACKING_PARAMS = [
  'fbclid',      // Facebook Click Identifier
  'gclid',       // Google Click Identifier  
  'utm_source',  // UTM tracking
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
];

// Check if request is from Facebook's in-app browser
function isFacebookBrowser(userAgent) {
  return userAgent.includes('FBAN') || userAgent.includes('FBAV') || userAgent.includes('Instagram');
}

export function middleware(request) {
  const url = request.nextUrl.clone();
  const { searchParams } = url;
  const userAgent = request.headers.get('user-agent') || '';
  
  // Check if any tracking parameters exist
  const hasTrackingParams = TRACKING_PARAMS.some(param => 
    searchParams.has(param)
  );
  
  if (hasTrackingParams) {
    // For Facebook in-app browser, use rewrite instead of redirect to avoid CORS issues
    if (isFacebookBrowser(userAgent)) {
      // Remove tracking parameters
      TRACKING_PARAMS.forEach(param => {
        searchParams.delete(param);
      });
      
      // Rewrite the URL instead of redirecting
      return NextResponse.rewrite(url);
    }
    
    // For regular browsers, use redirect
    TRACKING_PARAMS.forEach(param => {
      searchParams.delete(param);
    });
    
    return NextResponse.redirect(url);
  }
  
  // Continue with the request if no tracking parameters
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  // Run on all paths except API routes, static files, and Next.js internals
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};