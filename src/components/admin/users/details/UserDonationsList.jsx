// components/admin/users/details/UserDonationsList.jsx
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
  DropdownMenuTrigger,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const UserDonationsList = ({ donations = [] }) => {
  // Donations may be null from the API
  const donationsList = donations || [];

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort donations
  const filterAndSortDonations = () => {
    if (!donationsList.length) return [];

    let filteredDonations = [...donationsList];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredDonations = filteredDonations.filter(
        (donation) =>
          (donation.event?.title || '').toLowerCase().includes(query) ||
          (donation.id && donation.id.toString().toLowerCase().includes(query))
      );
    }

    // Apply date filter
    if (dateFilter) {
      filteredDonations = filteredDonations.filter((donation) => {
        if (!donation.donated_at) return false;
        const donationDate = parseISO(donation.donated_at);
        return format(donationDate, 'yyyy-MM-dd') === format(dateFilter, 'yyyy-MM-dd');
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filteredDonations.sort((a, b) => {
          const dateA = a.donated_at ? new Date(a.donated_at) : new Date(0);
          const dateB = b.donated_at ? new Date(b.donated_at) : new Date(0);
          return dateB - dateA;
        });
        break;
      case 'oldest':
        filteredDonations.sort((a, b) => {
          const dateA = a.donated_at ? new Date(a.donated_at) : new Date(0);
          const dateB = b.donated_at ? new Date(b.donated_at) : new Date(0);
          return dateA - dateB;
        });
        break;
      case 'amount-high':
        filteredDonations.sort((a, b) => (b.total_price || 0) - (a.total_price || 0));
        break;
      case 'amount-low':
        filteredDonations.sort((a, b) => (a.total_price || 0) - (b.total_price || 0));
        break;
    }

    return filteredDonations;
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

  // Calculate total donation amount
  const totalDonationAmount = donationsList.reduce(
    (sum, donation) => sum + (donation.total_price || 0),
    0
  );
  const formattedTotalAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(totalDonationAmount);

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
        <CardDescription>
          {donationsList.length} total donations • {formattedTotalAmount}
        </CardDescription>

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
                        {dateFilter ? format(dateFilter, 'PPP') : 'Select Date...'}
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
              <div className="text-sm text-muted-foreground">Events:</div>
              {/* Create a unique list of event titles for filtering */}
              {Array.from(new Set(donationsList.map((d) => d.event?.title)))
                .filter(Boolean)
                .map((eventTitle) => (
                  <Button
                    key={eventTitle}
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery(eventTitle)}
                  >
                    {eventTitle}
                  </Button>
                ))}
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
              <UserDonationRow key={donation.id} donation={donation} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserDonationsList;
