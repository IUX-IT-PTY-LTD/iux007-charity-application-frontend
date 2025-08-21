'use client';

import { Lock } from 'lucide-react';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import EventsTableHeader from './EventsTableHeader';
import EventsTableRow from './EventsTableRow';
import LoadingRow from './LoadingRow';
import EmptyRow from './EmptyRow';

const EventsTable = ({
  columns,
  events,
  isLoading,
  sortField,
  sortDirection,
  handleSort,
  handleStatusChange,
  handleDelete,
  indexOfFirstItem,
  eventPermissions,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <EventsTableHeader
          columns={columns}
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
        />
        <TableBody>
          {isLoading ? (
            <LoadingRow colSpan={columns.length} />
          ) : !eventPermissions.canView ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Lock className="h-8 w-8 text-gray-400" />
                  <p>You don't have permission to view events</p>
                </div>
              </TableCell>
            </TableRow>
          ) : events.length === 0 ? (
            <EmptyRow colSpan={columns.length} />
          ) : (
            events.map((event, index) => (
              <EventsTableRow
                key={event.id}
                event={event}
                index={index}
                rowNumber={indexOfFirstItem + index + 1}
                handleStatusChange={handleStatusChange}
                handleDelete={handleDelete}
                eventPermissions={eventPermissions}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EventsTable;
