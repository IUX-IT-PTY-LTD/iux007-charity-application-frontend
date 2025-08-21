'use client';

import { useRouter } from 'next/navigation';
import { PlusCircle, Lock } from 'lucide-react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Import permission hooks
import { useEventPermissions } from '@/api/hooks/useModulePermissions';

// Permission-aware create button component
const PermissionAwareCreateButton = () => {
  const router = useRouter();
  const eventPermissions = useEventPermissions();

  if (eventPermissions.isLoading) {
    return (
      <Button disabled className="bg-blue-600 hover:bg-blue-700 text-white">
        Loading...
      </Button>
    );
  }

  if (!eventPermissions.canCreate) {
    return (
      <Button
        disabled
        className="opacity-50 cursor-not-allowed"
        title="You don't have permission to create events"
      >
        <Lock className="mr-2 h-4 w-4" />
        Create Event
      </Button>
    );
  }

  return (
    <Button
      onClick={() => router.push('/admin/events/create')}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      <PlusCircle className="mr-2 h-4 w-4" />
      Create Event
    </Button>
  );
};

const EventsHeader = () => {
  const eventPermissions = useEventPermissions();

  return (
    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
      <div>
        <CardTitle>All Events</CardTitle>
        <CardDescription>
          Manage your fundraising and charity events
          {!eventPermissions.canView && (
            <span className="text-orange-600 ml-2">(Limited access)</span>
          )}
        </CardDescription>
      </div>

      <PermissionAwareCreateButton />
    </CardHeader>
  );
};

export default EventsHeader;
