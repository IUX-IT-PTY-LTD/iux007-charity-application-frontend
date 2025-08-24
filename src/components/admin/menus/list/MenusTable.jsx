'use client';

import React from 'react';
import { ArrowUpDown, Lock } from 'lucide-react';
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
  menuPermissions,
}) => {
  // Column definitions for sortable headers
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
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-900 border-t-transparent dark:border-gray-100 dark:border-t-transparent"></div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading menus...</p>
                </div>
              </TableCell>
            </TableRow>
          ) : !menuPermissions.canView ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Lock className="h-8 w-8 text-gray-400" />
                  <p>You don't have permission to view menus</p>
                </div>
              </TableCell>
            </TableRow>
          ) : menus.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center">
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No menus found.</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
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
                    menuPermissions={menuPermissions}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <ActionsCell
                    menu={menu}
                    onDelete={handleDelete}
                    menuPermissions={menuPermissions}
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
