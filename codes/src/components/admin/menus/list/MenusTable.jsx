// components/admin/menus/list/MenusTable.jsx
import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatusCell, ActionsCell } from './TableCells';

const MenusTable = ({
  menus,
  isLoading,
  sortField,
  sortDirection,
  handleSort,
  handleStatusChange,
  handleDelete,
}) => {
  // Column definitions for sortable headers (without the ID column)
  const columns = [
    { field: 'name', label: 'Name', sortable: true },
    { field: 'slug', label: 'Slug', sortable: true },
    { field: 'ordering', label: 'Order', sortable: true },
    { field: 'status', label: 'Status', sortable: true },
    { field: 'actions', label: 'Actions', sortable: false },
  ];

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.field}
                className={`text-center ${column.sortable ? 'cursor-pointer select-none' : ''}`}
                onClick={column.sortable ? () => handleSort(column.field) : undefined}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>{column.label}</span>
                  {column.sortable && <ArrowUpDown className="h-3 w-3" />}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Loading menus...
              </TableCell>
            </TableRow>
          ) : menus.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No menus found.
              </TableCell>
            </TableRow>
          ) : (
            menus.map((menu) => (
              <TableRow key={menu.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <TableCell className="text-center">
                  <div className="font-medium">{menu.name}</div>
                </TableCell>
                <TableCell className="text-center">{menu.slug}</TableCell>
                <TableCell className="text-center">{menu.ordering}</TableCell>
                <TableCell className="text-center">
                  <StatusCell 
                    menu={menu}
                    onStatusChange={handleStatusChange}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <ActionsCell 
                    menu={menu}
                    onDelete={handleDelete}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default MenusTable;