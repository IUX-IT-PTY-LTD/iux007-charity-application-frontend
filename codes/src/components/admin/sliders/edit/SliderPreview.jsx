'use client';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const SliderPreview = ({ form, imagePreview, sliderId, hasUnsavedChanges }) => {
  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="overflow-hidden rounded-md border">
            {imagePreview ? (
              <img src={imagePreview} alt="Slider Preview" className="w-full h-32 object-cover" />
            ) : (
              <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">No image selected</p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold">{form.watch('title') || 'Slider Title'}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant={form.watch('status') === '1' ? 'default' : 'secondary'}
                className={
                  form.watch('status') === '1'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                }
              >
                {form.watch('status') === '1' ? 'Active' : 'Inactive'}
              </Badge>
              <span className="text-xs text-gray-500">Order: {form.watch('ordering')}</span>
            </div>
          </div>

          <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
            <p className="text-xs text-gray-500 mb-2">Description Preview:</p>
            <p className="text-sm line-clamp-5">
              {form.watch('description') || 'No description...'}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-gray-500">
        <span>ID: {sliderId}</span>
        <span>{hasUnsavedChanges ? 'Unsaved changes' : 'No changes'}</span>
      </CardFooter>
    </Card>
  );
};

export default SliderPreview;
