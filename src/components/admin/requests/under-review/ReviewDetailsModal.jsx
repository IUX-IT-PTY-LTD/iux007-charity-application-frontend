'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Download,
  FileText,
  User,
  Building,
  DollarSign,
  Calendar,
  Tag,
  Clock,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Users,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { format, isPast, differenceInDays } from 'date-fns';

const ReviewDetailsModal = ({ request, isOpen, onClose, onApprove, onDeny }) => {
  if (!request) return null;

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
    return format(new Date(dateString), 'PPP p');
  };

  // Format file size
  const formatFileSize = (sizeStr) => {
    return sizeStr;
  };

  // Handle file download
  const handleFileDownload = (file) => {
    console.log('Downloading file:', file.name);
    // window.open(file.url, '_blank');
  };

  // Get deadline status
  const getDeadlineStatus = (deadline) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const isOverdue = isPast(deadlineDate);
    const daysLeft = differenceInDays(deadlineDate, now);

    if (isOverdue) {
      return {
        text: `Overdue by ${Math.abs(daysLeft)} days`,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
      };
    } else if (daysLeft <= 3) {
      return {
        text: `${daysLeft} days remaining`,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        icon: <Clock className="h-5 w-5 text-yellow-600" />,
      };
    } else {
      return {
        text: `${daysLeft} days remaining`,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      };
    }
  };

  // Get approval progress
  const getApprovalProgress = (approvals) => {
    const approvalCount = approvals.length;
    const requiredApprovals = 3;
    const progressPercentage = Math.min((approvalCount / requiredApprovals) * 100, 100);

    return {
      count: approvalCount,
      required: requiredApprovals,
      percentage: progressPercentage,
      isComplete: approvalCount >= requiredApprovals,
    };
  };

  // Check if current user has acted
  const currentUserId = 'current_user'; // This would come from auth context
  const hasApproved = request.approvals.some((approval) => approval.reviewer_id === currentUserId);
  const hasDenied = request.denials.some((denial) => denial.reviewer_id === currentUserId);
  const hasActed = hasApproved || hasDenied;

  // Check if deadline has passed
  const deadlinePassed = isPast(new Date(request.deadline));

  const deadlineStatus = getDeadlineStatus(request.deadline);
  const approvalProgress = getApprovalProgress(request.approvals);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Users className="h-6 w-6 text-purple-600" />
            Request Review - {request.request_id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Request Status and Deadline */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge className="bg-purple-100 text-purple-800">Under Review</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Progress:</span>
                  <span className="font-semibold text-purple-700">
                    {approvalProgress.count}/{approvalProgress.required} Approvals
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <Progress value={approvalProgress.percentage} className="w-full h-2" />
                {approvalProgress.isComplete && (
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">
                      Ready for final approval process
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div
              className={`flex-1 p-4 rounded-lg border ${deadlineStatus.bgColor} ${deadlineStatus.borderColor}`}
            >
              <div className="flex items-center gap-3">
                {deadlineStatus.icon}
                <div>
                  <div className="text-sm font-medium text-gray-700">Review Deadline</div>
                  <div className={`font-semibold ${deadlineStatus.color}`}>
                    {deadlineStatus.text}
                  </div>
                  <div className="text-xs text-gray-600">{formatDate(request.deadline)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {!hasActed && !deadlinePassed && (
            <div className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-700 mb-1">Your Review Decision</h4>
                <p className="text-sm text-gray-600">
                  Please review the request details and make your decision.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => onApprove(request)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  Approve Request
                </Button>
                <Button
                  onClick={() => onDeny(request)}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <ThumbsDown className="mr-2 h-4 w-4" />
                  Deny Request
                </Button>
              </div>
            </div>
          )}

          {/* Deadline Passed Notice */}
          {deadlinePassed && !hasActed && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <span className="font-medium text-red-700">Review deadline has passed</span>
                  <p className="text-sm text-red-600 mt-1">
                    You can no longer approve or deny this request. The review period ended on{' '}
                    {formatDate(request.deadline)}.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* User's Previous Action */}
          {hasActed && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {hasApproved ? (
                  <>
                    <ThumbsUp className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-700">
                      You have approved this request
                    </span>
                  </>
                ) : (
                  <>
                    <ThumbsDown className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-red-700">You have denied this request</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Request Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Requester Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5 text-purple-600" />
                Requester Information
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Name:</span> {request.requester_name}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {request.requester_email}
                </div>
                <div>
                  <span className="font-medium">Phone:</span> {request.requester_phone}
                </div>
              </div>
            </div>

            {/* Organization Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Building className="h-5 w-5 text-purple-600" />
                Organization Information
              </h3>
              <div className="space-y-2 text-sm">
                {request.organization_name ? (
                  <>
                    <div>
                      <span className="font-medium">Name:</span> {request.organization_name}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span> {request.organization_type}
                    </div>
                    <div>
                      <span className="font-medium">Address:</span> {request.organization_address}
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500 italic">
                    This is an individual request (no organization)
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Request Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Request Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-sm text-gray-600">Requested Amount</div>
                  <div className="font-semibold text-lg text-green-700">
                    {formatCurrency(request.request_amount)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Tag className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-sm text-gray-600">Category</div>
                  <div className="font-semibold text-lg text-blue-700">
                    {request.request_category}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Submitted:</span>
                <span>{formatDate(request.submission_date)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Request Purpose</h4>
              <p className="text-sm text-gray-700">{request.request_purpose}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Description</h4>
              <p className="text-sm text-gray-700 leading-relaxed">{request.request_description}</p>
            </div>
          </div>

          <Separator />

          {/* Attached File */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Attached Documents
            </h3>

            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-gray-500" />
                  <div>
                    <div className="font-medium text-sm">{request.attached_file.name}</div>
                    <div className="text-xs text-gray-500">
                      {formatFileSize(request.attached_file.size)}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFileDownload(request.attached_file)}
                  className="text-purple-600 hover:text-purple-800"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download ZIP
                </Button>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              This ZIP file contains all supporting documents for the request.
            </p>
          </div>

          <Separator />

          {/* Approvals Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ThumbsUp className="h-5 w-5 text-green-600" />
              Approvals ({request.approvals.length})
            </h3>

            {request.approvals.length === 0 ? (
              <div className="text-center p-6 text-gray-500">
                <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm">No approvals yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {request.approvals.map((approval, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 border border-green-200 rounded-lg bg-green-50"
                  >
                    <ThumbsUp className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-green-800">
                          {approval.reviewer_name}
                        </span>
                        <span className="text-xs text-green-600">
                          {formatDate(approval.reviewed_at)}
                        </span>
                      </div>
                      <p className="text-sm text-green-700">{approval.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Denials Section */}
          {request.denials && request.denials.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <ThumbsDown className="h-5 w-5 text-red-600" />
                  Denials ({request.denials.length})
                </h3>

                <div className="space-y-3">
                  {request.denials.map((denial, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 border border-red-200 rounded-lg bg-red-50"
                    >
                      <ThumbsDown className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-red-800">
                            {denial.reviewer_name}
                          </span>
                          <span className="text-xs text-red-600">
                            {formatDate(denial.reviewed_at)}
                          </span>
                        </div>
                        <p className="text-sm text-red-700">{denial.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Status History */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              Status History
            </h3>

            <div className="space-y-3">
              {request.status_history.map((history, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex-shrink-0">
                    <Badge className="bg-purple-100 text-purple-800">{history.status}</Badge>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{history.changed_by}</span>
                      <span className="text-xs text-gray-500">
                        {formatDate(history.changed_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{history.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>

          {!hasActed && !deadlinePassed && (
            <div className="flex gap-2">
              <Button
                onClick={() => onDeny(request)}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <ThumbsDown className="mr-2 h-4 w-4" />
                Deny
              </Button>
              <Button
                onClick={() => onApprove(request)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <ThumbsUp className="mr-2 h-4 w-4" />
                Approve
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDetailsModal;
