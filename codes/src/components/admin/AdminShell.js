"use client";

import { AdminSidebar } from "@/components/admin/sidebar";
import AdminPageHeader from "@/components/admin/header";
import AdminFooter from "@/components/admin/footer";
import { Suspense } from "react";

export default function AdminShell({ children }) {
  return (
    <div className="fixed inset-0 flex h-screen w-full bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - fixed width */}
      <aside className="h-full w-[230px] border-r border-gray-200 dark:border-gray-800">
        <AdminSidebar />
      </aside>

      {/* Main content area */}
      <main className="flex flex-col flex-1 h-full">
        <Suspense
          fallback={
            <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          }
        >
          <AdminPageHeader />
        </Suspense>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-auto">
          <div className="container py-6 px-4 mx-auto max-w-7xl">
            {children}
          </div>
        </div>

        {/* Footer - always visible at bottom */}
        <AdminFooter />
      </main>
    </div>
  );
}
