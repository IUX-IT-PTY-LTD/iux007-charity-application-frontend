'use client';
import { useState, useEffect } from 'react';
import { commonService } from '@/api/services/app/commonService';

const MasjidIframe = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldShowComponent, setShouldShowComponent] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await commonService.getSettings();
        const settings = response?.data || [];
        
        const prayerTimeSetting = settings.find(setting => setting.key === 'show_prayer_time');
        const shouldShow = prayerTimeSetting?.value === '1' || prayerTimeSetting?.value === 1;
        
        setShouldShowComponent(shouldShow);
        
        if (shouldShow) {
          const savedMinimized = localStorage.getItem('masjidIframeMinimized');
          
          if (savedMinimized !== null) {
            setIsMinimized(JSON.parse(savedMinimized));
          }
          
          setIsVisible(true);
          localStorage.setItem('masjidIframeVisible', JSON.stringify(true));
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        setShouldShowComponent(false);
      }
    };

    fetchSettings();
  }, []);

  const toggleMinimize = () => {
    const newMinimized = !isMinimized;
    setIsMinimized(newMinimized);
    localStorage.setItem('masjidIframeMinimized', JSON.stringify(newMinimized));
  };

  const handleHide = () => {
    setIsVisible(false);
    localStorage.setItem('masjidIframeVisible', JSON.stringify(false));
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  if (!shouldShowComponent || !isVisible) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
      isMinimized ? 'w-16 h-16' : 'w-80 h-96'
    }`}>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 h-full">
        <div className="flex items-center justify-between p-2 bg-gray-100 rounded-t-lg border-b border-gray-200">
          <span className={`text-sm font-medium text-gray-700 ${isMinimized ? 'hidden' : 'block'}`}>
            Prayer Time
          </span>
          <div className="flex items-center space-x-1">
            <button
              onClick={toggleMinimize}
              className="p-1 rounded hover:bg-gray-200 transition-colors duration-200"
              title={isMinimized ? 'Expand' : 'Minimize'}
            >
              <svg 
                className="w-4 h-4 text-gray-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {isMinimized ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                )}
              </svg>
            </button>
            <button
              onClick={handleHide}
              className="p-1 rounded hover:bg-gray-200 transition-colors duration-200"
              title="Close"
            >
              <svg 
                className="w-4 h-4 text-gray-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {!isMinimized && (
          <div className="h-full pb-10 relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-b-lg z-10">
                <div className="flex flex-col items-center space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                  <span className="text-sm text-gray-600">Loading Prayer Time...</span>
                </div>
              </div>
            )}
            <iframe
              src="https://www.seftonmasjid.org/"
              className="w-full h-full rounded-b-lg border-0"
              title="Sefton Masjid"
              allowFullScreen
              onLoad={handleIframeLoad}
              style={{
                transform: 'scale(0.7)',
                transformOrigin: 'top left',
                width: '142.86%',
                height: '142.86%'
              }}
            />
          </div>
        )}
        
        {isMinimized && (
          <div className="flex items-center justify-center h-12">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg 
                className="w-4 h-4 text-white" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MasjidIframe;