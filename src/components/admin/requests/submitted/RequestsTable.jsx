'use client';

import React from 'react';
import { ArrowUpDown, Eye, Edit3, Calendar, DollarSign, Users, FileText } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const RequestsTable = ({
  requests,
  isLoading,
  sortField,
  sortDirection,
  handleSort,
  onRequestClick,
  onStatusChange,
  statusOptions,
}) => {
  // Column definitions for sortable headers
  const columns = [
    { field: 'request_id', label: 'Request ID', sortable: true },
    { field: 'requester_name', label: 'Requester', sortable: true },
    { field: 'organization_name', label: 'Organization', sortable: true },
    { field: 'request_purpose', label: 'Request Purpose', sortable: true },
    { field: 'request_amount', label: 'Amount', sortable: true },
    { field: 'request_category', label: 'Category', sortable: true },
    { field: 'submission_date', label: 'Submitted', sortable: true },
    { field: 'current_status', label: 'Status', sortable: true },
    { field: 'actions', label: 'Actions', sortable: false },
  ];

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusOption = statusOptions.find((option) => option.value === status);
    if (!statusOption) return <Badge variant="outline">{status}</Badge>;

    return <Badge className={statusOption.color}>{statusOption.label}</Badge>;
  };

  // Check if status can be changed (reviewer permissions)
  const canChangeStatus = (currentStatus) => {
    // Reviewer can change: submitted -> information_needed/technical_check_passed
    // And information_needed -> technical_check_passed
    // Once technical_check_passed, no more changes from this page
    return ['submitted', 'information_needed'].includes(currentStatus);
  };

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
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Loading requests...
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center">
                  <FileText className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No requests found.</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            requests.map((request) => (
              <TableRow
                key={request.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                onClick={() => onRequestClick(request)}
              >
                <TableCell className="text-center">
                  <div className="font-mono text-sm font-medium text-blue-600">
                    {request.request_id}
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <div className="flex flex-col items-center">
                    <div className="font-medium">{request.requester_name}</div>
                    <div className="text-xs text-gray-500">{request.requester_email}</div>
                  </div>
                </TableCell>

                <TableCell className="text-center max-w-48">
                  <div className="font-medium truncate" title={request.organization_name}>
                    {request.organization_name || 'Individual Request'}
                  </div>
                  {request.organization_type && (
                    <div className="text-xs text-gray-500">{request.organization_type}</div>
                  )}
                </TableCell>

                <TableCell className="text-left max-w-64">
                  <div className="font-medium truncate" title={request.request_purpose}>
                    {request.request_purpose}
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <div className="flex flex-col items-center">
                    <span className="font-semibold text-green-600">
                      {formatCurrency(request.request_amount)}
                    </span>
                    <span className="text-xs text-gray-500">ZIP file attached</span>
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <Badge variant="outline" className="bg-gray-50">
                    {request.request_category}
                  </Badge>
                </TableCell>

                <TableCell className="text-center">
                  <div className="text-sm">{formatDate(request.submission_date)}</div>
                </TableCell>

                <TableCell className="text-center">
                  {getStatusBadge(request.current_status)}
                </TableCell>

                <TableCell className="text-center">
                  <div className="flex justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRequestClick(request);
                      }}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View Details</span>
                    </Button>

                    {canChangeStatus(request.current_status) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStatusChange(request);
                        }}
                        title="Change Status"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit3 className="h-4 w-4" />
                        <span className="sr-only">Change Status</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RequestsTable;
