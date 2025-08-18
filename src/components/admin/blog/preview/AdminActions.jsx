// components/blog/AdminActions.jsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, ArrowLeft, Eye, ExternalLink } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const AdminActions = ({ post, onDelete }) => {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Handle edit action
  const handleEdit = () => {
    router.push(`/admin/blogs/${post.id}/edit`);
  };

  // Handle back to list action
  const handleBackToList = () => {
    router.push('/admin/blogs');
  };

  // Handle view on site action (this would link to the actual published post)
  const handleViewOnSite = () => {
    // In a real implementation, this would open the actual public-facing blog post
    // For demonstration purposes, we'll just show a toast
    toast.info('This would open the published post on your website');

    // If you have an actual URL:
    // window.open(`/blog/${post.metadata?.slug || post.id}`, '_blank');
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    onDelete(post.id);
    setIsDeleteDialogOpen(false);
    router.push('/admin/blogs');
  };

  return (
    <div className="sticky top-4 z-10 bg-background/95 backdrop-blur-sm p-4 rounded-lg border shadow-sm">
      <div className="flex flex-wrap gap-2 justify-between">
        <Button variant="outline" size="sm" onClick={handleBackToList}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Posts
        </Button>

        <div className="flex gap-2">
          {post.status === 'published' && (
            <Button variant="outline" size="sm" onClick={handleViewOnSite}>
              <ExternalLink className="mr-2 h-4 w-4" />
              View on Site
            </Button>
          )}

          <Button variant="default" size="sm" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Post
          </Button>

          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-800 hover:bg-red-100"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the blog post "{post.title}". This action cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default AdminActions;
