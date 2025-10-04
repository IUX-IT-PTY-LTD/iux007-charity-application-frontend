'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import { getPageDetails, updatePage } from '@/api/services/admin/pageBuilderService';

// Import permission hooks and context
import { PermissionProvider } from '@/api/contexts/PermissionContext';
import { useMenuPermissions } from '@/api/hooks/useModulePermissions';

// Import component types and utilities
import { COMPONENT_TYPES, getDefaultComponent } from '../components';

// Component Editor Modal (same as create page)
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

  // Render editor based on component type (same logic as create page)
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
            <div>
              <Label htmlFor="backgroundImage">Background Image URL</Label>
              <Input
                id="backgroundImage"
                value={localComponent.content.backgroundImage || ''}
                onChange={(e) => updateContent('backgroundImage', e.target.value)}
                placeholder="https://example.com/image.jpg"
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
                placeholder="#, /page, https://example.com"
              />
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

              <Textarea
                id="text"
                rows={8}
                value={localComponent.content.text || ''}
                onChange={(e) => updateContent('text', e.target.value)}
                placeholder="Enter your text content here. Use the toolbar above for formatting or write HTML directly."
                className="rounded-t-none border-t-0 font-mono text-sm"
              />
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
          </div>
        );

      case COMPONENT_TYPES.IMAGE:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="src">Image URL</Label>
              <Input
                id="src"
                value={localComponent.content.src || ''}
                onChange={(e) => updateContent('src', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
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

// Component Preview (same as create page)
const ComponentPreview = ({ component, onEdit, onDelete, onMoveUp, onMoveDown, index, totalComponents }) => {
  const renderPreview = () => {
    switch (component.type) {
      case COMPONENT_TYPES.HERO:
        return (
          <div 
            className="relative p-8 bg-cover bg-center rounded-lg text-white min-h-[300px] flex items-center justify-center"
            style={{ 
              backgroundImage: component.content.backgroundImage 
                ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${component.content.backgroundImage})` 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">{component.content.title}</h1>
              <p className="text-xl mb-6">{component.content.subtitle}</p>
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                {component.content.buttonText}
              </button>
            </div>
          </div>
        );

      case COMPONENT_TYPES.TEXT:
        return (
          <div 
            className={`prose max-w-none text-${component.content.alignment || 'left'}`}
            dangerouslySetInnerHTML={{ __html: component.content.text }}
          />
        );

      case COMPONENT_TYPES.IMAGE:
        return (
          <div className={`text-${component.content.alignment || 'center'}`}>
            {component.content.src ? (
              <div>
                <img 
                  src={component.content.src} 
                  alt={component.content.alt}
                  className="max-w-full h-auto rounded-lg"
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
          >
            ↑
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onMoveDown}
            disabled={index === totalComponents - 1}
          >
            ↓
          </Button>
          <Button size="sm" variant="outline" onClick={onEdit}>
            <Edit3 className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="destructive" onClick={onDelete}>
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

// Main Edit Page Builder Component
const EditPageBuilderContent = () => {
  const router = useRouter();
  const params = useParams();
  const { setPageTitle, setPageSubtitle } = useAdminContext();
  const menuPermissions = useMenuPermissions();
  
  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);
  const [showComponentEditor, setShowComponentEditor] = useState(false);

  // Set page title
  useEffect(() => {
    setPageTitle('Edit Page');
    setPageSubtitle('Modify your dynamic page');
  }, [setPageTitle, setPageSubtitle]);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error('Authentication required. Please log in.');
      router.push('/admin/login');
    }
  }, [router]);

  // Fetch page data
  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setIsLoading(true);
        
        const response = await getPageDetails(params.id);
        
        if (response.status === 'success') {
          const data = response.data;
          setPageData({
            id: data.id,
            title: data.title,
            slug: data.slug,
            meta_title: data.meta_title || '',
            meta_description: data.meta_description || '',
            status: data.status,
            components: data.content_data || [],
            menu_id: data.menu_id,
            menu: data.menu
          });
        } else {
          throw new Error(response.message || 'Failed to fetch page');
        }
      } catch (error) {
        console.error('Error fetching page:', error);
        toast.error('Failed to load page data');
        router.push('/admin/page-builder');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchPageData();
    }
  }, [params.id, router]);

  // Add new component
  const addComponent = (type) => {
    if (!pageData) return;
    
    const newComponent = {
      id: Date.now(),
      type,
      content: getDefaultComponent(type).content
    };
    
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
    if (!pageData) return;
    
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
    if (!pageData) return;
    
    setIsSaving(true);
    try {
      const updateData = {
        title: pageData.title,
        slug: pageData.slug,
        content_data: pageData.components,
        meta_title: pageData.meta_title,
        meta_description: pageData.meta_description,
        status: pageData.status, // Already boolean
        menu_id: pageData.menu_id,
      };
      
      const response = await updatePage(pageData.id, updateData);
      
      if (response.status === 'success') {
        toast.success('Page updated successfully!');
      } else {
        throw new Error(response.message || 'Failed to update page');
      }
    } catch (error) {
      console.error('Error saving page:', error);
      toast.error(error.message || 'Failed to update page');
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading state
  if (isLoading || menuPermissions.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading page...</p>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
          <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/admin/page-builder')}>
            Back to Page Builder
          </Button>
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
              <Button 
                variant="outline"
                onClick={() => window.open(`/${pageData.slug}`, '_blank')}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button onClick={savePage} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
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
                {pageData?.menu && (
                  <div>
                    <Label>Associated Menu</Label>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="text-blue-600 mr-3">📋</div>
                        <div>
                          <p className="font-medium text-blue-900">{pageData.menu.name}</p>
                          <p className="text-sm text-blue-700">Slug: {pageData.menu.slug}</p>
                        </div>
                      </div>
                      <p className="text-xs text-blue-600 mt-2">
                        This page was created from a menu. Title and slug cannot be changed.
                      </p>
                    </div>
                  </div>
                )}
                <div>
                  <Label htmlFor="title">Page Title</Label>
                  <Input
                    id="title"
                    value={pageData.title}
                    onChange={(e) => setPageData(prev => ({ ...prev, title: e.target.value }))}
                    disabled={!!pageData?.menu_id}
                    className={pageData?.menu_id ? "bg-gray-100 cursor-not-allowed" : ""}
                  />
                  {pageData?.menu_id && (
                    <p className="text-xs text-blue-600 mt-1">
                      Auto-filled from selected menu. Cannot be edited.
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={pageData.slug}
                    onChange={(e) => setPageData(prev => ({ ...prev, slug: e.target.value }))}
                    disabled={!!pageData?.menu_id}
                    className={pageData?.menu_id ? "bg-gray-100 cursor-not-allowed" : ""}
                  />
                  {pageData?.menu_id && (
                    <p className="text-xs text-blue-600 mt-1">
                      Auto-filled from selected menu. Cannot be edited.
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={pageData.meta_title}
                    onChange={(e) => setPageData(prev => ({ ...prev, meta_title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={pageData.meta_description}
                    onChange={(e) => setPageData(prev => ({ ...prev, meta_description: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={pageData.status.toString()}
                    onValueChange={(value) => setPageData(prev => ({ ...prev, status: value === 'true' }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
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
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Components Yet</h3>
                    <p className="text-gray-500 mb-6">Add components to start building your page</p>
                    <Button onClick={() => addComponent(COMPONENT_TYPES.HERO)}>
                      Add Hero Section
                    </Button>
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
                  disabled={isSaving}
                  onClick={() => window.open(`/${pageData.slug}`, '_blank')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  onClick={savePage}
                  disabled={isSaving}
                  className="min-w-[120px]"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
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
const EditPageBuilder = () => {
  return (
    <PermissionProvider>
      <EditPageBuilderContent />
    </PermissionProvider>
  );
};

export default EditPageBuilder;