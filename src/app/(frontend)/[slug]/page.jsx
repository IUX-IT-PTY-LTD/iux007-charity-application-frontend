'use client';

import React, { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { getPageBySlug } from '@/api/services/app/pageBuilderService';
import ComponentRenderer from '@/components/page-builder/ComponentRenderer';

export default function DynamicPage() {
  const params = useParams();
  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await getPageBySlug(params.slug);
        
        if (response.status === 'success') {
          // Check if page is active
          if (!response.data.status) {
            notFound();
            return;
          }
          
          setPageData(response.data);

          // Update head tags using direct DOM manipulation
          if (typeof document !== 'undefined') {
            const pageTitle = response.data.meta_title || response.data.title;
            const pageDescription = response.data.meta_description || `${response.data.title} page`;

            // Update title
            document.title = pageTitle;

            // Update meta description
            let metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
              metaDesc.content = pageDescription;
            } else {
              metaDesc = document.createElement('meta');
              metaDesc.name = 'description';
              metaDesc.content = pageDescription;
              document.head.appendChild(metaDesc);
            }

            // Update OG tags
            let ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle) {
              ogTitle.content = pageTitle;
            } else {
              ogTitle = document.createElement('meta');
              ogTitle.property = 'og:title';
              ogTitle.content = pageTitle;
              document.head.appendChild(ogTitle);
            }

            let ogDesc = document.querySelector('meta[property="og:description"]');
            if (ogDesc) {
              ogDesc.content = pageDescription;
            } else {
              ogDesc = document.createElement('meta');
              ogDesc.property = 'og:description';
              ogDesc.content = pageDescription;
              document.head.appendChild(ogDesc);
            }

            let ogType = document.querySelector('meta[property="og:type"]');
            if (ogType) {
              ogType.content = 'website';
            } else {
              ogType = document.createElement('meta');
              ogType.property = 'og:type';
              ogType.content = 'website';
              document.head.appendChild(ogType);
            }
          }
        } else {
          throw new Error(response.message || 'Page not found');
        }
      } catch (error) {
        console.error('Error fetching page:', error);
        setError(error.message);
        // If it's a 404 error, trigger Next.js 404 page
        if (error.message.includes('not found') || error.status === 404) {
          notFound();
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (params.slug) {
      fetchPage();
    }
  }, [params.slug]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading page...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
          <a 
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  // Page not found
  if (!pageData) {
    notFound();
  }

  return (
    <>
      {/* SEO Meta Tags - Note: Head tags are now handled via DOM manipulation in useEffect */}
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto">
          {pageData.content_data && pageData.content_data.length > 0 ? (
            pageData.content_data.map((component, index) => (
              <div key={component.id || index}>
                <ComponentRenderer component={component} />
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{pageData.title}</h1>
                <p className="text-gray-600">This page is currently empty.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}