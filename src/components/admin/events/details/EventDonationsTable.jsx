'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Search, Lock, DollarSign, Users, Calendar, TrendingUp, Eye, UserCheck } from 'lucide-react';

// Import permission hooks
import { useEventPermissions } from '@/api/hooks/useModulePermissions';

const EventDonationsTable = ({ donations = [], eventPermissions: passedPermissions, event }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const itemsPerPage = 10;

  // Donation Details popup component
  const DonationDetailsPopup = ({ donation, isOpen, onClose }) => {
    if (!donation) return null;

    const formatDate = (dateString) => {
      try {
        return format(new Date(dateString), 'PPP p');
      } catch (error) {
        return dateString || 'N/A';
      }
    };

    const getStatusColor = (status) => {
      switch (status?.toLowerCase()) {
        case 'completed': return 'text-green-700 bg-green-50 border-green-200';
        case 'pending': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
        case 'failed': return 'text-red-700 bg-red-50 border-red-200';
        case 'cancelled': return 'text-gray-700 bg-gray-50 border-gray-200';
        default: return 'text-gray-700 bg-gray-50 border-gray-200';
      }
    };

    const getAnimalIcon = (animalType) => {
      switch(animalType?.toLowerCase()) {
        case 'cow': return '🐄';
        case 'goat': return '🐐';
        case 'lamb': return '🐑';
        default: return '';
      }
    };

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <Eye className="h-5 w-5" />
              </div>
              Donation Details
            </DialogTitle>
            <DialogDescription>
              Complete information for donation #{donation.id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Donor Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <span className="text-xl">👤</span>
                  Donor Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-blue-700">Full Name</label>
                    <p className="text-sm font-semibold text-blue-900">{donation.user_name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-blue-700">Email</label>
                    <p className="text-sm text-blue-900">{donation.user_email || 'N/A'}</p>
                  </div>
                  {donation.user_phone_number && (
                    <div>
                      <label className="text-sm font-medium text-blue-700">Phone</label>
                      <p className="text-sm text-blue-900">{donation.user_phone_number}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Information */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <span className="text-xl">💰</span>
                  Financial Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-green-700">Total Amount</label>
                    <p className="text-lg font-bold text-green-900">${donation.total_price}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-green-700">Admin Contribution</label>
                    <p className="text-sm font-semibold text-green-900">
                      ${donation.admin_contribution_amount ? Number(donation.admin_contribution_amount).toFixed(2) : '0.00'}
                    </p>
                  </div>
                  {donation.quantity && (
                    <div>
                      <label className="text-sm font-medium text-green-700">Quantity & Price</label>
                      <p className="text-sm text-green-900">
                        {donation.quantity} × ${donation.per_unit_price} = ${donation.total_price}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Qurbani Information - Only show if it's a Qurbani event */}
            {event?.is_qurbani_donation === 1 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-amber-800 mb-3 flex items-center gap-2">
                  <span className="text-xl">🕌</span>
                  Qurbani Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {donation.animal_type && (
                    <div>
                      <label className="text-sm font-medium text-amber-700">Animal Type</label>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getAnimalIcon(donation.animal_type)}</span>
                        <p className="text-sm font-semibold text-amber-900 capitalize">{donation.animal_type}</p>
                      </div>
                    </div>
                  )}
                  {donation.qurbani_location && (
                    <div>
                      <label className="text-sm font-medium text-amber-700">Qurbani Location</label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{donation.qurbani_location === 'australia' ? '🇦🇺' : '🌍'}</span>
                        <p className="text-sm font-semibold text-amber-900 capitalize">
                          {donation.qurbani_location === 'australia' ? 'Australia' : 'Overseas'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Qurbani Participants */}
                {donation.qurbani_participants && donation.qurbani_participants.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-amber-700 mb-2 block">
                      Participants ({donation.qurbani_participants.length})
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {donation.qurbani_participants.map((participant, index) => (
                        <div key={index} className="bg-white border border-amber-200 rounded-lg p-3">
                          <div className="font-medium text-amber-900 mb-2">Participant {index + 1}</div>
                          <div className="text-xs space-y-1 text-amber-800">
                            <div><strong>Name:</strong> {participant.participant_name || 'N/A'}</div>
                            <div><strong>Address:</strong> {participant.address || 'N/A'}</div>
                            {participant.qurbani_day && (
                              <div className="bg-amber-100 px-2 py-1 rounded mt-2">
                                <strong>Qurbani Day:</strong> {participant.qurbani_day}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Status and Date Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-xl">📅</span>
                  Timeline
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Donation Date</label>
                    <p className="text-sm text-gray-900">{formatDate(donation.donated_at)}</p>
                  </div>
                  {donation.created_at && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Created</label>
                      <p className="text-sm text-gray-900">{formatDate(donation.created_at)}</p>
                    </div>
                  )}
                  {donation.updated_at && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Last Updated</label>
                      <p className="text-sm text-gray-900">{formatDate(donation.updated_at)}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-xl">📋</span>
                  Status & Notes
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <div className={`inline-block px-3 py-1 rounded-lg text-sm font-medium border ${getStatusColor(donation.status)}`}>
                      {donation.status || 'Unknown'}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Notes</label>
                    <p className="text-sm text-gray-900 bg-white p-2 rounded border min-h-[60px]">
                      {donation.notes || 'No notes available'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Participants popup component
  const ParticipantsPopup = ({ participants, animalType }) => {
    if (!participants || participants.length === 0) {
      return null;
    }

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <Eye className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Qurbani Participants ({participants.length})
            </DialogTitle>
            <DialogDescription>
              List of participants for this {animalType} Qurbani donation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {participants.map((participant, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    Participant {index + 1}
                  </h4>
                </div>
                
                {/* Highlighted Qurbani Day Section */}
                {participant.qurbani_day && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🕌</span>
                      <label className="text-sm font-semibold text-amber-800">Qurbani Day Preference</label>
                    </div>
                    <p className="text-sm font-medium text-amber-900 bg-amber-100 px-3 py-1 rounded-md inline-block">
                      {participant.qurbani_day}
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <span className="text-blue-600">👤</span>
                      Full Name
                    </label>
                    <p className="text-sm text-gray-900 font-medium">{participant.participant_name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <span className="text-green-600">🏠</span>
                      Address
                    </label>
                    <p className="text-sm text-gray-900">{participant.address || 'N/A'}</p>
                  </div>
                  
                  {participant.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <span className="text-orange-600">📞</span>
                        Phone
                      </label>
                      <p className="text-sm text-gray-900">{participant.phone}</p>
                    </div>
                  )}
                  {participant.email && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <span className="text-cyan-600">📧</span>
                        Email
                      </label>
                      <p className="text-sm text-gray-900">{participant.email}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Use passed permissions if available, otherwise use hook
  const hookPermissions = useEventPermissions();
  const eventPermissions = passedPermissions || hookPermissions;

  // Check if this is a Qurbani event
  const isQurbaniEvent = event?.is_qurbani_donation === 1;

  // Filter donations based on search term
  const filteredDonations = donations.filter((donation) => {
    const searchRegex = new RegExp(searchTerm, 'i');
    return (
      searchRegex.test(donation.user_name) ||
      searchRegex.test(donation.user_email) ||
      searchRegex.test(donation.notes || '') ||
      searchRegex.test(donation.status) ||
      searchRegex.test(donation.total_price?.toString()) ||
      (donation.animal_type && searchRegex.test(donation.animal_type))
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDonations = filteredDonations.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return dateString || 'N/A';
    }
  };

  // Get status badge variant
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status || 'Unknown'}</Badge>;
    }
  };

  // Mask sensitive data based on permissions
  const maskSensitiveData = (data, type) => {
    if (!eventPermissions.canView) {
      switch (type) {
        case 'email':
          return '***@***.***';
        case 'phone':
          return '***-***-****';
        case 'name':
          return '***';
        default:
          return '***';
      }
    }
    return data;
  };

  // Calculate donation statistics
  const calculateStats = () => {
    if (!donations || donations.length === 0) {
      return {
        totalAmount: 0,
        totalDonations: 0,
        uniqueDonors: 0,
        averageDonation: 0,
      };
    }

    // Calculate total amount from all donations
    const totalAmount = donations.reduce((sum, donation) => {
      const amount = donation.total_price || 0;
      return sum + Number(amount);
    }, 0);

    // Count unique donors based on email/name
    const uniqueDonorEmails = new Set();
    donations.forEach((donation) => {
      const identifier = donation.user_email || donation.user_name;
      if (identifier && identifier.trim()) {
        uniqueDonorEmails.add(identifier.trim().toLowerCase());
      }
    });

    const averageDonation = donations.length > 0 ? totalAmount / donations.length : 0;

    return {
      totalAmount,
      totalDonations: donations.length,
      uniqueDonors: uniqueDonorEmails.size,
      averageDonation,
    };
  };

  const stats = calculateStats();

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  // Get animal icon for Qurbani donations
  const getAnimalIcon = (animalType) => {
    switch(animalType?.toLowerCase()) {
      case 'cow': return '🐄';
      case 'goat': return '🐐';
      case 'lamb': return '🐑';
      default: return '';
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Donations</CardTitle>
        <CardDescription>
          {donations.length} donation{donations.length !== 1 ? 's' : ''} for this event
          {!eventPermissions.canView && (
            <span className="text-orange-600 ml-2">(Limited access)</span>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Statistics Cards - Only show if user has view permission and there are donations */}
        {eventPermissions.canView && donations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Total Amount</p>
                  <p className="text-2xl font-bold text-green-900">
                    {formatCurrency(stats.totalAmount)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Donations</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.totalDonations}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Unique Donors</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.uniqueDonors}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Average Donation</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {formatCurrency(stats.averageDonation)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        )}

        {/* Show permission warning if user doesn't have view permission */}
        {!eventPermissions.isLoading && !eventPermissions.canView && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-2 mb-4">
            <Lock className="h-4 w-4 text-orange-600" />
            <p className="text-sm text-orange-600">
              You don't have permission to view donation details. Data is masked.
            </p>
          </div>
        )}


        {/* Search bar */}
        {donations.length > 0 && eventPermissions.canView && (
          <div className="mb-4 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder={isQurbaniEvent ? "Search by name, email, status, or animal type..." : "Search by name, email, or status..."}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>
        )}

        {/* No donations message */}
        {donations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No donations found for this event</p>
          </div>
        )}

        {/* Permission denied message */}
        {!eventPermissions.canView && donations.length > 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Lock className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              You don't have permission to view donation details
            </p>
          </div>
        )}

        {/* Donations table */}
        {donations.length > 0 && eventPermissions.canView && (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Donor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Admin Contribution</TableHead>
                  {isQurbaniEvent && <TableHead>Animal Type</TableHead>}
                  {isQurbaniEvent && <TableHead>Qurbani Location</TableHead>}
                  {isQurbaniEvent && <TableHead>Participants</TableHead>}
                  <TableHead>Date</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentDonations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isQurbaniEvent ? 11 : 8} className="text-center py-6">
                      No donations match your search
                    </TableCell>
                  </TableRow>
                ) : (
                  currentDonations.map((donation, index) => (
                    <TableRow key={donation.id}>
                      <TableCell className="font-medium">{indexOfFirstItem + index + 1}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {maskSensitiveData(donation.user_name, 'name')}
                          </div>
                          <div className="text-xs text-gray-500">
                            {maskSensitiveData(donation.user_email, 'email')}
                          </div>
                          {donation.user_phone_number && (
                            <div className="text-xs text-gray-500">
                              {maskSensitiveData(donation.user_phone_number, 'phone')}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">${donation.total_price}</div>
                        {donation.quantity && (
                          <div className="text-xs text-gray-500">
                            {donation.quantity} × ${donation.per_unit_price}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {donation.admin_contribution_amount && Number(donation.admin_contribution_amount) > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="text-green-600 text-sm">🏛️</span>
                            <div>
                              <div className="font-medium text-green-700">${Number(donation.admin_contribution_amount).toFixed(2)}</div>
                              <div className="text-xs text-green-600">Admin added</div>
                            </div>
                          </div>
                        ) : (
                          <div className="font-medium text-gray-600">
                            ${donation.admin_contribution_amount ? Number(donation.admin_contribution_amount).toFixed(2) : '0.00'}
                          </div>
                        )}
                      </TableCell>
                      {isQurbaniEvent && (
                        <TableCell>
                          {donation.animal_type ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{getAnimalIcon(donation.animal_type)}</span>
                              <span className="capitalize font-medium">{donation.animal_type}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                      )}
                      {isQurbaniEvent && (
                        <TableCell>
                          {donation.qurbani_location ? (
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{donation.qurbani_location === 'australia' ? '🇦🇺' : '🌍'}</span>
                              <span className="capitalize font-medium">
                                {donation.qurbani_location === 'australia' ? 'Australia' : 'Overseas'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                      )}
                      {isQurbaniEvent && (
                        <TableCell>
                          {donation.qurbani_participants && donation.qurbani_participants.length > 0 ? (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">
                                {donation.qurbani_participants.length} participant{donation.qurbani_participants.length > 1 ? 's' : ''}
                              </span>
                              <ParticipantsPopup 
                                participants={donation.qurbani_participants} 
                                animalType={donation.animal_type}
                              />
                            </div>
                          ) : (
                            <span className="text-gray-400">No participants</span>
                          )}
                        </TableCell>
                      )}
                      <TableCell>{formatDate(donation.donated_at)}</TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate">
                          {donation.notes ? (
                            maskSensitiveData(donation.notes, 'notes')
                          ) : (
                            <span className="text-gray-400">No notes</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(donation.status)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => setSelectedDonation(donation)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Show limited table for users without view permission */}
        {donations.length > 0 && !eventPermissions.canView && (
          <div className="border rounded-md opacity-50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Donor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Admin Contribution</TableHead>
                  {isQurbaniEvent && <TableHead>Animal Type</TableHead>}
                  {isQurbaniEvent && <TableHead>Qurbani Location</TableHead>}
                  {isQurbaniEvent && <TableHead>Participants</TableHead>}
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.slice(0, 3).map((donation, index) => (
                  <TableRow key={donation.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">***</div>
                        <div className="text-xs text-gray-500">***@***.***</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">$***</div>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-400">***</span>
                    </TableCell>
                    {isQurbaniEvent && (
                      <TableCell>
                        <span className="text-gray-400">***</span>
                      </TableCell>
                    )}
                    {isQurbaniEvent && (
                      <TableCell>
                        <span className="text-gray-400">***</span>
                      </TableCell>
                    )}
                    {isQurbaniEvent && (
                      <TableCell>
                        <span className="text-gray-400">***</span>
                      </TableCell>
                    )}
                    <TableCell>***</TableCell>
                    <TableCell>
                      <Badge className="bg-gray-100 text-gray-800">***</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {donations.length > 3 && (
                  <TableRow>
                    <TableCell colSpan={isQurbaniEvent ? 10 : 7} className="text-center py-4 text-gray-500">
                      ... and {donations.length - 3} more donations
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Pagination - only show if user can view and has searchable data */}
      {totalPages > 1 && eventPermissions.canView && (
        <CardFooter className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredDonations.length)}{' '}
            of {filteredDonations.length} donations
          </div>

          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            {/* Page numbers */}
            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const startPage = Math.max(1, currentPage - 2);
                const endPage = Math.min(totalPages, startPage + 4);
                const adjustedStartPage = Math.max(1, endPage - 4);
                const pageNumber = adjustedStartPage + i;

                if (pageNumber <= totalPages) {
                  return (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(pageNumber)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNumber}
                    </Button>
                  );
                }
                return null;
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      )}

      {/* Donation Details Popup */}
      <DonationDetailsPopup
        donation={selectedDonation}
        isOpen={!!selectedDonation}
        onClose={() => setSelectedDonation(null)}
      />
    </>
  );
};

export default EventDonationsTable;
