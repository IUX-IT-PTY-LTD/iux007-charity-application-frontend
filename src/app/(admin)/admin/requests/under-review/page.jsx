'use client';

import React, { useState, useEffect } from 'react';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { toast } from 'sonner';

// Import UI components
import { Card, CardContent, CardFooter } from '@/components/ui/card';

// Import custom components
import ReviewHeader from '@/components/admin/requests/under-review/ReviewHeader';
import ReviewSearchBar from '@/components/admin/requests/under-review/ReviewSearchBar';
import ReviewTable from '@/components/admin/requests/under-review/ReviewTable';
import RequestsPagination from '@/components/admin/requests/submitted/RequestsPagination';
import ReviewDetailsModal from '@/components/admin/requests/under-review/ReviewDetailsModal';
import ReviewActionModal from '@/components/admin/requests/under-review/ReviewActionModal';

// Import service
import {
  getAllFundRequests,
  getFundRequestByUuid,
  submitApproval,
  searchFundRequests,
  sortByDate,
  filterByStatus,
} from '@/api/services/admin/fundRequestService';
import { isPast, differenceInDays } from 'date-fns';

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

// Main Under Review Requests Page Component
const UnderReviewRequestsPage = () => {
  const { setPageTitle, setPageSubtitle } = useAdminContext();

  // State management
  const [requests, setRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [approvalFilter, setApprovalFilter] = useState('all');
  const [deadlineFilter, setDeadlineFilter] = useState('all');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');

  // Modal states
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(null); // 'approve' or 'deny'
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Set page title
  useEffect(() => {
    setPageTitle('Under Review Requests');
    setPageSubtitle('Review and approve fundraising requests in the approval process');
  }, [setPageTitle, setPageSubtitle]);

  // Fetch requests on mount
  useEffect(() => {
    fetchRequests();
  }, []);

  // Fetch all fundraising requests with In Review status
  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await getAllFundRequests(['in_review']);

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

  // Handle approve action
  const handleApprove = async (request) => {
    // If we don't have full details, fetch them
    if (!request.description) {
      const details = await fetchRequestDetails(request.uuid);
      if (details) {
        setSelectedRequest(details);
        setActionType('approve');
        setShowActionModal(true);
      }
    } else {
      setSelectedRequest(request);
      setActionType('approve');
      setShowActionModal(true);
    }
  };

  // Handle deny action
  const handleDeny = async (request) => {
    // If we don't have full details, fetch them
    if (!request.description) {
      const details = await fetchRequestDetails(request.uuid);
      if (details) {
        setSelectedRequest(details);
        setActionType('deny');
        setShowActionModal(true);
      }
    } else {
      setSelectedRequest(request);
      setActionType('deny');
      setShowActionModal(true);
    }
  };

  // Handle action submission (approve/deny)
  const handleActionSubmit = async (uuid, apiAction, comment) => {
    try {
      const approvalData = {
        action: apiAction, // Already mapped to 'accepted' or 'rejected' from modal
        comments: comment,
      };

      const response = await submitApproval(uuid, approvalData);

      if (response.status === 'success') {
        toast.success(
          response.message ||
            `Request ${apiAction === 'accepted' ? 'approved' : 'rejected'} successfully`
        );

        // Refresh the requests list
        await fetchRequests();

        setShowActionModal(false);
        setShowDetailsModal(false);
        setSelectedRequest(null);
        setActionType(null);
      } else {
        toast.error(
          response.message || `Failed to ${apiAction === 'accepted' ? 'approve' : 'reject'} request`
        );
      }
    } catch (error) {
      console.error(`Error submitting approval:`, error);
      toast.error(error.message || `Failed to submit approval`);
    }
  };

  // Apply filters and search
  useEffect(() => {
    let filtered = [...allRequests];

    // Apply search
    if (searchQuery) {
      filtered = searchFundRequests(filtered, searchQuery);
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((req) => req.fundraising_category === categoryFilter);
    }

    // Apply approval filter
    if (approvalFilter !== 'all') {
      const approvalCount = (req) => req.approval_summary?.approved_count || 0;

      filtered = filtered.filter((req) => {
        const count = approvalCount(req);
        switch (approvalFilter) {
          case 'no_approvals':
            return count === 0;
          case 'some_approvals':
            return count > 0 && count < 3;
          case 'ready_for_final':
            return count >= 3;
          default:
            return true;
        }
      });
    }

    // Apply deadline filter
    if (deadlineFilter !== 'all') {
      filtered = filtered.filter((req) => {
        if (!req.reviews || req.reviews.length === 0) return false;

        const latestReview = req.reviews[req.reviews.length - 1];
        if (!latestReview.deadline) return false;

        const deadlineDate = new Date(latestReview.deadline);
        const now = new Date();
        const daysUntil = differenceInDays(deadlineDate, now);

        switch (deadlineFilter) {
          case 'overdue':
            return isPast(deadlineDate);
          case 'due_soon':
            return !isPast(deadlineDate) && daysUntil <= 3;
          case 'due_later':
            return daysUntil > 3;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    if (sortField === 'created_at') {
      filtered = sortByDate(filtered, sortDirection);
    } else if (sortField === 'target_amount') {
      filtered = [...filtered].sort((a, b) => {
        const modifier = sortDirection === 'asc' ? 1 : -1;
        return (Number(a.target_amount) - Number(b.target_amount)) * modifier;
      });
    } else if (sortField === 'approval_count') {
      filtered = [...filtered].sort((a, b) => {
        const modifier = sortDirection === 'asc' ? 1 : -1;
        const countA = a.approval_summary?.approved_count || 0;
        const countB = b.approval_summary?.approved_count || 0;
        return (countA - countB) * modifier;
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
  }, [
    allRequests,
    searchQuery,
    categoryFilter,
    approvalFilter,
    deadlineFilter,
    sortField,
    sortDirection,
  ]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = requests.slice(indexOfFirstItem, indexOfLastItem);

  // Get approval counts for filters
  const approvalCounts = allRequests.reduce((acc, request) => {
    const approvalCount = request.approval_summary?.approved_count || 0;
    acc.total = (acc.total || 0) + 1;

    if (approvalCount === 0) {
      acc.no_approvals = (acc.no_approvals || 0) + 1;
    } else if (approvalCount < 3) {
      acc.some_approvals = (acc.some_approvals || 0) + 1;
    } else {
      acc.ready_for_final = (acc.ready_for_final || 0) + 1;
    }

    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <Card>
          {/* Header */}
          <ReviewHeader />

          <CardContent>
            {/* Search Bar */}
            <ReviewSearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              approvalFilter={approvalFilter}
              setApprovalFilter={setApprovalFilter}
              deadlineFilter={deadlineFilter}
              setDeadlineFilter={setDeadlineFilter}
              totalRequests={requests.length}
              approvalCounts={approvalCounts}
              categoryOptions={CATEGORY_OPTIONS}
            />

            {/* Table */}
            <ReviewTable
              requests={currentRequests}
              isLoading={isLoading}
              sortField={sortField}
              sortDirection={sortDirection}
              handleSort={handleSort}
              onRequestClick={handleRequestClick}
              onApprove={handleApprove}
              onDeny={handleDeny}
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
        <ReviewDetailsModal
          request={selectedRequest}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedRequest(null);
          }}
          onApprove={handleApprove}
          onDeny={handleDeny}
          isLoading={isLoadingDetails}
        />
      )}

      {/* Review Action Modal */}
      {showActionModal && selectedRequest && actionType && (
        <ReviewActionModal
          request={selectedRequest}
          isOpen={showActionModal}
          onClose={() => {
            setShowActionModal(false);
            setSelectedRequest(null);
            setActionType(null);
          }}
          onSubmit={handleActionSubmit}
          actionType={actionType}
        />
      )}
    </div>
  );
};

export default UnderReviewRequestsPage;
