'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { apiService } from '@/api/services/app/apiService';
import { ENDPOINTS } from '@/api/config';
import { useRouter } from 'next/navigation';
import { set } from 'date-fns';


const FAQ = () => {
  const [faqData, setFaqData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState(null);
  
  const fetchFAQData = async (forceFresh = false) => {
    try {
      setIsLoading(true);
      
      // Add cache busting parameter for fresh data
      const cacheParam = forceFresh ? `?_refresh=${Date.now()}` : `?_t=${Date.now()}`;
      const endpoint = `${ENDPOINTS.COMMON.FAQ}${cacheParam}`;
      
      const response = await apiService.get(endpoint, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      console.log('FAQ API Response:', response);
      
      if(response.status === 'success') {
        setFaqData(response.data || []);
        setLastFetch(Date.now());
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching FAQ data:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }

  // Auto-refresh data periodically when page is visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && lastFetch) {
        const timeSinceLastFetch = Date.now() - lastFetch;
        // Refresh if it's been more than 5 minutes
        if (timeSinceLastFetch > 5 * 60 * 1000) {
          fetchFAQData(true);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [lastFetch]);
  const handleAccordion = (e) => {
    const accordion = e.target.closest("[role='accordion']");
    // hide all other accordions
    const accordions = document.querySelectorAll("[role='accordion']");
    accordions.forEach((acc) => {
      if (acc !== accordion) {
        const content = acc.querySelector('div');
        const minus = acc.querySelector('.minus');
        const plus = acc.querySelector('.plus');
        content.classList.add('hidden');
        minus.classList.add('hidden');
        plus.classList.remove('hidden');
      }
    });
    const content = accordion.querySelector('div');
    const minus = accordion.querySelector('.minus');
    const plus = accordion.querySelector('.plus');
    content.classList.toggle('hidden');
    minus.classList.toggle('hidden');
    plus.classList.toggle('hidden');
  };

  useEffect(() => {
    fetchFAQData(true); // Force fresh data on initial load
  }, []);

  // Clear all caches and force refresh
  const clearCacheAndRefresh = async () => {
    try {
      // Clear service worker caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }
      
      // Clear session storage
      sessionStorage.clear();
      
      // Force fresh data fetch
      await fetchFAQData(true);
    } catch (error) {
      console.error('Error clearing cache:', error);
      // Still try to fetch fresh data even if cache clearing fails
      await fetchFAQData(true);
    }
  };

  return (
    <div className="rounded-lg container mx-auto py-16 flex flex-col items-center">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-4">
          <h2 className="sm:text-4xl text-2xl font-bold text-primary">FAQ</h2>
          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={clearCacheAndRefresh}
              className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors"
              title="Clear cache and refresh data"
            >
              🔄 Refresh
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 max-w-2xl w-full">
        <div className="grid-item space-y-4 w-full">
          {isLoading ? (
            <div className="border border-gray-200 rounded-lg shadow-sm p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-700">Loading FAQs...</p>
            </div>
          ) : faqData.length > 0 ? (
            faqData.map((faq) => (
              <div 
                key={faq.id} 
                role="accordion"
                className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 w-full"
              >
                <button
                  type="button"
                  className="w-full text-left font-semibold p-6 text-gray-800 flex items-center bg-white rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  onClick={handleAccordion}
                >
                  <span className="mr-4 text-lg">{faq.question}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 fill-current ml-auto shrink-0 minus hidden text-primary transition-transform duration-300 ease-in-out"
                    viewBox="0 0 124 124"
                  >
                    <path
                      d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z"
                      data-original="#000000"
                    />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 fill-current ml-auto shrink-0 plus text-primary transition-transform duration-300 ease-in-out"
                    viewBox="0 0 42 42"
                  >
                    <path
                      d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                      data-original="#000000"
                    />
                  </svg>
                </button>
                <div className="overflow-hidden transition-all duration-300 ease-in-out hidden">
                  <div className="p-6 bg-gray-50 rounded-b-lg">
                    <div 
                      className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="border border-gray-200 rounded-lg shadow-sm p-6 text-center">
              <p className="text-gray-700">No FAQ data found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
