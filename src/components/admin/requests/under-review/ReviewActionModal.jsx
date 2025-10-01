'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ThumbsUp, ThumbsDown, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const ReviewActionModal = ({ request, isOpen, onClose, onSubmit, actionType }) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!request) return null;

  const isApproval = actionType === 'approve';
  const actionLabel = isApproval ? 'Approve' : 'Reject';
  const actionColor = isApproval ? 'green' : 'red';
  const ActionIcon = isApproval ? ThumbsUp : ThumbsDown;

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setComment('');
    }
  }, [isOpen]);

  // Form validation
  const getValidationErrors = () => {
    const errors = [];

    if (!comment.trim()) {
      errors.push('Comment is required');
    }

    if (comment.trim().length < 5) {
      errors.push('Comment must be at least 5 characters long');
    }

    if (comment.length > 500) {
      errors.push('Comment must be 500 characters or less');
    }

    return errors;
  };

  const validationErrors = getValidationErrors();
  const isFormValid = validationErrors.length === 0;

  // Handle form submission
  const handleSubmit = async () => {
    if (!isFormValid) {
      validationErrors.forEach((error) => toast.error(error));
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(request.uuid, actionType, comment.trim());
      // Success handling is done in parent component
    } catch (error) {
      console.error(`Error ${actionType}ing request:`, error);
      toast.error(`Failed to ${actionType} request`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format currency
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-background pb-4 border-t">
          <DialogTitle className="flex items-center gap-3">
            <ActionIcon className={`h-6 w-6 text-${actionColor}-600`} />
            {actionLabel} Request
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Request Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Request ID:</span>
                <span className="font-mono text-purple-600 text-sm break-all">
                  {request.request_number}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Requester:</span>
                <span className="text-sm break-all">{request.name}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t">
              <span className="font-medium text-sm">Amount:</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(request.target_amount, request.currency || 'USD')}
              </span>
            </div>
          </div>

          {/* Action Confirmation */}
          <div
            className={`p-4 rounded-lg border ${isApproval ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
          >
            <div className="flex items-start gap-3">
              <ActionIcon className={`h-5 w-5 text-${actionColor}-600 flex-shrink-0 mt-0.5`} />
              <div>
                <h4 className={`font-medium text-${actionColor}-800 mb-1`}>
                  {isApproval ? 'Approval Confirmation' : 'Rejection Confirmation'}
                </h4>
                <p className={`text-sm text-${actionColor}-700`}>
                  {isApproval
                    ? 'By approving this request, you are indicating that it meets the criteria and should proceed. Your approval will count towards the required approvals for this request.'
                    : 'By rejecting this request, you are indicating that it does not meet the criteria or has issues that prevent approval. Please provide detailed feedback in your comment.'}
                </p>
              </div>
            </div>
          </div>

          {/* Comment Section */}
          <div className="space-y-3">
            <Label htmlFor="comment" className="text-sm font-medium">
              {isApproval ? 'Approval Comments' : 'Rejection Reason'}{' '}
              <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="comment"
              placeholder={
                isApproval
                  ? "Provide your comments on why you're approving this request..."
                  : 'Explain the reasons for rejection and any recommendations...'
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              maxLength={500}
              className={`resize-none ${
                (!comment.trim() || comment.length > 500) && !isFormValid
                  ? 'border-red-300 bg-red-50'
                  : ''
              }`}
            />
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">{comment.length}/500 characters</div>
              {!comment.trim() && !isFormValid && (
                <p className="text-xs text-red-600">Comment is required</p>
              )}
            </div>
          </div>

          {/* Guidelines */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <MessageSquare className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 mb-1">Review Guidelines</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  {isApproval ? (
                    <>
                      <li>• Confirm all documentation is complete and accurate</li>
                      <li>• Verify the request aligns with fundraising objectives</li>
                      <li>• Ensure the requested amount is reasonable for the stated purpose</li>
                      <li>• Consider the potential impact and beneficiaries</li>
                    </>
                  ) : (
                    <>
                      <li>• Provide specific reasons for rejection</li>
                      <li>• Mention missing documentation or information</li>
                      <li>• Suggest improvements or alternatives if applicable</li>
                      <li>• Be constructive in your feedback</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Warning for rejection */}
          {!isApproval && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800 mb-1">Important Note</h4>
                  <p className="text-sm text-red-700">
                    Rejected requests cannot proceed to final approval. The requester may be
                    notified of the rejection reason and may have the option to address concerns and
                    resubmit.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Success note for approval */}
          {isApproval && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800 mb-1">Next Steps</h4>
                  <p className="text-sm text-green-700">
                    Once this request receives the required number of approvals, it will move to the
                    next stage where administrators can make the final decision.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !isFormValid}
              className={`${
                isApproval ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
              } text-white sm:w-auto`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  {isApproval ? 'Approving...' : 'Rejecting...'}
                </>
              ) : (
                <>
                  <ActionIcon className="mr-2 h-4 w-4" />
                  {actionLabel} Request
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewActionModal;
