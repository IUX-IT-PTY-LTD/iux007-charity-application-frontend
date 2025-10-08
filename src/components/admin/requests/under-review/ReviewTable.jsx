'use client';

import React from 'react';
import {
  ArrowUpDown,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Clock,
  AlertTriangle,
  CheckCircle,
  Users,
} from 'lucide-react';
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
import { Progress } from '@/components/ui/progress';
import { formatDistanceToNow, isPast, differenceInDays } from 'date-fns';

const ReviewTable = ({
  requests,
  isLoading,
  sortField,
  sortDirection,
  handleSort,
  onRequestClick,
  onApprove,
  onDeny,
  loadingRequestId = null, // ID of the request currently being loaded
}) => {
  // Column definitions for sortable headers
  const columns = [
    { field: 'request_number', label: 'Request ID', sortable: true },
    { field: 'name', label: 'Requester', sortable: true },
    { field: 'fundraising_for', label: 'Fundraising For', sortable: true },
    { field: 'title', label: 'Title', sortable: true },
    { field: 'target_amount', label: 'Amount', sortable: true },
    { field: 'fundraising_category', label: 'Category', sortable: true },
    { field: 'approval_count', label: 'Approvals', sortable: true },
    { field: 'deadline', label: 'Deadline', sortable: false },
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

  // Get deadline from reviews
  const getDeadline = (reviews) => {
    if (!reviews || reviews.length === 0) return null;
    const latestReview = reviews[reviews.length - 1];
    return latestReview.deadline || null;
  };

  // Get deadline status and styling
  const getDeadlineInfo = (deadline) => {
    if (!deadline) {
      return {
        text: 'No deadline',
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        icon: <Clock className="h-4 w-4 text-gray-500" />,
      };
    }

    const deadlineDate = new Date(deadline);
    const now = new Date();
    const isOverdue = isPast(deadlineDate);
    const daysLeft = differenceInDays(deadlineDate, now);

    if (isOverdue) {
      return {
        text: `Overdue (${Math.abs(daysLeft)}d)`,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
      };
    } else if (daysLeft <= 3) {
      return {
        text: `${daysLeft}d left`,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        icon: <Clock className="h-4 w-4 text-yellow-500" />,
      };
    } else {
      return {
        text: `${daysLeft}d left`,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      };
    }
  };

  // Get approval progress info
  const getApprovalInfo = (approvalSummary) => {
    const approvalCount = approvalSummary?.approved || 0;
    const requiredApprovals = approvalSummary?.total_approval_users || 3;
    const progressPercentage = Math.min((approvalCount / requiredApprovals) * 100, 100);

    let color = 'bg-red-500';
    let textColor = 'text-red-600';

    if (approvalCount >= requiredApprovals) {
      color = 'bg-green-500';
      textColor = 'text-green-600';
    } else if (approvalCount >= 1) {
      color = 'bg-yellow-500';
      textColor = 'text-yellow-600';
    }

    return {
      count: approvalCount,
      required: requiredApprovals,
      percentage: progressPercentage,
      color,
      textColor,
      isComplete: approvalCount >= requiredApprovals,
    };
  };

  // Check if deadline has passed
  const isDeadlinePassed = (deadline) => {
    if (!deadline) return false;
    return isPast(new Date(deadline));
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
                      className={`h-3 w-3 ${sortField === column.field ? 'text-purple-600' : ''}`}
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
                  <Users className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No requests under review found.
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            requests.map((request) => {
              const deadline = getDeadline(request.reviews);
              const deadlineInfo = getDeadlineInfo(deadline);
              const approvalInfo = getApprovalInfo(request.approval_summary);
              const deadlinePassed = isDeadlinePassed(deadline);

              return (
                <TableRow
                  key={request.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={() => onRequestClick(request)}
                >
                  <TableCell className="text-center">
                    <div className="font-mono text-sm font-medium text-purple-600">
                      {request.request_number}
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <div className="font-medium">{request.name}</div>
                      <div className="text-xs text-gray-500">{request.email}</div>
                    </div>
                  </TableCell>

                  <TableCell className="text-center max-w-48">
                    <div className="font-medium truncate" title={request.fundraising_for}>
                      {request.fundraising_for}
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs ${request.fund_type === 'individual' ? 'bg-blue-50' : 'bg-purple-50'}`}
                    >
                      {request.fund_type === 'individual' ? 'Individual' : 'Organization'}
                    </Badge>
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
                      <span className="text-xs text-gray-500">Requested</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge variant="outline" className="bg-gray-50">
                      {request.fundraising_category}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${approvalInfo.textColor}`}>
                          {approvalInfo.count}/{approvalInfo.required}
                        </span>
                        <Users className="h-4 w-4 text-gray-500" />
                      </div>
                      <Progress value={approvalInfo.percentage} className="w-16 h-2" />
                      {approvalInfo.isComplete && (
                        <Badge className="bg-green-100 text-green-800 text-xs">Ready</Badge>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <div
                      className={`flex flex-col items-center p-2 rounded-lg ${deadlineInfo.bgColor}`}
                    >
                      <div className="flex items-center gap-2">
                        {deadlineInfo.icon}
                        <span className={`text-sm font-medium ${deadlineInfo.color}`}>
                          {deadlineInfo.text}
                        </span>
                      </div>
                      {deadline && (
                        <div className="text-xs text-gray-600 mt-1">
                          {formatDistanceToNow(new Date(deadline), { addSuffix: true })}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRequestClick(request);
                      }}
                      title="Review Request"
                      disabled={loadingRequestId === request.uuid}
                      className="group relative text-purple-600 hover:text-white hover:bg-purple-600 border border-purple-200 hover:border-purple-600 transition-all duration-200 px-3 py-2 h-auto"
                    >
                      {loadingRequestId === request.uuid ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-200 border-t-purple-600"></div>
                          <span className="text-xs font-medium">Loading...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-xs font-medium text-purple-600 group-hover:text-white transition-all duration-200">
                            Review
                          </span>
                        </div>
                      )}
                      <span className="sr-only">View Details & Take Action</span>
                    </Button>
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

export default ReviewTable;
