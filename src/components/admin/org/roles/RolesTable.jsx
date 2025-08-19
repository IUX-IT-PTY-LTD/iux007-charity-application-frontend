// components/admin/org/roles/RolesTable.jsx
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
import { StatusCell, PermissionsCell, ActionsCell } from './TableCells';

const RolesTable = ({
  roles,
  isLoading,
  sortField,
  sortDirection,
  handleSort,
  handleUpdateRole,
  handleDeleteRole,
  handleEditClick,
  handleViewPermissions,
  rolePermissions,
}) => {
  // Column definitions for sortable headers
  const columns = [
    { field: 'name', label: 'Role Name', sortable: true },
    { field: 'permissions', label: 'Permissions', sortable: false },
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
                Loading roles...
              </TableCell>
            </TableRow>
          ) : roles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No roles found.
              </TableCell>
            </TableRow>
          ) : (
            roles.map((role) => (
              <TableRow key={role.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <TableCell className="text-center">
                  <div className="font-medium">{role.name}</div>
                </TableCell>
                <TableCell className="text-center">
                  <PermissionsCell role={role} rolePermissions={rolePermissions} />
                </TableCell>
                <TableCell className="text-center">
                  <StatusCell role={role} onStatusChange={handleUpdateRole} />
                </TableCell>
                <TableCell className="text-center">
                  <ActionsCell
                    role={role}
                    onEdit={() => handleEditClick(role)}
                    onDelete={handleDeleteRole}
                    onViewPermissions={handleViewPermissions}
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

export default RolesTable;
