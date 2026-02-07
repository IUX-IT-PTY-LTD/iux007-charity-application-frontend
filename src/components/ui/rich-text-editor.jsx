'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image,
  Type,
  Palette,
  Undo,
  Redo,
  Eye,
  EyeOff,
} from 'lucide-react';

const RichTextEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'Start writing your content...', 
  className,
  minHeight = '400px' 
}) => {
  const editorRef = useRef(null);
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);
  const [isImagePopoverOpen, setIsImagePopoverOpen] = useState(false);
  const [isColorPopoverOpen, setIsColorPopoverOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [lastValue, setLastValue] = useState(value);

  // Common colors for text
  const textColors = [
    '#000000', '#333333', '#666666', '#999999', '#CCCCCC',
    '#FF0000', '#FF6600', '#FFCC00', '#33CC33', '#0066CC',
    '#6600CC', '#CC0066', '#FF3366', '#FF6633', '#FFFF00',
    '#66FF66', '#00CCFF', '#9966FF', '#FF66CC', '#FF9999'
  ];

  // Save cursor position
  const saveCursorPosition = useCallback(() => {
    if (!editorRef.current) return null;
    
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return null;
    
    const range = selection.getRangeAt(0);
    return {
      startContainer: range.startContainer,
      startOffset: range.startOffset,
      endContainer: range.endContainer,
      endOffset: range.endOffset
    };
  }, []);

  // Restore cursor position
  const restoreCursorPosition = useCallback((position) => {
    if (!position || !editorRef.current) return;
    
    try {
      const selection = window.getSelection();
      const range = document.createRange();
      
      range.setStart(position.startContainer, position.startOffset);
      range.setEnd(position.endContainer, position.endOffset);
      
      selection.removeAllRanges();
      selection.addRange(range);
    } catch (error) {
      // If restoration fails, place cursor at the end
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, []);

  // Execute formatting commands
  const execCommand = useCallback((command, value = null) => {
    if (isPreviewMode) return;
    
    // Special handling for lists
    if (command === 'insertUnorderedList' || command === 'insertOrderedList') {
      const selection = window.getSelection();
      if (selection.rangeCount === 0) return;
      
      const range = selection.getRangeAt(0);
      editorRef.current?.focus();
      
      // Execute the command
      document.execCommand(command, false, value);
      
      // Update content and maintain focus
      setTimeout(() => {
        if (editorRef.current && onChange) {
          const newValue = editorRef.current.innerHTML;
          setLastValue(newValue);
          onChange(newValue);
        }
      }, 10);
    } else {
      document.execCommand(command, false, value);
      editorRef.current?.focus();
      
      // Update content after command
      setTimeout(() => {
        if (editorRef.current && onChange) {
          const newValue = editorRef.current.innerHTML;
          setLastValue(newValue);
          onChange(newValue);
        }
      }, 0);
    }
  }, [isPreviewMode, onChange]);

  // Format block commands
  const formatBlock = useCallback((tag) => {
    execCommand('formatBlock', `<${tag}>`);
  }, [execCommand]);

  // Handle link insertion
  const handleInsertLink = useCallback(() => {
    if (linkUrl && linkText) {
      execCommand('insertHTML', `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`);
      setLinkUrl('');
      setLinkText('');
      setIsLinkPopoverOpen(false);
    }
  }, [linkUrl, linkText, execCommand]);

  // Handle image insertion
  const handleInsertImage = useCallback(() => {
    if (imageUrl) {
      execCommand('insertHTML', `<img src="${imageUrl}" alt="${imageAlt}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 8px 0;" />`);
      setImageUrl('');
      setImageAlt('');
      setIsImagePopoverOpen(false);
    }
  }, [imageUrl, imageAlt, execCommand]);

  // Handle color change
  const handleColorChange = useCallback((color) => {
    execCommand('foreColor', color);
    setSelectedColor(color);
    setIsColorPopoverOpen(false);
  }, [execCommand]);

  // Handle list creation manually for better reliability
  const createList = useCallback((type) => {
    if (isPreviewMode) return;
    
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    editorRef.current?.focus();
    
    // Try the standard command first
    const listCommand = type === 'ul' ? 'insertUnorderedList' : 'insertOrderedList';
    
    try {
      const success = document.execCommand(listCommand, false);
      
      if (!success) {
        // Fallback: manually create list
        const selectedText = selection.toString() || 'List item';
        const listHTML = type === 'ul' 
          ? `<ul><li>${selectedText}</li></ul>`
          : `<ol><li>${selectedText}</li></ol>`;
        
        document.execCommand('insertHTML', false, listHTML);
      }
      
      // Update content
      setTimeout(() => {
        if (editorRef.current && onChange) {
          const newValue = editorRef.current.innerHTML;
          setLastValue(newValue);
          onChange(newValue);
        }
      }, 10);
    } catch (error) {
      console.error('Error creating list:', error);
    }
  }, [isPreviewMode, onChange]);

  // Handle input changes
  const handleInput = useCallback(() => {
    if (editorRef.current && onChange) {
      const newValue = editorRef.current.innerHTML;
      setLastValue(newValue);
      onChange(newValue);
    }
  }, [onChange]);

  // Handle paste
  const handlePaste = useCallback((e) => {
    if (isPreviewMode) {
      e.preventDefault();
      return;
    }

    // Handle image paste
    const items = e.clipboardData?.items;
    if (items) {
      for (let item of items) {
        if (item.type.indexOf('image') !== -1) {
          e.preventDefault();
          const blob = item.getAsFile();
          const reader = new FileReader();
          reader.onload = (event) => {
            execCommand('insertHTML', `<img src="${event.target.result}" alt="Pasted image" style="max-width: 100%; height: auto; border-radius: 8px; margin: 8px 0;" />`);
          };
          reader.readAsDataURL(blob);
          break;
        }
      }
    }
  }, [isPreviewMode, execCommand]);

  // Toggle preview mode
  const togglePreview = useCallback(() => {
    setIsPreviewMode(!isPreviewMode);
  }, [isPreviewMode]);

  // Initialize editor content
  React.useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
      setLastValue(value);
    }
  }, []);

  // Handle external value changes (from form)
  React.useEffect(() => {
    if (editorRef.current && value !== lastValue) {
      // Only update if the content is different from what we have
      if (editorRef.current.innerHTML !== value) {
        const cursorPosition = saveCursorPosition();
        editorRef.current.innerHTML = value;
        
        // Restore cursor position after a brief delay
        setTimeout(() => {
          if (cursorPosition) {
            restoreCursorPosition(cursorPosition);
          }
        }, 0);
      }
      setLastValue(value);
    }
  }, [value, lastValue, saveCursorPosition, restoreCursorPosition]);

  // Toolbar button component
  const ToolbarButton = ({ onClick, children, isActive = false, title, disabled = false }) => (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      title={title}
      disabled={disabled || isPreviewMode}
      className="h-8 w-8 p-0"
    >
      {children}
    </Button>
  );

  return (
    <div className={cn("border rounded-lg overflow-hidden bg-background", className)}>
      {/* Toolbar */}
      <div className="border-b bg-muted/50 p-2">
        <div className="flex flex-wrap items-center gap-1">
          {/* Preview Toggle */}
          <ToolbarButton
            onClick={togglePreview}
            title={isPreviewMode ? "Switch to Edit Mode" : "Switch to Preview Mode"}
            disabled={false}
          >
            {isPreviewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* History */}
          <ToolbarButton onClick={() => execCommand('undo')} title="Undo">
            <Undo className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('redo')} title="Redo">
            <Redo className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Text Formatting */}
          <ToolbarButton onClick={() => execCommand('bold')} title="Bold">
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('italic')} title="Italic">
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('underline')} title="Underline">
            <Underline className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('strikeThrough')} title="Strikethrough">
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Text Color */}
          <Popover open={isColorPopoverOpen} onOpenChange={setIsColorPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={isPreviewMode}
                title="Text Color"
              >
                <div className="relative">
                  <Type className="h-4 w-4" />
                  <div 
                    className="absolute -bottom-1 left-0 right-0 h-1 rounded"
                    style={{ backgroundColor: selectedColor }}
                  />
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2">
              <div className="grid grid-cols-5 gap-2">
                {textColors.map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                    title={color}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Headings */}
          <ToolbarButton onClick={() => formatBlock('h1')} title="Heading 1">
            <span className="text-xs font-bold">H1</span>
          </ToolbarButton>
          <ToolbarButton onClick={() => formatBlock('h2')} title="Heading 2">
            <span className="text-xs font-bold">H2</span>
          </ToolbarButton>
          <ToolbarButton onClick={() => formatBlock('h3')} title="Heading 3">
            <span className="text-xs font-bold">H3</span>
          </ToolbarButton>
          <ToolbarButton onClick={() => formatBlock('p')} title="Paragraph">
            <span className="text-xs">P</span>
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Alignment */}
          <ToolbarButton onClick={() => execCommand('justifyLeft')} title="Align Left">
            <AlignLeft className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('justifyCenter')} title="Align Center">
            <AlignCenter className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('justifyRight')} title="Align Right">
            <AlignRight className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('justifyFull')} title="Justify">
            <AlignJustify className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Lists */}
          <ToolbarButton onClick={() => createList('ul')} title="Bullet List">
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => createList('ol')} title="Numbered List">
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Quote & Code */}
          <ToolbarButton onClick={() => formatBlock('blockquote')} title="Quote">
            <Quote className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => formatBlock('pre')} title="Code Block">
            <Code className="h-4 w-4" />
          </ToolbarButton>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Link */}
          <Popover open={isLinkPopoverOpen} onOpenChange={setIsLinkPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={isPreviewMode}
                title="Insert Link"
              >
                <Link className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="link-text">Link Text</Label>
                  <Input
                    id="link-text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Enter link text"
                  />
                </div>
                <div>
                  <Label htmlFor="link-url">URL</Label>
                  <Input
                    id="link-url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsLinkPopoverOpen(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleInsertLink} disabled={!linkUrl || !linkText}>
                    Insert Link
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Image */}
          <Popover open={isImagePopoverOpen} onOpenChange={setIsImagePopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={isPreviewMode}
                title="Insert Image"
              >
                <Image className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="image-url">Image URL</Label>
                  <Input
                    id="image-url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor="image-alt">Alt Text</Label>
                  <Input
                    id="image-alt"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    placeholder="Describe the image"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsImagePopoverOpen(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleInsertImage} disabled={!imageUrl}>
                    Insert Image
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Editor Area */}
      <div className="relative">
        {isPreviewMode ? (
          // Preview Mode
          <div 
            className="p-4 prose prose-lg max-w-none dark:prose-invert [&>ul]:list-disc [&>ul]:ml-6 [&>ol]:list-decimal [&>ol]:ml-6 [&>ul>li]:mb-1 [&>ol>li]:mb-1"
            style={{ minHeight }}
          >
            <div dangerouslySetInnerHTML={{ __html: value }} />
            {!value && (
              <div className="text-muted-foreground text-center py-12">
                <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Preview mode - no content to display</p>
                <p className="text-sm">Switch to edit mode to add content</p>
              </div>
            )}
          </div>
        ) : (
          // Edit Mode
          <div
            ref={editorRef}
            contentEditable
            className="p-4 focus:outline-none prose prose-lg max-w-none dark:prose-invert text-left [&>ul]:list-disc [&>ul]:ml-6 [&>ol]:list-decimal [&>ol]:ml-6 [&>ul>li]:mb-1 [&>ol>li]:mb-1"
            style={{ 
              minHeight,
              direction: 'ltr',
              textAlign: 'start',
              unicodeBidi: 'plaintext',
              writingMode: 'horizontal-tb',
              caretColor: 'currentColor'
            }}
            onInput={handleInput}
            onPaste={handlePaste}
            onFocus={() => {
              if (editorRef.current) {
                editorRef.current.style.direction = 'ltr';
                editorRef.current.style.textAlign = 'start';
              }
            }}
            data-placeholder={placeholder}
            suppressContentEditableWarning={true}
            dir="ltr"
            spellCheck="true"
            lang="en"
          />
        )}

        {/* Placeholder when empty and not in preview mode */}
        {!isPreviewMode && !value && (
          <div className="absolute top-4 left-4 text-muted-foreground pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="border-t bg-muted/30 px-4 py-2 text-xs text-muted-foreground flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-xs">
            {isPreviewMode ? 'Preview Mode' : 'Edit Mode'}
          </Badge>
          <span>
            Characters: {value ? value.replace(/<[^>]*>/g, '').length : 0}
          </span>
        </div>
        <div className="text-xs">
          Tip: Paste images directly into the editor
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;