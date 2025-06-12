'use client';

import { format } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const EditEventPreview = ({ form, eventId, hasUnsavedChanges }) => {
  const formValues = form.watch();

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            {formValues.featured_image && typeof formValues.featured_image === 'string' ? (
              <img
                src={formValues.featured_image}
                alt="Event"
                className="w-full h-32 object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">No image selected</p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold">{formValues.title || 'Event Title'}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant={formValues.status === 1 ? 'default' : 'secondary'}
                className={
                  formValues.status === 1
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                }
              >
                {formValues.status === 1 ? 'Active' : 'Inactive'}
              </Badge>
              {formValues.is_featured === 1 && (
                <Badge
                  variant="outline"
                  className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                >
                  Featured
                </Badge>
              )}
            </div>
          </div>

          <div className="text-sm">
            <div className="grid grid-cols-3 gap-1">
              <span className="text-muted-foreground">Dates:</span>
              <span className="col-span-2">
                {formValues.start_date && format(formValues.start_date, 'MMM d, yyyy')}
                {' - '}
                {formValues.end_date && format(formValues.end_date, 'MMM d, yyyy')}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1 mt-1">
              <span className="text-muted-foreground">Location:</span>
              <span className="col-span-2">{formValues.location || 'TBD'}</span>
            </div>

            <div className="grid grid-cols-3 gap-1 mt-1">
              <span className="text-muted-foreground">Price:</span>
              <span className="col-span-2">
                ${formValues.price}
                {formValues.is_fixed_donation === 1 && ' (Fixed)'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1 mt-1">
              <span className="text-muted-foreground">Target:</span>
              <span className="col-span-2">${formValues.target_amount}</span>
            </div>
          </div>

          <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
            <p className="text-xs text-gray-500 mb-2">Description Preview:</p>
            <p className="text-sm line-clamp-5">
              {formValues.description || 'No description yet...'}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-gray-500">
        <span>ID: {eventId}</span>
        <span>{hasUnsavedChanges ? 'Unsaved changes' : 'No changes'}</span>
      </CardFooter>
    </Card>
  );
};

export default EditEventPreview;
