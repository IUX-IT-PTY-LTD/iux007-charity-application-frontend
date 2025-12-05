'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { apiService } from '@/api/services/app/apiService';
import { ENDPOINTS } from '@/api/config';

export default function DynamicHead() {
  const [settings, setSettings] = useState({});
  const pathname = usePathname();

  const updateHeadElements = (finalSettings) => {
    if (typeof document !== 'undefined') {
      // Update title
      document.title = finalSettings.site_name;

      // Update or create favicon
      let favicon = document.querySelector('link[rel="icon"]') || document.createElement('link');
      favicon.rel = 'icon';
      favicon.href = finalSettings.logo || '/favicon.ico';
      if (!document.querySelector('link[rel="icon"]')) {
        document.head.appendChild(favicon);
      }

      // Update apple-touch-icon
      let appleIcon = document.querySelector('link[rel="apple-touch-icon"]') || document.createElement('link');
      appleIcon.rel = 'apple-touch-icon';
      appleIcon.href = finalSettings.logo || '/favicon.ico';
      if (!document.querySelector('link[rel="apple-touch-icon"]') && appleIcon.href) {
        document.head.appendChild(appleIcon);
      }

      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]') || document.createElement('meta');
      metaDesc.name = 'description';
      metaDesc.content = `${finalSettings.site_name} - Charity is Noble | Developed By IUX IT Pty Ltd`;
      if (!document.querySelector('meta[name="description"]')) {
        document.head.appendChild(metaDesc);
      }
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await apiService.get(ENDPOINTS.COMMON.SETTINGS);
        const settingsArray = Array.isArray(response.data) ? response.data : response;

        const logoValue = settingsArray.find((item) => item.key === 'company_logo')?.value;
        const siteNameValue = settingsArray.find((item) => item.key === 'company_name')?.value;

        const finalSettings = {
          site_name: siteNameValue || 'IUXIT-Charity-Application',
          logo: logoValue,
        };

        setSettings(finalSettings);
        updateHeadElements(finalSettings);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  // Re-apply head elements when route changes
  useEffect(() => {
    if (Object.keys(settings).length > 0) {
      updateHeadElements(settings);
    }
  }, [pathname, settings]);

  // This component doesn't render anything, it just manipulates the DOM
  return null;
}