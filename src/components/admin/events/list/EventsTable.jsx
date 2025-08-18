'use client';

import { Table, TableBody } from '@/components/ui/table';
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
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EventsTable;
