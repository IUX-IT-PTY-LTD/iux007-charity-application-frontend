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

        {/* Edit and Delete buttons are commented out as requested */}
        {/* 
        <Button variant="outline" onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>

        <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
        */}
      </div>

      {/* Delete Confirmation Dialog - Commented out as requested */}
      {/* 
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
      */}
    </div>
  );
};

export default UserActionsHeader;
