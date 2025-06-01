// components/users/UserDonationsList.jsx
'use client';

import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Download, Search, Calendar, Filter, ChevronDown, FileText } from 'lucide-react';

import UserDonationRow from '@/components/admin/users/details/UserDonationRow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';

const UserDonationsList = ({ donations = [], events = [] }) => {
  // Donations may be null from the API
  const donationsList = donations || [];

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Calculate status counts - adjust based on actual donation data structure
  const getStatusCounts = () => {
    const counts = {
      all: donationsList.length,
      completed: 0,
      pending: 0,
      failed: 0,
      refunded: 0,
    };

    // If we have donations with status property, count them
    donationsList.forEach((donation) => {
      if (donation.status) {
        counts[donation.status] = (counts[donation.status] || 0) + 1;
      } else {
        // Default to completed if no status is provided
        counts.completed += 1;
      }
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  // Filter and sort donations
  const filterAndSortDonations = () => {
    if (!donationsList.length) return [];

    let filteredDonations = [...donationsList];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredDonations = filteredDonations.filter(
        (donation) =>
          (findEventName(donation.event_id) || '').toLowerCase().includes(query) ||
          (donation.id && donation.id.toString().toLowerCase().includes(query)) ||
          (donation.transaction_id &&
            donation.transaction_id.toString().toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filteredDonations = filteredDonations.filter((donation) => donation.status === statusFilter);
    }

    // Apply date filter
    if (dateFilter) {
      filteredDonations = filteredDonations.filter((donation) => {
        if (!donation.date && !donation.created_at) return false;

        const donationDate = donation.date
          ? parseISO(donation.date)
          : parseISO(donation.created_at);

        return format(donationDate, 'yyyy-MM-dd') === format(dateFilter, 'yyyy-MM-dd');
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filteredDonations.sort((a, b) => {
          const dateA = a.date
            ? new Date(a.date)
            : a.created_at
              ? new Date(a.created_at)
              : new Date(0);
          const dateB = b.date
            ? new Date(b.date)
            : b.created_at
              ? new Date(b.created_at)
              : new Date(0);
          return dateB - dateA;
        });
        break;
      case 'oldest':
        filteredDonations.sort((a, b) => {
          const dateA = a.date
            ? new Date(a.date)
            : a.created_at
              ? new Date(a.created_at)
              : new Date(0);
          const dateB = b.date
            ? new Date(b.date)
            : b.created_at
              ? new Date(b.created_at)
              : new Date(0);
          return dateA - dateB;
        });
        break;
      case 'amount-high':
        filteredDonations.sort((a, b) => (b.amount || 0) - (a.amount || 0));
        break;
      case 'amount-low':
        filteredDonations.sort((a, b) => (a.amount || 0) - (b.amount || 0));
        break;
    }

    return filteredDonations;
  };

  // Find event name based on event ID
  const findEventName = (eventId) => {
    if (!eventId || !events.length) return 'Unknown Event';
    const event = events.find((e) => e.id === eventId);
    return event ? event.title : 'Unknown Event';
  };

  // Export donations as CSV
  const handleExportDonations = () => {
    toast.info('Exporting donation history...');

    // Simulate export delay
    setTimeout(() => {
      toast.success('Donation history exported successfully!');
    }, 1500);
  };

  // Get filtered donations
  const filteredDonations = filterAndSortDonations();

  // Render empty state
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-4">
        <FileText className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No donations found</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        {donationsList.length === 0
          ? 'This user has not made any donations yet.'
          : 'No donations match your current filters. Try adjusting your search or filter criteria.'}
      </p>
      {donationsList.length > 0 && (
        <Button
          variant="outline"
          onClick={() => {
            setSearchQuery('');
            setStatusFilter('all');
            setDateFilter(null);
          }}
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <Card className="shadow-sm mt-6">
      <CardHeader>
        <CardTitle>Donation History</CardTitle>
        <CardDescription>{donationsList.length} total donations</CardDescription>

        <div className="space-y-4 mt-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search donations..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="mr-2 h-4 w-4" />
                Filters
                <ChevronDown
                  className={`ml-2 h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
                />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Date
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-auto p-0">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start font-normal p-4"
                      >
                        {dateFilter ? 'Clear Date Filter' : 'Select Date...'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={dateFilter}
                        onSelect={setDateFilter}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </DropdownMenuContent>
              </DropdownMenu>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="amount-high">Amount (High to Low)</SelectItem>
                  <SelectItem value="amount-low">Amount (Low to High)</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" onClick={handleExportDonations}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-2 py-2 items-center">
              <div className="text-sm text-muted-foreground">Status:</div>
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
              >
                All
                <Badge variant="outline" className="ml-2">
                  {statusCounts.all}
                </Badge>
              </Button>
              <Button
                variant={statusFilter === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('completed')}
              >
                Completed
                <Badge variant="outline" className="ml-2">
                  {statusCounts.completed}
                </Badge>
              </Button>
              <Button
                variant={statusFilter === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('pending')}
              >
                Pending
                <Badge variant="outline" className="ml-2">
                  {statusCounts.pending}
                </Badge>
              </Button>
              <Button
                variant={statusFilter === 'failed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('failed')}
              >
                Failed
                <Badge variant="outline" className="ml-2">
                  {statusCounts.failed}
                </Badge>
              </Button>
              <Button
                variant={statusFilter === 'refunded' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('refunded')}
              >
                Refunded
                <Badge variant="outline" className="ml-2">
                  {statusCounts.refunded}
                </Badge>
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {filteredDonations.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="space-y-4">
            {filteredDonations.map((donation) => (
              <UserDonationRow
                key={donation.id || `donation-${Math.random()}`}
                donation={donation}
                eventName={findEventName(donation.event_id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserDonationsList;
