"use client";

import React from "react";
import Link from "next/link";
import { Heart, Github, ExternalLink } from "lucide-react";

const AdminFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white py-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Copyright */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {currentYear} Charity Co. All rights reserved.
          </div>

          {/* Center item - can be version or status */}
          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
            <span>Version 0.1.0</span>
            <span
              className="inline-block h-2 w-2 rounded-full bg-green-500"
              title="System online"
            ></span>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/help"
              className="flex items-center text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            >
              Help
            </Link>
            <Link
              href="/admin/documentation"
              className="flex items-center text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            >
              Docs
            </Link>

            {/* Optional external link to GitHub or other resource */}
            <Link
              href="https://github.com/yourusername/yourproject"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            >
              <Github className="mr-1 h-4 w-4" />
              <span className="sr-only sm:not-sr-only">GitHub</span>
            </Link>
          </div>
        </div>

        {/* Optional secondary footer with additional info */}
        <div className="mt-4 flex items-center justify-center text-xs text-gray-400 dark:text-gray-500">
          <span>
            Developed by <a href="https://iuxit.com.au/">IUX IT Pty Ltd</a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
