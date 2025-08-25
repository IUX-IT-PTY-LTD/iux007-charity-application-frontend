// src/components/admin/sliders/edit/SliderDeleteDialog.jsx

'use client';

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
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

// Import permission hooks
import { useSliderPermissions } from '@/api/hooks/useModulePermissions';

const SliderDeleteDialog = ({ isOpen, onOpenChange, onDelete, isDeleting, sliderTitle }) => {
  const sliderPermissions = useSliderPermissions();

  // If user doesn't have delete permission, show disabled button
  if (!sliderPermissions.canDelete) {
    return (
      <Button
        variant="outline"
        disabled
        className="opacity-50 cursor-not-allowed text-red-600"
        title="You don't have permission to delete sliders"
      >
        <Lock className="mr-2 h-4 w-4" />
        Delete Slider
      </Button>
    );
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete Slider'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the "{sliderTitle}" slider. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700 text-white">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SliderDeleteDialog;
