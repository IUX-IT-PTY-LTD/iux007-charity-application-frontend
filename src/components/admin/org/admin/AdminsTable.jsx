// components/admin/org/admin/AdminsTable.jsx

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

const AdminsTable = ({
  admins,
  isLoading,
  sortField,
  sortDirection,
  handleSort,
  handleUpdateAdmin,
  handleDeleteAdmin,
  handleEditClick,
  handleResetPassword,
}) => {
  // Column definitions for sortable headers
  const columns = [
    { field: 'name', label: 'Name', sortable: true },
    { field: 'email', label: 'Email', sortable: true },
    { field: 'role_id', label: 'Role', sortable: false },
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
                Loading admins...
              </TableCell>
            </TableRow>
          ) : admins.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No admins found.
              </TableCell>
            </TableRow>
          ) : (
            admins.map((admin) => (
              <TableRow key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <TableCell className="text-center">
                  <div className="font-medium">{admin.name}</div>
                </TableCell>
                <TableCell className="text-center">{admin.email}</TableCell>
                <TableCell className="text-center">
                  {admin.role && (
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {admin.role.name || 'Admin'}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <StatusCell admin={admin} onStatusChange={handleUpdateAdmin} />
                </TableCell>
                <TableCell className="text-center">
                  <ActionsCell
                    admin={admin}
                    onEdit={() => handleEditClick(admin)}
                    onDelete={handleDeleteAdmin}
                    onResetPassword={handleResetPassword}
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

export default AdminsTable;
