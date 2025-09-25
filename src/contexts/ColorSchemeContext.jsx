'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getColorSchemeSettings } from '@/api/services/admin/settingsService';

const ColorSchemeContext = createContext({
  colorScheme: {
    primary_color: '#DB375A',
    secondary_color: '#16423C',
    accent_color: '#C4DAD2',
    light_color: '#E9EFEC'
  },
  isLoading: true,
  error: null,
  refreshColorScheme: () => {}
});

export const useColorScheme = () => {
  const context = useContext(ColorSchemeContext);
  if (!context) {
    throw new Error('useColorScheme must be used within a ColorSchemeProvider');
  }
  return context;
};

export const ColorSchemeProvider = ({ children }) => {
  const [colorScheme, setColorScheme] = useState({
    primary_color: '#DB375A',
    secondary_color: '#16423C',
    accent_color: '#C4DAD2',
    light_color: '#E9EFEC'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const applyColorsToCSS = (colors) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', colors.primary_color);
    root.style.setProperty('--secondary', colors.secondary_color);
    root.style.setProperty('--accent', colors.accent_color);
    root.style.setProperty('--light', colors.light_color);
    
    // Debug: Log the colors being applied
    console.log('Colors applied to CSS:', {
      primary: colors.primary_color,
      secondary: colors.secondary_color,
      accent: colors.accent_color,
      light: colors.light_color
    });
  };

  const loadColorScheme = async () => {
    try {
      setError(null);
      const response = await getColorSchemeSettings();
      
      // Extract color settings from response
      let colorSettings = null;
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        colorSettings = response.data[0]; // Get the first color scheme
      } else if (response.data && !Array.isArray(response.data)) {
        colorSettings = response.data;
      }
      
      // Extract current colors or use defaults
      const currentColors = {
        primary_color: colorSettings?.primary_color || '#3954db', // Use your API default
        secondary_color: colorSettings?.secondary_color || '#135705', // Use your API default
        accent_color: colorSettings?.accent_color || '#C4DAD2',
        light_color: colorSettings?.light_color || '#E9EFEC'
      };
      
      setColorScheme(currentColors);
      applyColorsToCSS(currentColors);
    } catch (err) {
      console.warn('Color scheme API not available, using default colors:', err.message);
      
      // Apply default colors when API is not available (e.g., for frontend users)
      const defaultColors = {
        primary_color: '#3954db', // Use your current API colors as defaults
        secondary_color: '#135705',
        accent_color: '#C4DAD2',
        light_color: '#E9EFEC'
      };
      setColorScheme(defaultColors);
      applyColorsToCSS(defaultColors);
      setError(null); // Don't show error for frontend users
    } finally {
      setIsLoading(false);
    }
  };

  const refreshColorScheme = async () => {
    setIsLoading(true);
    await loadColorScheme();
  };

  useEffect(() => {
    loadColorScheme();
  }, []);

  const value = {
    colorScheme,
    isLoading,
    error,
    refreshColorScheme
  };

  return (
    <ColorSchemeContext.Provider value={value}>
      {children}
    </ColorSchemeContext.Provider>
  );
};