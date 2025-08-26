'use client';

import React from 'react';
import { Search, Filter, Tag, Link, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const ApprovedSearchBar = ({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  eventConnectionFilter,
  setEventConnectionFilter,
  totalRequests,
  connectionCounts,
  categoryOptions,
}) => {
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setEventConnectionFilter('all');
  };

  // Check if any filters are active
  const hasActiveFilters =
    searchQuery || categoryFilter !== 'all' || eventConnectionFilter !== 'all';

  return (
    <div className="flex flex-col space-y-4 mb-6">
      {/* Search and primary filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search by ID, name, organization, purpose..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-gray-500" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categoryOptions.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Event Connection Filter */}
        <div className="flex items-center gap-2">
          <Link className="h-4 w-4 text-gray-500" />
          <Select value={eventConnectionFilter} onValueChange={setEventConnectionFilter}>
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Filter by event status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests ({connectionCounts.total || 0})</SelectItem>
              <SelectItem value="connected">
                Connected to Event ({connectionCounts.connected || 0})
              </SelectItem>
              <SelectItem value="not_connected">
                Not Connected ({connectionCounts.not_connected || 0})
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results summary and quick actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Results summary */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600">
            {totalRequests} {totalRequests === 1 ? 'request' : 'requests'} found
          </span>

          {/* Active filter badges */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Filters:</span>
              {searchQuery && (
                <Badge variant="outline" className="text-xs">
                  Search: "{searchQuery}"
                </Badge>
              )}
              {categoryFilter !== 'all' && (
                <Badge variant="outline" className="text-xs">
                  Category: {categoryFilter}
                </Badge>
              )}
              {eventConnectionFilter !== 'all' && (
                <Badge variant="outline" className="text-xs">
                  Status: {eventConnectionFilter.replace('_', ' ')}
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-6 px-2">
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Quick filter dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Quick Filters
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Quick Filters</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setEventConnectionFilter('not_connected')}
              className="justify-between"
            >
              <span>Needs Event Connection</span>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                {connectionCounts.not_connected || 0}
              </Badge>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setEventConnectionFilter('connected')}
              className="justify-between"
            >
              <span>Already Connected</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {connectionCounts.connected || 0}
              </Badge>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={clearFilters}>
              <span>Clear All Filters</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ApprovedSearchBar;
