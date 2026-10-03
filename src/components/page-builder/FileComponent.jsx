'use client';

import React, { useRef, useState } from 'react';
import {
  File as FileIcon,
  FileText,
  FileImage,
  FileSpreadsheet,
  FileArchive,
  Presentation,
  ExternalLink,
  UploadCloud,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const getExtension = (file = {}) => {
  const source = file.originalName || file.name || file.url || '';
  const ext = source.split('?')[0].split('.').pop();
  return ext && ext !== source ? ext.toLowerCase() : '';
};

const FILE_STYLES = {
  pdf: { Icon: FileText, color: 'text-red-600', bg: 'bg-red-50' },
  doc: { Icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
  docx: { Icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
  txt: { Icon: FileText, color: 'text-gray-600', bg: 'bg-gray-100' },
  xls: { Icon: FileSpreadsheet, color: 'text-green-600', bg: 'bg-green-50' },
  xlsx: { Icon: FileSpreadsheet, color: 'text-green-600', bg: 'bg-green-50' },
  csv: { Icon: FileSpreadsheet, color: 'text-green-600', bg: 'bg-green-50' },
  ppt: { Icon: Presentation, color: 'text-orange-600', bg: 'bg-orange-50' },
  pptx: { Icon: Presentation, color: 'text-orange-600', bg: 'bg-orange-50' },
  zip: { Icon: FileArchive, color: 'text-yellow-700', bg: 'bg-yellow-50' },
  jpg: { Icon: FileImage, color: 'text-purple-600', bg: 'bg-purple-50' },
  jpeg: { Icon: FileImage, color: 'text-purple-600', bg: 'bg-purple-50' },
  png: { Icon: FileImage, color: 'text-purple-600', bg: 'bg-purple-50' },
  gif: { Icon: FileImage, color: 'text-purple-600', bg: 'bg-purple-50' },
  webp: { Icon: FileImage, color: 'text-purple-600', bg: 'bg-purple-50' },
  svg: { Icon: FileImage, color: 'text-purple-600', bg: 'bg-purple-50' },
};

const getFileStyle = (file) =>
  FILE_STYLES[getExtension(file)] || { Icon: FileIcon, color: 'text-gray-600', bg: 'bg-gray-100' };

// Title shown to visitors; never the raw file name with its extension
const stripExtension = (name = '') => name.replace(/\.[a-z0-9]+$/i, '');
const getFileTitle = (file) => stripExtension(file.name || file.originalName || '') || 'Download';

// Clickable title: opens the file in a new tab
const FileLink = ({ file, title }) => {
  const { Icon, color, bg } = getFileStyle(file);
  return (
    <a
      href={file.url}
      target="_blank"
      rel="noopener noreferrer"
      title={`Open ${title} in a new tab`}
      className="group inline-flex items-center gap-3 -mx-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <span className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-md ${bg} group-hover:scale-110 transition-transform`}>
        <Icon className={`h-4 w-4 ${color}`} />
      </span>
      <span className="text-base sm:text-lg font-medium text-primary underline decoration-gray-300 decoration-1 underline-offset-4 group-hover:decoration-2 group-hover:decoration-primary transition-all">
        {title}
      </span>
      <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 text-primary opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
    </a>
  );
};

// Shared layout for the public page and the builder preview
const FileSection = ({ content = {} }) => {
  const files = content.files || [];

  // One file: the section title itself is the link
  if (files.length === 1) {
    return (
      <div>
        <FileLink file={files[0]} title={content.title || getFileTitle(files[0])} />
        {content.description && <p className="mt-1 text-sm text-gray-600">{content.description}</p>}
      </div>
    );
  }

  // Several files: compact list that flows top-to-bottom into columns
  return (
    <div>
      {content.title && <h3 className="text-xl font-semibold text-gray-900 mb-1">{content.title}</h3>}
      {content.description && <p className="text-gray-600 mb-3">{content.description}</p>}
      <ul className="max-w-4xl columns-1 sm:columns-2 lg:columns-3 gap-x-10 mt-2">
        {files.map((file, idx) => (
          <li key={file.url || idx} className="break-inside-avoid py-0.5">
            <FileLink file={file} title={getFileTitle(file)} />
          </li>
        ))}
      </ul>
    </div>
  );
};

// Public page renderer
export const FileDisplay = ({ content = {} }) => {
  if (!(content.files || []).length) return null;

  return (
    <div className="py-3">
      <FileSection content={content} />
    </div>
  );
};

// Builder canvas preview
export const FilePreview = ({ content = {} }) => {
  if (!(content.files || []).length) {
    return (
      <div className="bg-gray-100 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
        <span className="text-gray-500">No files uploaded</span>
      </div>
    );
  }

  return <FileSection content={content} />;
};

// Editor fields shown inside the component editor dialog
export const FileEditor = ({ content = {}, updateContent }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  // Files uploaded during this editing session (not yet referenced by a saved page)
  const sessionUploads = useRef(new Set());
  const files = content.files || [];

  const handleFiles = async (fileList) => {
    const selected = Array.from(fileList || []);
    if (!selected.length || uploading) return;

    const { uploadPageFile, validatePageFile } = await import('@/api/services/admin/fileUploadService');

    setUploading(true);
    const uploaded = [];
    for (const file of selected) {
      const validation = validatePageFile(file);
      if (!validation.isValid) {
        toast.error(`${file.name}: ${validation.error}`);
        continue;
      }
      try {
        const response = await uploadPageFile(file);
        if (response.status !== 'success') {
          throw new Error(response.message || 'Upload failed');
        }
        sessionUploads.current.add(response.data.filePath);
        uploaded.push({
          name: stripExtension(file.name),
          originalName: file.name,
          url: response.data.filePath,
          size: file.size,
          type: file.type,
        });
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`${file.name}: ${error.message || 'Failed to upload file'}`);
      }
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';

    if (uploaded.length) {
      updateContent('files', [...files, ...uploaded]);
      toast.success(`${uploaded.length} file${uploaded.length > 1 ? 's' : ''} uploaded successfully!`);
    }
  };

  const renameFile = (index, name) => {
    const next = [...files];
    next[index] = { ...next[index], name };
    updateContent('files', next);
  };

  const removeFile = async (index) => {
    const file = files[index];
    updateContent('files', files.filter((_, i) => i !== index));

    // Only delete from storage if it was uploaded in this session; saved pages may still reference older files
    if (sessionUploads.current.has(file.url)) {
      try {
        const { deletePageFile } = await import('@/api/services/admin/fileUploadService');
        await deletePageFile(file.url);
        sessionUploads.current.delete(file.url);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const moveFile = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= files.length) return;
    const next = [...files];
    [next[index], next[target]] = [next[target], next[index]];
    updateContent('files', next);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="file-title">Section Title</Label>
        <Input
          id="file-title"
          value={content.title || ''}
          onChange={(e) => updateContent('title', e.target.value)}
          placeholder="e.g. Downloads, Annual Reports"
        />
      </div>

      <div>
        <Label htmlFor="file-description">Description (optional)</Label>
        <Textarea
          id="file-description"
          value={content.description || ''}
          onChange={(e) => updateContent('description', e.target.value)}
          rows={2}
        />
      </div>

      <div>
        <Label>Upload Files</Label>
        <div
          role="button"
          tabIndex={0}
          onClick={() => !uploading && inputRef.current?.click()}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !uploading) inputRef.current?.click();
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`mt-1 flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          } ${uploading ? 'opacity-60 cursor-wait' : ''}`}
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-sm text-blue-600">Uploading...</span>
            </>
          ) : (
            <>
              <UploadCloud className="h-8 w-8 text-gray-400" />
              <span className="text-sm text-gray-700">
                <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
              </span>
              <span className="text-xs text-gray-500">PDF, images, Word, Excel, PowerPoint, TXT, CSV, ZIP (max 5MB each)</span>
            </>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.jpg,.jpeg,.png,.gif,.webp,.svg"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <Label>Files ({files.length})</Label>
          {files.map((file, index) => {
            const { Icon, color, bg } = getFileStyle(file);
            return (
              <div key={file.url || index} className="flex items-center gap-2 p-2 border rounded-lg bg-white">
                <span className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded ${bg}`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </span>
                <Input
                  value={file.name || ''}
                  onChange={(e) => renameFile(index, e.target.value)}
                  placeholder="Title shown to visitors"
                  className="flex-1"
                  disabled={uploading}
                />
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open file"
                  className="p-2 text-gray-500 hover:text-blue-600"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
                <Button size="sm" variant="outline" onClick={() => moveFile(index, -1)} disabled={uploading || index === 0} title="Move up">
                  ↑
                </Button>
                <Button size="sm" variant="outline" onClick={() => moveFile(index, 1)} disabled={uploading || index === files.length - 1} title="Move down">
                  ↓
                </Button>
                <Button size="sm" variant="destructive" onClick={() => removeFile(index)} disabled={uploading} title="Remove">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            );
          })}
          <p className="text-xs text-gray-500">
            {files.length === 1
              ? 'With one file, visitors see the Section Title (or this title if the section title is empty) and clicking it opens the file in a new tab.'
              : 'Visitors see each title; clicking it opens the file in a new tab.'}
          </p>
        </div>
      )}
    </div>
  );
};
