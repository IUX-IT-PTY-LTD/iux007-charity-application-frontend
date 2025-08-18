'use client';

import { TableRow, TableCell } from '@/components/ui/table';

const LoadingRow = ({ colSpan }) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-900 border-t-transparent dark:border-gray-100 dark:border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading events...</p>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default LoadingRow;
