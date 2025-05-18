'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useAdminContext } from '@/components/admin/admin-context';
import { CalendarIcon, Save, ArrowLeft, Eye, Clock } from 'lucide-react';
import { format } from 'date-fns';

// Import custom components
import RichTextEditor from '@/components/admin/blog/create/RichTextEditor';
import CategorySelect from '@/components/admin/blog/create/CategorySelect';
import TagSelect from '@/components/admin/blog/create/TagSelect';
import FeaturedImageUploader from '@/components/admin/blog/create/FeaturedImageUploader';
import SEOMetadata from '@/components/admin/blog/create/SEOMetadata';

// Import shadcn components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

// Define form schema with validation
const formSchema = z.object({
  title: z.string().min(5, {
    message: 'Title must be at least 5 characters.',
  }),
  excerpt: z
    .string()
    .min(10, {
      message: 'Excerpt must be at least 10 characters.',
    })
    .max(300, {
      message: 'Excerpt must not exceed 300 characters.',
    }),
  content: z.string().min(50, {
    message: 'Content must be at least 50 characters.',
  }),
  category_id: z.string({
    required_error: 'Please select a category.',
  }),
  tag_ids: z.array(z.string()).optional().default([]),
  featured_image: z.any().optional(),
  publish_date: z.date({
    required_error: 'Please select a date.',
  }),
  status: z.string().default('draft'),
  is_featured: z.boolean().default(false),
  allow_comments: z.boolean().default(true),
  estimated_read_time: z.string().optional(),
});

const AdminBlogCreate = () => {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();
  const editorRef = useRef(null);
  const [activeTab, setActiveTab] = useState('edit');
  const [seoMetadata, setSeoMetadata] = useState({
    title: '',
    description: '',
    slug: '',
    canonicalUrl: '',
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize form with validation
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      category_id: '',
      tag_ids: [],
      featured_image: null,
      publish_date: new Date(),
      status: 'draft',
      is_featured: false,
      allow_comments: true,
      estimated_read_time: '',
    },
  });

  // Set page title and subtitle
  useEffect(() => {
    setPageTitle('Create Blog Post');
    setPageSubtitle('Create a new blog post for your website');
  }, [setPageTitle, setPageSubtitle]);

  // Watch for title changes to update SEO title and slug
  useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      setHasUnsavedChanges(true);

      // Update SEO title and slug when post title changes
      if (name === 'title') {
        const title = values.title;

        if (title && (!seoMetadata.title || seoMetadata.title === form.getValues('title'))) {
          setSeoMetadata((prev) => ({
            ...prev,
            title,
          }));
        }

        if (
          title &&
          (!seoMetadata.slug || generateSlug(form.getValues('title')) === seoMetadata.slug)
        ) {
          setSeoMetadata((prev) => ({
            ...prev,
            slug: generateSlug(title),
          }));
        }
      }

      // Update estimated read time when content changes
      if (name === 'content') {
        const content = values.content;
        const readTime = calculateReadTime(content);
        form.setValue('estimated_read_time', readTime);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, seoMetadata]);

  // Handle unsaved changes when navigating away
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Generate slug from text
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  // Calculate estimated read time
  const calculateReadTime = (content) => {
    // Strip HTML tags
    const text = content.replace(/<\/?[^>]+(>|$)/g, '');
    // Count words (approximately)
    const words = text.split(/\s+/).length;
    // Average reading speed: 200-250 words per minute
    const minutes = Math.ceil(words / 225);
    return minutes > 0 ? `${minutes} min read` : '< 1 min read';
  };

  // Handle form submission
  const onSubmit = (data) => {
    try {
      // Add meta data and generate a timestamp ID
      const blogPost = {
        ...data,
        id: Date.now().toString(),
        metadata: seoMetadata,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log('Creating blog post:', blogPost);

      // Store in localStorage for testing
      const existingPosts = JSON.parse(localStorage.getItem('blog_posts') || '[]');
      existingPosts.push(blogPost);
      localStorage.setItem('blog_posts', JSON.stringify(existingPosts));

      // Show success message
      toast.success(`Blog post ${data.status === 'published' ? 'published' : 'saved as draft'}!`);

      // Reset unsaved changes flag
      setHasUnsavedChanges(false);

      // Redirect to blog posts list
      router.push('/admin/blog');

      /* API Implementation (Commented out for future use)
      // For actual API implementation, we would use FormData for file uploads
      const apiFormData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(data).forEach(key => {
        if (key === 'featured_image' && data[key]) {
          // Handle base64 image data
          fetch(data[key])
            .then(res => res.blob())
            .then(blob => {
              apiFormData.append(key, blob, 'featured-image.jpg');
            });
        } else if (key === 'publish_date') {
          apiFormData.append(key, data[key].toISOString());
        } else if (key === 'tag_ids') {
          data[key].forEach((tagId, index) => {
            apiFormData.append(`${key}[${index}]`, tagId);
          });
        } else {
          apiFormData.append(key, data[key]);
        }
      });
      
      // Add SEO metadata
      Object.keys(seoMetadata).forEach(key => {
        apiFormData.append(`metadata[${key}]`, seoMetadata[key]);
      });

      // API call
      fetch('/api/blog-posts', {
        method: 'POST',
        body: apiFormData,
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          toast.success(`Blog post ${data.status === "published" ? "published" : "saved as draft"}!`);
          setHasUnsavedChanges(false);
          router.push('/admin/blog');
        })
        .catch(error => {
          console.error('Error creating blog post:', error);
          toast.error("Failed to create blog post. Please try again.");
        });
      */
    } catch (error) {
      console.error('Error creating blog post:', error);
      toast.error('Failed to create blog post');
    }
  };

  // Preview mode
  const renderPreview = () => {
    const formData = form.getValues();
    const readTime = formData.estimated_read_time || calculateReadTime(formData.content);

    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          {formData.featured_image && (
            <img
              src={formData.featured_image}
              alt={formData.title}
              className="w-full h-80 object-cover rounded-xl mb-6"
            />
          )}

          <h1 className="text-3xl font-bold mb-4">{formData.title || 'Blog Post Title'}</h1>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {format(formData.publish_date, 'MMMM d, yyyy')}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {readTime}
            </div>
          </div>

          <p className="text-lg text-muted-foreground italic mb-6">
            {formData.excerpt || 'This is a preview of your blog post excerpt.'}
          </p>

          <Separator className="my-8" />

          <div
            className="prose max-w-full dark:prose-invert"
            dangerouslySetInnerHTML={{
              __html: formData.content || '<p>Your blog content will appear here...</p>',
            }}
          />
        </div>
      </div>
    );
  };

  // Create a sidebar component for reuse
  const Sidebar = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Publish Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="publish_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Publish Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className="w-full pl-3 text-left font-normal">
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  {field.value === 'draft' && 'Save as draft to continue editing later'}
                  {field.value === 'published' && 'Publish immediately'}
                  {field.value === 'scheduled' && 'Schedule for future publication'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Featured Post</FormLabel>
                  <FormDescription>Display this post in featured sections</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allow_comments"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Allow Comments</FormLabel>
                  <FormDescription>Enable commenting on this post</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Featured Image</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="featured_image"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FeaturedImageUploader value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormDescription>
                  This image will be displayed at the top of your post and in social shares
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categories & Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <CategorySelect value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormDescription>Select a primary category for your post</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tag_ids"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <TagSelect value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormDescription>Add tags to help readers discover your content</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (hasUnsavedChanges) {
                      if (
                        window.confirm('You have unsaved changes. Are you sure you want to leave?')
                      ) {
                        router.push('/admin/blogs');
                      }
                    } else {
                      router.push('/admin/blogs');
                    }
                  }}
                  type="button"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Posts
                </Button>

                <div className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                  <TabsContent value="edit" className="lg:col-span-2 m-0 p-0">
                    <Card>
                      <CardContent className="pt-6 space-y-6">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Post Title</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your blog post title"
                                  className="text-xl font-medium"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="excerpt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Excerpt</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Write a short excerpt for your post (displayed in post listings and social shares)"
                                  rows={3}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Maximum 300 characters. This will be used in search results and
                                social media shares.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Content</FormLabel>
                              <FormControl>
                                <RichTextEditor
                                  value={field.value}
                                  onChange={field.onChange}
                                  editorRef={editorRef}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>

                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>SEO & Metadata</CardTitle>
                        <CardDescription>Optimize your post for search engines</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <SEOMetadata metadata={seoMetadata} onChange={setSeoMetadata} />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="preview" className="lg:col-span-2 m-0 p-0">
                    <Card>
                      <CardContent className="pt-6">{renderPreview()}</CardContent>
                    </Card>
                  </TabsContent>

                  {/* Sidebar - Always visible regardless of active tab */}
                  <div className="lg:col-span-1">
                    <Sidebar />
                  </div>
                </div>
              </Tabs>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AdminBlogCreate;
