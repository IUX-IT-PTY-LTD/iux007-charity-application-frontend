'use client';

import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Calendar, Check, X, Edit, ImageIcon } from 'lucide-react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import DeleteEventDialog from './DeleteEventDialog';

const EventsTableRow = ({ event, index, rowNumber, handleStatusChange, handleDelete }) => {
  const router = useRouter();

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <TableRow key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
      <TableCell className="font-medium">{rowNumber}</TableCell>
      <TableCell>
        <div className="h-10 w-10 rounded-md overflow-hidden">
          {event.featured_image ? (
            <img
              src={event.featured_image}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <ImageIcon className="h-5 w-5 text-gray-400" />
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="max-w-[150px]">
          <div
            className="font-medium truncate cursor-pointer hover:text-blue-600"
            title={event.title}
            onClick={() => router.push(`/admin/events/${event.id}/donations`)}
          >
            {event.title}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {event.is_fixed_donation === 1 || event.is_fixed_donation === '1' ? (
              <Badge variant="outline" className="mt-1">
                Fixed
              </Badge>
            ) : null}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-gray-400" />
          <span>{formatDate(event.start_date)}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-gray-400" />
          <span>{formatDate(event.end_date)}</span>
        </div>
      </TableCell>
      <TableCell className="font-medium">${Number(event.price).toLocaleString()}</TableCell>
      <TableCell className="font-medium">${Number(event.target_amount).toLocaleString()}</TableCell>
      <TableCell>
        <span className="max-w-[100px] truncate block" title={event.location || 'N/A'}>
          {event.location || 'N/A'}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex justify-center">
          {event.is_featured === 1 || event.is_featured === '1' ? (
            <span className="text-green-500">
              <Check className="h-5 w-5" />
            </span>
          ) : (
            <span className="text-red-500">
              <X className="h-5 w-5" />
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Switch
            checked={event.status === 'active'}
            onCheckedChange={() => handleStatusChange(event.id, event.status)}
            aria-label={`Toggle status for ${event.title}`}
            className="data-[state=checked]:bg-black data-[state=checked]:text-white"
          />
          <Badge
            variant={event.status === 'active' ? 'success' : 'destructive'}
            className={
              event.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }
          >
            {event.status === 'active' ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/admin/events/${event.id}/edit`)}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>

          <DeleteEventDialog event={event} onDelete={handleDelete} />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default EventsTableRow;
