'use client';

import { Poppins } from 'next/font/google';
import '../../styles/globals.css';
import { AdminProvider } from '@/components/admin/layout/admin-context';
import AdminShell from '@/components/admin/layout/AdminShell';
import { Toaster } from '@/components/ui/sonner';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Import font outside of component to avoid re-instantiation
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Auth-exempt routes that don't require authentication
  const authExemptRoutes = ['/admin/login', '/admin/register', '/admin/forgot-password'];
  const isAuthRoute = authExemptRoutes.includes(pathname);

  useEffect(() => {
    // Check for authentication token in cookies
    const checkAuth = () => {
      const cookies = document.cookie.split(';');
      const adminToken = cookies.find((cookie) => cookie.trim().startsWith('admin_token='));

      if (adminToken) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);

        // Only redirect if not already on an auth page
        if (!isAuthRoute) {
          router.push('/admin/login');
        }
      }

      setIsLoading(false);
    };

    checkAuth();
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
  if (isAuthenticated) {
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
