'use client';

import React, { useState, useEffect } from 'react';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { toast } from 'sonner';

// Import UI components
import { Card, CardContent, CardFooter } from '@/components/ui/card';

// Import custom components
import ApprovedHeader from '@/components/admin/requests/approved/ApprovedHeader';
import ApprovedSearchBar from '@/components/admin/requests/approved/ApprovedSearchBar';
import ApprovedTable from '@/components/admin/requests/approved/ApprovedTable';
import RequestsPagination from '@/components/admin/requests/submitted/RequestsPagination';
import ApprovedDetailsModal from '@/components/admin/requests/approved/ApprovedDetailsModal';
import ConnectEventModal from '@/components/admin/requests/approved/ConnectEventModal';

// Import API service
import {
  getAllFundRequests,
  getFundRequestByUuid,
  FUND_REQUEST_STATUS,
  publishFundRequest,
  formatPublishDataForSubmission,
} from '@/api/services/admin/fundRequestService';

const CATEGORY_OPTIONS = [
  'Education',
  'Healthcare',
  'Environment',
  'Community Development',
  'Emergency Relief',
  'Technology',
  'Arts & Culture',
  'Sports & Recreation',
  'Food & Hunger Relief',
  'Medical Emergency',
];

// Main Approved Requests Page Component
const ApprovedRequestsPage = () => {
  const { setPageTitle, setPageSubtitle } = useAdminContext();

  // State management
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [eventConnectionFilter, setEventConnectionFilter] = useState('all');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');

  // Modal states
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Set page title
  useEffect(() => {
    setPageTitle('Approved Requests');
    setPageSubtitle('Connect approved charity requests to events');
  }, [setPageTitle, setPageSubtitle]);

  // Transform API data to component structure
  const transformRequestData = (apiRequest) => ({
    id: apiRequest.uuid,
    uuid: apiRequest.uuid, // Keep UUID for API calls
    request_id: apiRequest.request_number,
    requester_name: apiRequest.name,
    requester_email: apiRequest.email,
    requester_phone: apiRequest.phone,
    organization_name: apiRequest.fund_type === 'organization' ? apiRequest.fundraising_for : null,
    organization_type: apiRequest.fund_type === 'organization' ? 'Non-Profit Organization' : null,
    organization_address: apiRequest.address || null,
    request_purpose: apiRequest.title,
    request_description: apiRequest.description || apiRequest.details || 'No description available',
    request_amount: parseFloat(apiRequest.target_amount) || 0,
    request_category: apiRequest.fundraising_category,
    submission_date: apiRequest.created_at,
    current_status: apiRequest.status.toLowerCase().replace(/\s+/g, '_'),
    connected_event_id: apiRequest.event_id || null,
    attached_file: apiRequest.documents
      ? {
          name: apiRequest.documents,
          size: 'N/A',
          url: apiRequest.document_url || `/documents/${apiRequest.documents}`,
        }
      : null,
    user_info: apiRequest.user_info || apiRequest.user,
    approval_summary: apiRequest.approval_summary,
  });

  // Fetch approved requests from API
  useEffect(() => {
    const fetchApprovedRequests = async () => {
      setIsLoading(true);
      try {
        const response = await getAllFundRequests([FUND_REQUEST_STATUS.APPROVED]);

        if (response.status === 'success' && Array.isArray(response.data)) {
          const transformedRequests = response.data.map(transformRequestData);
          setRequests(transformedRequests);
        } else {
          toast.error('Unexpected response format from server');
        }
      } catch (error) {
        console.error('Error fetching approved requests:', error);
        toast.error('Failed to load approved requests. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApprovedRequests();
  }, []);

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle request selection - fetch full details
  const handleRequestClick = async (request) => {
    try {
      // Fetch full request details
      const response = await getFundRequestByUuid(request.id);

      if (response.status === 'success' && response.data) {
        const fullRequestData = transformRequestData(response.data);
        setSelectedRequest(fullRequestData);
        setShowDetailsModal(true);
      }
    } catch (error) {
      console.error('Error fetching request details:', error);
      toast.error('Failed to load request details');
    }
  };

  // Handle connect event action
  const handleConnectEvent = (request) => {
    setSelectedRequest(request);
    setShowConnectModal(true);
  };

  // Handle event connection submission
  const handleConnectSubmit = async (requestUuid, eventId) => {
    try {
      // Format the publish data
      const publishData = formatPublishDataForSubmission({ event_id: eventId });

      // Call the API to publish/connect the request using UUID
      await publishFundRequest(requestUuid, publishData);

      // Update local state to reflect the connection
      const updatedRequests = requests.map((request) => {
        if (request.uuid === requestUuid) {
          return {
            ...request,
            connected_event_id: eventId,
          };
        }
        return request;
      });

      setRequests(updatedRequests);
      setShowConnectModal(false);
      setSelectedRequest(null);

      toast.success('Request successfully connected to event');
    } catch (error) {
      console.error('Error connecting event:', error);
      toast.error(error.message || 'Failed to connect request to event');
      throw error;
    }
  };

  // Filter and sort requests
  const filteredRequests = requests.filter((request) => {
    // Search filter
    const matchesSearch =
      !searchQuery ||
      request.request_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requester_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (request.organization_name &&
        request.organization_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      request.request_purpose.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory = categoryFilter === 'all' || request.request_category === categoryFilter;

    // Event connection filter
    const matchesEventConnection = (() => {
      switch (eventConnectionFilter) {
        case 'connected':
          return !!request.connected_event_id;
        case 'not_connected':
          return !request.connected_event_id;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesCategory && matchesEventConnection;
  });

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    const modifier = sortDirection === 'asc' ? 1 : -1;

    if (sortField === 'submission_date' || sortField === 'created_at') {
      return (new Date(a.submission_date) - new Date(b.submission_date)) * modifier;
    } else if (sortField === 'request_amount') {
      return (a.request_amount - b.request_amount) * modifier;
    } else if (typeof a[sortField] === 'string') {
      return a[sortField].localeCompare(b[sortField]) * modifier;
    } else {
      return (a[sortField] - b[sortField]) * modifier;
    }
  });

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = sortedRequests.slice(indexOfFirstItem, indexOfLastItem);

  // Get connection counts for filters
  const connectionCounts = requests.reduce((acc, request) => {
    acc.total = (acc.total || 0) + 1;

    if (request.connected_event_id) {
      acc.connected = (acc.connected || 0) + 1;
    } else {
      acc.not_connected = (acc.not_connected || 0) + 1;
    }

    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <Card>
          {/* Header */}
          <ApprovedHeader />

          <CardContent>
            {/* Search Bar */}
            <ApprovedSearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              eventConnectionFilter={eventConnectionFilter}
              setEventConnectionFilter={setEventConnectionFilter}
              totalRequests={sortedRequests.length}
              connectionCounts={connectionCounts}
              categoryOptions={CATEGORY_OPTIONS}
            />

            {/* Table */}
            <ApprovedTable
              requests={currentRequests}
              isLoading={isLoading}
              sortField={sortField}
              sortDirection={sortDirection}
              handleSort={handleSort}
              onRequestClick={handleRequestClick}
              onConnectEvent={handleConnectEvent}
            />
          </CardContent>

          <CardFooter>
            {/* Pagination */}
            {sortedRequests.length > 0 && (
              <RequestsPagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                totalItems={sortedRequests.length}
                indexOfFirstItem={indexOfFirstItem}
                indexOfLastItem={indexOfLastItem}
              />
            )}
          </CardFooter>
        </Card>
      </div>

      {/* Request Details Modal */}
      {showDetailsModal && selectedRequest && (
        <ApprovedDetailsModal
          request={selectedRequest}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedRequest(null);
          }}
          onConnectEvent={handleConnectEvent}
        />
      )}

      {/* Connect Event Modal */}
      {showConnectModal && selectedRequest && (
        <ConnectEventModal
          request={selectedRequest}
          isOpen={showConnectModal}
          onClose={() => {
            setShowConnectModal(false);
            setSelectedRequest(null);
          }}
          onSubmit={handleConnectSubmit}
        />
      )}
    </div>
  );
};

export default ApprovedRequestsPage;
