// components/admin/users/details/UserActionsHeader.jsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Download, Lock, FileDown } from 'lucide-react';
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

// Import permission hooks
import { useUserPermissions } from '@/api/hooks/useModulePermissions';

// Permission-aware export button
const PermissionAwareExportButton = ({ userId, userName }) => {
  const userPermissions = useUserPermissions();

  const handleExport = () => {
    if (!userPermissions.canView) {
      toast.error("You don't have permission to export user data");
      return;
    }

    toast.info(`Exporting user data for ${userName}...`);

    // Simulate export delay
    setTimeout(() => {
      toast.success('User data exported successfully');
    }, 1500);
  };

  if (!userPermissions.canView) {
    return (
      <Button
        variant="outline"
        disabled
        className="opacity-50 cursor-not-allowed"
        title="You don't have permission to export user data"
      >
        <Lock className="mr-2 h-4 w-4" />
        Export Data
      </Button>
    );
  }

  return (
    <Button variant="outline" onClick={handleExport}>
      <Download className="mr-2 h-4 w-4" />
      Export Data
    </Button>
  );
};

// Permission-aware edit button (for future use)
const PermissionAwareEditButton = ({ userId, userName }) => {
  const userPermissions = useUserPermissions();

  const handleEdit = () => {
    if (!userPermissions.canEdit) {
      toast.error("You don't have permission to edit users");
      return;
    }
    // router.push(`/admin/users/${userId}/edit`);
    toast.info('Edit functionality will be implemented in the future');
  };

  if (!userPermissions.canEdit) {
    return (
      <Button
        variant="outline"
        disabled
        className="opacity-50 cursor-not-allowed"
        title="You don't have permission to edit users"
      >
        <Lock className="mr-2 h-4 w-4" />
        Edit
      </Button>
    );
  }

  return (
    <Button variant="outline" onClick={handleEdit}>
      <Edit className="mr-2 h-4 w-4" />
      Edit
    </Button>
  );
};

// Permission-aware delete button (for future use)
const PermissionAwareDeleteButton = ({ userId, userName, onDelete }) => {
  const userPermissions = useUserPermissions();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const handleDelete = () => {
    if (!userPermissions.canDelete) {
      toast.error("You don't have permission to delete users");
      return;
    }

    setShowDeleteDialog(false);
    if (onDelete) {
      onDelete(userId);
    } else {
      toast.info('Delete functionality will be implemented in the future');
    }
  };

  if (!userPermissions.canDelete) {
    return (
      <Button
        variant="destructive"
        disabled
        className="opacity-50 cursor-not-allowed"
        title="You don't have permission to delete users"
      >
        <Lock className="mr-2 h-4 w-4" />
        Delete
      </Button>
    );
  }

  return (
    <>
      <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>

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
    </>
  );
};

const UserActionsHeader = ({ userId, userName, canView }) => {
  const router = useRouter();
  const userPermissions = useUserPermissions();

  // Handle navigation back to users list
  const handleBack = () => {
    router.push('/admin/users');
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      {/* Back button - always available */}
      <Button variant="ghost" onClick={handleBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Users
      </Button>

      {/* Action buttons - permission aware */}
      <div className="flex flex-wrap gap-2">
        <PermissionAwareExportButton userId={userId} userName={userName} />

        {/* Edit and Delete buttons are commented out as requested, but here's how they would work */}
        {/* 
        <PermissionAwareEditButton userId={userId} userName={userName} />
        <PermissionAwareDeleteButton userId={userId} userName={userName} />
        */}
      </div>

      {/* Permission status indicator */}
      {!userPermissions.canView && (
        <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded">
          <Lock className="h-4 w-4" />
          Limited access - View only permissions required
        </div>
      )}
    </div>
  );
};

export default UserActionsHeader;
