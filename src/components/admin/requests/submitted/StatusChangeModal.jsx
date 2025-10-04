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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { AlertTriangle, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const StatusChangeModal = ({ request, isOpen, onClose, onSubmit, statusOptions }) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [comment, setComment] = useState('');
  const [deadline, setDeadline] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!request) return null;

  // Get available status transitions (only information_needed and in_review)
  const getAvailableStatuses = () => {
    return [
      { value: 'Information Needed', label: 'Information Needed', apiValue: 'information_needed' },
      { value: 'In Review', label: 'In Review', apiValue: 'in_review' },
    ];
  };

  const availableStatuses = getAvailableStatuses();

  // Get current status info
  const currentStatusInfo = statusOptions.find((s) => s.value === request.status);

  // Deadline is required for both statuses
  const requiresDeadline = selectedStatus !== '';

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setSelectedStatus('');
      setComment('');
      setDeadline(null);
    }
  }, [isOpen]);

  // Improved date validation
  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate <= today;
  };

  // Handle calendar date selection
  const handleDateSelect = (selectedDate) => {
    if (selectedDate && !isDateDisabled(selectedDate)) {
      setDeadline(selectedDate);
    }
  };

  // Format date to YYYY-MM-DD
  const formatDateForAPI = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Form validation
  const getValidationErrors = () => {
    const errors = [];

    if (!selectedStatus) {
      errors.push('Please select a new status');
    }

    if (!comment.trim()) {
      errors.push('Comment is required');
    }

    if (comment.trim().length < 5) {
      errors.push('Comment must be at least 5 characters long');
    }

    if (comment.length > 500) {
      errors.push('Comment must be 500 characters or less');
    }

    if (requiresDeadline && !deadline) {
      errors.push('Deadline is required when sending for review');
    }

    if (requiresDeadline && deadline && isDateDisabled(deadline)) {
      errors.push('Deadline must be tomorrow or later');
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
      // Get the API value for the selected status
      const statusObj = availableStatuses.find((s) => s.value === selectedStatus);
      const apiStatus = statusObj
        ? statusObj.apiValue
        : selectedStatus.toLowerCase().replace(/ /g, '_');

      // Prepare deadline (convert to YYYY-MM-DD format)
      const deadlineFormatted = deadline ? formatDateForAPI(deadline) : null;

      // Call parent handler with uuid, status, comment, and deadline
      await onSubmit(request.uuid, apiStatus, comment.trim(), deadlineFormatted);

      // Success handling is done in parent component
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get status change icon
  const getStatusIcon = (status) => {
    if (status === 'Information Needed') {
      return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    }
    if (status === 'In Review') {
      return <CheckCircle className="h-5 w-5 text-purple-600" />;
    }
    return <MessageSquare className="h-5 w-5 text-blue-600" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-background pb-4 border-b">
          <DialogTitle className="flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-blue-600" />
            Change Request Status
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Request Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Request ID:</span>
                <span className="font-mono text-blue-600 text-sm break-all">
                  {request.request_number}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Requester:</span>
                <span className="text-sm break-all">{request.name}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t">
              <span className="font-medium text-sm">Current Status:</span>
              {currentStatusInfo && (
                <Badge className={currentStatusInfo.color}>{currentStatusInfo.label}</Badge>
              )}
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-3">
            <Label htmlFor="status-select" className="text-sm font-medium">
              New Status <span className="text-red-500">*</span>
            </Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                {availableStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status.value)}
                      <span>{status.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedStatus && (
              <div className="text-sm">
                {selectedStatus === 'Information Needed' && (
                  <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-yellow-800">
                      This will send the request back to the requester for additional information.
                    </span>
                  </div>
                )}
                {selectedStatus === 'In Review' && (
                  <div className="flex items-start gap-2 p-3 bg-purple-50 border border-purple-200 rounded-md">
                    <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span className="text-purple-800">
                      This confirms the technical review is complete and requirements are met. The
                      request will be sent to approvers with the deadline you set.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Deadline Selection (required for both statuses) */}
          {requiresDeadline && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Review Deadline <span className="text-red-500">*</span>
              </Label>
              <DatePicker
                selected={deadline}
                onSelect={handleDateSelect}
                disabled={isDateDisabled}
                fromDate={new Date()}
                placeholder="Select deadline for review"
                className={cn(
                  !isFormValid && requiresDeadline && !deadline ? 'border-red-300 bg-red-50' : ''
                )}
              />
              <div className="text-xs text-gray-500">
                {selectedStatus === 'Information Needed'
                  ? 'Requester will have until this date to provide the additional information.'
                  : 'Approvers will have until this date to review and make their decisions on this request.'}
              </div>
              {requiresDeadline && !deadline && !isFormValid && (
                <p className="text-xs text-red-600">Deadline is required</p>
              )}
            </div>
          )}

          {/* Comment */}
          <div className="space-y-3">
            <Label htmlFor="comment" className="text-sm font-medium">
              Comment <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="comment"
              placeholder="Provide details about the status change, requirements, or feedback..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
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

          {/* Warning for information needed */}
          {selectedStatus === 'Information Needed' && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 mb-1">Information Request</h4>
                  <p className="text-sm text-yellow-700">
                    The requester will be notified and can resubmit their request with the
                    additional information. Make sure to clearly specify what is needed in your
                    comment.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Warning for in review */}
          {selectedStatus === 'In Review' && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-purple-800 mb-1">Ready for Approval</h4>
                  <p className="text-sm text-purple-700">
                    This request will be sent to the approval process and assigned approvers will be
                    notified. The deadline you set will determine how long approvers have to make
                    their decisions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Validation Errors Summary */}
          {!isFormValid && validationErrors.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800 mb-1">Please fix the following:</h4>
                  <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
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
              className="bg-blue-600 hover:bg-blue-700 text-white sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Updating...
                </>
              ) : (
                'Update Status'
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StatusChangeModal;
