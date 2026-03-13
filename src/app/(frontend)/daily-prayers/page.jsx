'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

const DailyPrayersPage = () => {
  const [prayerData, setPrayerData] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

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

    fetchPrayerData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          <span className="text-lg text-gray-600">Loading Prayer Times...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 py-4 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-emerald-700 mb-1">
            Daily Prayer Times
          </h1>
          <p className="text-sm text-gray-600">Sydney, NSW - Australia</p>
        </div>

        {/* Live Clock Section */}
        <div className="bg-white rounded-lg shadow p-2 mb-3">
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-emerald-800">
              {formatSydneyTime()}
            </div>
            <div className="text-xs text-gray-600">
              {currentTime.toLocaleDateString('en-AU', { 
                timeZone: 'Australia/Sydney',
                weekday: 'short', 
                day: 'numeric',
                month: 'short'
              })}
            </div>
            {prayerData && (
              <div className="text-xs text-emerald-600 mt-1" dir="rtl">
                {prayerData.hijri_day_number} {prayerData.hijri_month}
              </div>
            )}
          </div>
        </div>

        {/* Prayer Times Section */}
        {prayerData && (
          <div className="flex justify-center">
            <div className="w-full max-w-xl">
              {/* Prayer Times Table */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-3">
                  <h2 className="text-lg font-semibold text-white text-center">
                    Today's Prayer Times
                  </h2>
                </div>
                
                <div className="p-4">
                {/* Table Header */}
                <div className="grid grid-cols-3 gap-2 mb-3 pb-2 border-b border-emerald-100">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-800">Salah</div>
                    <div className="text-emerald-600 text-xs" dir="rtl">صلاة</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-800">Adhan</div>
                    <div className="text-emerald-600 text-xs" dir="rtl">أذان</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-800">Iqamah</div>
                    <div className="text-emerald-600 text-xs" dir="rtl">إقامة</div>
                  </div>
                </div>
                
                {/* Prayer Rows */}
                <div className="space-y-2">
                  {['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'].map((prayer) => (
                    <div key={prayer} className="grid grid-cols-3 gap-2 py-2 border-b border-gray-50 hover:bg-emerald-25 rounded transition-colors">
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-700">{prayerNames.en[prayer]}</div>
                        <div className="text-emerald-600 text-xs" dir="rtl">{prayerNames.ar[prayer]}</div>
                      </div>
                      <div className="text-center text-sm font-mono font-bold text-gray-800">
                        {formatTime24Hour(prayerData[prayer])}
                      </div>
                      <div className="text-center text-sm font-mono font-bold text-emerald-700">
                        {calculateIqamahTime(prayerData[prayer], prayer)}
                      </div>
                    </div>
                  ))}
                  
                  {/* Jummah */}
                  {prayerData.iqama_jumma && (
                    <div className="grid grid-cols-3 gap-2 py-2 bg-emerald-50 rounded">
                      <div className="text-center">
                        <div className="text-sm font-medium text-emerald-800">{prayerNames.en.jumah}</div>
                        <div className="text-emerald-700 text-xs" dir="rtl">{prayerNames.ar.jumah}</div>
                      </div>
                      <div className="text-center text-sm font-mono font-bold text-emerald-800">
                        {prayerData.iqama_jumma?.substring(0, 5) || '-'}
                      </div>
                      <div className="text-center text-sm font-mono font-bold text-emerald-700">
                        {prayerData.iqama_jumma?.substring(0, 5) || '-'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="text-center mt-4 text-gray-600">
          <p className="text-xs">
            Prayer times are calculated for Sydney, NSW. Times may vary slightly in different areas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailyPrayersPage;