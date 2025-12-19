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
  CheckCircle,
  Link,
} from 'lucide-react';
import { format } from 'date-fns';

const ApprovedDetailsModal = ({ request, isOpen, onClose, onConnectEvent }) => {
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
    try {
      return format(new Date(dateString), 'PPP p');
    } catch (error) {
      return dateString;
    }
  };

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

  // Check if connected to event
  const isConnectedToEvent = !!request.connected_event_id;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-emerald-600" />
            Approved Request Details - {request.request_id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Request Status and Event Connection */}
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isConnectedToEvent ? (
                  <>
                    <Link className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-700">Event Connection</div>
                      <div className="font-semibold text-green-700">
                        Connected to Event: {request.connected_event_id}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Calendar className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-700">Event Connection</div>
                      <div className="font-semibold text-yellow-700">Not Connected to Event</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Connect Event Button (only show if not connected) */}
          {!isConnectedToEvent && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex flex-col sm:flex-row gap-3 items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-blue-800 mb-1">Connect to Event</h4>
                  <p className="text-sm text-blue-700">
                    Create an event manually and then connect this approved request to that event.
                  </p>
                </div>
                <Button
                  onClick={() => onConnectEvent(request)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
                >
                  <Link className="mr-2 h-4 w-4" />
                  Connect Event
                </Button>
              </div>
            </div>
          )}

          <Separator />

          {/* Request Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Requester Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5 text-emerald-600" />
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
                {request.user_info && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">User Account Info:</div>
                    <div>
                      <span className="font-medium">User ID:</span> {request.user_info.id}
                    </div>
                    {request.user_info.name && (
                      <div>
                        <span className="font-medium">Account Name:</span> {request.user_info.name}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Organization Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Building className="h-5 w-5 text-emerald-600" />
                Organization Information
              </h3>
              <div className="space-y-2 text-sm">
                {request.organization_name ? (
                  <>
                    <div>
                      <span className="font-medium">Name:</span> {request.organization_name}
                    </div>
                    {request.organization_type && (
                      <div>
                        <span className="font-medium">Type:</span> {request.organization_type}
                      </div>
                    )}
                    {request.organization_address && (
                      <div>
                        <span className="font-medium">Address:</span> {request.organization_address}
                      </div>
                    )}
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
                  <div className="text-sm text-gray-600">Approved Amount</div>
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
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {request.request_description}
              </p>
            </div>
          </div>

          {/* Approval Summary */}
          {request.approval_summary && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  Approval Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-600">Total Approvers</div>
                    <div className="text-lg font-semibold">
                      {request.approval_summary.total_approvers_needed ||
                        request.approval_summary.total_approval_users ||
                        0}
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-xs text-gray-600">Approved</div>
                    <div className="text-lg font-semibold text-green-700">
                      {request.approval_summary.approved ||
                        request.approval_summary.approved_count ||
                        0}
                    </div>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="text-xs text-gray-600">Rejected</div>
                    <div className="text-lg font-semibold text-red-700">
                      {request.approval_summary.rejected ||
                        request.approval_summary.rejected_count ||
                        0}
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="text-xs text-gray-600">Pending</div>
                    <div className="text-lg font-semibold text-yellow-700">
                      {request.approval_summary.pending ||
                        request.approval_summary.pending_approvals ||
                        0}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Attached File */}
          {request.attached_file && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-600" />
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
                      onClick={() => handleDocumentDownload(request.attached_file.url || request.attached_file.name)}
                      className="text-emerald-600 hover:text-emerald-800"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                  
                  <div className="w-full">
                    <img
                      src={request.attached_file.url || request.attached_file.name}
                      alt="Supporting document"
                      className="w-full max-h-80 object-contain rounded-md border"
                      onError={(e) => {
                        e.target.src = 'https://iux007-charity-application.s3.ap-southeast-2.amazonaws.com/staging/assets/fallback_images/slider_fallback_image.jpg';
                        e.target.onerror = null;
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Event Connection Info (if connected) */}
          {isConnectedToEvent && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Link className="h-5 w-5 text-emerald-600" />
                  Event Connection
                </h3>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <div className="font-medium text-green-800">Connected to Event</div>
                      <div className="text-sm text-green-700 mt-1">
                        This request has been successfully connected to event:
                        <span className="font-mono font-semibold ml-2">
                          {request.connected_event_id}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end items-center pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApprovedDetailsModal;
