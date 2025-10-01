'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, 
  Info, 
  Upload, 
  X, 
  Plus, 
  User, 
  Building, 
  Eye,
  Edit3,
  Trash2,
  ImageIcon,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

// Import services
import { isAuthenticated } from '@/api/services/admin/authService';
import { getAboutUsContent, updateAboutUsContent } from '@/api/services/admin/aboutUsService';

// About Us Form Component
const AboutUsPageContent = () => {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();

  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  // Form data state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mission: '',
    vision: '',
    values: '',
    image: '',
    status: 1,
    members: []
  });

  const [originalData, setOriginalData] = useState({});

  // Set page title and subtitle
  useEffect(() => {
    setPageTitle('About Us');
    setPageSubtitle('Manage your organization\'s About Us content');
  }, [setPageTitle, setPageSubtitle]);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error('Authentication required. Please log in.');
      router.push('/admin/login');
    }
  }, [router]);

  // Fetch current About Us content
  const fetchAboutUsContent = async () => {
    setIsLoading(true);
    try {
      const response = await getAboutUsContent();
      if (response.status === 'success') {
        // Handle single object response
        const data = response.data || {};
        
        setFormData({
          title: data.title || '',
          description: data.description || '',
          mission: data.mission || '',
          vision: data.vision || '',
          values: data.values || '',
          image: data.image || '',
          status: data.status !== undefined ? (data.status ? 1 : 0) : 1,
          members: (data.members || []).map(member => ({
            ...member,
            image: member.image || '',
            status: member.status !== undefined ? (member.status ? 1 : 0) : 1
          }))
        });
        setOriginalData(data);
      } else {
        throw new Error(response.message || 'Failed to fetch About Us content');
      }
    } catch (error) {
      console.error('Error fetching About Us content:', error);
      toast.error(error.message || 'Failed to load About Us content');
      // Set empty form data on error
      setFormData({
        title: '',
        description: '',
        mission: '',
        vision: '',
        values: '',
        image: '',
        status: 1,
        members: []
      });
      setOriginalData({});
    } finally {
      setIsLoading(false);
    }
  };

  // Load content on component mount
  useEffect(() => {
    fetchAboutUsContent();
  }, []);

  // Check for changes
  useEffect(() => {
    setHasChanges(JSON.stringify(formData) !== JSON.stringify(originalData));
  }, [formData, originalData]);

  // Handle form field changes
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle image upload
  const handleImageUpload = (file, onChangeCallback) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChangeCallback(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  // Add team member
  const addTeamMember = () => {
    const newMember = {
      id: null, // Will be assigned by backend for new members
      name: '',
      position: '',
      bio: '',
      image: '',
      email: '',
      phone: '',
      linkedin: '',
      twitter: '',
      sort_order: formData.members.length,
      status: 1
    };
    setFormData(prev => ({
      ...prev,
      members: [...prev.members, newMember]
    }));
  };

  // Remove team member
  const removeTeamMember = (memberIndex) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter((_, index) => index !== memberIndex)
    }));
  };

  // Update team member
  const updateTeamMember = (memberIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.map((member, index) =>
        index === memberIndex ? { ...member, [field]: value } : member
      )
    }));
  };

  // Tab navigation
  const tabs = ['basic', 'content', 'team'];
  
  const nextTab = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const prevTab = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  const canGoNext = () => {
    return tabs.indexOf(activeTab) < tabs.length - 1;
  };

  const canGoPrev = () => {
    return tabs.indexOf(activeTab) > 0;
  };

  // Handle save
  const handleSave = async () => {
    if (!hasChanges) {
      toast.info('No changes to save');
      return;
    }

    setSaving(true);
    try {
      console.log('Saving form data:', formData); // Debug log
      
      const response = await updateAboutUsContent(formData);
      
      if (response.status === 'success') {
        // Refresh data after successful save
        await fetchAboutUsContent();
        toast.success('About Us content updated successfully');
      } else {
        throw new Error(response.message || 'Failed to update About Us content');
      }
    } catch (error) {
      console.error('Error saving About Us content:', error);
      
      // Handle different types of errors
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = Object.values(error.response.data.errors).flat();
        toast.error(errors.join(', '));
      } else {
        toast.error(error.message || 'Failed to save About Us content');
      }
    } finally {
      setSaving(false);
    }
  };

  // Image Upload Component
  const ImageUploadField = ({ label, value, onChange, className = "" }) => {
    const inputId = `image-${label.replace(/\s+/g, '-').toLowerCase()}`;
    const fileInputRef = useRef(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    
    const validateAndProcessFile = (file) => {
      if (!file) return false;
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return false;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return false;
      }
      
      setIsUploading(true);
      handleImageUpload(file, (result) => {
        onChange(result);
        setIsUploading(false);
      });
      return true;
    };
    
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        validateAndProcessFile(file);
      }
      // Reset input value to allow uploading same file again
      e.target.value = '';
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        validateAndProcessFile(files[0]);
      }
    };

    return (
      <div className={`space-y-2 ${className}`}>
        <Label>{label}</Label>
        <div 
          className={`border-2 border-dashed rounded-lg p-4 transition-all duration-200 ${
            isDragOver 
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-950' 
              : 'border-gray-300 hover:border-gray-400'
          } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {value ? (
            <div className="relative">
              <img src={value} alt={label} className="w-full h-48 object-cover rounded-lg" />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => onChange('')}
                type="button"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="text-center">
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-sm text-gray-600">Uploading image...</p>
                </div>
              ) : (
                <>
                  <ImageIcon className={`h-12 w-12 mx-auto mb-4 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
                  <p className={`text-sm mb-4 ${isDragOver ? 'text-blue-600' : 'text-gray-600'}`}>
                    {isDragOver ? 'Drop image here' : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    PNG, JPG, GIF up to 5MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id={inputId}
                    disabled={isUploading}
                  />
                  <Button 
                    variant="outline" 
                    type="button" 
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading About Us content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Info className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold">About Us Content</h1>
              <p className="text-muted-foreground">
                Manage your organization's About Us page content and team information
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="flex items-center gap-2"
            >
              {isPreviewMode ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {isPreviewMode ? 'Edit Mode' : 'Preview'}
            </Button>
            
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        <Separator />

        {/* Save Changes Alert */}
        {hasChanges && (
          <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <p className="text-sm text-orange-700 dark:text-orange-300">
              You have unsaved changes. Don't forget to save your work.
            </p>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Now'}
            </Button>
          </div>
        )}

        {isPreviewMode ? (
          // Preview Mode
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Preview Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Hero Section */}
              {formData.image && (
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <img src={formData.image} alt="Hero" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <h1 className="text-4xl font-bold text-white">{formData.title}</h1>
                  </div>
                </div>
              )}

              {/* Description */}
              {formData.description && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">About Our Organization</h2>
                  <p className="text-lg leading-relaxed">{formData.description}</p>
                </div>
              )}

              {/* Mission, Vision, Values */}
              <div className="grid md:grid-cols-3 gap-6">
                {formData.mission && (
                  <div>
                    <h3 className="text-xl font-bold mb-2">Our Mission</h3>
                    <p>{formData.mission}</p>
                  </div>
                )}
                {formData.vision && (
                  <div>
                    <h3 className="text-xl font-bold mb-2">Our Vision</h3>
                    <p>{formData.vision}</p>
                  </div>
                )}
                {formData.values && (
                  <div>
                    <h3 className="text-xl font-bold mb-2">Our Values</h3>
                    <p>{formData.values}</p>
                  </div>
                )}
              </div>

              {/* Team Members */}
              {formData.members.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Our Team</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {formData.members
                      .filter(member => member.status === 1)
                      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                      .map((member, index) => (
                      <div key={`member-${index}`} className="text-center">
                        {member.image && (
                          <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
                        )}
                        <h3 className="font-bold">{member.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{member.position}</p>
                        {member.bio && <p className="text-sm">{member.bio}</p>}
                        <div className="flex justify-center gap-2 mt-2">
                          {member.email && (
                            <a href={`mailto:${member.email}`} className="text-blue-600 hover:text-blue-800">
                              Email
                            </a>
                          )}
                          {member.linkedin && (
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                              LinkedIn
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          // Edit Mode - Tabs
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Content
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Team
              </TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Organization Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleFieldChange('title', e.target.value)}
                        placeholder="Enter your organization name"
                      />
                    </div>

                    <ImageUploadField
                      label="Hero Image"
                      value={formData.image}
                      onChange={(value) => handleFieldChange('image', value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Organization Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleFieldChange('description', e.target.value)}
                      placeholder="Write a brief description of your organization..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle>Mission, Vision & Values</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="mission">Mission Statement</Label>
                    <Textarea
                      id="mission"
                      value={formData.mission}
                      onChange={(e) => handleFieldChange('mission', e.target.value)}
                      placeholder="Describe your organization's mission..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vision">Vision Statement</Label>
                    <Textarea
                      id="vision"
                      value={formData.vision}
                      onChange={(e) => handleFieldChange('vision', e.target.value)}
                      placeholder="Describe your organization's vision..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="values">Core Values</Label>
                    <Textarea
                      id="values"
                      value={formData.values}
                      onChange={(e) => handleFieldChange('values', e.target.value)}
                      placeholder="List your organization's core values..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => handleFieldChange('status', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>


            {/* Team Tab */}
            <TabsContent value="team">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Team Members
                    <Button onClick={addTeamMember} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Team Member
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {formData.members.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No team members added yet. Click "Add Team Member" to get started.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {formData.members.map((member, memberIndex) => (
                        <Card key={`member-form-${memberIndex}`} className="p-4">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-medium">Team Member</h4>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeTeamMember(memberIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input
                                  value={member.name}
                                  onChange={(e) => updateTeamMember(memberIndex, 'name', e.target.value)}
                                  placeholder="Enter full name"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Position/Title</Label>
                                <Input
                                  value={member.position}
                                  onChange={(e) => updateTeamMember(memberIndex, 'position', e.target.value)}
                                  placeholder="Enter job title"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Bio</Label>
                                <Textarea
                                  value={member.bio}
                                  onChange={(e) => updateTeamMember(memberIndex, 'bio', e.target.value)}
                                  placeholder="Brief biography..."
                                  rows={3}
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <ImageUploadField
                                label="Profile Photo"
                                value={member.image}
                                onChange={(value) => updateTeamMember(memberIndex, 'image', value)}
                              />
                              
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-2">
                                  <Label>Email</Label>
                                  <Input
                                    type="email"
                                    value={member.email}
                                    onChange={(e) => updateTeamMember(memberIndex, 'email', e.target.value)}
                                    placeholder="email@example.com"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label>Phone</Label>
                                  <Input
                                    value={member.phone}
                                    onChange={(e) => updateTeamMember(memberIndex, 'phone', e.target.value)}
                                    placeholder="+1 (555) 123-4567"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label>LinkedIn</Label>
                                  <Input
                                    value={member.linkedin}
                                    onChange={(e) => updateTeamMember(memberIndex, 'linkedin', e.target.value)}
                                    placeholder="https://linkedin.com/in/username"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label>Twitter</Label>
                                  <Input
                                    value={member.twitter}
                                    onChange={(e) => updateTeamMember(memberIndex, 'twitter', e.target.value)}
                                    placeholder="https://twitter.com/username"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label>Sort Order</Label>
                                  <Input
                                    type="number"
                                    value={member.sort_order}
                                    onChange={(e) => updateTeamMember(memberIndex, 'sort_order', parseInt(e.target.value) || 0)}
                                    placeholder="0"
                                    min="0"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label>Status</Label>
                                  <select
                                    value={member.status}
                                    onChange={(e) => updateTeamMember(memberIndex, 'status', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  >
                                    <option value={1}>Active</option>
                                    <option value={0}>Inactive</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default AboutUsPageContent;