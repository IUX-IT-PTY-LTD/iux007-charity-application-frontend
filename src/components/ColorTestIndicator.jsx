'use client';

import React from 'react';
import { useColorScheme } from '@/contexts/ColorSchemeContext';

const ColorTestIndicator = () => {
  const { colorScheme, isLoading, error } = useColorScheme();

  if (isLoading) {
    return (
      <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 text-xs z-50 border">
        <div className="text-gray-600">Loading colors...</div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 text-xs z-50 border max-w-xs">
      <div className="font-semibold mb-2">Current Color Scheme:</div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded border"
            style={{ backgroundColor: colorScheme.primary_color }}
          />
          <span>Primary: {colorScheme.primary_color}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded border"
            style={{ backgroundColor: colorScheme.secondary_color }}
          />
          <span>Secondary: {colorScheme.secondary_color}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded border"
            style={{ backgroundColor: colorScheme.accent_color }}
          />
          <span>Accent: {colorScheme.accent_color}</span>
        </div>
      </div>

      {error && (
        <div className="mt-2 text-red-600">Error: {error}</div>
      )}
      
      {/* Test the Tailwind classes */}
      <div className="mt-3 pt-2 border-t">
        <div className="text-xs text-gray-500 mb-1">Tailwind Test:</div>
        <div className="flex gap-1">
          <div className="bg-primary text-white px-2 py-1 rounded text-xs">Primary Button</div>
          <div className="bg-secondary text-white px-2 py-1 rounded text-xs">Secondary</div>
        </div>
      </div>
    </div>
  );
};

export default ColorTestIndicator;