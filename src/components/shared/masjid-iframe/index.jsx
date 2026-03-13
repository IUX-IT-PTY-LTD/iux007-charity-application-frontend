'use client';
import { useState, useEffect } from 'react';
import { commonService } from '@/api/services/app/commonService';
import axios from 'axios';

const MasjidIframe = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldShowComponent, setShouldShowComponent] = useState(false);
  const [prayerData, setPrayerData] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);

  const prayerNames = {
    en: {
      fajr: 'Fajr',
      sunrise: 'Shurooq',
      dhuhr: 'Dhuhr',
      asr: 'Asr',
      maghrib: 'Maghrib',
      isha: 'Isha',
      jumah: 'Jumu\'ah'
    },
    ar: {
      fajr: 'فجر',
      sunrise: 'شروق',
      dhuhr: 'ظهر',
      asr: 'عصر',
      maghrib: 'مغرب',
      isha: 'عشاء',
      jumah: 'جمعة'
    }
  };

  const arabicNumerals = {
    '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
    '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
  };

  const arabicDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  const toArabicNumber = (num) => {
    return num.toString().split('').map(digit => arabicNumerals[digit] || digit).join('');
  };

  const formatTime24Hour = (time24) => {
    if (!time24) return '';
    return time24.substring(0, 5);
  };

  const calculateIqamahTime = (adhanTime, prayer) => {
    if (!adhanTime) return '-';
    
    const iqamahDelays = {
      fajr: 20,
      dhuhr: 10,
      asr: 10,
      maghrib: 5,
      isha: 10
    };
    
    if (prayer === 'sunrise') return '-';
    
    const delay = iqamahDelays[prayer] || 0;
    if (delay === 0) return '-';
    
    const [hours, minutes] = adhanTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + delay;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    
    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
      
      // Initially hide on mobile devices
      if (isMobileDevice) {
        const savedVisible = localStorage.getItem('masjidIframeVisible');
        if (savedVisible === null) {
          setIsVisible(false);
          localStorage.setItem('masjidIframeVisible', JSON.stringify(false));
        } else {
          setIsVisible(JSON.parse(savedVisible));
        }
      }
    };

    const fetchSettings = async () => {
      try {
        const response = await commonService.getSettings();
        const settings = response?.data || [];
        
        const prayerTimeSetting = settings.find(setting => setting.key === 'show_prayer_time');
        const shouldShow = prayerTimeSetting?.value === '1' || prayerTimeSetting?.value === 1;
        
        setShouldShowComponent(shouldShow);
        
        if (shouldShow && !isMobile) {
          const savedMinimized = localStorage.getItem('masjidIframeMinimized');
          
          if (savedMinimized !== null) {
            setIsMinimized(JSON.parse(savedMinimized));
          }
          
          const savedVisible = localStorage.getItem('masjidIframeVisible');
          if (savedVisible !== null) {
            setIsVisible(JSON.parse(savedVisible));
          } else {
            setIsVisible(true);
            localStorage.setItem('masjidIframeVisible', JSON.stringify(true));
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        setShouldShowComponent(true);
      }
    };

    checkMobile();
    fetchSettings();

    const handleResize = () => {
      checkMobile();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  useEffect(() => {
    const fetchPrayerData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('https://seftonmasjid.org/api/prayer');
        setPrayerData(response.data);
      } catch (error) {
        console.error('Error fetching prayer data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (shouldShowComponent) {
      fetchPrayerData();
    }
  }, [shouldShowComponent]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
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

  const formatSydneyTime = () => {
    const sydneyTime = new Date().toLocaleString('en-AU', {
      timeZone: 'Australia/Sydney',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    return sydneyTime;
  };

  if (!shouldShowComponent) {
    return null;
  }

  // Show floating button on mobile when hidden
  if (isMobile && !isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => {
            setIsVisible(true);
            localStorage.setItem('masjidIframeVisible', JSON.stringify(true));
          }}
          className="w-14 h-14 bg-emerald-600 hover:bg-emerald-700 rounded-full shadow-lg flex items-center justify-center transition-all duration-200"
          title="Show Prayer Times"
        >
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z" />
          </svg>
        </button>
      </div>
    );
  }

  if (!isVisible) {
    return null;
  }

  const getComponentSize = () => {
    if (isMinimized) return 'w-16 h-16';
    if (isMobile) return 'w-72 h-[40vh]';
    return 'w-80 h-[50vh]';
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${getComponentSize()}`}>
      <div className="bg-gradient-to-b from-emerald-50 to-green-50 rounded-lg shadow-lg border border-emerald-200 h-full">
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-600 to-green-600 rounded-t-lg">
          <span className={`text-sm font-semibold text-white ${isMinimized ? 'hidden' : 'flex items-center space-x-2'}`}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z" />
            </svg>
            <span>Prayer Times</span>
          </span>
          <div className="flex items-center space-x-1">
            <button
              onClick={toggleMinimize}
              className="p-1 rounded hover:bg-white/20 transition-colors duration-200"
              title={isMinimized ? 'Expand' : 'Minimize'}
            >
              <svg 
                className="w-4 h-4 text-white" 
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
              className="p-1 rounded hover:bg-white/20 transition-colors duration-200"
              title="Close"
            >
              <svg 
                className="w-4 h-4 text-white" 
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
          <div className="flex flex-col overflow-hidden" style={{ height: 'calc(100% - 60px)' }}>
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="p-3">
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-emerald-500"></div>
                    <span className="text-xs text-gray-600">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Live Clock */}
                  <div className="text-center bg-white rounded p-3 shadow-sm border border-emerald-100">
                    <div className="text-xl font-mono font-bold text-emerald-700 mb-1">
                      {formatSydneyTime()}
                    </div>
                    <div className="text-xs text-gray-600">Sydney, NSW</div>
                  </div>

                {/* Prayer Times Table */}
                {prayerData && (
                  <div className="bg-white rounded shadow-sm border border-emerald-100">
                    {/* Header */}
                    <div className="grid grid-cols-3 gap-2 p-2 bg-gray-50 text-xs font-semibold text-center border-b">
                      <div>
                        <div>Salah</div>
                        <div className="text-emerald-600" dir="rtl">صلاة</div>
                      </div>
                      <div>
                        <div>Adhan</div>
                        <div className="text-emerald-600" dir="rtl">أذان</div>
                      </div>
                      <div>
                        <div>Iqamah</div>
                        <div className="text-emerald-600" dir="rtl">إقامة</div>
                      </div>
                    </div>
                    
                    {/* Prayer Rows */}
                    <div className="divide-y divide-gray-100">
                      {['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'].map((prayer) => (
                        <div key={prayer} className="grid grid-cols-3 gap-2 p-2 text-xs">
                          <div className="flex flex-col items-center">
                            <span className="font-medium text-gray-700">{prayerNames.en[prayer]}</span>
                            <span className="text-emerald-600" dir="rtl">{prayerNames.ar[prayer]}</span>
                          </div>
                          <div className="text-center font-mono font-semibold text-gray-800">
                            {formatTime24Hour(prayerData[prayer])}
                          </div>
                          <div className="text-center font-mono font-semibold text-emerald-700">
                            {calculateIqamahTime(prayerData[prayer], prayer)}
                          </div>
                        </div>
                      ))}
                      
                      {/* Jummah */}
                      {prayerData.iqama_jumma && (
                        <div className="grid grid-cols-3 gap-2 p-2 text-xs bg-emerald-50">
                          <div className="flex flex-col items-center">
                            <span className="font-medium text-gray-700">{prayerNames.en.jumah}</span>
                            <span className="text-emerald-600" dir="rtl">{prayerNames.ar.jumah}</span>
                          </div>
                          <div className="text-center font-mono font-semibold text-gray-800">
                            {prayerData.iqama_jumma?.substring(0, 5) || '-'}
                          </div>
                          <div className="text-center font-mono font-semibold text-emerald-700">
                            {prayerData.iqama_jumma?.substring(0, 5) || '-'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  )}
                </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {isMinimized && (
          <div className="flex items-center justify-center h-12">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
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