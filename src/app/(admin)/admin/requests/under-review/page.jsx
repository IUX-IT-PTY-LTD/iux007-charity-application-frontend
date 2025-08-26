'use client';

import React, { useState, useEffect } from 'react';
import { useAdminContext } from '@/components/admin/layout/admin-context';

// Import UI components
import { Card, CardContent, CardFooter } from '@/components/ui/card';

// Import custom components
import ReviewHeader from '@/components/admin/requests/under-review/ReviewHeader';
import ReviewSearchBar from '@/components/admin/requests/under-review/ReviewSearchBar';
import ReviewTable from '@/components/admin/requests/under-review/ReviewTable';
import RequestsPagination from '@/components/admin/requests/submitted/RequestsPagination';
import ReviewDetailsModal from '@/components/admin/requests/under-review/ReviewDetailsModal';
import ReviewActionModal from '@/components/admin/requests/under-review/ReviewActionModal';

// Demo data - will be replaced with API calls
const DEMO_REVIEW_REQUESTS = [
  {
    id: 3,
    request_id: 'CR-2024-003',
    requester_name: 'Ahmed Hassan',
    requester_email: 'ahmed.h@environmentfund.org',
    requester_phone: '+1-555-0789',
    organization_name: 'Green Earth Foundation',
    organization_type: 'Environmental NGO',
    organization_address: '789 Eco Street, Green Valley, State 11223',
    request_purpose: 'Clean Water Initiative',
    request_description:
      'Implementation of water filtration systems in rural villages to provide clean drinking water. The project includes installation, maintenance training, and ongoing support for 5 villages affecting over 2000 residents.',
    request_amount: 35000,
    request_category: 'Environment',
    submission_date: '2025-08-15T11:45:00Z',
    current_status: 'under_review',
    attached_file: {
      name: 'water_initiative_documents.zip',
      size: '6.9 MB',
      url: '/files/water_initiative_documents.zip',
    },
    deadline: '2025-09-05T23:59:59Z',
    approvals: [
      {
        reviewer_id: 'reviewer_1',
        reviewer_name: 'Dr. Sarah Williams',
        reviewed_at: '2025-08-23T10:30:00Z',
        comment:
          'Excellent project with clear community impact. All documentation is comprehensive and the budget breakdown is reasonable.',
      },
      {
        reviewer_id: 'reviewer_2',
        reviewer_name: 'Mark Johnson',
        reviewed_at: '2025-08-24T14:15:00Z',
        comment:
          'Strong technical approach and sustainable long-term planning. The training component ensures community ownership.',
      },
    ],
    denials: [],
    status_history: [
      {
        status: 'submitted',
        changed_by: 'System',
        changed_at: '2025-08-15T11:45:00Z',
        comment: 'Request submitted successfully',
      },
      {
        status: 'technical_check_passed',
        changed_by: 'Engineering Team Lead',
        changed_at: '2025-08-22T16:30:00Z',
        comment:
          'Technical review completed. All specifications meet requirements. Ready for approval process.',
      },
      {
        status: 'under_review',
        changed_by: 'System',
        changed_at: '2025-08-22T16:30:00Z',
        comment: 'Request moved to approval process with deadline set.',
      },
    ],
  },
  {
    id: 5,
    request_id: 'CR-2024-005',
    requester_name: 'Jennifer Liu',
    requester_email: 'j.liu@techforeducation.org',
    requester_phone: '+1-555-0654',
    organization_name: 'Tech for Education',
    organization_type: 'Educational NGO',
    organization_address: '321 Innovation Ave, Tech City, State 54321',
    request_purpose: 'Digital Literacy Program for Seniors',
    request_description:
      'Comprehensive digital literacy program targeting seniors aged 65+ in underserved communities. Program includes basic computer skills, internet safety, and digital communication training.',
    request_amount: 28000,
    request_category: 'Education',
    submission_date: '2025-08-19T09:20:00Z',
    current_status: 'under_review',
    attached_file: {
      name: 'digital_literacy_proposal.zip',
      size: '5.2 MB',
      url: '/files/digital_literacy_proposal.zip',
    },
    deadline: '2025-09-10T23:59:59Z',
    approvals: [],
    denials: [
      {
        reviewer_id: 'reviewer_3',
        reviewer_name: 'Dr. Michael Chen',
        reviewed_at: '2025-08-25T11:45:00Z',
        comment:
          'While the program concept is good, the budget allocation seems unclear and the timeline appears too ambitious for the scope.',
      },
    ],
    status_history: [
      {
        status: 'submitted',
        changed_by: 'System',
        changed_at: '2025-08-19T09:20:00Z',
        comment: 'Request submitted successfully',
      },
      {
        status: 'technical_check_passed',
        changed_by: 'Technical Reviewer',
        changed_at: '2025-08-23T13:15:00Z',
        comment: 'Technical requirements met. Program structure is sound.',
      },
      {
        status: 'under_review',
        changed_by: 'System',
        changed_at: '2025-08-23T13:15:00Z',
        comment: 'Request moved to approval process.',
      },
    ],
  },
  {
    id: 6,
    request_id: 'CR-2024-006',
    requester_name: 'Dr. Elena Rodriguez',
    requester_email: 'e.rodriguez@healthcareaccess.org',
    requester_phone: '+1-555-0987',
    organization_name: 'Healthcare Access Initiative',
    organization_type: 'Medical NGO',
    organization_address: '456 Medical Center Dr, Healthcare District, State 98765',
    request_purpose: 'Mobile Mental Health Crisis Response Team',
    request_description:
      'Establishing a mobile crisis response team to provide immediate mental health support in underserved rural areas. The team will include licensed counselors and peer support specialists.',
    request_amount: 52000,
    request_category: 'Healthcare',
    submission_date: '2024-08-21T15:30:00Z',
    current_status: 'under_review',
    attached_file: {
      name: 'mental_health_crisis_response.zip',
      size: '8.7 MB',
      url: '/files/mental_health_crisis_response.zip',
    },
    deadline: '2024-08-30T23:59:59Z', // Overdue deadline
    approvals: [
      {
        reviewer_id: 'reviewer_4',
        reviewer_name: 'Dr. Amanda Foster',
        reviewed_at: '2024-08-26T09:00:00Z',
        comment:
          'Critical need in rural communities. The staffing plan is appropriate and the response protocols are well-defined.',
      },
      {
        reviewer_id: 'reviewer_5',
        reviewer_name: 'James Parker',
        reviewed_at: '2024-08-26T16:20:00Z',
        comment:
          'Strong evidence-based approach with clear metrics for success. Budget justification is thorough.',
      },
      {
        reviewer_id: 'reviewer_6',
        reviewer_name: 'Dr. Lisa Thompson',
        reviewed_at: '2024-08-27T10:30:00Z',
        comment:
          'Excellent collaboration plan with existing services. This fills a critical gap in mental health infrastructure.',
      },
    ],
    denials: [],
    status_history: [
      {
        status: 'submitted',
        changed_by: 'System',
        changed_at: '2024-08-21T15:30:00Z',
        comment: 'Request submitted successfully',
      },
      {
        status: 'technical_check_passed',
        changed_by: 'Healthcare Review Board',
        changed_at: '2024-08-25T11:00:00Z',
        comment: 'Medical protocols reviewed and approved. Licensing requirements verified.',
      },
      {
        status: 'under_review',
        changed_by: 'System',
        changed_at: '2024-08-25T11:00:00Z',
        comment: 'Request moved to approval process.',
      },
    ],
  },
  {
    id: 7,
    request_id: 'CR-2024-007',
    requester_name: 'Carlos Martinez',
    requester_email: 'carlos.m@email.com',
    requester_phone: '+1-555-0321',
    organization_name: null,
    organization_type: null,
    organization_address: null,
    request_purpose: 'Community Garden and Food Distribution',
    request_description:
      'Individual initiative to create a community garden that will provide fresh produce to local food banks and low-income families. Includes educational workshops on sustainable gardening.',
    request_amount: 8500,
    request_category: 'Community Development',
    submission_date: '2024-08-20T12:45:00Z',
    current_status: 'under_review',
    attached_file: {
      name: 'community_garden_proposal.zip',
      size: '3.4 MB',
      url: '/files/community_garden_proposal.zip',
    },
    deadline: '2024-09-02T23:59:59Z', // Due soon
    approvals: [
      {
        reviewer_id: 'reviewer_7',
        reviewer_name: 'Maria Gonzalez',
        reviewed_at: '2024-08-24T14:30:00Z',
        comment:
          'Great grassroots initiative with clear community benefit. The sustainability plan is well thought out.',
      },
    ],
    denials: [],
    status_history: [
      {
        status: 'submitted',
        changed_by: 'System',
        changed_at: '2024-08-20T12:45:00Z',
        comment: 'Request submitted successfully',
      },
      {
        status: 'technical_check_passed',
        changed_by: 'Community Programs Coordinator',
        changed_at: '2024-08-23T16:45:00Z',
        comment: 'Community impact assessment completed. Project plan is feasible.',
      },
      {
        status: 'under_review',
        changed_by: 'System',
        changed_at: '2024-08-23T16:45:00Z',
        comment: 'Request moved to approval process.',
      },
    ],
  },
];

const CATEGORY_OPTIONS = [
  'Education',
  'Healthcare',
  'Environment',
  'Community Development',
  'Emergency Relief',
  'Technology',
  'Arts & Culture',
  'Sports & Recreation',
];

// Main Under Review Requests Page Component
const UnderReviewRequestsPage = () => {
  const { setPageTitle, setPageSubtitle } = useAdminContext();

  // State management
  const [requests, setRequests] = useState(DEMO_REVIEW_REQUESTS);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [approvalFilter, setApprovalFilter] = useState('all');
  const [deadlineFilter, setDeadlineFilter] = useState('all');
  const [sortField, setSortField] = useState('deadline');
  const [sortDirection, setSortDirection] = useState('asc');

  // Modal states
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(null); // 'approve' or 'deny'

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Set page title
  useEffect(() => {
    setPageTitle('Under Review Requests');
    setPageSubtitle('Review and approve charity requests in the approval process');
  }, [setPageTitle, setPageSubtitle]);

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle request selection
  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  // Handle approve action
  const handleApprove = (request) => {
    setSelectedRequest(request);
    setActionType('approve');
    setShowActionModal(true);
  };

  // Handle deny action
  const handleDeny = (request) => {
    setSelectedRequest(request);
    setActionType('deny');
    setShowActionModal(true);
  };

  // Handle action submission (approve/deny)
  const handleActionSubmit = (requestId, action, comment) => {
    const updatedRequests = requests.map((request) => {
      if (request.id === requestId) {
        const newAction = {
          reviewer_id: 'current_user',
          reviewer_name: 'Current Reviewer', // This will be replaced with actual user data
          reviewed_at: new Date().toISOString(),
          comment: comment,
        };

        const updatedRequest = { ...request };

        if (action === 'approve') {
          updatedRequest.approvals = [...request.approvals, newAction];
        } else {
          updatedRequest.denials = [...(request.denials || []), newAction];
        }

        // Add to status history
        updatedRequest.status_history = [
          ...request.status_history,
          {
            status: action === 'approve' ? 'approved_by_reviewer' : 'denied_by_reviewer',
            changed_by: 'Current Reviewer',
            changed_at: new Date().toISOString(),
            comment: `Request ${action}d: ${comment}`,
          },
        ];

        return updatedRequest;
      }
      return request;
    });

    setRequests(updatedRequests);
    setShowActionModal(false);
    setSelectedRequest(null);
    setActionType(null);
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

    // Approval filter
    const matchesApproval = (() => {
      const approvalCount = request.approvals.length;
      switch (approvalFilter) {
        case 'no_approvals':
          return approvalCount === 0;
        case 'some_approvals':
          return approvalCount > 0 && approvalCount < 3;
        case 'ready_for_final':
          return approvalCount >= 3;
        default:
          return true;
      }
    })();

    // Deadline filter
    const matchesDeadline = (() => {
      if (deadlineFilter === 'all') return true;

      const deadlineDate = new Date(request.deadline);
      const now = new Date();
      const daysUntilDeadline = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));

      switch (deadlineFilter) {
        case 'overdue':
          return daysUntilDeadline < 0;
        case 'due_soon':
          return daysUntilDeadline >= 0 && daysUntilDeadline <= 3;
        case 'due_later':
          return daysUntilDeadline > 3;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesCategory && matchesApproval && matchesDeadline;
  });

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    const modifier = sortDirection === 'asc' ? 1 : -1;

    if (sortField === 'deadline') {
      return (new Date(a.deadline) - new Date(b.deadline)) * modifier;
    } else if (sortField === 'submission_date') {
      return (new Date(a.submission_date) - new Date(b.submission_date)) * modifier;
    } else if (sortField === 'request_amount') {
      return (a.request_amount - b.request_amount) * modifier;
    } else if (sortField === 'approval_count') {
      return (a.approvals.length - b.approvals.length) * modifier;
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

  // Get approval counts for filters
  const approvalCounts = requests.reduce((acc, request) => {
    const approvalCount = request.approvals.length;
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
              totalRequests={sortedRequests.length}
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
        <ReviewDetailsModal
          request={selectedRequest}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedRequest(null);
          }}
          onApprove={handleApprove}
          onDeny={handleDeny}
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
