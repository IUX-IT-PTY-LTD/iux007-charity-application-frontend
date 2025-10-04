'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { Lock, Plus, Edit, Trash2, Eye, Layout } from 'lucide-react';
import { toast } from 'sonner';

// Import UI components
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

// Import protected services
import { isAuthenticated } from '@/api/services/admin/authService';
import { getPages, deletePage, updatePage } from '@/api/services/admin/pageBuilderService';

// Import permission hooks and context
import { PermissionProvider } from '@/api/contexts/PermissionContext';
import { useMenuPermissions } from '@/api/hooks/useModulePermissions';

// Main Page Builder List Component
const PageBuilderContent = () => {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();
  const menuPermissions = useMenuPermissions();

  // State management
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Set page title
  useEffect(() => {
    setPageTitle('Page Builder');
    setPageSubtitle('Create and manage dynamic pages for your website');
  }, [setPageTitle, setPageSubtitle]);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error('Authentication required. Please log in.');
      router.push('/admin/login');
    }
  }, [router]);

  // Fetch pages from API
  useEffect(() => {
    const fetchPages = async () => {
      try {
        setIsLoading(true);
        const response = await getPages();
        
        if (response.status === 'success') {
          setPages(response.data || []);
        } else {
          throw new Error(response.message || 'Failed to fetch pages');
        }
      } catch (error) {
        console.error('Error fetching pages:', error);
        toast.error('Failed to load pages');
        setPages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPages();
  }, []);

  // Filter pages based on search
  const filteredPages = pages.filter((page) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      page.title.toLowerCase().includes(query) ||
      page.slug.toLowerCase().includes(query)
    );
  });

  // Handle page deletion
  const handleDelete = async (pageId) => {
    try {
      const response = await deletePage(pageId);
      
      if (response.status === 'success') {
        setPages(prev => prev.filter(page => page.id !== pageId));
        toast.success('Page deleted successfully');
      } else {
        throw new Error(response.message || 'Failed to delete page');
      }
    } catch (error) {
      console.error('Error deleting page:', error);
      toast.error('Failed to delete page');
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (pageId, currentStatus) => {
    try {
      // Find the page to get all required data
      const page = pages.find((p) => p.id === pageId);
      if (!page) {
        throw new Error('Page not found');
      }

      // Create the data object with all required fields
      const pageData = {
        title: page.title,
        slug: page.slug,
        content_data: page.content_data || [],
        meta_title: page.meta_title,
        meta_description: page.meta_description,
        status: currentStatus === true ? false : true,
      };

      const response = await updatePage(pageId, pageData);
      
      if (response.status === 'success') {
        setPages(prev => prev.map(page => 
          page.id === pageId 
            ? { ...page, status: pageData.status ? true : false }
            : page
        ));
        
        toast.success(`Page ${currentStatus === true ? 'deactivated' : 'activated'} successfully`);
      } else {
        throw new Error(response.message || 'Failed to update page status');
      }
    } catch (error) {
      console.error('Error updating page status:', error);
      toast.error('Failed to update page status');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Show loading state while permissions are loading
  if (menuPermissions.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <Card>
          {/* Header */}
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Layout className="h-5 w-5 mr-2" />
                  Page Builder
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Create and manage dynamic pages for your website
                </p>
              </div>
              <Button onClick={() => router.push('/admin/page-builder/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Page
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {/* Search Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1 max-w-md">
                  <Input
                    placeholder="Search pages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Total: {filteredPages.length}</span>
                  <span>Active: {filteredPages.filter(p => p.status === true).length}</span>
                  <span>Inactive: {filteredPages.filter(p => p.status === false).length}</span>
                </div>
              </div>
            </div>

            {/* Pages Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Components</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-900 border-t-transparent"></div>
                          <p className="mt-2 text-sm text-gray-500">Loading pages...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredPages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Layout className="h-12 w-12 text-gray-400 mb-4" />
                          <p className="text-lg font-medium text-gray-900 mb-2">No pages found</p>
                          <p className="text-sm text-gray-500 mb-4">
                            {searchQuery 
                              ? 'Try adjusting your search criteria'
                              : 'Get started by creating your first page'
                            }
                          </p>
                          {!searchQuery && (
                            <Button onClick={() => router.push('/admin/page-builder/create')}>
                              <Plus className="h-4 w-4 mr-2" />
                              Create First Page
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPages.map((page) => (
                      <TableRow key={page.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="font-medium">{page.title}</div>
                        </TableCell>
                        <TableCell>
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                            /{page.slug}
                          </code>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {page.components_count} components
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleStatusToggle(page.id, page.status)}
                              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                              style={{
                                backgroundColor: page.status === true ? '#10b981' : '#d1d5db'
                              }}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  page.status === true ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                            <Badge
                              variant={page.status === true ? 'success' : 'destructive'}
                              className={
                                page.status === true
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }
                            >
                              {page.status === true ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {formatDate(page.updated_at)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => router.push(`/admin/page-builder/${page.id}`)}
                              title="Edit Page"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => window.open(`/${page.slug}`, '_blank')}
                              title="Preview Page"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-600 hover:text-red-800 hover:bg-red-100"
                                  title="Delete Page"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete the "{page.title}" page and all its content.
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(page.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Wrapper component that provides permission context
const PageBuilder = () => {
  return (
    <PermissionProvider>
      <PageBuilderContent />
    </PermissionProvider>
  );
};

export default PageBuilder;