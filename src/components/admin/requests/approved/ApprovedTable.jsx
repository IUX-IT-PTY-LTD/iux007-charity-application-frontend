'use client';

import React from 'react';
import { ArrowUpDown, Eye, Link, CheckCircle, Calendar } from 'lucide-react';
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

const ApprovedTable = ({
  requests,
  isLoading,
  sortField,
  sortDirection,
  handleSort,
  onRequestClick,
  onConnectEvent,
}) => {
  // Column definitions for sortable headers
  const columns = [
    { field: 'request_id', label: 'Request ID', sortable: true },
    { field: 'requester_name', label: 'Requester', sortable: true },
    { field: 'organization_name', label: 'Organization', sortable: true },
    { field: 'request_purpose', label: 'Request Purpose', sortable: true },
    { field: 'request_amount', label: 'Amount', sortable: true },
    { field: 'request_category', label: 'Category', sortable: true },
    { field: 'submission_date', label: 'Approved', sortable: true },
    { field: 'event_connection', label: 'Event Status', sortable: false },
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

  // Format date safely
  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Unknown date';
    }
  };

  // Get event connection status
  const getEventConnectionStatus = (request) => {
    // If status is published or has connected_event_id, show as connected
    if (request.current_status === 'published' || request.connected_event_id) {
      return {
        badge: <Badge className="bg-green-100 text-green-800">Connected</Badge>,
        eventId: request.connected_event_id,
        canConnect: false,
      };
    } else {
      return {
        badge: <Badge className="bg-yellow-100 text-yellow-800">Not Connected</Badge>,
        eventId: null,
        canConnect: true,
      };
    }
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
                      className={`h-3 w-3 ${sortField === column.field ? 'text-emerald-600' : ''}`}
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
                  <CheckCircle className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No approved requests found.
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            requests.map((request) => {
              const eventStatus = getEventConnectionStatus(request);

              return (
                <TableRow
                  key={request.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={() => onRequestClick(request)}
                >
                  <TableCell className="text-center">
                    <div className="font-mono text-sm font-medium text-emerald-600">
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
                      <span className="text-xs text-gray-500">Approved</span>
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
                    <div className="flex flex-col items-center space-y-1">
                      {eventStatus.badge}
                      {eventStatus.eventId && (
                        <div className="text-xs text-gray-600 font-mono">
                          Event: {eventStatus.eventId}
                        </div>
                      )}
                    </div>
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

                      {eventStatus.canConnect && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            onConnectEvent(request);
                          }}
                          title="Connect to Event"
                          className="text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50"
                        >
                          <Link className="h-4 w-4" />
                          <span className="sr-only">Connect Event</span>
                        </Button>
                      )}

                      {!eventStatus.canConnect && (
                        <div className="flex items-center gap-1">
                          <Badge className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            Linked
                          </Badge>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApprovedTable;
