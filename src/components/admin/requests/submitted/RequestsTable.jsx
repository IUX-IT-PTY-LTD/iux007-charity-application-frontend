'use client';

import React from 'react';
import { ArrowUpDown, Eye, Edit3, FileText } from 'lucide-react';
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
    { field: 'request_number', label: 'Request ID', sortable: true },
    { field: 'name', label: 'Requester', sortable: true },
    { field: 'fundraising_for', label: 'Fundraising For', sortable: true },
    { field: 'title', label: 'Title', sortable: true },
    { field: 'target_amount', label: 'Amount', sortable: true },
    { field: 'fundraising_category', label: 'Category', sortable: true },
    { field: 'created_at', label: 'Submitted', sortable: true },
    { field: 'status', label: 'Status', sortable: true },
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

  // Check if status can be changed (reviewer can change submitted/resubmitted/information_needed)
  const canChangeStatus = (currentStatus) => {
    return ['Submitted', 'Resubmitted', 'Information Needed'].includes(currentStatus);
  };

  // Get fund type badge
  const getFundTypeBadge = (fundType) => {
    if (fundType === 'individual') {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          Individual
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-purple-50 text-purple-700">
        Organization
      </Badge>
    );
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
                    {request.request_number}
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <div className="flex flex-col items-center">
                    <div className="font-medium">{request.name}</div>
                    <div className="text-xs text-gray-500">{request.email}</div>
                    <div className="text-xs text-gray-400">{request.phone}</div>
                  </div>
                </TableCell>

                <TableCell className="text-center max-w-48">
                  <div className="flex flex-col items-center gap-1">
                    <div className="font-medium truncate" title={request.fundraising_for}>
                      {request.fundraising_for}
                    </div>
                    {getFundTypeBadge(request.fund_type)}
                  </div>
                </TableCell>

                <TableCell className="text-left max-w-64">
                  <div className="font-medium truncate" title={request.title}>
                    {request.title}
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <div className="flex flex-col items-center">
                    <span className="font-semibold text-green-600">
                      {formatCurrency(request.target_amount)}
                    </span>
                    {request.shortage_amount > 0 && (
                      <span className="text-xs text-gray-500">
                        Shortage: {formatCurrency(request.shortage_amount)}
                      </span>
                    )}
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <Badge variant="outline" className="bg-gray-50">
                    {request.fundraising_category}
                  </Badge>
                </TableCell>

                <TableCell className="text-center">
                  <div className="text-sm">{formatDate(request.created_at)}</div>
                </TableCell>

                <TableCell className="text-center">{getStatusBadge(request.status)}</TableCell>

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

                    {canChangeStatus(request.status) && (
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
