'use client';

import { Poppins } from 'next/font/google';
import '../../styles/globals.css';
import { AdminProvider } from '@/components/admin/layout/admin-context';
import AdminShell from '@/components/admin/layout/AdminShell';
import { Toaster } from '@/components/ui/sonner';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Import auth service
import { isAuthenticated } from '@/api/services/admin/authService';

// Import font outside of component to avoid re-instantiation
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authStatus, setAuthStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Auth-exempt routes that don't require authentication
  const authExemptRoutes = [
    '/admin/login',
    '/admin/register',
    '/admin/forgot-password',
    '/admin/reset-password',
  ];
  const isAuthRoute = authExemptRoutes.some((route) => pathname.startsWith(route));

  useEffect(() => {
    // Check authentication using our auth service
    const checkAuth = () => {
      // Using localStorage-based authentication
      const authenticated = isAuthenticated();
      setAuthStatus(authenticated);

      // Only redirect if not already on an auth page and not authenticated
      if (!authenticated && !isAuthRoute) {
        router.push('/admin/login');
      }

      setIsLoading(false);
    };

    // Small delay to ensure client-side code runs properly
    // This helps with SSR/hydration issues
    const timer = setTimeout(() => {
      checkAuth();
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, router, isAuthRoute]);

  // Show a minimal loading state while checking authentication
  if (isLoading) {
    return (
      <html lang="en" className={poppins.className}>
        <body className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </body>
      </html>
    );
  }

  // If it's an auth route (login, register, forgot-password), render without admin shell
  if (isAuthRoute) {
    return (
      <html lang="en" suppressHydrationWarning className={poppins.className}>
        <body className="admin-auth-layout antialiased">
          {children}
          <Toaster />
        </body>
      </html>
    );
  }

  // For authenticated admin routes, render with admin shell
  if (authStatus) {
    return (
      <html lang="en" suppressHydrationWarning className={poppins.className}>
        <body className="overflow-hidden bg-background text-foreground antialiased">
          <AdminProvider>
            <AdminShell>{children}</AdminShell>
            <Toaster />
          </AdminProvider>
        </body>
      </html>
    );
  }

  // This will rarely be reached due to the redirect in useEffect
  // But adding as a fallback - shows a basic loading state
  return (
    <html lang="en" className={poppins.className}>
      <body className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </body>
    </html>
  );
}
