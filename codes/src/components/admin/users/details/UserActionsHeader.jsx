// components/users/UserActionsHeader.jsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const UserActionsHeader = ({ userId, userName }) => {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  // Handle navigation back to users list
  const handleBack = () => {
    router.push('/admin/users');
  };

  // Handle navigation to edit user page
  const handleEdit = () => {
    router.push(`/admin/users/${userId}/edit`);
  };

  // Handle user deletion
  const handleDelete = () => {
    // Close the dialog
    setShowDeleteDialog(false);

    // Get current users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = storedUsers.filter((user) => user.id !== userId);

    // Update localStorage
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Show success message
    toast.success(`User ${userName} has been deleted`);

    // Navigate back to users list
    setTimeout(() => {
      router.push('/admin/users');
    }, 500);

    /* API Implementation (Commented out for future use)
    // Delete user from API
    fetch(`/api/users/${userId}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (!response.ok) throw new Error('Failed to delete user');
      return response.json();
    })
    .then(data => {
      toast.success(`User ${userName} has been deleted`);
      router.push("/admin/users");
    })
    .catch(error => {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    });
    */
  };

  // Handle export user data
  const handleExport = () => {
    toast.info(`Exporting user data for ${userName}...`);

    // Simulate export delay
    setTimeout(() => {
      toast.success('User data exported successfully');
    }, 1500);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <Button variant="ghost" onClick={handleBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Users
      </Button>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>

        <Button variant="outline" onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>

        <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm User Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user "{userName}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserActionsHeader;
