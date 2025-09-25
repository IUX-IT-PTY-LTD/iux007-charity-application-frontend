'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Palette, Save, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { 
  updateColorScheme, 
  getColorSchemeSettings,
  validateColorSchemeData,
  isValidHexColor 
} from '@/api/services/admin/settingsService';
import { useColorScheme } from '@/contexts/ColorSchemeContext';

const ColorSchemeSection = () => {
  const { refreshColorScheme } = useColorScheme();
  const [colorScheme, setColorScheme] = useState({
    primary_color: '#DB375A',
    secondary_color: '#16423C',
    accent_color: '#C4DAD2',
    light_color: '#E9EFEC'
  });
  
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [originalColors, setOriginalColors] = useState({});

  // Load current color scheme
  useEffect(() => {
    const loadColorScheme = async () => {
      try {
        setIsLoading(true);
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
          primary_color: colorSettings?.primary_color || '#DB375A',
          secondary_color: colorSettings?.secondary_color || '#16423C',
          accent_color: colorSettings?.accent_color || '#C4DAD2',
          light_color: colorSettings?.light_color || '#E9EFEC'
        };
        
        setColorScheme(currentColors);
        setOriginalColors(currentColors);
      } catch (error) {
        console.error('Error loading color scheme:', error);
        toast.error('Failed to load color scheme settings');
        
        // Set default colors on error
        const defaultColors = {
          primary_color: '#DB375A',
          secondary_color: '#16423C',
          accent_color: '#C4DAD2',
          light_color: '#E9EFEC'
        };
        setColorScheme(defaultColors);
        setOriginalColors(defaultColors);
      } finally {
        setIsLoading(false);
      }
    };

    loadColorScheme();
  }, []);

  // Apply colors to CSS variables for preview
  useEffect(() => {
    if (previewMode) {
      const root = document.documentElement;
      root.style.setProperty('--primary', colorScheme.primary_color);
      root.style.setProperty('--secondary', colorScheme.secondary_color);
      root.style.setProperty('--accent', colorScheme.accent_color);
      root.style.setProperty('--light', colorScheme.light_color);
    }
  }, [colorScheme, previewMode]);

  const handleColorChange = (colorKey, value) => {
    setColorScheme(prev => ({
      ...prev,
      [colorKey]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Validate colors
      const validation = validateColorSchemeData(colorScheme);
      if (!validation.isValid) {
        toast.error(`Validation error: ${validation.errors.join(', ')}`);
        return;
      }

      // Update color scheme
      await updateColorScheme(colorScheme);
      
      // Update original colors
      setOriginalColors(colorScheme);
      
      // Refresh the global color scheme context
      await refreshColorScheme();
      
      toast.success('Color scheme updated successfully');
    } catch (error) {
      console.error('Error updating color scheme:', error);
      toast.error(error.message || 'Failed to update color scheme');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewToggle = () => {
    if (previewMode) {
      // Reset to original colors
      const root = document.documentElement;
      root.style.setProperty('--primary', originalColors.primary_color);
      root.style.setProperty('--secondary', originalColors.secondary_color);
      root.style.setProperty('--accent', originalColors.accent_color);
      root.style.setProperty('--light', originalColors.light_color);
    }
    setPreviewMode(!previewMode);
  };

  const handleReset = () => {
    setColorScheme(originalColors);
    if (previewMode) {
      const root = document.documentElement;
      root.style.setProperty('--primary', originalColors.primary_color);
      root.style.setProperty('--secondary', originalColors.secondary_color);
      root.style.setProperty('--accent', originalColors.accent_color);
      root.style.setProperty('--light', originalColors.light_color);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Scheme
          </CardTitle>
          <CardDescription>
            Loading color scheme settings...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const colorInputs = [
    { key: 'primary_color', label: 'Primary Color', description: 'Main brand color used for buttons and highlights' },
    { key: 'secondary_color', label: 'Secondary Color', description: 'Supporting color for accents and navigation' },
    { key: 'accent_color', label: 'Accent Color', description: 'Light accent color for backgrounds and borders' },
    { key: 'light_color', label: 'Light Color', description: 'Lightest color for subtle backgrounds' }
  ];

  const hasChanges = JSON.stringify(colorScheme) !== JSON.stringify(originalColors);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Color Scheme
              {hasChanges && <Badge variant="outline">Unsaved Changes</Badge>}
            </CardTitle>
            <CardDescription>
              Customize your website's color scheme. Colors will be applied across buttons, links, loaders, and footer.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviewToggle}
              className="flex items-center gap-2"
            >
              {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {previewMode ? 'Exit Preview' : 'Preview'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {previewMode && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <Eye className="h-4 w-4 inline mr-2" />
              Preview mode is active. Colors are applied temporarily to see how they look on your site.
            </p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {colorInputs.map(({ key, label, description }) => (
            <div key={key} className="space-y-3">
              <Label htmlFor={key} className="text-sm font-medium">
                {label}
              </Label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-lg border border-gray-300 flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: colorScheme[key] }}
                  title={`Current ${label.toLowerCase()}: ${colorScheme[key]}`}
                />
                <div className="flex-1 space-y-1">
                  <Input
                    id={key}
                    type="color"
                    value={colorScheme[key]}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="h-12 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={colorScheme[key]}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    placeholder="#000000"
                    className={`text-sm ${!isValidHexColor(colorScheme[key]) ? 'border-red-300' : ''}`}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{description}</p>
              {!isValidHexColor(colorScheme[key]) && (
                <p className="text-xs text-red-600">Please enter a valid hex color (e.g., #DB375A)</p>
              )}
            </div>
          ))}
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Color Preview</p>
            <div className="flex items-center gap-2">
              {Object.entries(colorScheme).map(([key, color]) => (
                <div
                  key={key}
                  className="w-6 h-6 rounded border border-gray-300"
                  style={{ backgroundColor: color }}
                  title={`${key.replace('_', ' ')}: ${color}`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={loading || !hasChanges}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading || !hasChanges}
              className="flex items-center gap-2"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorSchemeSection;