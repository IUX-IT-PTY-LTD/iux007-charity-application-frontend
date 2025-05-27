'use client';

import { ArrowUpDown } from 'lucide-react';
import { TableHeader, TableRow, TableHead } from '@/components/ui/table';

const EventsTableHeader = ({ columns, sortField, sortDirection, handleSort }) => {
  return (
    <TableHeader>
      <TableRow>
        {columns.map((column) => (
          <TableHead
            key={column.field}
            className={column.sortable ? 'cursor-pointer select-none' : ''}
            onClick={column.sortable ? () => handleSort(column.field) : undefined}
          >
            <div className="flex items-center space-x-1">
              <span>{column.label}</span>
              {column.sortable && (
                <ArrowUpDown
                  className={`h-3 w-3 ${sortField === column.field ? 'text-blue-600' : ''}`}
                />
              )}
            </div>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};

export default EventsTableHeader;
