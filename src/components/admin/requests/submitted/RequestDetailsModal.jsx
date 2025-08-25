'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  Edit3,
} from 'lucide-react';
import { format } from 'date-fns';

const RequestDetailsModal = ({ request, isOpen, onClose, onStatusChange, statusOptions }) => {
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

  // Get status badge
  const getStatusBadge = (status) => {
    const statusOption = statusOptions.find((option) => option.value === status);
    if (!statusOption) return <Badge variant="outline">{status}</Badge>;

    return <Badge className={statusOption.color}>{statusOption.label}</Badge>;
  };

  // Handle file download
  const handleFileDownload = (file) => {
    // In a real implementation, this would trigger the actual file download
    console.log('Downloading file:', file.name);
    // window.open(file.url, '_blank');
  };

  // Check if status can be changed
  const canChangeStatus = (currentStatus) => {
    return ['submitted', 'information_needed'].includes(currentStatus);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-blue-600" />
            Request Details - {request.request_id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Request Status and Actions */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Current Status:</span>
              {getStatusBadge(request.current_status)}
            </div>
            {canChangeStatus(request.current_status) && (
              <Button
                onClick={() => onStatusChange(request)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Edit3 className="mr-2 h-4 w-4" />
                Change Status
              </Button>
            )}
          </div>

          {/* Request Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Requester Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
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
                <Building className="h-5 w-5 text-blue-600" />
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
              <FileText className="h-5 w-5 text-blue-600" />
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
                  className="text-blue-600 hover:text-blue-800"
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

          {/* Status History */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Status History
            </h3>

            <div className="space-y-3">
              {request.status_history.map((history, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex-shrink-0">{getStatusBadge(history.status)}</div>
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

          {/* Deadline (if set) */}
          {request.deadline && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  Review Deadline
                </h3>
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="text-sm">
                    <span className="font-medium">Deadline:</span>
                    <span className="ml-2 text-orange-700 font-semibold">
                      {formatDate(request.deadline)}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {canChangeStatus(request.current_status) && (
            <Button
              onClick={() => onStatusChange(request)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Edit3 className="mr-2 h-4 w-4" />
              Change Status
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailsModal;
