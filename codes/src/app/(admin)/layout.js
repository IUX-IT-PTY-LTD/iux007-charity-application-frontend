// src/app/(admin)/layout.js

import { Poppins } from 'next/font/google';
import '../../styles/globals.css';
import { AdminProvider } from '@/components/admin/layout/admin-context';
import AdminShell from '@/components/admin/layout/AdminShell';
import { Toaster } from '@/components/ui/sonner';

export const metadata = {
  title: 'Charity Admin',
  description: 'Charity is Noble | Developed By IUX IT Pty Ltd',
  icons: {
    icon: '/favicon.ico',
  },
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export default function AdminLayout({ children }) {
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
