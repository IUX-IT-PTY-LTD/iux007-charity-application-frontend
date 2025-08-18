'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SliderHeader = ({
  hasUnsavedChanges,
  router,
  onSubmit,
  isSubmitting,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  isDeleting,
  slider,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          if (hasUnsavedChanges) {
            if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
              router.push('/admin/sliders');
            }
          } else {
            router.push('/admin/sliders');
          }
        }}
        className="mb-2 sm:mb-0"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Sliders
      </Button>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
          disabled={isDeleting}
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          {isDeleting ? 'Deleting...' : 'Delete Slider'}
        </Button>

        <Button
          onClick={onSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isSubmitting}
        >
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default SliderHeader;
