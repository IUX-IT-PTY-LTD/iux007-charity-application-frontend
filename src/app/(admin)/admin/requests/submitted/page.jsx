'use client';

import React, { useState, useEffect } from 'react';
import { useAdminContext } from '@/components/admin/layout/admin-context';

// Import UI components
import { Card, CardContent, CardFooter } from '@/components/ui/card';

// Import custom components
import RequestsHeader from '@/components/admin/requests/submitted/RequestsHeader';
import RequestsSearchBar from '@/components/admin/requests/submitted/RequestsSearchBar';
import RequestsTable from '@/components/admin/requests/submitted/RequestsTable';
import RequestsPagination from '@/components/admin/requests/submitted/RequestsPagination';
import RequestDetailsModal from '@/components/admin/requests/submitted/RequestDetailsModal';
import StatusChangeModal from '@/components/admin/requests/submitted/StatusChangeModal';

// Demo data - will be replaced with API calls
const DEMO_REQUESTS = [
  {
    id: 1,
    request_id: 'CR-2024-001',
    requester_name: 'John Smith',
    requester_email: 'john.smith@example.com',
    requester_phone: '+1-555-0123',
    organization_name: 'Hope Foundation',
    organization_type: 'Non-Profit',
    organization_address: '123 Main St, City, State 12345',
    request_purpose: 'Educational Support for Underprivileged Children',
    request_description:
      'We are seeking funding to provide educational materials and scholarships for underprivileged children in our community. This program will help them access quality education and break the cycle of poverty.',
    request_amount: 25000,
    request_category: 'Education',
    submission_date: '2024-08-20T10:30:00Z',
    current_status: 'submitted',
    attached_file: {
      name: 'education_support_documents.zip',
      size: '4.7 MB',
      url: '/files/education_support_documents.zip',
    },
    status_history: [
      {
        status: 'submitted',
        changed_by: 'System',
        changed_at: '2024-08-20T10:30:00Z',
        comment: 'Request submitted successfully',
      },
    ],
    deadline: null,
  },
  {
    id: 2,
    request_id: 'CR-2024-002',
    requester_name: 'Sarah Johnson',
    requester_email: 'sarah.j@healthcareorg.org',
    requester_phone: '+1-555-0456',
    organization_name: 'Community Health Initiative',
    organization_type: 'Healthcare NGO',
    organization_address: '456 Health Ave, Medical District, State 67890',
    request_purpose: 'Mobile Health Clinic for Rural Areas',
    request_description:
      'Requesting funds to establish a mobile health clinic that will serve remote rural communities. The clinic will provide basic healthcare services, vaccinations, and health education.',
    request_amount: 45000,
    request_category: 'Healthcare',
    submission_date: '2024-08-18T14:15:00Z',
    current_status: 'information_needed',
    attached_file: {
      name: 'mobile_clinic_proposal.zip',
      size: '8.3 MB',
      url: '/files/mobile_clinic_proposal.zip',
    },
    status_history: [
      {
        status: 'submitted',
        changed_by: 'System',
        changed_at: '2024-08-18T14:15:00Z',
        comment: 'Request submitted successfully',
      },
      {
        status: 'information_needed',
        changed_by: 'Dr. Michael Brown',
        changed_at: '2024-08-19T09:20:00Z',
        comment:
          'Please provide additional documentation regarding medical equipment specifications and vendor quotes.',
      },
    ],
    deadline: null,
  },
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
      'Implementation of water filtration systems in rural villages to provide clean drinking water. The project includes installation, maintenance training, and ongoing support.',
    request_amount: 35000,
    request_category: 'Environment',
    submission_date: '2024-08-15T11:45:00Z',
    current_status: 'technical_check_passed',
    attached_file: {
      name: 'water_initiative_documents.zip',
      size: '6.9 MB',
      url: '/files/water_initiative_documents.zip',
    },
    status_history: [
      {
        status: 'submitted',
        changed_by: 'System',
        changed_at: '2024-08-15T11:45:00Z',
        comment: 'Request submitted successfully',
      },
      {
        status: 'technical_check_passed',
        changed_by: 'Engineering Team Lead',
        changed_at: '2024-08-22T16:30:00Z',
        comment:
          'Technical review completed. All specifications meet requirements. Ready for approval process.',
      },
    ],
    deadline: '2024-09-05T23:59:59Z',
  },
  {
    id: 4,
    request_id: 'CR-2024-004',
    requester_name: 'Maria Rodriguez',
    requester_email: 'maria.rodriguez@email.com',
    requester_phone: '+1-555-0321',
    organization_name: null,
    organization_type: null,
    organization_address: null,
    request_purpose: 'Community Art Workshop for Youth',
    request_description:
      'Individual request to organize art workshops for local youth. This initiative aims to provide creative outlets and skill development opportunities for children in the neighborhood.',
    request_amount: 5000,
    request_category: 'Arts & Culture',
    submission_date: '2024-08-22T09:15:00Z',
    current_status: 'submitted',
    attached_file: {
      name: 'art_workshop_proposal.zip',
      size: '2.1 MB',
      url: '/files/art_workshop_proposal.zip',
    },
    status_history: [
      {
        status: 'submitted',
        changed_by: 'System',
        changed_at: '2024-08-22T09:15:00Z',
        comment: 'Request submitted successfully',
      },
    ],
    deadline: null,
  },
];

const STATUS_OPTIONS = [
  { value: 'submitted', label: 'Submitted', color: 'bg-blue-100 text-blue-800' },
  {
    value: 'information_needed',
    label: 'Information Needed',
    color: 'bg-yellow-100 text-yellow-800',
  },
  {
    value: 'technical_check_passed',
    label: 'Technical Check Passed',
    color: 'bg-green-100 text-green-800',
  },
  { value: 'under_review', label: 'Under Review', color: 'bg-purple-100 text-purple-800' },
  { value: 'approved', label: 'Approved', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'denied', label: 'Denied', color: 'bg-red-100 text-red-800' },
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

// Main Submitted Requests Page Component
const SubmittedRequestsPage = () => {
  const { setPageTitle, setPageSubtitle } = useAdminContext();

  // State management
  const [requests, setRequests] = useState(DEMO_REQUESTS);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortField, setSortField] = useState('submission_date');
  const [sortDirection, setSortDirection] = useState('desc');

  // Modal states
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Set page title
  useEffect(() => {
    setPageTitle('Charity Requests');
    setPageSubtitle('Review and manage submitted charity requests');
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

  // Handle status change initiation
  const handleStatusChange = (request) => {
    setSelectedRequest(request);
    setShowStatusModal(true);
  };

  // Handle status change submission
  const handleStatusChangeSubmit = (requestId, newStatus, comment, deadline = null) => {
    const updatedRequests = requests.map((request) => {
      if (request.id === requestId) {
        const updatedStatusHistory = [
          ...request.status_history,
          {
            status: newStatus,
            changed_by: 'Current Reviewer', // This will be replaced with actual user data
            changed_at: new Date().toISOString(),
            comment: comment,
          },
        ];

        return {
          ...request,
          current_status: newStatus,
          status_history: updatedStatusHistory,
          deadline: deadline || request.deadline,
        };
      }
      return request;
    });

    setRequests(updatedRequests);
    setShowStatusModal(false);
    setSelectedRequest(null);
  };

  // Filter and sort requests
  const filteredRequests = requests.filter((request) => {
    // Search filter
    const matchesSearch =
      !searchQuery ||
      request.request_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requester_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.organization_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.request_title.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus = statusFilter === 'all' || request.current_status === statusFilter;

    // Category filter
    const matchesCategory = categoryFilter === 'all' || request.request_category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    const modifier = sortDirection === 'asc' ? 1 : -1;

    if (sortField === 'submission_date') {
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

  // Get status counts for filters
  const statusCounts = requests.reduce((acc, request) => {
    acc[request.current_status] = (acc[request.current_status] || 0) + 1;
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
              totalRequests={sortedRequests.length}
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
        <RequestDetailsModal
          request={selectedRequest}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedRequest(null);
          }}
          onStatusChange={handleStatusChange}
          statusOptions={STATUS_OPTIONS}
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
