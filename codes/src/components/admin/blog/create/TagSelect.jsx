// components/blog/TagSelect.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { PlusCircle, X } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';

const TagSelect = ({ value = [], onChange }) => {
  const [tags, setTags] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagSlug, setNewTagSlug] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Load tags from localStorage
  useEffect(() => {
    const storedTags = localStorage.getItem('blog_tags');

    if (storedTags) {
      setTags(JSON.parse(storedTags));
    } else {
      // Set default tags if none exist
      const defaultTags = [
        { id: '1', name: 'JavaScript', slug: 'javascript' },
        { id: '2', name: 'React', slug: 'react' },
        { id: '3', name: 'CSS', slug: 'css' },
        { id: '4', name: 'HTML', slug: 'html' },
        { id: '5', name: 'Node.js', slug: 'nodejs' },
        { id: '6', name: 'Web Development', slug: 'web-development' },
        { id: '7', name: 'UX Design', slug: 'ux-design' },
        { id: '8', name: 'SEO', slug: 'seo' },
        { id: '9', name: 'Productivity', slug: 'productivity' },
      ];

      localStorage.setItem('blog_tags', JSON.stringify(defaultTags));
      setTags(defaultTags);
    }
  }, []);

  // Generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  // Handle name change and auto-generate slug
  const handleNameChange = (e) => {
    const name = e.target.value;
    setNewTagName(name);
    setNewTagSlug(generateSlug(name));
  };

  // Add new tag
  const handleAddTag = () => {
    if (!newTagName.trim()) {
      toast.error('Tag name cannot be empty');
      return;
    }

    // Check if tag with same slug already exists
    if (tags.some((tag) => tag.slug === newTagSlug)) {
      toast.error('A tag with this name already exists');
      return;
    }

    const newTag = {
      id: Date.now().toString(),
      name: newTagName.trim(),
      slug: newTagSlug,
    };

    const updatedTags = [...tags, newTag];
    setTags(updatedTags);
    localStorage.setItem('blog_tags', JSON.stringify(updatedTags));

    // Add the new tag to selected tags
    const updatedValue = [...value, newTag.id];
    onChange(updatedValue);

    // Reset and close dialog
    setNewTagName('');
    setNewTagSlug('');
    setIsDialogOpen(false);

    toast.success('Tag added successfully');
  };

  // Toggle tag selection
  const toggleTag = (tagId) => {
    const isSelected = value.includes(tagId);

    if (isSelected) {
      onChange(value.filter((id) => id !== tagId));
    } else {
      onChange([...value, tagId]);
    }
  };

  // Remove a tag
  const removeTag = (tagId, e) => {
    e.stopPropagation();
    onChange(value.filter((id) => id !== tagId));
  };

  // Get selected tag names for display
  const selectedTags = tags.filter((tag) => value.includes(tag.id));

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map((tag) => (
          <Badge key={tag.id} variant="secondary" className="px-3 py-1">
            {tag.name}
            <X
              className="ml-1 h-3 w-3 cursor-pointer opacity-60 hover:opacity-100"
              onClick={(e) => removeTag(tag.id, e)}
            />
          </Badge>
        ))}
        {selectedTags.length === 0 && (
          <div className="text-sm text-muted-foreground">No tags selected</div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              Select tags...
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search tags..." />
              <CommandList>
                <CommandEmpty>No tags found</CommandEmpty>
                <CommandGroup>
                  {tags.map((tag) => (
                    <CommandItem
                      key={tag.id}
                      value={tag.name}
                      onSelect={() => {
                        toggleTag(tag.id);
                      }}
                    >
                      <div
                        className={`mr-2 h-4 w-4 border rounded ${
                          value.includes(tag.id) ? 'bg-primary border-primary' : 'border-input'
                        }`}
                      >
                        {value.includes(tag.id) && (
                          <div className="h-full w-full flex items-center justify-center text-[10px] text-primary-foreground">
                            ✓
                          </div>
                        )}
                      </div>
                      {tag.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <PlusCircle className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Tag</DialogTitle>
              <DialogDescription>Create a new tag for your blog posts</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tag-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="tag-name"
                  value={newTagName}
                  onChange={handleNameChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tag-slug" className="text-right">
                  Slug
                </Label>
                <Input
                  id="tag-slug"
                  value={newTagSlug}
                  onChange={(e) => setNewTagSlug(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTag}>Add Tag</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TagSelect;
