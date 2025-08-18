'use client';

import { useState } from 'react';
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
import { format } from 'date-fns';
import { Search } from 'lucide-react';

const EventDonationsTable = ({ donations = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter donations based on search term
  const filteredDonations = donations.filter((donation) => {
    const searchRegex = new RegExp(searchTerm, 'i');
    return (
      searchRegex.test(donation.user_name) ||
      searchRegex.test(donation.user_email) ||
      searchRegex.test(donation.notes || '') ||
      searchRegex.test(donation.status) ||
      searchRegex.test(donation.total_price?.toString())
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

  return (
    <>
      <CardHeader>
        <CardTitle>Donations</CardTitle>
        <CardDescription>
          {donations.length} donation{donations.length !== 1 ? 's' : ''} for this event
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Search bar */}
        {donations.length > 0 && (
          <div className="mb-4 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search by name, email, or status..."
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

        {/* Donations table */}
        {donations.length > 0 && (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Donor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentDonations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No donations match your search
                    </TableCell>
                  </TableRow>
                ) : (
                  currentDonations.map((donation, index) => (
                    <TableRow key={donation.id}>
                      <TableCell className="font-medium">{indexOfFirstItem + index + 1}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{donation.user_name}</div>
                          <div className="text-xs text-gray-500">{donation.user_email}</div>
                          {donation.user_phone_number && (
                            <div className="text-xs text-gray-500">
                              {donation.user_phone_number}
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
                      <TableCell>{formatDate(donation.donated_at)}</TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate">
                          {donation.notes || <span className="text-gray-400">No notes</span>}
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
      </CardContent>

      {/* Pagination */}
      {totalPages > 1 && (
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
