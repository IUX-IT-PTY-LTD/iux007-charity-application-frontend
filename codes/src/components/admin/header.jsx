"use client";

import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAdminContext } from "@/components/admin/admin-context"; // Import the context

const AdminPageHeader = () => {
  const pathname = usePathname();
  // Get title and subtitle from context
  const { pageTitle, pageSubtitle } = useAdminContext();

  // Generate breadcrumbs automatically
  const autoBreadcrumbs = React.useMemo(() => {
    // Get path segments and create breadcrumbs
    const segments = pathname.split("/").filter(Boolean);
    return segments.map((segment, index) => {
      // Build path up to this point
      const path = `/${segments.slice(0, index + 1).join("/")}`;

      // Format display name
      const name =
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

      return {
        name,
        path,
        isActive: index === segments.length - 1,
      };
    });
  }, [pathname]);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-1">
          {/* Breadcrumbs */}
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link
                  href="/admin/dashboard"
                  className="flex items-center hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <Home className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              </li>

              {autoBreadcrumbs.map((crumb, i) => (
                <React.Fragment key={i}>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />
                    {crumb.isActive ? (
                      <span className="text-gray-700 dark:text-gray-200 font-medium">
                        {crumb.name}
                      </span>
                    ) : (
                      <Link
                        href={crumb.path}
                        className="hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {crumb.name}
                      </Link>
                    )}
                  </li>
                </React.Fragment>
              ))}
            </ol>
          </nav>

          {/* Title & Subtitle */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {pageTitle}
              </h1>
              {pageSubtitle && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {pageSubtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPageHeader;
