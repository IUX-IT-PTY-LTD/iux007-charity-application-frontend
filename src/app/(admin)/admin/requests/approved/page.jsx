'use client';

import React, { useState, useEffect } from 'react';
import { useAdminContext } from '@/components/admin/layout/admin-context';

// Import UI components
import { Card, CardContent, CardFooter } from '@/components/ui/card';

// Import custom components
import ApprovedHeader from '@/components/admin/requests/approved/ApprovedHeader';
import ApprovedSearchBar from '@/components/admin/requests/approved/ApprovedSearchBar';
import ApprovedTable from '@/components/admin/requests/approved/ApprovedTable';
import RequestsPagination from '@/components/admin/requests/submitted/RequestsPagination';
import ApprovedDetailsModal from '@/components/admin/requests/approved/ApprovedDetailsModal';
import ConnectEventModal from '@/components/admin/requests/approved/ConnectEventModal';

// Demo data - only approved requests
const DEMO_APPROVED_REQUESTS = [
  {
    id: 11,
    request_id: 'CR-2024-011',
    requester_name: 'Dr. Jennifer Martinez',
    requester_email: 'j.martinez@literacy4all.org',
    requester_phone: '+1-555-0444',
    organization_name: 'Literacy for All Foundation',
    organization_type: 'Educational Non-Profit',
    organization_address: '123 Reading Street, Book City, State 12345',
    request_purpose: 'Adult Literacy Program for Immigrants',
    request_description:
      'Comprehensive adult literacy program designed specifically for recent immigrants. Program includes English language classes, basic literacy skills, and citizenship preparation. Will serve 150 adults over 12 months.',
    request_amount: 45000,
    request_category: 'Education',
    submission_date: '2024-08-05T10:30:00Z',
    current_status: 'approved_final',
    connected_event_id: 'EVT-2024-015',
    attached_file: {
      name: 'adult_literacy_program_proposal.zip',
      size: '7.3 MB',
      url: '/files/adult_literacy_program_proposal.zip',
    },
  },
  {
    id: 12,
    request_id: 'CR-2024-012',
    requester_name: 'Robert Chen',
    requester_email: 'r.chen@communityhealth.org',
    requester_phone: '+1-555-0555',
    organization_name: 'Community Health Network',
    organization_type: 'Healthcare Non-Profit',
    organization_address: '456 Wellness Avenue, Health City, State 67890',
    request_purpose: 'Mobile Vaccination Clinic for Rural Areas',
    request_description:
      'Mobile vaccination clinic to provide COVID-19, flu, and routine immunizations to underserved rural communities. Clinic will visit 20 rural locations monthly, providing free vaccinations and health screenings.',
    request_amount: 62000,
    request_category: 'Healthcare',
    submission_date: '2024-08-07T14:15:00Z',
    current_status: 'approved_final',
    connected_event_id: null,
    attached_file: {
      name: 'mobile_vaccination_clinic_proposal.zip',
      size: '9.8 MB',
      url: '/files/mobile_vaccination_clinic_proposal.zip',
    },
  },
  {
    id: 13,
    request_id: 'CR-2024-013',
    requester_name: 'Maria Rodriguez',
    requester_email: 'maria.r@email.com',
    requester_phone: '+1-555-0666',
    organization_name: null,
    organization_type: null,
    organization_address: null,
    request_purpose: 'Community Garden and Food Security Initiative',
    request_description:
      'Individual initiative to establish a community garden that will provide fresh produce to local food banks and teach urban gardening skills to low-income families. Includes educational workshops and sustainable farming techniques.',
    request_amount: 18000,
    request_category: 'Community Development',
    submission_date: '2024-08-09T11:20:00Z',
    current_status: 'approved_final',
    connected_event_id: null,
    attached_file: {
      name: 'community_garden_initiative.zip',
      size: '4.2 MB',
      url: '/files/community_garden_initiative.zip',
    },
  },
  {
    id: 14,
    request_id: 'CR-2024-014',
    requester_name: 'Dr. Ahmed Hassan',
    requester_email: 'a.hassan@greentech.org',
    requester_phone: '+1-555-0777',
    organization_name: 'Green Technology Solutions',
    organization_type: 'Environmental NGO',
    organization_address: '789 Solar Drive, Clean City, State 11223',
    request_purpose: 'Solar Energy Training Program for Veterans',
    request_description:
      'Training program to provide veterans with solar panel installation and maintenance skills. Program includes certification preparation, job placement assistance, and tools for starting solar energy careers.',
    request_amount: 85000,
    request_category: 'Environment',
    submission_date: '2024-08-11T16:45:00Z',
    current_status: 'approved_final',
    connected_event_id: 'EVT-2024-023',
    attached_file: {
      name: 'solar_training_veterans_proposal.zip',
      size: '11.5 MB',
      url: '/files/solar_training_veterans_proposal.zip',
    },
  },
  {
    id: 15,
    request_id: 'CR-2024-015',
    requester_name: 'Lisa Thompson',
    requester_email: 'l.thompson@youtharts.org',
    requester_phone: '+1-555-0888',
    organization_name: 'Youth Arts Collective',
    organization_type: 'Arts Non-Profit',
    organization_address: '321 Creative Boulevard, Arts District, State 44556',
    request_purpose: 'After-School Arts Program for At-Risk Youth',
    request_description:
      'After-school arts program providing creative outlets for at-risk youth ages 12-17. Program includes visual arts, music, drama, and digital media classes. Includes mentorship and college/career guidance.',
    request_amount: 38000,
    request_category: 'Arts & Culture',
    submission_date: '2024-08-13T09:30:00Z',
    current_status: 'approved_final',
    connected_event_id: null,
    attached_file: {
      name: 'youth_arts_program_proposal.zip',
      size: '6.7 MB',
      url: '/files/youth_arts_program_proposal.zip',
    },
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

// Main Approved Requests Page Component
const ApprovedRequestsPage = () => {
  const { setPageTitle, setPageSubtitle } = useAdminContext();

  // State management
  const [requests, setRequests] = useState(DEMO_APPROVED_REQUESTS);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [eventConnectionFilter, setEventConnectionFilter] = useState('all');
  const [sortField, setSortField] = useState('submission_date');
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

  // Handle connect event action
  const handleConnectEvent = (request) => {
    setSelectedRequest(request);
    setShowConnectModal(true);
  };

  // Handle event connection submission
  const handleConnectSubmit = (requestId, eventId) => {
    const updatedRequests = requests.map((request) => {
      if (request.id === requestId) {
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
