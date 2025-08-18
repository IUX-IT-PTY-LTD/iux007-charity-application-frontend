'use client';

import { PlusCircle } from 'lucide-react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SlidersHeader = ({ router }) => {
  return (
    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
      <div>
        <CardTitle>Homepage Sliders</CardTitle>
        {/* <CardDescription>Manage carousel sliders displayed on your website</CardDescription> */}
      </div>

      <Button
        onClick={() => router.push('/admin/sliders/create')}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Slider
      </Button>
    </CardHeader>
  );
};

export default SlidersHeader;
