'use client';

import { useRouter } from 'next/navigation';
import { PlusCircle } from 'lucide-react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const EventsHeader = () => {
  const router = useRouter();

  return (
    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
      <div>
        <CardTitle>All Events</CardTitle>
        <CardDescription>Manage your fundraising and charity events</CardDescription>
      </div>

      <Button
        onClick={() => router.push('/admin/events/create')}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Event
      </Button>
    </CardHeader>
  );
};

export default EventsHeader;