'use client';

import { Trash2, Lock } from 'lucide-react';
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

// Import permission hooks
import { useEventPermissions } from '@/api/hooks/useModulePermissions';

const DeleteEventDialog = ({ event, onDelete }) => {
  const eventPermissions = useEventPermissions();

  // Show loading state
  if (eventPermissions.isLoading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        Loading...
      </Button>
    );
  }

  // Show disabled button if no delete permission
  if (!eventPermissions.canDelete) {
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        title="You don't have permission to delete events"
        className="opacity-50 cursor-not-allowed text-red-600"
      >
        <Lock className="h-4 w-4" />
        <span className="sr-only">Delete (No Permission)</span>
      </Button>
    );
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-600 hover:text-red-800 hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the "{event.title}" event. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDelete(event.id)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteEventDialog;
