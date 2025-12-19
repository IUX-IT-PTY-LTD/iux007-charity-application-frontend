'use client';

import { useEffect } from 'react';
import { getAllSettings, getSettingByKey } from '@/api/services/admin/settingsService';

const DynamicFavicon = () => {
  useEffect(() => {
    const loadCompanySettings = async () => {
      try {
        const response = await getAllSettings();
        
        if (response.status === 'success' && response.data) {
          // Get company logo for favicon
          const logoSetting = getSettingByKey(response.data, 'company_logo');
          if (logoSetting?.value) {
            // Update existing favicon links
            const existingFaviconLinks = document.querySelectorAll('link[rel*="icon"]');
            existingFaviconLinks.forEach(link => {
              link.href = logoSetting.value;
            });

            // If no favicon links exist, create them
            if (existingFaviconLinks.length === 0) {
              const link = document.createElement('link');
              link.rel = 'icon';
              link.href = logoSetting.value;
              document.head.appendChild(link);
            }
          }

          // Get company name for title
          const nameSetting = getSettingByKey(response.data, 'company_name');
          if (nameSetting?.value) {
            document.title = `${nameSetting.value} - Admin Panel`;
          }
        }
      } catch (error) {
        console.warn('Failed to load company settings for favicon:', error);
      }
    };

    loadCompanySettings();
  }, []);

  return null; // This component doesn't render anything
};

export default DynamicFavicon;