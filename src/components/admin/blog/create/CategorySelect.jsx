// components/blog/CategorySelect.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { PlusCircle, X } from 'lucide-react';

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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const CategorySelect = ({ value, onChange }) => {
  const [categories, setCategories] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategorySlug, setNewCategorySlug] = useState('');

  // Load categories from localStorage
  useEffect(() => {
    const storedCategories = localStorage.getItem('blog_categories');

    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      // Set default categories if none exist
      const defaultCategories = [
        { id: '1', name: 'Technology', slug: 'technology' },
        { id: '2', name: 'Business', slug: 'business' },
        { id: '3', name: 'Design', slug: 'design' },
        { id: '4', name: 'Development', slug: 'development' },
        { id: '5', name: 'Marketing', slug: 'marketing' },
      ];

      localStorage.setItem('blog_categories', JSON.stringify(defaultCategories));
      setCategories(defaultCategories);
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
    setNewCategoryName(name);
    setNewCategorySlug(generateSlug(name));
  };

  // Add new category
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }

    // Check if category with same slug already exists
    if (categories.some((cat) => cat.slug === newCategorySlug)) {
      toast.error('A category with this name already exists');
      return;
    }

    const newCategory = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      slug: newCategorySlug,
    };

    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    localStorage.setItem('blog_categories', JSON.stringify(updatedCategories));

    // Select the new category
    onChange(newCategory.id);

    // Reset and close dialog
    setNewCategoryName('');
    setNewCategorySlug('');
    setIsDialogOpen(false);

    toast.success('Category added successfully');
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>Create a new category for your blog posts</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category-name" className="text-right">
                Name
              </Label>
              <Input
                id="category-name"
                value={newCategoryName}
                onChange={handleNameChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category-slug" className="text-right">
                Slug
              </Label>
              <Input
                id="category-slug"
                value={newCategorySlug}
                onChange={(e) => setNewCategorySlug(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategorySelect;
