'use client';

import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAdminContext } from '@/components/admin/admin-context';

const AdminPageHeader = () => {
  const pathname = usePathname();
  const { pageTitle, pageSubtitle } = useAdminContext();

  // Generate breadcrumbs automatically
  const breadcrumbs = React.useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      return {
        name,
        path,
        isActive: index === segments.length - 1,
      };
    });
  }, [pathname]);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <div className="flex items-center justify-between">
            {/* Left side: Breadcrumbs */}
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

                {breadcrumbs.map((crumb, i) => (
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

            {/* Right side: Title & Subtitle */}
            <div className="text-right">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{pageTitle}</h1>
              {pageSubtitle && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{pageSubtitle}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminPageHeader;
