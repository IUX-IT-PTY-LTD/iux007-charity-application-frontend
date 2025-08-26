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
  DollarSign,
  Calendar,
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
}) => {
  // Column definitions for sortable headers
  const columns = [
    { field: 'request_id', label: 'Request ID', sortable: true },
    { field: 'requester_name', label: 'Requester', sortable: true },
    { field: 'organization_name', label: 'Organization', sortable: true },
    { field: 'request_purpose', label: 'Request Purpose', sortable: true },
    { field: 'request_amount', label: 'Amount', sortable: true },
    { field: 'request_category', label: 'Category', sortable: true },
    { field: 'approval_count', label: 'Approvals', sortable: true },
    { field: 'deadline', label: 'Deadline', sortable: true },
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

  // Get deadline status and styling
  const getDeadlineInfo = (deadline) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const isOverdue = isPast(deadlineDate);
    const daysLeft = differenceInDays(deadlineDate, now);

    if (isOverdue) {
      return {
        text: `Overdue (${Math.abs(daysLeft)} days)`,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
      };
    } else if (daysLeft <= 3) {
      return {
        text: `${daysLeft} days left`,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        icon: <Clock className="h-4 w-4 text-yellow-500" />,
      };
    } else {
      return {
        text: `${daysLeft} days left`,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      };
    }
  };

  // Get approval progress info
  const getApprovalInfo = (approvals) => {
    const approvalCount = approvals.length;
    const requiredApprovals = 3;
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

  // Check if user has already approved/denied this request
  const getUserAction = (approvals, denials, currentUserId = 'current_user') => {
    const hasApproved = approvals.some((approval) => approval.reviewer_id === currentUserId);
    const hasDenied = denials.some((denial) => denial.reviewer_id === currentUserId);

    return { hasApproved, hasDenied, hasActed: hasApproved || hasDenied };
  };

  // Check if deadline has passed
  const isDeadlinePassed = (deadline) => {
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
              const deadlineInfo = getDeadlineInfo(request.deadline);
              const approvalInfo = getApprovalInfo(request.approvals);
              const userAction = getUserAction(request.approvals, request.denials);
              const deadlinePassed = isDeadlinePassed(request.deadline);

              return (
                <TableRow
                  key={request.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={() => onRequestClick(request)}
                >
                  <TableCell className="text-center">
                    <div className="font-mono text-sm font-medium text-purple-600">
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
                      <span className="text-xs text-gray-500">Requested</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge variant="outline" className="bg-gray-50">
                      {request.request_category}
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
                      <div className="text-xs text-gray-600 mt-1">
                        {formatDistanceToNow(new Date(request.deadline), { addSuffix: true })}
                      </div>
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

                      {!userAction.hasActed && !deadlinePassed && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onApprove(request);
                            }}
                            title="Approve Request"
                            className="text-green-600 hover:text-green-800 hover:bg-green-50"
                          >
                            <ThumbsUp className="h-4 w-4" />
                            <span className="sr-only">Approve</span>
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeny(request);
                            }}
                            title="Deny Request"
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <ThumbsDown className="h-4 w-4" />
                            <span className="sr-only">Deny</span>
                          </Button>
                        </>
                      )}

                      {deadlinePassed && !userAction.hasActed && (
                        <div className="flex items-center gap-1">
                          <Badge className="bg-gray-100 text-gray-600 text-xs px-2 py-1">
                            Deadline Passed
                          </Badge>
                        </div>
                      )}

                      {userAction.hasActed && (
                        <div className="flex items-center gap-1">
                          {userAction.hasApproved && (
                            <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">
                              Approved
                            </Badge>
                          )}
                          {userAction.hasDenied && (
                            <Badge className="bg-red-100 text-red-800 text-xs px-2 py-1">
                              Denied
                            </Badge>
                          )}
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

export default ReviewTable;
