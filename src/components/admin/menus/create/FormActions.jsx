'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { Lock, ArrowLeft } from 'lucide-react';

// Import permission hooks
import { useMenuPermissions } from '@/api/hooks/useModulePermissions';

const FormActions = ({ form, isSubmitting = false, menuPermissions }) => {
  const router = useRouter();

  // Use passed permissions or hook (for flexibility)
  const permissions = menuPermissions || useMenuPermissions();

  const handleCancel = () => {
    router.push('/admin/menus');
  };

  const handleReset = () => {
    if (!permissions.canCreate) {
      return; // Don't allow reset if no create permission
    }
    form.reset();
  };

  return (
    <CardFooter className="flex justify-between">
      {/* Left side - Cancel/Back button */}
      <Button
        variant="outline"
        type="button"
        onClick={handleCancel}
        disabled={isSubmitting}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Cancel
      </Button>

      {/* Right side - Reset and Submit buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          type="button"
          onClick={handleReset}
          disabled={isSubmitting || !permissions.canCreate}
          title={
            !permissions.canCreate ? "You don't have permission to create menus" : 'Reset form'
          }
        >
          Reset
        </Button>

        {permissions.canCreate ? (
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Menu'}
          </Button>
        ) : (
          <Button
            type="button"
            disabled
            className="opacity-50 cursor-not-allowed"
            title="You don't have permission to create menus"
          >
            <Lock className="mr-2 h-4 w-4" />
            Save Menu
          </Button>
        )}
      </div>
    </CardFooter>
  );
};

export default FormActions;
