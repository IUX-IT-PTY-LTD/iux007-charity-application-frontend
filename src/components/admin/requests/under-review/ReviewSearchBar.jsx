'use client';

import React from 'react';
import { Search, Filter, Calendar, Tag, Clock } from 'lucide-react';
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

const ReviewSearchBar = ({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  approvalFilter,
  setApprovalFilter,
  deadlineFilter,
  setDeadlineFilter,
  totalRequests,
  approvalCounts,
  categoryOptions,
}) => {
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setApprovalFilter('all');
    setDeadlineFilter('all');
  };

  // Check if any filters are active
  const hasActiveFilters =
    searchQuery || categoryFilter !== 'all' || approvalFilter !== 'all' || deadlineFilter !== 'all';

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

        {/* Approval Status Filter */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <Select value={approvalFilter} onValueChange={setApprovalFilter}>
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Filter by approval status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Approvals ({approvalCounts.total || 0})</SelectItem>
              <SelectItem value="no_approvals">
                No Approvals ({approvalCounts.no_approvals || 0})
              </SelectItem>
              <SelectItem value="some_approvals">
                Partial Approvals ({approvalCounts.some_approvals || 0})
              </SelectItem>
              <SelectItem value="ready_for_final">
                Ready (3+ Approvals) ({approvalCounts.ready_for_final || 0})
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Deadline Filter */}
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <Select value={deadlineFilter} onValueChange={setDeadlineFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by deadline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Deadlines</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="due_soon">Due Soon (3 days)</SelectItem>
              <SelectItem value="due_later">Due Later</SelectItem>
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
              {approvalFilter !== 'all' && (
                <Badge variant="outline" className="text-xs">
                  Approval: {approvalFilter.replace('_', ' ')}
                </Badge>
              )}
              {deadlineFilter !== 'all' && (
                <Badge variant="outline" className="text-xs">
                  Deadline: {deadlineFilter.replace('_', ' ')}
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
              onClick={() => setDeadlineFilter('overdue')}
              className="justify-between"
            >
              <span>Overdue Requests</span>
              <Badge variant="outline" className="bg-red-50 text-red-700">
                Urgent
              </Badge>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setDeadlineFilter('due_soon')}
              className="justify-between"
            >
              <span>Due Soon (3 days)</span>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                Warning
              </Badge>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setApprovalFilter('ready_for_final')}
              className="justify-between"
            >
              <span>Ready for Final</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {approvalCounts.ready_for_final || 0}
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

export default ReviewSearchBar;
