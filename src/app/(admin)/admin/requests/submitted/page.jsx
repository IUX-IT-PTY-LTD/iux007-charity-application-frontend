'use client';

import React, { useState, useEffect } from 'react';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { toast } from 'sonner';

// Import UI components
import { Card, CardContent, CardFooter } from '@/components/ui/card';

// Import custom components
import RequestsHeader from '@/components/admin/requests/submitted/RequestsHeader';
import RequestsSearchBar from '@/components/admin/requests/submitted/RequestsSearchBar';
import RequestsTable from '@/components/admin/requests/submitted/RequestsTable';
import RequestsPagination from '@/components/admin/requests/submitted/RequestsPagination';
import RequestDetailsModal from '@/components/admin/requests/submitted/RequestDetailsModal';
import StatusChangeModal from '@/components/admin/requests/submitted/StatusChangeModal';

// Import service
import {
  getAllFundRequests,
  getFundRequestByUuid,
  submitReview,
  FUND_REQUEST_STATUS,
  searchFundRequests,
  sortByDate,
  filterByStatus,
} from '@/api/services/admin/fundRequestService';

const STATUS_OPTIONS = [
  { value: 'Submitted', label: 'Submitted', color: 'bg-blue-100 text-blue-800' },
  { value: 'Resubmitted', label: 'Resubmitted', color: 'bg-cyan-100 text-cyan-800' },
  {
    value: 'Information Needed',
    label: 'Information Needed',
    color: 'bg-yellow-100 text-yellow-800',
  },
  { value: 'In Review', label: 'In Review', color: 'bg-purple-100 text-purple-800' },
  { value: 'Approved', label: 'Approved', color: 'bg-green-100 text-green-800' },
  { value: 'Rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
  { value: 'Published', label: 'Published', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'Expired', label: 'Expired', color: 'bg-gray-100 text-gray-800' },
];

const CATEGORY_OPTIONS = [
  'Medical Emergency',
  'Food & Hunger Relief',
  'Community Development',
  'Education',
  'Emergency Relief',
  'Healthcare',
  'Environment',
  'Technology',
  'Arts & Culture',
  'Sports & Recreation',
];

// Main Submitted Requests Page Component
const SubmittedRequestsPage = () => {
  const { setPageTitle, setPageSubtitle } = useAdminContext();

  // State management
  const [requests, setRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');

  // Modal states
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Set page title
  useEffect(() => {
    setPageTitle('Fundraising Requests');
    setPageSubtitle('Review and manage submitted fundraising requests');
  }, [setPageTitle, setPageSubtitle]);

  // Fetch requests on mount
  useEffect(() => {
    fetchRequests();
  }, []);

  // Fetch all fundraising requests
  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      // Fetch requests with statuses that can be reviewed (use lowercase with underscores for API)
      const response = await getAllFundRequests(['submitted', 'resubmitted', 'information_needed']);

      if (response.status === 'success' && response.data) {
        setAllRequests(response.data);
        setRequests(response.data);
      } else {
        toast.error('Failed to fetch requests');
        setAllRequests([]);
        setRequests([]);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error(error.message || 'Failed to fetch fundraising requests');
      setAllRequests([]);
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch single request details
  const fetchRequestDetails = async (uuid) => {
    setIsLoadingDetails(true);
    try {
      const response = await getFundRequestByUuid(uuid);

      if (response.status === 'success' && response.data) {
        return response.data;
      } else {
        toast.error('Failed to fetch request details');
        return null;
      }
    } catch (error) {
      console.error('Error fetching request details:', error);
      toast.error(error.message || 'Failed to fetch request details');
      return null;
    } finally {
      setIsLoadingDetails(false);
    }
  };

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
    const details = await fetchRequestDetails(request.uuid);
    if (details) {
      setSelectedRequest(details);
      setShowDetailsModal(true);
    }
  };

  // Handle status change initiation
  const handleStatusChange = async (request) => {
    // If we don't have full details, fetch them
    if (!request.description) {
      const details = await fetchRequestDetails(request.uuid);
      if (details) {
        setSelectedRequest(details);
        setShowStatusModal(true);
      }
    } else {
      setSelectedRequest(request);
      setShowStatusModal(true);
    }
  };

  // Handle status change submission
  const handleStatusChangeSubmit = async (uuid, newStatus, comment, deadline = null) => {
    try {
      const reviewData = {
        status: newStatus.toLowerCase().replace(/ /g, '_'),
        comments: comment,
        deadline: deadline,
      };

      const response = await submitReview(uuid, reviewData);

      if (response.status === 'success') {
        toast.success(response.message || 'Status updated successfully');

        // Refresh the requests list
        await fetchRequests();

        setShowStatusModal(false);
        setSelectedRequest(null);
      } else {
        toast.error(response.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.message || 'Failed to update status');
    }
  };

  // Apply filters and search
  useEffect(() => {
    let filtered = [...allRequests];

    // Apply search
    if (searchQuery) {
      filtered = searchFundRequests(filtered, searchQuery);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filterByStatus(filtered, statusFilter);
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((req) => req.fundraising_category === categoryFilter);
    }

    // Apply sorting
    if (sortField === 'created_at') {
      filtered = sortByDate(filtered, sortDirection);
    } else if (sortField === 'target_amount') {
      filtered = [...filtered].sort((a, b) => {
        const modifier = sortDirection === 'asc' ? 1 : -1;
        return (Number(a.target_amount) - Number(b.target_amount)) * modifier;
      });
    } else {
      filtered = [...filtered].sort((a, b) => {
        const modifier = sortDirection === 'asc' ? 1 : -1;
        const aValue = a[sortField] || '';
        const bValue = b[sortField] || '';

        if (typeof aValue === 'string') {
          return aValue.localeCompare(bValue) * modifier;
        }
        return (aValue - bValue) * modifier;
      });
    }

    setRequests(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [allRequests, searchQuery, statusFilter, categoryFilter, sortField, sortDirection]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = requests.slice(indexOfFirstItem, indexOfLastItem);

  // Get status counts for filters
  const statusCounts = allRequests.reduce((acc, request) => {
    acc[request.status] = (acc[request.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <Card>
          {/* Header */}
          <RequestsHeader />

          <CardContent>
            {/* Search Bar */}
            <RequestsSearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              totalRequests={requests.length}
              statusCounts={statusCounts}
              statusOptions={STATUS_OPTIONS}
              categoryOptions={CATEGORY_OPTIONS}
            />

            {/* Table */}
            <RequestsTable
              requests={currentRequests}
              isLoading={isLoading}
              sortField={sortField}
              sortDirection={sortDirection}
              handleSort={handleSort}
              onRequestClick={handleRequestClick}
              onStatusChange={handleStatusChange}
              statusOptions={STATUS_OPTIONS}
            />
          </CardContent>

          <CardFooter>
            {/* Pagination */}
            {requests.length > 0 && (
              <RequestsPagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                totalItems={requests.length}
                indexOfFirstItem={indexOfFirstItem}
                indexOfLastItem={indexOfLastItem}
              />
            )}
          </CardFooter>
        </Card>
      </div>

      {/* Request Details Modal */}
      {showDetailsModal && selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedRequest(null);
          }}
          onStatusChange={handleStatusChange}
          statusOptions={STATUS_OPTIONS}
          isLoading={isLoadingDetails}
        />
      )}

      {/* Status Change Modal */}
      {showStatusModal && selectedRequest && (
        <StatusChangeModal
          request={selectedRequest}
          isOpen={showStatusModal}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedRequest(null);
          }}
          onSubmit={handleStatusChangeSubmit}
          statusOptions={STATUS_OPTIONS}
        />
      )}
    </div>
  );
};

export default SubmittedRequestsPage;
