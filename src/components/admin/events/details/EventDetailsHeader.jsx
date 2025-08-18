'use client';

import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarRange } from 'lucide-react';

const EventDetailsHeader = ({ event }) => {
  return (
    <Card>
      <div className="relative">
        {/* Event image */}
        <div className="w-full h-48 overflow-hidden">
          {event.featured_image ? (
            <img
              src={event.featured_image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>

        {/* Status badges */}
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge
            variant={event.event_status === 1 ? 'default' : 'secondary'}
            className={
              event.event_status === 1
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
            }
          >
            {event.event_status === 1 ? 'Active' : 'Inactive'}
          </Badge>
          {event.is_featured === 1 && (
            <Badge
              variant="outline"
              className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
            >
              Featured
            </Badge>
          )}
        </div>
      </div>

      <CardHeader>
        <CardTitle className="text-xl font-bold">{event.title}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <CalendarRange className="h-4 w-4 mr-1" />
          {event.start_date && format(new Date(event.start_date), 'MMM d, yyyy')} -
          {event.end_date && format(new Date(event.end_date), 'MMM d, yyyy')}
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>{event.description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventDetailsHeader;
