import "../../../styles/globals.css";
import { Suspense } from "react";
import AdminSidebar from "@/components/admin/sidebar";
import AdminPageHeader from "@/components/admin/header";
import AdminFooter from "@/components/admin/footer";
import { AdminProvider } from "@/components/admin/admin-context";

export const metadata = {
  title: "Charity Admin",
  description: "Developed By IUX IT Pty Ltd",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-gray-900">
        <AdminProvider>
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className="shrink-0">
              <AdminSidebar />
            </div>

            {/* Main Content */}
            <div className="flex flex-col flex-1 min-w-0">
              {/* Header - wrapped in Suspense for pathname access */}
              <Suspense
                fallback={
                  <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"></div>
                }
              >
                <AdminPageHeader />
              </Suspense>

              {/* Main Content Area */}
              <main className="flex-1 p-4 md:p-6">{children}</main>

              {/* Footer */}
              <AdminFooter />
            </div>
          </div>
        </AdminProvider>
      </body>
    </html>
  );
}
