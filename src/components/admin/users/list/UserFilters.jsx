// components/users/UserFilters.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, ChevronDown, X } from 'lucide-react';
import { format } from 'date-fns';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const UserFilters = ({
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
  dateFilter,
  setDateFilter,
  sortBy,
  setSortBy,
  roles,
  onFiltersChange, // New prop to handle filter changes
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dateFilter);
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Function to apply filters
  const applyDateFilter = (date) => {
    setSelectedDate(date);
    setDateFilter(date);
    setPopoverOpen(false);

    // Call the onFiltersChange callback if provided
    if (onFiltersChange) {
      onFiltersChange({
        date: date ? format(date, 'yyyy-MM-dd') : null,
      });
    }
  };

  // Function to clear date filter
  const clearDateFilter = () => {
    setSelectedDate(null);
    setDateFilter(null);

    // Call the onFiltersChange callback if provided
    if (onFiltersChange) {
      onFiltersChange({
        date: null,
      });
    }
  };

  // Function to handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Call the onFiltersChange callback if provided
    if (onFiltersChange) {
      onFiltersChange({
        search: value,
      });
    }
  };

  // Function to handle sort changes
  const handleSortChange = (value) => {
    setSortBy(value);

    // Call the onFiltersChange callback if provided
    if (onFiltersChange) {
      onFiltersChange({
        sort: value,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={handleSearchChange}
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

          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={selectedDate ? 'border-primary text-primary' : ''}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'Registration Date'}
                {selectedDate && (
                  <X
                    className="ml-2 h-3.5 w-3.5 text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearDateFilter();
                    }}
                  />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-0">
              <div className="p-2">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={applyDateFilter}
                  initialFocus
                />
              </div>
            </PopoverContent>
          </Popover>

          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-a-z">Name (A-Z)</SelectItem>
              <SelectItem value="name-z-a">Name (Z-A)</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="donations-high">Donations (High to Low)</SelectItem>
              <SelectItem value="donations-low">Donations (Low to High)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {showFilters && (
        <div className="space-y-4 pt-2">
          {/* Filter options would go here */}

          {/* Donation filter option */}
          <div className="flex flex-wrap gap-2 py-2 items-center">
            <div className="text-sm text-muted-foreground">Donation Status:</div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (onFiltersChange) onFiltersChange({ donationStatus: 'all' });
              }}
            >
              All Users
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (onFiltersChange) onFiltersChange({ donationStatus: 'donors' });
              }}
            >
              Donors
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (onFiltersChange) onFiltersChange({ donationStatus: 'non-donors' });
              }}
            >
              Non-Donors
            </Button>
          </div>

          {dateFilter && (
            <div className="flex justify-end mt-2">
              <Button variant="outline" size="sm" onClick={clearDateFilter}>
                Clear Date Filter
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserFilters;
