'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiService } from '@/api/services/admin/apiService';

const ConnectEventModal = ({ request, isOpen, onClose, onSubmit }) => {
  const [eventId, setEventId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableEvents, setAvailableEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);

  if (!request) return null;

  // Fetch approved requests without events
  const fetchApprovedRequestsWithoutEvents = async () => {
    setIsLoadingEvents(true);
    try {
      const response = await apiService.get('/admin/v1/fundraising-requests/approved-without-events');
      if (response.status === 'success' && response.data) {
        setAvailableEvents(response.data);
      } else {
        toast.error('Failed to load available events');
        setAvailableEvents([]);
      }
    } catch (error) {
      console.error('Error fetching approved requests without events:', error);
      toast.error('Failed to load available events');
      setAvailableEvents([]);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  // Reset form and fetch events when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setEventId('');
      setIsSubmitting(false);
      fetchApprovedRequestsWithoutEvents();
    } else {
      setAvailableEvents([]);
    }
  }, [isOpen]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      setEventId('');
      setIsSubmitting(false);
    };
  }, []);

  // Form validation
  const getValidationErrors = () => {
    const errors = [];

    if (!eventId) {
      errors.push('Please select an event to connect');
    }

    return errors;
  };

  const validationErrors = getValidationErrors();
  const isFormValid = validationErrors.length === 0 && eventId;

  // Handle form submission
  const handleSubmit = async () => {
    if (!isFormValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Pass request UUID and event_id to parent component
      await onSubmit(request.uuid, parseInt(eventId, 10));
      setEventId('');
      onClose();
    } catch (error) {
      console.error('Error connecting event:', error);
      // Error handling is done in parent component
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Link className="h-6 w-6 text-emerald-600" />
            Connect Request to Event
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Request Info */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Request ID:</span>
                <span className="font-mono text-emerald-600 text-sm break-all">
                  {request.request_id}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Requester:</span>
                <span className="text-sm break-all">{request.requester_name}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-emerald-200">
              <span className="font-medium text-sm">Amount:</span>
              <span className="font-semibold text-emerald-700">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(request.request_amount)}
              </span>
            </div>
            <div className="mt-2">
              <span className="font-medium text-sm">Purpose:</span>
              <p className="text-sm text-emerald-700 mt-1">{request.request_purpose}</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 mb-1">Event Connection Process</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Select an approved fundraising request from the dropdown below</li>
                  <li>• The selected request will be converted into a charity event</li>
                  <li>• Once connected, both requests will be linked together</li>
                  <li>• This helps track which approved requests have been converted into events</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Event Selection Dropdown */}
          <div className="space-y-3">
            <Label htmlFor="eventSelect" className="text-sm font-medium">
              Select Event to Connect <span className="text-red-500">*</span>
            </Label>
            {isLoadingEvents ? (
              <div className="flex items-center justify-center p-4 border border-gray-200 rounded-md">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-gray-600">Loading available events...</span>
              </div>
            ) : (
              <Select
                value={eventId}
                onValueChange={setEventId}
                disabled={isSubmitting || availableEvents.length === 0}
              >
                <SelectTrigger 
                  id="eventSelect"
                  className={`${
                    validationErrors.length > 0 && !eventId
                      ? 'border-red-300 focus:border-red-500'
                      : ''
                  }`}
                >
                  <SelectValue placeholder={
                    availableEvents.length === 0 
                      ? "No approved requests available" 
                      : "Select an approved request to connect..."
                  } />
                </SelectTrigger>
                <SelectContent>
                  {availableEvents.map((event) => (
                    <SelectItem key={event.id} value={event.id.toString()}>
                      <div className="flex flex-col">
                        <span className="font-medium">{event.title}</span>
                        <span className="text-xs text-gray-500">{event.request_number}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            <div className="text-xs text-gray-500">
              {availableEvents.length > 0 
                ? `${availableEvents.length} approved request${availableEvents.length === 1 ? '' : 's'} available for connection`
                : 'No approved requests without events found'
              }
            </div>

            {/* Validation errors */}
            {validationErrors.length > 0 && !eventId && (
              <div className="text-xs text-red-600 space-y-1">
                {validationErrors.map((error, index) => (
                  <div key={index}>• {error}</div>
                ))}
              </div>
            )}
          </div>

          {/* Connection Confirmation */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800 mb-1">After Connection</h4>
                <p className="text-sm text-green-700">
                  Once connected, this request will be published and marked as linked to the event.
                  The status will change to "Published" and the connection will be visible in both
                  the requests list and event details. This helps track which approved requests have
                  been converted into actual charity events.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
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
              className="bg-emerald-600 hover:bg-emerald-700 text-white sm:w-auto disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Connecting...
                </>
              ) : (
                <>
                  <Link className="mr-2 h-4 w-4" />
                  Connect Event
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectEventModal;
