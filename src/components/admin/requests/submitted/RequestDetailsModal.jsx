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
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';

const RequestDetailsModal = ({
  request,
  isOpen,
  onClose,
  onStatusChange,
  statusOptions,
  isLoading,
}) => {
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

  // Get status badge
  const getStatusBadge = (status) => {
    const statusOption = statusOptions.find((option) => option.value === status);
    if (!statusOption) return <Badge variant="outline">{status}</Badge>;

    return <Badge className={statusOption.color}>{statusOption.label}</Badge>;
  };

  // Check if status can be changed
  const canChangeStatus = (currentStatus) => {
    return ['Submitted', 'Resubmitted', 'Information Needed'].includes(currentStatus);
  };

  // Get fund type display
  const getFundTypeDisplay = (fundType) => {
    return fundType === 'individual' ? 'Individual' : 'Organization';
  };

  // Handle document download
  const handleDocumentDownload = async (documentPath) => {
    try {
      const response = await fetch(`${documentPath}`);
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
      window.open(`${documentPath}`, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-blue-600" />
            Request Details - {request.request_number}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-900 border-t-transparent"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Request Status and Actions */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Current Status:</span>
                {getStatusBadge(request.status)}
              </div>
              {canChangeStatus(request.status) && (
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
                  <Building className="h-5 w-5 text-blue-600" />
                  Fundraising Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Fundraising For:</span> {request.fundraising_for}
                  </div>
                  <div>
                    <span className="font-medium">Fund Type:</span>{' '}
                    {getFundTypeDisplay(request.fund_type)}
                  </div>
                  <div>
                    <span className="font-medium">Category:</span> {request.fundraising_category}
                  </div>
                  {request.user_info && (
                    <div className="pt-2 mt-2 border-t">
                      <div className="font-medium mb-1">User Account:</div>
                      <div className="text-xs text-gray-600">
                        {request.user_info.name} ({request.user_info.email})
                      </div>
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

            {/* Reference Information */}
            {(request.reference_name || request.reference_email || request.reference_phone) && (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Reference Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    {request.reference_name && (
                      <div>
                        <span className="font-medium">Name:</span> {request.reference_name}
                      </div>
                    )}
                    {request.reference_email && (
                      <div>
                        <span className="font-medium">Email:</span> {request.reference_email}
                      </div>
                    )}
                    {request.reference_phone && (
                      <div>
                        <span className="font-medium">Phone:</span> {request.reference_phone}
                      </div>
                    )}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Attached Documents */}
            {request.documents && (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Attached Documents
                  </h3>

                  <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="h-6 w-6 text-gray-500" />
                          <div>
                            {/* <div className="font-medium text-sm">{request.documents}</div> */}
                            <div className="text-xs text-gray-500">Supporting documents</div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDocumentDownload(request.documents)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                      
                      <div className="w-full">
                        <img
                          src={`${request.documents}`}
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
                <Separator />
              </>
            )}

            {/* Reviews History */}
            {request.reviews && request.reviews.length > 0 && (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    Review History
                  </h3>

                  <div className="space-y-3">
                    {request.reviews.map((review, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="flex-shrink-0">
                          <Badge variant="outline" className="bg-blue-50">
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
              </>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {!isLoading && canChangeStatus(request.status) && (
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
