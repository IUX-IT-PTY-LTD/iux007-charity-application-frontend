// components/admin/menus/create/FormActions.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';

const FormActions = ({ form, isSubmitting = false }) => {
  return (
    <CardFooter className="flex justify-between">
      <Button variant="outline" type="button" onClick={() => form.reset()} disabled={isSubmitting}>
        Reset
      </Button>
      <Button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Save Menu'}
      </Button>
    </CardFooter>
  );
};

export default FormActions;
