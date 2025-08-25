'use client';

import React from 'react';
import { Search, Filter, Calendar, Tag } from 'lucide-react';
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

const RequestsSearchBar = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  totalRequests,
  statusCounts,
  statusOptions,
  categoryOptions,
}) => {
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
  };

  // Check if any filters are active
  const hasActiveFilters = searchQuery || statusFilter !== 'all' || categoryFilter !== 'all';

  return (
    <div className="flex flex-col space-y-4 mb-6">
      {/* Search and primary filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search by ID, name, organization, title..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status ({statusCounts.total || 0})</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${status.color.replace('bg-', '').replace('text-', 'bg-')}`}
                    ></div>
                    {status.label} ({statusCounts[status.value] || 0})
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              {statusFilter !== 'all' && (
                <Badge variant="outline" className="text-xs">
                  Status: {statusOptions.find((s) => s.value === statusFilter)?.label}
                </Badge>
              )}
              {categoryFilter !== 'all' && (
                <Badge variant="outline" className="text-xs">
                  Category: {categoryFilter}
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
            <DropdownMenuLabel>Quick Status Filters</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setStatusFilter('submitted')}
              className="justify-between"
            >
              <span>Recently Submitted</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {statusCounts.submitted || 0}
              </Badge>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setStatusFilter('information_needed')}
              className="justify-between"
            >
              <span>Need Information</span>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                {statusCounts.information_needed || 0}
              </Badge>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setStatusFilter('technical_check_passed')}
              className="justify-between"
            >
              <span>Ready for Review</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {statusCounts.technical_check_passed || 0}
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

export default RequestsSearchBar;
