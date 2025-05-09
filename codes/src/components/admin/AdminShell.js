"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { AdminSidebar, MainContent } from "@/components/admin/sidebar";
import AdminPageHeader from "@/components/admin/header";
import AdminFooter from "@/components/admin/footer";
import { Suspense } from "react";

export default function AdminShell({ children }) {
  const sidebar = useSidebar();
  const isCollapsed = sidebar?.collapsed;

  const sidebarWidth = isCollapsed
    ? "var(--sidebar-width-collapsed)"
    : "var(--sidebar-width)";

  return (
    <div
      className="flex h-screen w-full transition-all duration-300 ease-in-out"
      style={{ "--sidebar-width-current": sidebarWidth }}
    >
      <div
        className="shrink-0 transition-all duration-300 ease-in-out"
        style={{ width: "var(--sidebar-width-current)" }}
      >
        <AdminSidebar />
      </div>

      <div
        className="flex-1 flex flex-col overflow-hidden transition-all duration-300"
        style={{ width: "calc(100% - var(--sidebar-width-current))" }}
      >
        <MainContent>
          <Suspense
            fallback={
              <div className="h-16 bg-background border-b border-border/40 flex items-center px-4">
                <div className="h-6 w-48 bg-muted/30 rounded animate-pulse"></div>
              </div>
            }
          >
            <AdminPageHeader />
          </Suspense>

          <div className="flex-1 overflow-auto">
            <div className="container p-6 mx-auto max-w-7xl">{children}</div>
          </div>

          <AdminFooter />
        </MainContent>
      </div>
    </div>
  );
}
