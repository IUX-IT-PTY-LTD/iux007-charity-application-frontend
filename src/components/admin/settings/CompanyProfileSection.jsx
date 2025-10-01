'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Building2, Save, RefreshCw, Upload, Globe, Type, Image as ImageIcon, Eye, ExternalLink, Hash } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { 
  getAllSettings, 
  updateSetting, 
  validateSettingData,
  isValidUrl
} from '@/api/services/admin/settingsService';

const CompanyProfileSection = () => {
  const [settings, setSettings] = useState([]);
  const [editedSettings, setEditedSettings] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({}); // Store files for logos
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});

  // Load current settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const response = await getAllSettings();
        const settingsData = response.data || response;
        
        // Filter company profile related settings
        const companySettings = settingsData.filter(setting => 
          ['company_name', 'fund_raising_max_approval', 'company_logo', 'customer_inquiry_email', 'facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'acnc_logo', 'acnc_link'].includes(setting.key)
        );
        
        setSettings(companySettings);
        
        // Initialize edited settings
        const initialEdited = {};
        companySettings.forEach(setting => {
          initialEdited[setting.id] = {
            key: setting.key,
            value: setting.value,
            type: setting.type || getDefaultType(setting.key),
            status: setting.status
          };
        });
        setEditedSettings(initialEdited);
      } catch (error) {
        console.error('Error loading settings:', error);
        toast.error('Failed to load company profile settings');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Determine default type based on key
  const getDefaultType = (key) => {
    if (key.includes('logo')) return 'image';
    if (key.includes('link')) return 'url';
    if (key === 'customer_inquiry_email') return 'text'; // Email field should be text input
    if (key === 'fund_raising_max_approval') return 'number';
    return 'text';
  };

  // Get display name for setting key
  const getDisplayName = (key) => {
    const nameMap = {
      company_name: 'Company Name',
      fund_raising_max_approval: 'Fund Raising Approval Needed',
      company_logo: 'Company Logo',
      customer_inquiry_email: 'Customer Inquiry Email',
      facebook: 'Facebook Link',
      instagram: 'Instagram Link',
      twitter: 'Twitter Link',
      linkedin: 'LinkedIn Link',
      youtube: 'YouTube Link',
      acnc_logo: 'ACNC Logo',
      acnc_link: 'ACNC Link'
    };
    return nameMap[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Get field description
  const getFieldDescription = (key) => {
    const descMap = {
      company_name: 'The name of your organization displayed across the website',
      fund_raising_max_approval: 'Maximum approvals needed for publishing for fundraising requests',
      company_logo: 'Your organization\'s logo (recommended: SVG or PNG format)',
      customer_inquiry_email: 'Email address for customer inquiries and support',
      facebook: 'Link to your organization\'s Facebook page',
      instagram: 'Link to your organization\'s Instagram profile',
      twitter: 'Link to your organization\'s Twitter/X profile',
      linkedin: 'Link to your organization\'s LinkedIn page',
      youtube: 'Link to your organization\'s YouTube channel',
      acnc_logo: 'Australian Charities and Not-for-profits Commission logo',
      acnc_link: 'Link to your ACNC charity profile page'
    };
    return descMap[key] || 'Organization setting';
  };

  const handleInputChange = (settingId, field, value) => {
    setEditedSettings(prev => ({
      ...prev,
      [settingId]: {
        ...prev[settingId],
        [field]: value
      }
    }));
  };

  const handleSave = async (settingId) => {
    try {
      setLoading(true);
      const settingData = editedSettings[settingId];
      const uploadedFile = uploadedFiles[settingId];
      
      // Check if this is a logo field with an uploaded file
      const isLogoField = settingData.key === 'company_logo' || settingData.key === 'acnc_logo';
      
      let response;
      
      if (isLogoField && uploadedFile) {
        // Create JSON data with base64 file
        const fileData = {
          key: settingData.key,
          type: 'image',
          status: settingData.status,
          value: uploadedFile.file // This is already clean base64 without data: prefix
        };
        
        // Update setting with file data
        response = await updateSetting(settingId, fileData);
        
        // Clear the stored file after successful upload
        setUploadedFiles(prev => {
          const updated = { ...prev };
          delete updated[settingId];
          return updated;
        });
      } else {
        // Validate setting data for non-file updates
        const validation = validateSettingData(settingData);
        if (!validation.isValid) {
          toast.error(`Validation error: ${validation.errors.join(', ')}`);
          return;
        }

        // Regular setting update
        response = await updateSetting(settingId, settingData);
      }
      
      // Update the original settings
      setSettings(prev => prev.map(setting => 
        setting.id === settingId 
          ? { ...setting, ...settingData, value: response.data?.value || settingData.value }
          : setting
      ));
      
      toast.success('Setting updated successfully');
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error(error.message || 'Failed to update setting');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    try {
      setLoading(true);
      const promises = Object.keys(editedSettings).map(async (settingId) => {
        const settingData = editedSettings[settingId];
        const validation = validateSettingData(settingData);
        if (!validation.isValid) {
          throw new Error(`${getDisplayName(settingData.key)}: ${validation.errors.join(', ')}`);
        }
        return updateSetting(settingId, settingData);
      });

      await Promise.all(promises);
      
      // Update all settings
      setSettings(prev => prev.map(setting => ({
        ...setting,
        ...editedSettings[setting.id]
      })));
      
      toast.success('All settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error(error.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (settingId) => {
    setExpandedItems(prev => ({
      ...prev,
      [settingId]: !prev[settingId]
    }));
  };

  const handleFileSelect = async (settingId, file) => {
    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, GIF, SVG, or WebP)');
      return;
    }
    
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target.result; // Keep full data URL with prefix
      
      // Store the file data for later upload
      setUploadedFiles(prev => ({
        ...prev,
        [settingId]: {
          file: base64String,
          name: file.name,
          type: file.type,
          size: file.size
        }
      }));

      // Update the edited settings to mark as changed and set type to image
      setEditedSettings(prev => ({
        ...prev,
        [settingId]: {
          ...prev[settingId],
          type: 'image',
          // Keep existing value for preview, will be replaced when saved
          value: prev[settingId].value
        }
      }));

      toast.success('File selected. Click "Save" to upload and apply changes.');
    };

    reader.onerror = () => {
      toast.error('Failed to read file. Please try again.');
    };

    reader.readAsDataURL(file);
  };

  const renderFieldInput = (setting, editedSetting) => {
    const fieldType = editedSetting.type || 'text';
    const isLogoField = setting.key === 'company_logo' || setting.key === 'acnc_logo';
    
    switch (fieldType) {
      case 'image':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              {editedSetting.value && (
                <div className="relative w-16 h-16 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                  <Image
                    src={editedSetting.value}
                    alt={getDisplayName(setting.key)}
                    fill
                    className="object-contain"
                    onError={() => {
                      // Handle image load error
                      console.warn('Failed to load image:', editedSetting.value);
                    }}
                  />
                </div>
              )}
              <div className="flex-1 space-y-3">
{isLogoField && (
                  <div>
                    <Label className="text-xs font-medium mb-2 block">Upload New Image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileSelect(setting.id, file);
                        }
                      }}
                      className="mb-2"
                      disabled={loading}
                    />
                    {uploadedFiles[setting.id] ? (
                      <p className="text-xs text-green-600 font-medium">
                        ✓ File selected: {uploadedFiles[setting.id].name}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Upload an image file (JPG, PNG, SVG, etc.)
                      </p>
                    )}
                  </div>
                )}
                <div>
                  <Label className="text-xs font-medium mb-2 block">Or Enter Image URL</Label>
                  <Input
                    type="url"
                    value={editedSetting.value}
                    onChange={(e) => handleInputChange(setting.id, 'value', e.target.value)}
                    placeholder="https://example.com/image.png"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the URL of your image file
                  </p>
                </div>
              </div>
            </div>
            {editedSetting.value && isValidUrl(editedSetting.value) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(editedSetting.value, '_blank')}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-3 w-3" />
                View Image
              </Button>
            )}
          </div>
        );
        
      case 'url':
        return (
          <div className="space-y-3">
            <Input
              type="url"
              value={editedSetting.value}
              onChange={(e) => handleInputChange(setting.id, 'value', e.target.value)}
              placeholder="https://example.com"
              className={!isValidUrl(editedSetting.value) && editedSetting.value ? 'border-red-300' : ''}
            />
            {!isValidUrl(editedSetting.value) && editedSetting.value && (
              <p className="text-xs text-red-600">Please enter a valid URL</p>
            )}
            {editedSetting.value && isValidUrl(editedSetting.value) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(editedSetting.value, '_blank')}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-3 w-3" />
                Visit Link
              </Button>
            )}
          </div>
        );
        
      case 'number':
        return (
          <Input
            type="number"
            value={editedSetting.value}
            onChange={(e) => handleInputChange(setting.id, 'value', e.target.value)}
            placeholder={`Enter ${getDisplayName(setting.key).toLowerCase()}`}
            min="0"
            step="1"
          />
        );
        
      default: // text
        const inputType = setting.key === 'customer_inquiry_email' ? 'email' : 'text';
        return (
          <Input
            type={inputType}
            value={editedSetting.value}
            onChange={(e) => handleInputChange(setting.id, 'value', e.target.value)}
            placeholder={`Enter ${getDisplayName(setting.key).toLowerCase()}`}
          />
        );
    }
  };

  const getFieldIcon = (type) => {
    switch (type) {
      case 'image': return <ImageIcon className="h-4 w-4" />;
      case 'url': return <Globe className="h-4 w-4" />;
      case 'number': return <Hash className="h-4 w-4" />;
      default: return <Type className="h-4 w-4" />;
    }
  };

  const hasChanges = () => {
    return settings.some(setting => {
      const edited = editedSettings[setting.id];
      const hasUploadedFile = uploadedFiles[setting.id];
      return edited && (
        edited.value !== setting.value ||
        edited.status !== setting.status ||
        hasUploadedFile
      );
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company Profile
          </CardTitle>
          <CardDescription>
            Loading company profile settings...
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Profile
              {hasChanges() && <Badge variant="outline">Unsaved Changes</Badge>}
            </CardTitle>
            <CardDescription>
              Manage your organization's profile information, logos, and social media links
            </CardDescription>
          </div>
          {hasChanges() && (
            <Button
              onClick={handleSaveAll}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save All Changes
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6">
          {settings.map((setting) => {
            const editedSetting = editedSettings[setting.id];
            if (!editedSetting) return null;

            const fieldType = editedSetting.type || 'text';
            const hasUploadedFile = uploadedFiles[setting.id];
            const hasChanged = editedSetting.value !== setting.value || editedSetting.status !== setting.status || hasUploadedFile;

            return (
              <div key={setting.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getFieldIcon(fieldType)}
                    <div>
                      <Label className="text-sm font-medium">
                        {getDisplayName(setting.key)}
                        {hasChanged && <span className="text-orange-600 ml-2">*</span>}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {getFieldDescription(setting.key)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={editedSetting.status === 1 ? "default" : "secondary"}
                      className={editedSetting.status === 1 
                        ? "bg-green-600 hover:bg-green-700 text-white border-green-600" 
                        : "bg-red-600 hover:bg-red-700 text-white border-red-600"
                      }
                    >
                      {editedSetting.status === 1 ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSave(setting.id)}
                      disabled={loading || !hasChanged}
                      className="flex items-center gap-2"
                    >
                      {loading ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : (
                        <Save className="h-3 w-3" />
                      )}
                      Save
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {renderFieldInput(setting, editedSetting)}
                  
                  <div className="flex items-center gap-4">
                    <Label className="text-xs">Status:</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={editedSetting.status === 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleInputChange(setting.id, 'status', 1)}
                        className={`h-7 px-3 text-xs ${
                          editedSetting.status === 1 
                            ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' 
                            : 'text-green-600 border-green-600 hover:bg-green-50'
                        }`}
                      >
                        Active
                      </Button>
                      <Button
                        variant={editedSetting.status === 0 ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleInputChange(setting.id, 'status', 0)}
                        className={`h-7 px-3 text-xs ${
                          editedSetting.status === 0 
                            ? 'bg-red-600 hover:bg-red-700 text-white border-red-600' 
                            : 'text-red-600 border-red-600 hover:bg-red-50'
                        }`}
                      >
                        Inactive
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {settings.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No company profile settings found
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyProfileSection;