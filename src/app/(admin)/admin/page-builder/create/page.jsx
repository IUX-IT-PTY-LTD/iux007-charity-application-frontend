'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { Lock, Save, Eye, Settings, Plus, Trash2, Edit3, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

// Import UI components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Import protected services
import { isAuthenticated } from '@/api/services/admin/authService';
import { createPage } from '@/api/services/admin/pageBuilderService';
import { getPageBuilderMenus } from '@/api/services/admin/protected/menuService';

// Import permission hooks and context
import { PermissionProvider } from '@/api/contexts/PermissionContext';
import { useMenuPermissions } from '@/api/hooks/useModulePermissions';

// Import component types and utilities
import { COMPONENT_TYPES, getDefaultComponent } from '../components';

// Component Editor Modal
const ComponentEditor = ({ component, onUpdate, onClose, isOpen }) => {
  const [localComponent, setLocalComponent] = useState(component);

  useEffect(() => {
    setLocalComponent(component);
  }, [component]);

  const handleSave = () => {
    onUpdate(localComponent);
    onClose();
  };

  const updateContent = (key, value) => {
    setLocalComponent(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [key]: value,
      },
    }));
  };

  const renderEditor = () => {
    if (!component) return null;

    switch (component.type) {
      case COMPONENT_TYPES.HERO:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={localComponent.content.title || ''}
                onChange={(e) => updateContent('title', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Textarea
                id="subtitle"
                value={localComponent.content.subtitle || ''}
                onChange={(e) => updateContent('subtitle', e.target.value)}
              />
            </div>
            
            {/* Background Settings */}
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-sm">Background Settings</h4>
              
              <div>
                <Label htmlFor="backgroundType">Background Type</Label>
                <Select
                  value={localComponent.content.backgroundType || 'color'}
                  onValueChange={(value) => updateContent('backgroundType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="color">Solid Color</SelectItem>
                    <SelectItem value="gradient">Gradient</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {localComponent.content.backgroundType === 'color' && (
                <div>
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={localComponent.content.backgroundColor || '#667eea'}
                      onChange={(e) => updateContent('backgroundColor', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={localComponent.content.backgroundColor || '#667eea'}
                      onChange={(e) => updateContent('backgroundColor', e.target.value)}
                      placeholder="#667eea"
                    />
                  </div>
                </div>
              )}

              {localComponent.content.backgroundType === 'gradient' && (
                <div className="space-y-2">
                  <Label>Gradient Colors</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="gradientStart" className="text-xs">Start Color</Label>
                      <Input
                        id="gradientStart"
                        type="color"
                        value={localComponent.content.gradientStart || '#667eea'}
                        onChange={(e) => updateContent('gradientStart', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gradientEnd" className="text-xs">End Color</Label>
                      <Input
                        id="gradientEnd"
                        type="color"
                        value={localComponent.content.gradientEnd || '#764ba2'}
                        onChange={(e) => updateContent('gradientEnd', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="gradientDirection">Gradient Direction</Label>
                    <Select
                      value={localComponent.content.gradientDirection || '135deg'}
                      onValueChange={(value) => updateContent('gradientDirection', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="to right">Left to Right</SelectItem>
                        <SelectItem value="to left">Right to Left</SelectItem>
                        <SelectItem value="to bottom">Top to Bottom</SelectItem>
                        <SelectItem value="to top">Bottom to Top</SelectItem>
                        <SelectItem value="135deg">Diagonal (135°)</SelectItem>
                        <SelectItem value="45deg">Diagonal (45°)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {localComponent.content.backgroundType === 'image' && (
                <div>
                  <Label htmlFor="hero-background-upload">Upload Background Image</Label>
                  <div className="space-y-3">
                    <input
                      id="hero-background-upload"
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          try {
                            const { uploadImage, validateImageFile } = await import('@/api/services/admin/imageUploadService');
                            
                            const validation = validateImageFile(file);
                            if (!validation.isValid) {
                              toast.error(validation.error);
                              return;
                            }

                            updateContent('uploadingBackground', true);
                            
                            const response = await uploadImage(file);
                            
                            if (response.status === 'success') {
                              updateContent('backgroundImage', response.data.filePath);
                              updateContent('uploadingBackground', false);
                              toast.success('Background image uploaded successfully!');
                            } else {
                              throw new Error(response.message || 'Upload failed');
                            }
                          } catch (error) {
                            updateContent('uploadingBackground', false);
                            console.error('Upload error:', error);
                            toast.error(error.message || 'Failed to upload background image');
                          }
                        }
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {localComponent.content.uploadingBackground && (
                      <div className="flex items-center space-x-2 text-sm text-blue-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span>Uploading background image...</span>
                      </div>
                    )}
                    {localComponent.content.backgroundImage && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-green-600">✓ Background image uploaded</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              try {
                                const { deleteImage } = await import('@/api/services/admin/imageUploadService');
                                await deleteImage(localComponent.content.backgroundImage);
                                updateContent('backgroundImage', '');
                                toast.success('Background image removed successfully!');
                              } catch (error) {
                                console.error('Delete error:', error);
                                toast.error('Failed to remove background image');
                              }
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                        <img 
                          src={localComponent.content.backgroundImage} 
                          alt="Background Preview" 
                          className="max-w-full h-20 object-cover rounded border"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3">
                    <Label htmlFor="backgroundOverlay">Background Overlay Opacity</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={localComponent.content.backgroundOverlay || 40}
                        onChange={(e) => updateContent('backgroundOverlay', e.target.value)}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-600 w-12">{localComponent.content.backgroundOverlay || 40}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Height Settings */}
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-sm">Size Settings</h4>
              
              <div>
                <Label htmlFor="height">Hero Height</Label>
                <Select
                  value={localComponent.content.height || 'medium'}
                  onValueChange={(value) => updateContent('height', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (300px)</SelectItem>
                    <SelectItem value="medium">Medium (500px)</SelectItem>
                    <SelectItem value="large">Large (700px)</SelectItem>
                    <SelectItem value="fullscreen">Full Screen (100vh)</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {localComponent.content.height === 'custom' && (
                <div>
                  <Label htmlFor="customHeight">Custom Height</Label>
                  <Input
                    id="customHeight"
                    value={localComponent.content.customHeight || '400px'}
                    onChange={(e) => updateContent('customHeight', e.target.value)}
                    placeholder="400px, 50vh, 2rem"
                  />
                </div>
              )}
            </div>

            {/* Text Settings */}
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-sm">Text Settings</h4>
              
              <div>
                <Label htmlFor="textAlignment">Text Alignment</Label>
                <Select
                  value={localComponent.content.textAlignment || 'center'}
                  onValueChange={(value) => updateContent('textAlignment', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="textColor">Text Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="textColor"
                    type="color"
                    value={localComponent.content.textColor || '#ffffff'}
                    onChange={(e) => updateContent('textColor', e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    value={localComponent.content.textColor || '#ffffff'}
                    onChange={(e) => updateContent('textColor', e.target.value)}
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>

            {/* Button Settings */}
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-sm">Button Settings</h4>
              
              <div>
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  value={localComponent.content.buttonText || ''}
                  onChange={(e) => updateContent('buttonText', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="buttonLink">Button Link</Label>
                <Input
                  id="buttonLink"
                  value={localComponent.content.buttonLink || ''}
                  onChange={(e) => updateContent('buttonLink', e.target.value)}
                  placeholder="#, /page, https://example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="buttonStyle">Button Style</Label>
                <Select
                  value={localComponent.content.buttonStyle || 'primary'}
                  onValueChange={(value) => updateContent('buttonStyle', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary (Blue)</SelectItem>
                    <SelectItem value="secondary">Secondary (Gray)</SelectItem>
                    <SelectItem value="outline">Outline</SelectItem>
                    <SelectItem value="ghost">Ghost</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="buttonSize">Button Size</Label>
                <Select
                  value={localComponent.content.buttonSize || 'medium'}
                  onValueChange={(value) => updateContent('buttonSize', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      
      case COMPONENT_TYPES.TEXT:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text">Text Content</Label>
              
              {/* Rich Text Formatting Toolbar */}
              <div className="border rounded-t-md bg-gray-50 p-2 flex flex-wrap gap-1">
                <div className="flex gap-1 border-r pr-2 mr-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const textarea = document.getElementById('text');
                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const selectedText = localComponent.content.text.substring(start, end);
                      const newText = localComponent.content.text.substring(0, start) + 
                        `<strong>${selectedText || 'Bold text'}</strong>` + 
                        localComponent.content.text.substring(end);
                      updateContent('text', newText);
                    }}
                    title="Bold"
                  >
                    <strong>B</strong>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const textarea = document.getElementById('text');
                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const selectedText = localComponent.content.text.substring(start, end);
                      const newText = localComponent.content.text.substring(0, start) + 
                        `<em>${selectedText || 'Italic text'}</em>` + 
                        localComponent.content.text.substring(end);
                      updateContent('text', newText);
                    }}
                    title="Italic"
                  >
                    <em>I</em>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const textarea = document.getElementById('text');
                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const selectedText = localComponent.content.text.substring(start, end);
                      const newText = localComponent.content.text.substring(0, start) + 
                        `<u>${selectedText || 'Underlined text'}</u>` + 
                        localComponent.content.text.substring(end);
                      updateContent('text', newText);
                    }}
                    title="Underline"
                  >
                    <u>U</u>
                  </Button>
                </div>

                <div className="flex gap-1 border-r pr-2 mr-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const textarea = document.getElementById('text');
                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const selectedText = localComponent.content.text.substring(start, end);
                      const linkText = selectedText || 'Link text';
                      const newText = localComponent.content.text.substring(0, start) + 
                        `<a href="https://example.com" class="text-blue-600 hover:underline">${linkText}</a>` + 
                        localComponent.content.text.substring(end);
                      updateContent('text', newText);
                    }}
                    title="Add Link"
                  >
                    🔗
                  </Button>
                </div>

                <div className="flex gap-1 border-r pr-2 mr-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const newText = localComponent.content.text + 
                        '\n<ul class="list-disc list-inside space-y-1">\n  <li>List item 1</li>\n  <li>List item 2</li>\n  <li>List item 3</li>\n</ul>';
                      updateContent('text', newText);
                    }}
                    title="Bullet List"
                  >
                    • List
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const newText = localComponent.content.text + 
                        '\n<ol class="list-decimal list-inside space-y-1">\n  <li>First item</li>\n  <li>Second item</li>\n  <li>Third item</li>\n</ol>';
                      updateContent('text', newText);
                    }}
                    title="Numbered List"
                  >
                    1. List
                  </Button>
                </div>

                <div className="flex gap-1">
                  <Select
                    onValueChange={(value) => {
                      const textarea = document.getElementById('text');
                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const selectedText = localComponent.content.text.substring(start, end);
                      const headingText = selectedText || 'Heading text';
                      const newText = localComponent.content.text.substring(0, start) + 
                        `<${value} class="font-bold ${value === 'h1' ? 'text-3xl' : value === 'h2' ? 'text-2xl' : value === 'h3' ? 'text-xl' : value === 'h4' ? 'text-lg' : 'text-base'} mb-2">${headingText}</${value}>` + 
                        localComponent.content.text.substring(end);
                      updateContent('text', newText);
                    }}
                  >
                    <SelectTrigger className="w-20 h-8">
                      <SelectValue placeholder="H" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="h1">H1</SelectItem>
                      <SelectItem value="h2">H2</SelectItem>
                      <SelectItem value="h3">H3</SelectItem>
                      <SelectItem value="h4">H4</SelectItem>
                      <SelectItem value="h5">H5</SelectItem>
                      <SelectItem value="h6">H6</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Additional HTML Elements Toolbar */}
              <div className="border-x border-b rounded-b-md bg-gray-50 p-2 border-t-0">
                <div className="flex flex-wrap gap-1 text-xs">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => {
                      const newText = localComponent.content.text + '\n<p class="mb-4">Your paragraph text here.</p>';
                      updateContent('text', newText);
                    }}
                    title="Add Paragraph"
                  >
                    P
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => {
                      const newText = localComponent.content.text + '\n<div class="p-4 bg-blue-50 border-l-4 border-blue-400 my-4">\n  <p class="text-blue-800">This is an info box.</p>\n</div>';
                      updateContent('text', newText);
                    }}
                    title="Add Info Box"
                  >
                    📝 Box
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => {
                      const newText = localComponent.content.text + '\n<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4">\n  "This is a quote."\n</blockquote>';
                      updateContent('text', newText);
                    }}
                    title="Add Quote"
                  >
                    💬 Quote
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => {
                      const newText = localComponent.content.text + '\n<hr class="my-6 border-gray-300" />';
                      updateContent('text', newText);
                    }}
                    title="Add Horizontal Line"
                  >
                    ➖ Line
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => {
                      const textarea = document.getElementById('text');
                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const selectedText = localComponent.content.text.substring(start, end);
                      const newText = localComponent.content.text.substring(0, start) + 
                        `<span class="bg-yellow-200 px-1 rounded">${selectedText || 'highlighted text'}</span>` + 
                        localComponent.content.text.substring(end);
                      updateContent('text', newText);
                    }}
                    title="Highlight Text"
                  >
                    🖍️ Highlight
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => {
                      const textarea = document.getElementById('text');
                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const selectedText = localComponent.content.text.substring(start, end);
                      const newText = localComponent.content.text.substring(0, start) + 
                        `<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">${selectedText || 'code'}</code>` + 
                        localComponent.content.text.substring(end);
                      updateContent('text', newText);
                    }}
                    title="Inline Code"
                  >
                    &lt;/&gt; Code
                  </Button>
                </div>
              </div>

              <Textarea
                id="text"
                rows={12}
                value={localComponent.content.text || ''}
                onChange={(e) => updateContent('text', e.target.value)}
                placeholder="Enter your text content here. Use the toolbar above for formatting or write HTML directly."
                className="rounded-t-none border-t-0 font-mono text-sm"
              />
              
              <div className="text-xs text-gray-500 space-y-1">
                <p><strong>Tips:</strong></p>
                <ul className="list-disc list-inside space-y-0.5 ml-2">
                  <li>Select text in the editor and use toolbar buttons to format</li>
                  <li>You can write HTML directly in the text area</li>
                  <li>Common tags: &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;u&gt;, &lt;a&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;h1-h6&gt;</li>
                  <li>Use Tailwind CSS classes for styling</li>
                </ul>
              </div>
            </div>
            
            <div>
              <Label htmlFor="alignment">Text Alignment</Label>
              <Select
                value={localComponent.content.alignment || 'left'}
                onValueChange={(value) => updateContent('alignment', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                  <SelectItem value="justify">Justify</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Typography Settings */}
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-sm">Typography Settings</h4>
              
              <div>
                <Label htmlFor="fontSize">Font Size</Label>
                <Select
                  value={localComponent.content.fontSize || 'base'}
                  onValueChange={(value) => updateContent('fontSize', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xs">Extra Small (12px)</SelectItem>
                    <SelectItem value="sm">Small (14px)</SelectItem>
                    <SelectItem value="base">Base (16px)</SelectItem>
                    <SelectItem value="lg">Large (18px)</SelectItem>
                    <SelectItem value="xl">Extra Large (20px)</SelectItem>
                    <SelectItem value="2xl">2X Large (24px)</SelectItem>
                    <SelectItem value="3xl">3X Large (30px)</SelectItem>
                    <SelectItem value="4xl">4X Large (36px)</SelectItem>
                    <SelectItem value="5xl">5X Large (48px)</SelectItem>
                    <SelectItem value="6xl">6X Large (60px)</SelectItem>
                    <SelectItem value="custom">Custom Size</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {localComponent.content.fontSize === 'custom' && (
                <div>
                  <Label htmlFor="customFontSize">Custom Font Size</Label>
                  <Input
                    id="customFontSize"
                    value={localComponent.content.customFontSize || ''}
                    onChange={(e) => updateContent('customFontSize', e.target.value)}
                    placeholder="16px, 1.2rem, 1.5em"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="lineHeight">Line Height (Line Spacing)</Label>
                <Select
                  value={localComponent.content.lineHeight || 'normal'}
                  onValueChange={(value) => updateContent('lineHeight', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (1.0)</SelectItem>
                    <SelectItem value="tight">Tight (1.25)</SelectItem>
                    <SelectItem value="snug">Snug (1.375)</SelectItem>
                    <SelectItem value="normal">Normal (1.5)</SelectItem>
                    <SelectItem value="relaxed">Relaxed (1.625)</SelectItem>
                    <SelectItem value="loose">Loose (2.0)</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {localComponent.content.lineHeight === 'custom' && (
                <div>
                  <Label htmlFor="customLineHeight">Custom Line Height</Label>
                  <Input
                    id="customLineHeight"
                    value={localComponent.content.customLineHeight || ''}
                    onChange={(e) => updateContent('customLineHeight', e.target.value)}
                    placeholder="1.6, 24px, 1.5rem"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="fontWeight">Font Weight</Label>
                <Select
                  value={localComponent.content.fontWeight || 'normal'}
                  onValueChange={(value) => updateContent('fontWeight', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="thin">Thin (100)</SelectItem>
                    <SelectItem value="extralight">Extra Light (200)</SelectItem>
                    <SelectItem value="light">Light (300)</SelectItem>
                    <SelectItem value="normal">Normal (400)</SelectItem>
                    <SelectItem value="medium">Medium (500)</SelectItem>
                    <SelectItem value="semibold">Semi Bold (600)</SelectItem>
                    <SelectItem value="bold">Bold (700)</SelectItem>
                    <SelectItem value="extrabold">Extra Bold (800)</SelectItem>
                    <SelectItem value="black">Black (900)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="textColor">Text Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="textColor"
                    type="color"
                    value={localComponent.content.textColor || '#000000'}
                    onChange={(e) => updateContent('textColor', e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    value={localComponent.content.textColor || ''}
                    onChange={(e) => updateContent('textColor', e.target.value)}
                    placeholder="#000000 (leave empty for default)"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="preserveLineBreaks">Line Break Handling</Label>
                <Select
                  value={localComponent.content.preserveLineBreaks || 'normal'}
                  onValueChange={(value) => updateContent('preserveLineBreaks', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal (HTML default)</SelectItem>
                    <SelectItem value="preserve">Preserve Line Breaks</SelectItem>
                    <SelectItem value="nowrap">No Line Wrapping</SelectItem>
                    <SelectItem value="pre">Preserve All Whitespace</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Controls how line breaks and spacing in the text editor are displayed
                </p>
              </div>
            </div>

            {/* Spacing Settings */}
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-sm">Spacing Settings</h4>
              
              <div>
                <Label htmlFor="marginTop">Top Margin</Label>
                <Select
                  value={localComponent.content.marginTop || 'normal'}
                  onValueChange={(value) => updateContent('marginTop', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="small">Small (8px)</SelectItem>
                    <SelectItem value="normal">Normal (16px)</SelectItem>
                    <SelectItem value="large">Large (24px)</SelectItem>
                    <SelectItem value="xlarge">Extra Large (32px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="marginBottom">Bottom Margin</Label>
                <Select
                  value={localComponent.content.marginBottom || 'normal'}
                  onValueChange={(value) => updateContent('marginBottom', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="small">Small (8px)</SelectItem>
                    <SelectItem value="normal">Normal (16px)</SelectItem>
                    <SelectItem value="large">Large (24px)</SelectItem>
                    <SelectItem value="xlarge">Extra Large (32px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="contentSpacing">Content Line Spacing (Between Elements)</Label>
                <Select
                  value={localComponent.content.contentSpacing || 'normal'}
                  onValueChange={(value) => updateContent('contentSpacing', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tight">Tight Spacing</SelectItem>
                    <SelectItem value="normal">Normal Spacing</SelectItem>
                    <SelectItem value="relaxed">Relaxed Spacing</SelectItem>
                    <SelectItem value="loose">Loose Spacing</SelectItem>
                    <SelectItem value="custom">Custom Spacing</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Controls spacing between paragraphs, headings, and other content elements
                </p>
              </div>

              {localComponent.content.contentSpacing === 'custom' && (
                <div>
                  <Label htmlFor="customContentSpacing">Custom Content Spacing</Label>
                  <Input
                    id="customContentSpacing"
                    value={localComponent.content.customContentSpacing || ''}
                    onChange={(e) => updateContent('customContentSpacing', e.target.value)}
                    placeholder="1.5rem, 24px, 1.5em"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Spacing between content elements (paragraphs, headings, lists, etc.)
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="paragraphSpacing">Paragraph Spacing</Label>
                <Select
                  value={localComponent.content.paragraphSpacing || 'normal'}
                  onValueChange={(value) => updateContent('paragraphSpacing', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Extra Spacing</SelectItem>
                    <SelectItem value="small">Small (0.5rem)</SelectItem>
                    <SelectItem value="normal">Normal (1rem)</SelectItem>
                    <SelectItem value="large">Large (1.5rem)</SelectItem>
                    <SelectItem value="xlarge">Extra Large (2rem)</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Additional spacing specifically between paragraphs
                </p>
              </div>

              {localComponent.content.paragraphSpacing === 'custom' && (
                <div>
                  <Label htmlFor="customParagraphSpacing">Custom Paragraph Spacing</Label>
                  <Input
                    id="customParagraphSpacing"
                    value={localComponent.content.customParagraphSpacing || ''}
                    onChange={(e) => updateContent('customParagraphSpacing', e.target.value)}
                    placeholder="1rem, 16px, 1em"
                  />
                </div>
              )}
            </div>

            {/* Live Preview */}
            <div>
              <Label>Live Preview</Label>
              <div className={`border rounded-lg p-4 bg-white min-h-[100px] text-${localComponent.content.alignment || 'left'}`}>
                {localComponent.content.text ? (
                  <div 
                    className={`prose max-w-none ${
                      // Font size classes
                      localComponent.content.fontSize && localComponent.content.fontSize !== 'custom' ? `text-${localComponent.content.fontSize}` : ''
                    } ${
                      // Line height classes
                      localComponent.content.lineHeight && localComponent.content.lineHeight !== 'custom' ? `leading-${localComponent.content.lineHeight}` : ''
                    } ${
                      // Font weight classes
                      localComponent.content.fontWeight ? `font-${localComponent.content.fontWeight}` : ''
                    }`}
                    style={{
                      // Custom font size
                      fontSize: localComponent.content.fontSize === 'custom' ? localComponent.content.customFontSize : undefined,
                      // Custom line height
                      lineHeight: localComponent.content.lineHeight === 'custom' ? localComponent.content.customLineHeight : undefined,
                      // Text color
                      color: localComponent.content.textColor || undefined,
                      // Line break handling
                      whiteSpace: localComponent.content.preserveLineBreaks === 'preserve' ? 'pre-line' :
                        localComponent.content.preserveLineBreaks === 'nowrap' ? 'nowrap' :
                        localComponent.content.preserveLineBreaks === 'pre' ? 'pre-wrap' : 'normal',
                      // Margins
                      marginTop: localComponent.content.marginTop === 'none' ? '0' :
                        localComponent.content.marginTop === 'small' ? '8px' :
                        localComponent.content.marginTop === 'normal' ? '16px' :
                        localComponent.content.marginTop === 'large' ? '24px' :
                        localComponent.content.marginTop === 'xlarge' ? '32px' : undefined,
                      marginBottom: localComponent.content.marginBottom === 'none' ? '0' :
                        localComponent.content.marginBottom === 'small' ? '8px' :
                        localComponent.content.marginBottom === 'normal' ? '16px' :
                        localComponent.content.marginBottom === 'large' ? '24px' :
                        localComponent.content.marginBottom === 'xlarge' ? '32px' : undefined,
                    }}
                    dangerouslySetInnerHTML={{ 
                      __html: (() => {
                        if (!localComponent.content.text) return '';
                        
                        // Get spacing values
                        const contentSpacing = localComponent.content.contentSpacing === 'custom' 
                          ? localComponent.content.customContentSpacing 
                          : localComponent.content.contentSpacing === 'tight' ? '0.75rem'
                          : localComponent.content.contentSpacing === 'relaxed' ? '1.5rem'
                          : localComponent.content.contentSpacing === 'loose' ? '2rem'
                          : '1rem';
                          
                        const paragraphSpacing = localComponent.content.paragraphSpacing === 'custom' 
                          ? localComponent.content.customParagraphSpacing 
                          : localComponent.content.paragraphSpacing === 'none' ? '0'
                          : localComponent.content.paragraphSpacing === 'small' ? '0.5rem'
                          : localComponent.content.paragraphSpacing === 'large' ? '1.5rem'
                          : localComponent.content.paragraphSpacing === 'xlarge' ? '2rem'
                          : '1rem';
                        
                        // Process HTML with direct spacing values
                        let processedHtml = localComponent.content.text;
                        
                        // First, remove any existing spacing divs to avoid duplicates
                        processedHtml = processedHtml.replace(
                          /<div style="height: [^"]*;"><\/div>/g, 
                          ''
                        );
                        
                        // Add spacing after paragraphs
                        if (paragraphSpacing && paragraphSpacing !== '0') {
                          processedHtml = processedHtml.replace(
                            /<\/p>/g, 
                            `</p><div style="height: ${paragraphSpacing}; margin: 0; padding: 0;"></div>`
                          );
                        }
                        
                        // Add spacing after headings, lists, and blockquotes (but not divs to avoid conflicts)
                        if (contentSpacing && contentSpacing !== '0') {
                          processedHtml = processedHtml.replace(
                            /<\/(h[1-6]|ul|ol|blockquote)>/g, 
                            `</$1><div style="height: ${contentSpacing}; margin: 0; padding: 0;"></div>`
                          );
                        }
                        
                        return processedHtml;
                      })()
                    }}
                  />
                ) : (
                  <p className="text-gray-500 italic">Your formatted text will appear here...</p>
                )}
              </div>
            </div>
          </div>
        );

      case COMPONENT_TYPES.IMAGE:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="image-upload">Upload Image</Label>
              <div className="space-y-3">
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      try {
                        // Import the upload service
                        const { uploadImage, validateImageFile } = await import('@/api/services/admin/imageUploadService');
                        
                        // Validate file
                        const validation = validateImageFile(file);
                        if (!validation.isValid) {
                          toast.error(validation.error);
                          return;
                        }

                        // Show loading state
                        updateContent('uploading', true);
                        
                        // Upload image
                        const response = await uploadImage(file);
                        
                        if (response.status === 'success') {
                          updateContent('src', response.data.filePath);
                          updateContent('uploading', false);
                          toast.success('Image uploaded successfully!');
                        } else {
                          throw new Error(response.message || 'Upload failed');
                        }
                      } catch (error) {
                        updateContent('uploading', false);
                        console.error('Upload error:', error);
                        toast.error(error.message || 'Failed to upload image');
                      }
                    }
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {localComponent.content.uploading && (
                  <div className="flex items-center space-x-2 text-sm text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span>Uploading image...</span>
                  </div>
                )}
                {localComponent.content.src && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-600">✓ Image uploaded</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          try {
                            const { deleteImage } = await import('@/api/services/admin/imageUploadService');
                            await deleteImage(localComponent.content.src);
                            updateContent('src', '');
                            toast.success('Image removed successfully!');
                          } catch (error) {
                            console.error('Delete error:', error);
                            toast.error('Failed to remove image');
                          }
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                    <img 
                      src={localComponent.content.src} 
                      alt="Preview" 
                      className="max-w-full h-32 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="alt">Alt Text</Label>
              <Input
                id="alt"
                value={localComponent.content.alt || ''}
                onChange={(e) => updateContent('alt', e.target.value)}
                placeholder="Describe the image for accessibility"
              />
            </div>
            
            <div>
              <Label htmlFor="caption">Caption (optional)</Label>
              <Input
                id="caption"
                value={localComponent.content.caption || ''}
                onChange={(e) => updateContent('caption', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="alignment">Alignment</Label>
              <Select
                value={localComponent.content.alignment || 'center'}
                onValueChange={(value) => updateContent('alignment', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Image Dimensions */}
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-sm">Image Dimensions</h4>
              
              <div>
                <Label htmlFor="sizeMode">Size Mode</Label>
                <Select
                  value={localComponent.content.sizeMode || 'auto'}
                  onValueChange={(value) => updateContent('sizeMode', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto (Original Size)</SelectItem>
                    <SelectItem value="responsive">Responsive (Max Width 100%)</SelectItem>
                    <SelectItem value="custom">Custom Dimensions</SelectItem>
                    <SelectItem value="preset">Preset Sizes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {localComponent.content.sizeMode === 'custom' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="customWidth">Width</Label>
                    <Input
                      id="customWidth"
                      value={localComponent.content.customWidth || ''}
                      onChange={(e) => updateContent('customWidth', e.target.value)}
                      placeholder="300px, 50%, auto"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customHeight">Height</Label>
                    <Input
                      id="customHeight"
                      value={localComponent.content.customHeight || ''}
                      onChange={(e) => updateContent('customHeight', e.target.value)}
                      placeholder="200px, auto"
                    />
                  </div>
                </div>
              )}

              {localComponent.content.sizeMode === 'preset' && (
                <div>
                  <Label htmlFor="presetSize">Preset Size</Label>
                  <Select
                    value={localComponent.content.presetSize || 'medium'}
                    onValueChange={(value) => updateContent('presetSize', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (200x150px)</SelectItem>
                      <SelectItem value="medium">Medium (400x300px)</SelectItem>
                      <SelectItem value="large">Large (600x450px)</SelectItem>
                      <SelectItem value="xlarge">X-Large (800x600px)</SelectItem>
                      <SelectItem value="thumbnail">Thumbnail (100x100px)</SelectItem>
                      <SelectItem value="banner">Banner (1200x300px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {(localComponent.content.sizeMode === 'custom' || localComponent.content.sizeMode === 'preset') && (
                <div>
                  <Label htmlFor="objectFit">Object Fit</Label>
                  <Select
                    value={localComponent.content.objectFit || 'cover'}
                    onValueChange={(value) => updateContent('objectFit', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cover">Cover (Fill, may crop)</SelectItem>
                      <SelectItem value="contain">Contain (Fit, no crop)</SelectItem>
                      <SelectItem value="fill">Fill (Stretch to fit)</SelectItem>
                      <SelectItem value="none">None (Original size)</SelectItem>
                      <SelectItem value="scale-down">Scale Down</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Border & Effects */}
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-sm">Border & Effects</h4>
              
              <div>
                <Label htmlFor="borderRadius">Border Radius</Label>
                <Select
                  value={localComponent.content.borderRadius || 'none'}
                  onValueChange={(value) => updateContent('borderRadius', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="rounded">Small (8px)</SelectItem>
                    <SelectItem value="rounded-lg">Medium (12px)</SelectItem>
                    <SelectItem value="rounded-xl">Large (16px)</SelectItem>
                    <SelectItem value="rounded-full">Full (Circle/Oval)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="shadow">Shadow</Label>
                <Select
                  value={localComponent.content.shadow || 'none'}
                  onValueChange={(value) => updateContent('shadow', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="shadow-sm">Small</SelectItem>
                    <SelectItem value="shadow">Medium</SelectItem>
                    <SelectItem value="shadow-lg">Large</SelectItem>
                    <SelectItem value="shadow-xl">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="border">Border</Label>
                <Select
                  value={localComponent.content.border || 'none'}
                  onValueChange={(value) => updateContent('border', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="border">Thin Gray</SelectItem>
                    <SelectItem value="border-2">Medium Gray</SelectItem>
                    <SelectItem value="border-4">Thick Gray</SelectItem>
                    <SelectItem value="border border-blue-500">Blue</SelectItem>
                    <SelectItem value="border border-red-500">Red</SelectItem>
                    <SelectItem value="border border-green-500">Green</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case COMPONENT_TYPES.CTA:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={localComponent.content.title || ''}
                onChange={(e) => updateContent('title', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={localComponent.content.description || ''}
                onChange={(e) => updateContent('description', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={localComponent.content.buttonText || ''}
                onChange={(e) => updateContent('buttonText', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="buttonLink">Button Link</Label>
              <Input
                id="buttonLink"
                value={localComponent.content.buttonLink || ''}
                onChange={(e) => updateContent('buttonLink', e.target.value)}
              />
            </div>
          </div>
        );

      case COMPONENT_TYPES.TESTIMONIAL:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="quote">Quote</Label>
              <Textarea
                id="quote"
                value={localComponent.content.quote || ''}
                onChange={(e) => updateContent('quote', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="author">Author Name</Label>
              <Input
                id="author"
                value={localComponent.content.author || ''}
                onChange={(e) => updateContent('author', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="role">Author Role/Title</Label>
              <Input
                id="role"
                value={localComponent.content.role || ''}
                onChange={(e) => updateContent('role', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="avatar">Avatar URL (optional)</Label>
              <Input
                id="avatar"
                value={localComponent.content.avatar || ''}
                onChange={(e) => updateContent('avatar', e.target.value)}
              />
            </div>
          </div>
        );

      case COMPONENT_TYPES.COLUMNS:
        return (
          <div className="space-y-4">
            <div>
              <Label>Columns</Label>
              <div className="space-y-4">
                {localComponent.content.columns.map((column, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Column {index + 1}</h4>
                      {localComponent.content.columns.length > 1 && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            const newColumns = localComponent.content.columns.filter((_, i) => i !== index);
                            updateContent('columns', newColumns);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`icon-${index}`}>Icon</Label>
                      <Input
                        id={`icon-${index}`}
                        value={column.icon || ''}
                        onChange={(e) => {
                          const newColumns = [...localComponent.content.columns];
                          newColumns[index] = { ...newColumns[index], icon: e.target.value };
                          updateContent('columns', newColumns);
                        }}
                        placeholder="🚀"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`title-${index}`}>Title</Label>
                      <Input
                        id={`title-${index}`}
                        value={column.title || ''}
                        onChange={(e) => {
                          const newColumns = [...localComponent.content.columns];
                          newColumns[index] = { ...newColumns[index], title: e.target.value };
                          updateContent('columns', newColumns);
                        }}
                        placeholder="Feature Title"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`text-${index}`}>Description</Label>
                      <Textarea
                        id={`text-${index}`}
                        value={column.text || ''}
                        onChange={(e) => {
                          const newColumns = [...localComponent.content.columns];
                          newColumns[index] = { ...newColumns[index], text: e.target.value };
                          updateContent('columns', newColumns);
                        }}
                        placeholder="Feature description"
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    const newColumns = [
                      ...localComponent.content.columns,
                      { title: 'New Feature', text: 'Description of your feature.', icon: '⭐' }
                    ];
                    updateContent('columns', newColumns);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Column
                </Button>
                <span className="text-sm text-gray-600">
                  {localComponent.content.columns.length} column{localComponent.content.columns.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <div>
              <Label htmlFor="layout">Layout</Label>
              <Select
                value={localComponent.content.layout || 'equal'}
                onValueChange={(value) => updateContent('layout', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equal">Equal Width</SelectItem>
                  <SelectItem value="featured">Featured First</SelectItem>
                  <SelectItem value="sidebar">Sidebar Layout</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case COMPONENT_TYPES.SPACER:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="height">Spacer Height</Label>
              <div className="space-y-2">
                <Input
                  id="height"
                  value={localComponent.content.height || '50px'}
                  onChange={(e) => updateContent('height', e.target.value)}
                  placeholder="50px"
                />
                <p className="text-xs text-gray-500">
                  Enter a valid CSS height value (e.g., 50px, 2rem, 10vh)
                </p>
              </div>
            </div>
            <div>
              <Label>Quick Height Options</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateContent('height', '25px')}
                  className={localComponent.content.height === '25px' ? 'bg-blue-50 border-blue-300' : ''}
                >
                  Small (25px)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateContent('height', '50px')}
                  className={localComponent.content.height === '50px' ? 'bg-blue-50 border-blue-300' : ''}
                >
                  Medium (50px)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateContent('height', '100px')}
                  className={localComponent.content.height === '100px' ? 'bg-blue-50 border-blue-300' : ''}
                >
                  Large (100px)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateContent('height', '150px')}
                  className={localComponent.content.height === '150px' ? 'bg-blue-50 border-blue-300' : ''}
                >
                  X-Large (150px)
                </Button>
              </div>
            </div>
            <div className="border rounded-lg p-4 bg-gray-50">
              <Label className="text-sm font-medium">Preview</Label>
              <div 
                style={{ height: localComponent.content.height || '50px' }}
                className="bg-gray-200 border-2 border-dashed border-gray-400 rounded mt-2 flex items-center justify-center"
              >
                <span className="text-gray-600 text-sm">
                  Spacer ({localComponent.content.height || '50px'})
                </span>
              </div>
            </div>
          </div>
        );

      default:
        return <p>No editor available for this component type.</p>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {component?.type} Component</DialogTitle>
          <DialogDescription>
            Configure the properties for this component.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {renderEditor()}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Component Preview
const ComponentPreview = ({ component, onEdit, onDelete, onMoveUp, onMoveDown, index, totalComponents }) => {
  const renderPreview = () => {
    switch (component.type) {
      case COMPONENT_TYPES.HERO:
        const getHeroHeight = () => {
          switch (component.content.height) {
            case 'small': return '300px';
            case 'medium': return '500px';
            case 'large': return '700px';
            case 'fullscreen': return '100vh';
            case 'custom': return component.content.customHeight || '400px';
            default: return '500px';
          }
        };

        const getHeroBackground = () => {
          const type = component.content.backgroundType || 'gradient';
          const overlay = component.content.backgroundOverlay || 40;
          
          if (type === 'color') {
            return component.content.backgroundColor || '#667eea';
          } else if (type === 'gradient') {
            const start = component.content.gradientStart || '#667eea';
            const end = component.content.gradientEnd || '#764ba2';
            const direction = component.content.gradientDirection || '135deg';
            return `linear-gradient(${direction}, ${start} 0%, ${end} 100%)`;
          } else if (type === 'image' && component.content.backgroundImage) {
            return `linear-gradient(rgba(0,0,0,${overlay/100}), rgba(0,0,0,${overlay/100})), url(${component.content.backgroundImage})`;
          } else {
            return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
          }
        };

        const getButtonClasses = () => {
          const style = component.content.buttonStyle || 'primary';
          const size = component.content.buttonSize || 'medium';
          
          let baseClasses = 'font-semibold rounded-lg transition-colors ';
          
          // Size classes
          switch (size) {
            case 'small':
              baseClasses += 'px-4 py-2 text-sm ';
              break;
            case 'large':
              baseClasses += 'px-10 py-4 text-lg ';
              break;
            default:
              baseClasses += 'px-8 py-3 ';
          }
          
          // Style classes
          switch (style) {
            case 'secondary':
              baseClasses += 'bg-gray-600 text-white hover:bg-gray-700 ';
              break;
            case 'outline':
              baseClasses += 'border-2 border-white text-white bg-transparent hover:bg-white hover:text-gray-900 ';
              break;
            case 'ghost':
              baseClasses += 'text-white bg-transparent hover:bg-white hover:bg-opacity-20 ';
              break;
            default:
              baseClasses += 'bg-white text-blue-600 hover:bg-gray-100 ';
          }
          
          return baseClasses;
        };

        return (
          <div 
            className="relative bg-cover bg-center rounded-lg flex items-center justify-center"
            style={{ 
              height: getHeroHeight(),
              background: getHeroBackground(),
              color: component.content.textColor || '#ffffff'
            }}
          >
            <div className={`text-${component.content.textAlignment || 'center'} max-w-4xl mx-auto px-8`}>
              <h1 className="text-4xl font-bold mb-4">{component.content.title || 'Hero Title'}</h1>
              {component.content.subtitle && (
                <p className="text-xl mb-6">{component.content.subtitle}</p>
              )}
              {component.content.buttonText && (
                <button className={getButtonClasses()}>
                  {component.content.buttonText}
                </button>
              )}
            </div>
          </div>
        );

      case COMPONENT_TYPES.TEXT:
        const getTextClasses = () => {
          let classes = ['prose', 'max-w-none'];
          
          // Add alignment
          classes.push(`text-${component.content.alignment || 'left'}`);
          
          // Add font size
          const fontSize = component.content.fontSize || 'base';
          if (fontSize !== 'custom') {
            classes.push(`text-${fontSize}`);
          }
          
          // Add line height
          const lineHeight = component.content.lineHeight || 'normal';
          if (lineHeight !== 'custom') {
            classes.push(`leading-${lineHeight}`);
          }
          
          // Add font weight
          const fontWeight = component.content.fontWeight || 'normal';
          classes.push(`font-${fontWeight}`);
          
          return classes.join(' ');
        };

        const getTextStyles = () => {
          let styles = {};
          
          // Custom font size
          if (component.content.fontSize === 'custom' && component.content.customFontSize) {
            styles.fontSize = component.content.customFontSize;
          }
          
          // Custom line height
          if (component.content.lineHeight === 'custom' && component.content.customLineHeight) {
            styles.lineHeight = component.content.customLineHeight;
          }
          
          // Text color
          if (component.content.textColor) {
            styles.color = component.content.textColor;
          }
          
          // Margins
          if (component.content.marginTop) {
            const marginMap = { none: '0', small: '8px', normal: '16px', large: '24px', xlarge: '32px' };
            styles.marginTop = marginMap[component.content.marginTop] || component.content.marginTop;
          }
          
          if (component.content.marginBottom) {
            const marginMap = { none: '0', small: '8px', normal: '16px', large: '24px', xlarge: '32px' };
            styles.marginBottom = marginMap[component.content.marginBottom] || component.content.marginBottom;
          }
          
          // Line break handling
          styles.whiteSpace = component.content.preserveLineBreaks === 'preserve' ? 'pre-line' :
            component.content.preserveLineBreaks === 'nowrap' ? 'nowrap' :
            component.content.preserveLineBreaks === 'pre' ? 'pre-wrap' : 'normal';
          
          // Content spacing (CSS custom properties for spacing control)
          styles['--content-spacing'] = component.content.contentSpacing === 'custom' 
            ? component.content.customContentSpacing 
            : component.content.contentSpacing === 'tight' ? '0.75rem'
            : component.content.contentSpacing === 'relaxed' ? '1.5rem'
            : component.content.contentSpacing === 'loose' ? '2rem'
            : '1rem';
            
          styles['--paragraph-spacing'] = component.content.paragraphSpacing === 'custom' 
            ? component.content.customParagraphSpacing 
            : component.content.paragraphSpacing === 'none' ? '0'
            : component.content.paragraphSpacing === 'small' ? '0.5rem'
            : component.content.paragraphSpacing === 'large' ? '1.5rem'
            : component.content.paragraphSpacing === 'xlarge' ? '2rem'
            : '1rem';
          
          return styles;
        };

        const processContentSpacing = (html) => {
          if (!html) return html;
          
          // Get spacing values
          const contentSpacing = component.content.contentSpacing === 'custom' 
            ? component.content.customContentSpacing 
            : component.content.contentSpacing === 'tight' ? '0.75rem'
            : component.content.contentSpacing === 'relaxed' ? '1.5rem'
            : component.content.contentSpacing === 'loose' ? '2rem'
            : '1rem';
            
          const paragraphSpacing = component.content.paragraphSpacing === 'custom' 
            ? component.content.customParagraphSpacing 
            : component.content.paragraphSpacing === 'none' ? '0'
            : component.content.paragraphSpacing === 'small' ? '0.5rem'
            : component.content.paragraphSpacing === 'large' ? '1.5rem'
            : component.content.paragraphSpacing === 'xlarge' ? '2rem'
            : '1rem';
          
          // Process HTML with direct spacing values
          let processedHtml = html;
          
          // First, remove any existing spacing divs to avoid duplicates
          processedHtml = processedHtml.replace(
            /<div style="height: [^"]*; margin: 0; padding: 0;"><\/div>/g, 
            ''
          );
          
          // Add spacing after paragraphs
          if (paragraphSpacing && paragraphSpacing !== '0') {
            processedHtml = processedHtml.replace(
              /<\/p>/g, 
              `</p><div style="height: ${paragraphSpacing}; margin: 0; padding: 0;"></div>`
            );
          }
          
          // Add spacing after headings, lists, and blockquotes (but not divs to avoid conflicts)
          if (contentSpacing && contentSpacing !== '0') {
            processedHtml = processedHtml.replace(
              /<\/(h[1-6]|ul|ol|blockquote)>/g, 
              `</$1><div style="height: ${contentSpacing}; margin: 0; padding: 0;"></div>`
            );
          }
          
          return processedHtml;
        };

        return (
          <div 
            className={getTextClasses()}
            style={getTextStyles()}
            dangerouslySetInnerHTML={{ __html: processContentSpacing(component.content.text) }}
          />
        );

      case COMPONENT_TYPES.IMAGE:
        const getImageDimensions = () => {
          const sizeMode = component.content.sizeMode || 'auto';
          let style = {};
          let className = '';

          switch (sizeMode) {
            case 'custom':
              if (component.content.customWidth) {
                style.width = component.content.customWidth;
              }
              if (component.content.customHeight) {
                style.height = component.content.customHeight;
              }
              break;
            case 'preset':
              const presetSize = component.content.presetSize || 'medium';
              switch (presetSize) {
                case 'small':
                  style = { width: '200px', height: '150px' };
                  break;
                case 'medium':
                  style = { width: '400px', height: '300px' };
                  break;
                case 'large':
                  style = { width: '600px', height: '450px' };
                  break;
                case 'xlarge':
                  style = { width: '800px', height: '600px' };
                  break;
                case 'thumbnail':
                  style = { width: '100px', height: '100px' };
                  break;
                case 'banner':
                  style = { width: '1200px', height: '300px' };
                  break;
              }
              break;
            case 'responsive':
              className = 'max-w-full h-auto';
              break;
            default: // auto
              className = 'h-auto';
              break;
          }

          return { style, className };
        };

        const getImageClasses = () => {
          let classes = [];
          
          // Add dimension classes
          const { className } = getImageDimensions();
          if (className) classes.push(className);
          
          // Add border radius
          const borderRadius = component.content.borderRadius || 'none';
          if (borderRadius !== 'none') {
            classes.push(borderRadius);
          }
          
          // Add shadow
          const shadow = component.content.shadow || 'none';
          if (shadow !== 'none') {
            classes.push(shadow);
          }
          
          // Add border
          const border = component.content.border || 'none';
          if (border !== 'none') {
            classes.push(border);
          }
          
          // Add object fit for custom/preset sizes
          const sizeMode = component.content.sizeMode || 'auto';
          if (sizeMode === 'custom' || sizeMode === 'preset') {
            const objectFit = component.content.objectFit || 'cover';
            classes.push(`object-${objectFit}`);
          }
          
          return classes.join(' ');
        };

        return (
          <div className={`text-${component.content.alignment || 'center'}`}>
            {component.content.src ? (
              <div>
                <img 
                  src={component.content.src} 
                  alt={component.content.alt}
                  style={getImageDimensions().style}
                  className={getImageClasses()}
                />
                {component.content.caption && (
                  <p className="text-sm text-gray-600 mt-2 italic">{component.content.caption}</p>
                )}
              </div>
            ) : (
              <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">No image selected</span>
              </div>
            )}
          </div>
        );

      case COMPONENT_TYPES.CTA:
        return (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-4">{component.content.title}</h3>
            <p className="text-lg mb-6 opacity-90">{component.content.description}</p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              {component.content.buttonText}
            </button>
          </div>
        );

      case COMPONENT_TYPES.TESTIMONIAL:
        return (
          <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
            <blockquote className="text-lg italic mb-4">
              "{component.content.quote}"
            </blockquote>
            <div className="flex items-center">
              {component.content.avatar && (
                <img 
                  src={component.content.avatar} 
                  alt={component.content.author}
                  className="w-12 h-12 rounded-full mr-4"
                />
              )}
              <div>
                <div className="font-semibold">{component.content.author}</div>
                <div className="text-sm text-gray-600">{component.content.role}</div>
              </div>
            </div>
          </div>
        );

      case COMPONENT_TYPES.COLUMNS:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {component.content.columns.map((column, idx) => (
              <div key={idx} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-3">{column.icon}</div>
                <h4 className="text-lg font-semibold mb-2">{column.title}</h4>
                <p className="text-gray-600">{column.text}</p>
              </div>
            ))}
          </div>
        );

      case COMPONENT_TYPES.SPACER:
        return (
          <div 
            style={{ height: component.content.height }}
            className="bg-gray-100 border-2 border-dashed border-gray-300 rounded flex items-center justify-center"
          >
            <span className="text-gray-500 text-sm">Spacer ({component.content.height})</span>
          </div>
        );

      default:
        return <div className="p-4 bg-gray-100 rounded border-2 border-dashed">Unknown component type: {component.type}</div>;
    }
  };

  return (
    <div className="group relative border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <div className="flex space-x-1 bg-white rounded-md shadow-lg p-1">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onMoveUp}
            disabled={index === 0}
            title="Move up"
          >
            ↑
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onMoveDown}
            disabled={index === totalComponents - 1}
            title="Move down"
          >
            ↓
          </Button>
          <Button size="sm" variant="outline" onClick={onEdit} title="Edit">
            <Edit3 className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="destructive" onClick={onDelete} title="Delete">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      <div className="pr-32">
        {renderPreview()}
      </div>
    </div>
  );
};

// Main Create Page Builder Component
const CreatePageBuilderContent = () => {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();
  const menuPermissions = useMenuPermissions();
  
  const [pageData, setPageData] = useState({
    title: '',
    slug: '',
    meta_title: '',
    meta_description: '',
    status: 1,
    components: [],
    selectedMenuId: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);
  const [showComponentEditor, setShowComponentEditor] = useState(false);
  const [pageBuilderMenus, setPageBuilderMenus] = useState([]);
  const [loadingMenus, setLoadingMenus] = useState(true);
  const [isMenuSelected, setIsMenuSelected] = useState(false);

  // Set page title
  useEffect(() => {
    setPageTitle('Create New Page');
    setPageSubtitle('Build a dynamic page with our page builder');
  }, [setPageTitle, setPageSubtitle]);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error('Authentication required. Please log in.');
      router.push('/admin/login');
    }
  }, [router]);

  // Fetch page builder menus
  useEffect(() => {
    const fetchPageBuilderMenus = async () => {
      try {
        setLoadingMenus(true);
        const response = await getPageBuilderMenus();
        if (response.status === 'success') {
          setPageBuilderMenus(response.data || []);
        }
      } catch (error) {
        console.error('Error fetching page builder menus:', error);
        // Don't show error toast as this is optional feature
      } finally {
        setLoadingMenus(false);
      }
    };

    if (menuPermissions.hasAccess) {
      fetchPageBuilderMenus();
    }
  }, [menuPermissions.hasAccess]);

  // Generate slug from title
  const generateSlug = (title) => {
    const slug = title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
    
    setPageData(prev => ({ ...prev, slug }));
  };

  // Handle menu selection
  const handleMenuSelection = (menuId) => {
    if (menuId === 'none' || !menuId) {
      setPageData(prev => ({ 
        ...prev, 
        selectedMenuId: '',
        title: '',
        slug: '',
        meta_title: '',
      }));
      setIsMenuSelected(false);
    } else {
      const selectedMenu = pageBuilderMenus.find(menu => menu.id.toString() === menuId);
      if (selectedMenu) {
        setPageData(prev => ({ 
          ...prev, 
          selectedMenuId: menuId,
          title: selectedMenu.name,
          slug: selectedMenu.slug,
          meta_title: selectedMenu.name,
        }));
        setIsMenuSelected(true);
      }
    }
  };

  // Add new component
  const addComponent = (type) => {
    const newComponent = getDefaultComponent(type);
    setPageData(prev => ({
      ...prev,
      components: [...prev.components, newComponent],
    }));
    toast.success('Component added successfully');
  };

  // Update component
  const updateComponent = (updatedComponent) => {
    setPageData(prev => ({
      ...prev,
      components: prev.components.map(comp => 
        comp.id === updatedComponent.id ? updatedComponent : comp
      ),
    }));
    toast.success('Component updated successfully');
  };

  // Delete component
  const deleteComponent = (componentId) => {
    setPageData(prev => ({
      ...prev,
      components: prev.components.filter(comp => comp.id !== componentId),
    }));
    toast.success('Component deleted successfully');
  };

  // Move component
  const moveComponent = (index, direction) => {
    const newComponents = [...pageData.components];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < newComponents.length) {
      [newComponents[index], newComponents[newIndex]] = [newComponents[newIndex], newComponents[index]];
      setPageData(prev => ({ ...prev, components: newComponents }));
      toast.success('Component moved successfully');
    }
  };

  // Save page
  const savePage = async () => {
    if (!pageData.title.trim()) {
      toast.error('Please enter a page title');
      return;
    }

    if (!pageData.slug.trim()) {
      toast.error('Please enter a page slug');
      return;
    }

    setIsSaving(true);
    try {
      // Transform pageData to match API expectations
      const apiData = {
        title: pageData.title,
        slug: pageData.slug,
        content_data: pageData.components, // Transform components to content_data
        meta_title: pageData.meta_title,
        meta_description: pageData.meta_description,
        status: pageData.status === 1 ? true : false,
        menu_id: pageData.selectedMenuId ? parseInt(pageData.selectedMenuId) : null
      };

      const response = await createPage(apiData);
      
      if (response.status === 'success') {
        toast.success('Page created successfully!');
        router.push('/admin/page-builder');
      } else {
        throw new Error(response.message || 'Failed to create page');
      }
    } catch (error) {
      console.error('Error saving page:', error);
      toast.error(error.message || 'Failed to create page');
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading state
  if (menuPermissions.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading page builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Button
                variant="outline"
                onClick={() => router.push('/admin/page-builder')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" disabled={!pageData.slug}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button onClick={savePage} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Creating...' : 'Create Page'}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Component Library & Settings */}
          <div className="lg:col-span-1 space-y-6">
            {/* Component Library */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Components
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => addComponent(COMPONENT_TYPES.HERO)}
                >
                  🎯 Hero Section
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => addComponent(COMPONENT_TYPES.TEXT)}
                >
                  📝 Text Block
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => addComponent(COMPONENT_TYPES.IMAGE)}
                >
                  🖼️ Image
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => addComponent(COMPONENT_TYPES.COLUMNS)}
                >
                  📋 Columns
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => addComponent(COMPONENT_TYPES.TESTIMONIAL)}
                >
                  💬 Testimonial
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => addComponent(COMPONENT_TYPES.CTA)}
                >
                  🚀 Call to Action
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => addComponent(COMPONENT_TYPES.SPACER)}
                >
                  ⬜ Spacer
                </Button>
              </CardContent>
            </Card>

            {/* Page Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Page Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="menu">Select Menu (Optional)</Label>
                  <Select
                    value={pageData.selectedMenuId}
                    onValueChange={handleMenuSelection}
                    disabled={loadingMenus}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={loadingMenus ? "Loading menus..." : "Choose a menu to auto-fill details"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Manual Entry)</SelectItem>
                      {pageBuilderMenus.map((menu) => (
                        <SelectItem key={menu.id} value={menu.id.toString()}>
                          {menu.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {pageBuilderMenus.length === 0 && !loadingMenus && (
                    <p className="text-xs text-gray-500 mt-1">
                      No menus available for page builder. Create a menu with "Show in Page Builder" enabled.
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="title">Page Title *</Label>
                  <Input
                    id="title"
                    value={pageData.title}
                    onChange={(e) => {
                      if (!isMenuSelected) {
                        const title = e.target.value;
                        setPageData(prev => ({ ...prev, title }));
                        if (title && !pageData.slug) {
                          generateSlug(title);
                        }
                      }
                    }}
                    placeholder="Enter page title"
                    disabled={isMenuSelected}
                    className={isMenuSelected ? "bg-gray-100 cursor-not-allowed" : ""}
                  />
                  {isMenuSelected && (
                    <p className="text-xs text-blue-600 mt-1">
                      Auto-filled from selected menu. Deselect menu to edit manually.
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={pageData.slug}
                    onChange={(e) => {
                      if (!isMenuSelected) {
                        setPageData(prev => ({ ...prev, slug: e.target.value }));
                      }
                    }}
                    placeholder="page-url-slug"
                    disabled={isMenuSelected}
                    className={isMenuSelected ? "bg-gray-100 cursor-not-allowed" : ""}
                  />
                  {pageData.slug && (
                    <p className="text-xs text-gray-500 mt-1">
                      URL: yoursite.com/{pageData.slug}
                    </p>
                  )}
                  {isMenuSelected && (
                    <p className="text-xs text-blue-600 mt-1">
                      Auto-filled from selected menu. Deselect menu to edit manually.
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={pageData.meta_title}
                    onChange={(e) => setPageData(prev => ({ ...prev, meta_title: e.target.value }))}
                    placeholder="SEO title"
                  />
                </div>
                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={pageData.meta_description}
                    onChange={(e) => setPageData(prev => ({ ...prev, meta_description: e.target.value }))}
                    placeholder="SEO description"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={pageData.status.toString()}
                    onValueChange={(value) => setPageData(prev => ({ ...prev, status: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Active</SelectItem>
                      <SelectItem value="0">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Page Canvas */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Page Preview</CardTitle>
                <p className="text-sm text-gray-600">
                  {pageData.components.length} component{pageData.components.length !== 1 ? 's' : ''} added
                </p>
              </CardHeader>
              <CardContent>
                {pageData.components.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-6xl mb-4">🎨</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Start Building Your Page</h3>
                    <p className="text-gray-500 mb-6">Use the component library on the left to add elements to your page</p>
                    <div className="flex justify-center space-x-2">
                      <Button onClick={() => addComponent(COMPONENT_TYPES.HERO)}>
                        Add Hero Section
                      </Button>
                      <Button variant="outline" onClick={() => addComponent(COMPONENT_TYPES.TEXT)}>
                        Add Text Block
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {pageData.components.map((component, index) => (
                      <ComponentPreview
                        key={component.id}
                        component={component}
                        index={index}
                        totalComponents={pageData.components.length}
                        onEdit={() => {
                          setEditingComponent(component);
                          setShowComponentEditor(true);
                        }}
                        onDelete={() => deleteComponent(component.id)}
                        onMoveUp={() => moveComponent(index, 'up')}
                        onMoveDown={() => moveComponent(index, 'down')}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sticky Bottom Save Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
          <div className="container px-4 py-4 mx-auto max-w-7xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {pageData.components.length} component{pageData.components.length !== 1 ? 's' : ''} added
                </span>
                {pageData.title && (
                  <span className="text-sm text-gray-600">
                    • Page: {pageData.title}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => router.push('/admin/page-builder')}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  disabled={!pageData.slug || isSaving}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  onClick={savePage}
                  disabled={isSaving || !pageData.title || !pageData.slug}
                  className="min-w-[120px]"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Creating...' : 'Create Page'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Add padding to bottom to account for sticky save bar */}
        <div className="h-20"></div>

        {/* Component Editor Modal */}
        {editingComponent && (
          <ComponentEditor
            component={editingComponent}
            isOpen={showComponentEditor}
            onUpdate={updateComponent}
            onClose={() => {
              setShowComponentEditor(false);
              setEditingComponent(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

// Wrapper component with permission provider
const CreatePageBuilder = () => {
  return (
    <PermissionProvider>
      <CreatePageBuilderContent />
    </PermissionProvider>
  );
};

export default CreatePageBuilder;