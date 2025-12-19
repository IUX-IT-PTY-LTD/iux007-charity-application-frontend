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
  Tag,
  Clock,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Users,
  AlertTriangle,
  CheckCircle,
  Calendar,
} from 'lucide-react';
import { format, isPast, differenceInDays } from 'date-fns';

const ReviewDetailsModal = ({ request, isOpen, onClose, onApprove, onDeny, isLoading }) => {
  if (!request) return null;

  // Format currency
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'PPP p');
  };

  // Get deadline from reviews
  const getDeadline = () => {
    if (!request.reviews || request.reviews.length === 0) return null;
    const latestReview = request.reviews[request.reviews.length - 1];
    return latestReview.deadline || null;
  };

  const deadline = getDeadline();

  // Get deadline status
  const getDeadlineStatus = (deadlineStr) => {
    if (!deadlineStr) return null;

    const deadlineDate = new Date(deadlineStr);
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
  const getApprovalProgress = () => {
    const summary = request.approval_summary;
    if (!summary) return { count: 0, required: 3, percentage: 0, isComplete: false };

    const approvalCount = summary.approved_count || 0;
    const requiredApprovals = summary.total_approval_users || 3;
    const progressPercentage = Math.min((approvalCount / requiredApprovals) * 100, 100);

    return {
      count: approvalCount,
      required: requiredApprovals,
      percentage: progressPercentage,
      isComplete: approvalCount >= requiredApprovals,
    };
  };

  const deadlineStatus = deadline ? getDeadlineStatus(deadline) : null;
  const approvalProgress = getApprovalProgress();
  const deadlinePassed = deadline ? isPast(new Date(deadline)) : false;

  // Handle document download
  const handleDocumentDownload = async (documentPath) => {
    try {
      const response = await fetch(documentPath);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = documentPath.split('/').pop() || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to opening in new tab if download fails
      window.open(documentPath, '_blank');
    }
  };

  // Check if current admin has already taken action
  const getCurrentAdminAction = () => {
    if (!request.approval_summary?.current_admin_action) return null;
    return request.approval_summary.current_admin_action;
  };

  const currentAdminAction = getCurrentAdminAction();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Users className="h-6 w-6 text-purple-600" />
            Request Review - {request.request_number}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="relative">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
              <div className="absolute inset-0 h-12 w-12 animate-pulse rounded-full border-4 border-transparent border-t-purple-400 opacity-30"></div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-gray-900">Loading Request Details</h3>
              <p className="text-sm text-gray-500">Please wait while we fetch the request information...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Request Status and Deadline */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge className="bg-purple-100 text-purple-800">In Review</Badge>
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

              {deadlineStatus && (
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
                      <div className="text-xs text-gray-600">{formatDate(deadline)}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons or Current Action Display */}
            {!deadlinePassed && (
              <div className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-700 mb-1">Your Review Decision</h4>
                  {currentAdminAction ? (
                    <p className="text-sm text-gray-600">
                      You have already reviewed this request.
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600">
                      Please review the request details and make your decision.
                    </p>
                  )}
                </div>
                {currentAdminAction ? (
                  <div className="flex items-center gap-2">
                    {currentAdminAction === 'approved' ? (
                      <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">You Approved</span>
                      </div>
                    ) : currentAdminAction === 'rejected' ? (
                      <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg">
                        <AlertTriangle className="h-5 w-5" />
                        <span className="font-medium">You Rejected</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg">
                        <span className="font-medium">Action: {currentAdminAction}</span>
                      </div>
                    )}
                  </div>
                ) : (
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
                      Reject Request
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Deadline Passed Notice */}
            {deadlinePassed && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <span className="font-medium text-red-700">Review deadline has passed</span>
                    <p className="text-sm text-red-600 mt-1">
                      You can no longer approve or reject this request. The review period ended on{' '}
                      {formatDate(deadline)}.
                    </p>
                  </div>
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
                    <span className="font-medium">Name:</span> {request.name}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {request.email}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span> {request.phone}
                  </div>
                  {request.country && (
                    <div>
                      <span className="font-medium">Country:</span> {request.country}
                    </div>
                  )}
                  {request.address && (
                    <div>
                      <span className="font-medium">Address:</span> {request.address}
                    </div>
                  )}
                </div>
              </div>

              {/* Fundraising Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Building className="h-5 w-5 text-purple-600" />
                  Fundraising Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Fundraising For:</span> {request.fundraising_for}
                  </div>
                  <div>
                    <span className="font-medium">Fund Type:</span>{' '}
                    {request.fund_type === 'individual' ? 'Individual' : 'Organization'}
                  </div>
                  <div>
                    <span className="font-medium">Category:</span> {request.fundraising_category}
                  </div>
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
                    <div className="text-sm text-gray-600">Target Amount</div>
                    <div className="font-semibold text-lg text-green-700">
                      {formatCurrency(request.target_amount, request.currency || 'USD')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <DollarSign className="h-8 w-8 text-orange-600" />
                  <div>
                    <div className="text-sm text-gray-600">Shortage Amount</div>
                    <div className="font-semibold text-lg text-orange-700">
                      {formatCurrency(request.shortage_amount, request.currency || 'USD')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Submitted:</span>
                  <span>{formatDate(request.created_at)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Title</h4>
                <p className="text-sm text-gray-700">{request.title}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Description</h4>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {request.description}
                </p>
              </div>
            </div>

            <Separator />

            {/* Attached Documents */}
            {request.documents && (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    Attached Documents
                  </h3>

                  <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="h-6 w-6 text-gray-500" />
                          <div>
                            <div className="text-xs text-gray-500">Supporting documents</div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDocumentDownload(request.documents)}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                      
                      <div className="w-full">
                        <img
                          src={request.documents}
                          alt="Supporting document"
                          className="w-full max-h-80 object-contain rounded-md border"
                          onError={(e) => {
                            e.target.src = '/images/document-placeholder.png';
                            e.target.onerror = null;
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Approval Summary */}
            {request.approval_summary && (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                    Approval Summary
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-700">
                        {request.approval_summary.approved_count || 0}
                      </div>
                      <div className="text-xs text-gray-600">Approved</div>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-red-700">
                        {request.approval_summary.rejected_count || 0}
                      </div>
                      <div className="text-xs text-gray-600">Rejected</div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-yellow-700">
                        {request.approval_summary.pending_approvals || 0}
                      </div>
                      <div className="text-xs text-gray-600">Pending</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-700">
                        {request.approval_summary.total_approval_users || 0}
                      </div>
                      <div className="text-xs text-gray-600">Total Approvers</div>
                    </div>
                  </div>

                  {/* Approval Users */}
                  {request.approval_users && request.approval_users.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Assigned Approvers:</h4>
                      <div className="flex flex-wrap gap-2">
                        {request.approval_users.map((user) => (
                          <Badge key={user.id} variant="outline" className="bg-purple-50">
                            {user.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Approval History */}
                  {request.approval_details && request.approval_details.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2 flex items-center gap-2 text-purple-700">
                        <Users className="h-4 w-4" />
                        Approval History:
                      </h4>
                      <div className="space-y-3">
                        {request.approval_details.map((approval, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded border ${
                              approval.action === 'approved'
                                ? 'bg-green-50 border-green-200'
                                : approval.action === 'rejected'
                                ? 'bg-red-50 border-red-200'
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className={`font-medium text-sm ${
                                  approval.action === 'approved'
                                    ? 'text-green-800'
                                    : approval.action === 'rejected'
                                    ? 'text-red-800'
                                    : 'text-gray-800'
                                }`}>
                                  {approval.admin_name || 'Admin'}
                                </span>
                                <div className="flex items-center gap-1">
                                  {approval.action === 'approved' ? (
                                    <ThumbsUp className="h-3 w-3 text-green-600" />
                                  ) : approval.action === 'rejected' ? (
                                    <ThumbsDown className="h-3 w-3 text-red-600" />
                                  ) : (
                                    <Clock className="h-3 w-3 text-gray-600" />
                                  )}
                                  <span className={`text-xs font-medium capitalize ${
                                    approval.action === 'approved'
                                      ? 'text-green-600'
                                      : approval.action === 'rejected'
                                      ? 'text-red-600'
                                      : 'text-gray-600'
                                  }`}>
                                    {approval.action || 'Pending'}
                                  </span>
                                </div>
                              </div>
                              {approval.created_at && (
                                <span className={`text-xs ${
                                  approval.action === 'approved'
                                    ? 'text-green-600'
                                    : approval.action === 'rejected'
                                    ? 'text-red-600'
                                    : 'text-gray-600'
                                }`}>
                                  {formatDate(approval.created_at)}
                                </span>
                              )}
                            </div>
                            {approval.comments && (
                              <p className={`text-sm ${
                                approval.action === 'approved'
                                  ? 'text-green-700'
                                  : approval.action === 'rejected'
                                  ? 'text-red-700'
                                  : 'text-gray-700'
                              }`}>
                                {approval.comments}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <Separator />
              </>
            )}

            {/* Reviews History */}
            {request.reviews && request.reviews.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  Review History
                </h3>

                <div className="space-y-3">
                  {request.reviews.map((review, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        <Badge variant="outline" className="bg-purple-50">
                          {review.status?.replace('_', ' ') || 'Review'}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {review.admin_name || 'Admin'}
                          </span>
                          {review.created_at && (
                            <span className="text-xs text-gray-500">
                              {formatDate(review.created_at)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700">{review.comments}</p>
                        {review.deadline && (
                          <div className="mt-2 flex items-center gap-1 text-xs text-orange-600">
                            <Calendar className="h-3 w-3" />
                            Deadline: {formatDate(review.deadline)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>

          {!isLoading && !deadlinePassed && !currentAdminAction && (
            <div className="flex gap-2">
              <Button
                onClick={() => onDeny(request)}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <ThumbsDown className="mr-2 h-4 w-4" />
                Reject
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
