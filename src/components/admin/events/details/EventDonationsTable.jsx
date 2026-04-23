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
  const itemsPerPage = 10;

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
                  {isQurbaniEvent && <TableHead>Animal Type</TableHead>}
                  {isQurbaniEvent && <TableHead>Qurbani Location</TableHead>}
                  {isQurbaniEvent && <TableHead>Participants</TableHead>}
                  <TableHead>Date</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentDonations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isQurbaniEvent ? 9 : 6} className="text-center py-6">
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
                  {isQurbaniEvent && <TableHead>Animal Type</TableHead>}
                  {isQurbaniEvent && <TableHead>Qurbani Location</TableHead>}
                  {isQurbaniEvent && <TableHead>Participants</TableHead>}
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
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
                  </TableRow>
                ))}
                {donations.length > 3 && (
                  <TableRow>
                    <TableCell colSpan={isQurbaniEvent ? 8 : 5} className="text-center py-4 text-gray-500">
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
    </>
  );
};

export default EventDonationsTable;
