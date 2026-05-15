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

export function middleware(request) {
  const url = request.nextUrl.clone();
  const { searchParams } = url;
  
  // Check if any tracking parameters exist
  const hasTrackingParams = TRACKING_PARAMS.some(param => 
    searchParams.has(param)
  );
  
  if (hasTrackingParams) {
    // Remove all tracking parameters
    TRACKING_PARAMS.forEach(param => {
      searchParams.delete(param);
    });
    
    // Redirect to clean URL
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