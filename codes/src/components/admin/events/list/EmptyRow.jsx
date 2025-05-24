'use client';

import { TableRow, TableCell } from '@/components/ui/table';
import { Calendar } from 'lucide-react';

const EmptyRow = ({ colSpan }) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center">
        <div className="flex flex-col items-center justify-center">
          <Calendar className="h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No events found.</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default EmptyRow;
