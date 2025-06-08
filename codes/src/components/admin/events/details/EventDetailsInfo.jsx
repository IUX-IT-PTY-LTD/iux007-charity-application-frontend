'use client';

import { MapPin, DollarSign, Target, Hash, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const EventDetailsInfo = ({ event }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md">Event Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-[20px_1fr] gap-x-3 items-start">
          <Hash className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Event ID</p>
            <p className="font-medium">{event.id}</p>
            <p className="text-xs text-gray-400 mt-0.5 break-all">{event.uuid}</p>
          </div>
        </div>

        <div className="grid grid-cols-[20px_1fr] gap-x-3 items-start">
          <Calendar className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Created At</p>
            <p className="font-medium">
              {event.created_at
                ? format(new Date(event.created_at), 'MMM d, yyyy h:mm a')
                : 'Not available'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[20px_1fr] gap-x-3 items-start">
          <MapPin className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
            <p className="font-medium">{event.location || 'No location specified'}</p>
          </div>
        </div>

        <div className="grid grid-cols-[20px_1fr] gap-x-3 items-start">
          <DollarSign className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
            <div className="flex items-center gap-2">
              <p className="font-medium">${event.price}</p>
              {event.is_fixed_donation === 1 && (
                <Badge variant="outline" className="text-xs">
                  Fixed
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[20px_1fr] gap-x-3 items-start">
          <Target className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Target Amount</p>
            <p className="font-medium">${event.target_amount.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventDetailsInfo;
