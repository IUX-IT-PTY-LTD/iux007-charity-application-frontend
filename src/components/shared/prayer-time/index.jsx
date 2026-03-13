'use client';
import { useState, useEffect } from 'react';
import { commonService } from '@/api/services/app/commonService';
import axios from 'axios';

const PrayerTime = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldShowComponent, setShouldShowComponent] = useState(false);
  const [prayerData, setPrayerData] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const prayerNames = {
    en: {
      fajr: 'Fajr',
      sunrise: 'Sunrise',
      dhuhr: 'Dhuhr',
      asr: 'Asr',
      maghrib: 'Maghrib',
      isha: 'Isha'
    },
    ar: {
      fajr: 'الفجر',
      sunrise: 'الشروق',
      dhuhr: 'الظهر',
      asr: 'العصر',
      maghrib: 'المغرب',
      isha: 'العشاء'
    }
  };

  const arabicNumerals = {
    '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
    '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
  };

  const hijriMonths = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة',
    'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ];

  const arabicDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  const toArabicNumber = (num) => {
    return num.toString().split('').map(digit => arabicNumerals[digit] || digit).join('');
  };

  const formatTime12Hour = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${period}`;
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await commonService.getSettings();
        const settings = response?.data || [];
        
        const prayerTimeSetting = settings.find(setting => setting.key === 'show_prayer_time');
        const shouldShow = prayerTimeSetting?.value === '1' || prayerTimeSetting?.value === 1;
        
        setShouldShowComponent(shouldShow);
        
        if (shouldShow) {
          const savedMinimized = localStorage.getItem('prayerTimeMinimized');
          
          if (savedMinimized !== null) {
            setIsMinimized(JSON.parse(savedMinimized));
          }
          
          setIsVisible(true);
          localStorage.setItem('prayerTimeVisible', JSON.stringify(true));
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        setShouldShowComponent(true);
      }
    };

    fetchSettings();
  }, []);

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
    localStorage.setItem('prayerTimeMinimized', JSON.stringify(newMinimized));
  };

  const handleHide = () => {
    setIsVisible(false);
    localStorage.setItem('prayerTimeVisible', JSON.stringify(false));
  };

  if (!shouldShowComponent || !isVisible) {
    return null;
  }

  const formatDigitalTime = () => {
    const now = currentTime;
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const getArabicDate = () => {
    const now = currentTime;
    const dayName = arabicDays[now.getDay()];
    const dayNumber = toArabicNumber(now.getDate());
    const monthNumber = toArabicNumber(now.getMonth() + 1);
    const year = toArabicNumber(now.getFullYear());
    
    return {
      dayName,
      date: `${dayNumber}/${monthNumber}/${year}`,
      hijriInfo: prayerData ? `${toArabicNumber(prayerData.hijri_day_number)} ${prayerData.hijri_month}` : ''
    };
  };

  const arabicDate = getArabicDate();

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
      isMinimized ? 'w-16 h-16' : 'w-96 h-auto min-h-[24rem]'
    }`}>
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
          <div className="p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center space-y-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
                  <span className="text-sm text-gray-600">Loading Prayer Times...</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Digital Clock */}
                <div className="text-center bg-white rounded-lg p-4 shadow-sm border border-emerald-100">
                  <div className="text-2xl font-mono font-bold text-emerald-700 mb-1">
                    {formatDigitalTime()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {currentTime.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>

                {/* Arabic Date */}
                <div className="text-center bg-white rounded-lg p-3 shadow-sm border border-emerald-100">
                  <div className="text-lg font-semibold text-emerald-700 mb-1" dir="rtl">
                    {arabicDate.dayName}
                  </div>
                  <div className="text-sm text-gray-600" dir="rtl">
                    {arabicDate.date}
                  </div>
                  {arabicDate.hijriInfo && (
                    <div className="text-sm text-emerald-600 mt-1" dir="rtl">
                      {arabicDate.hijriInfo}
                    </div>
                  )}
                </div>

                {/* Prayer Times */}
                {prayerData && (
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-emerald-100">
                    <div className="space-y-2">
                      {['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'].map((prayer) => (
                        <div key={prayer} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-700">
                              {prayerNames.en[prayer]}
                            </span>
                            <span className="text-xs text-emerald-600" dir="rtl">
                              {prayerNames.ar[prayer]}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-emerald-700">
                              {formatTime12Hour(prayerData[prayer])}
                            </div>
                            <div className="text-xs text-gray-500">
                              {prayerData[prayer]}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {prayerData.iqama_jumma && (
                      <div className="mt-3 pt-3 border-t border-emerald-100">
                        <div className="flex justify-between items-center">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-700">Jummah</span>
                            <span className="text-xs text-emerald-600" dir="rtl">الجمعة</span>
                          </div>
                          <div className="text-sm font-semibold text-emerald-700">
                            {prayerData.iqama_jumma}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
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

export default PrayerTime;