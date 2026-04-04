'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, Hash, DollarSign, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { donationService } from '@/api/services/admin/donationService';
import { toast } from 'sonner';

const BankTransferDonationsTable = ({ eventId, refreshTrigger = 0 }) => {
  const [bankTransferDonations, setBankTransferDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalTransactions: 0,
    totalRecords: 0,
  });

  // Ensure client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch bank transfer donations
  useEffect(() => {
    const fetchBankTransferDonations = async () => {
      if (!eventId) return;
      
      setIsLoading(true);
      setApiError(null);
      try {
        const response = await donationService.getBankTransferDonations(eventId);
        
        if (response.status === 'success' && response.data) {
          const donations = Array.isArray(response.data) ? response.data : [response.data];
          setBankTransferDonations(donations);
          
          // Calculate stats
          const totalAmount = donations.reduce((sum, donation) => sum + Number(donation.total_amount || 0), 0);
          const totalTransactions = donations.reduce((sum, donation) => sum + Number(donation.transaction_count || 0), 0);
          
          setStats({
            totalAmount,
            totalTransactions,
            totalRecords: donations.length,
          });
        } else {
          setBankTransferDonations([]);
          setStats({ totalAmount: 0, totalTransactions: 0, totalRecords: 0 });
        }
      } catch (error) {
        console.error('Error fetching bank transfer donations:', error);
        setBankTransferDonations([]);
        setStats({ totalAmount: 0, totalTransactions: 0, totalRecords: 0 });
        
        // Handle different error scenarios
        if (error.response?.status === 404) {
          // API endpoint not found - this is expected if backend doesn't have this endpoint yet
          console.log('Bank transfer donations API endpoint not available (404)');
          setApiError('endpoint_not_found');
        } else if (error.message?.includes('404')) {
          // String-based 404 check
          console.log('Bank transfer donations endpoint not found');
          setApiError('endpoint_not_found');
        } else {
          // Other errors should be shown to user
          setApiError('general_error');
          toast.error('Failed to load bank transfer donations');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBankTransferDonations();
  }, [eventId, refreshTrigger]);

  // Format date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return dateString || 'N/A';
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Bank Transfer Donations
        </CardTitle>
        <CardDescription>
          Track and manage donations made via bank transfer
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Amount</p>
                <p className="text-2xl font-bold text-blue-900">
                  {formatCurrency(stats.totalAmount)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Transactions</p>
                <p className="text-2xl font-bold text-green-900">{stats.totalTransactions}</p>
              </div>
              <Hash className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Records</p>
                <p className="text-2xl font-bold text-purple-900">{stats.totalRecords}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500 mb-2" />
            <p className="text-muted-foreground">Loading bank transfer donations...</p>
          </div>
        )}

        {/* API Not Available State */}
        {!isLoading && apiError === 'endpoint_not_found' && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-6 mb-4">
              <CreditCard className="h-12 w-12 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Bank Transfer API Not Available</h3>
            <p className="text-muted-foreground text-center max-w-md">
              The bank transfer donations API endpoint is not yet available on the backend.
              You can still use the "Add Bank Transfer" button to submit donations, 
              but viewing existing donations requires the API to be implemented.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && bankTransferDonations.length === 0 && apiError !== 'endpoint_not_found' && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-4">
              <CreditCard className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Bank Transfer Donations</h3>
            <p className="text-muted-foreground text-center max-w-md">
              No bank transfer donations have been recorded for this event yet. 
              Use the "Add Bank Transfer" button to record donations made via bank transfer.
            </p>
          </div>
        )}

        {/* Bank Transfer Donations Table */}
        {!isLoading && bankTransferDonations.length > 0 && (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bankTransferDonations.map((donation, index) => (
                  <TableRow key={donation.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="font-medium text-green-600">
                        {formatCurrency(donation.total_amount)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Hash className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{donation.transaction_count}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {formatDate(donation.created_at)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate">
                        {donation.notes ? (
                          <span className="text-sm text-gray-700">{donation.notes}</span>
                        ) : (
                          <span className="text-gray-400 text-sm italic">No notes</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">
                        Recorded
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BankTransferDonationsTable;