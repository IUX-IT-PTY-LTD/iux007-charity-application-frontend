'use client';

import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const EventsFilters = ({
  searchQuery,
  setSearchQuery,
  totalEvents,
  activeEvents,
  inactiveEvents,
  featuredEvents,
  handleFilterChange,
  currentFilter,
}) => {
  // Handle search input
  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Explicitly call setSearchQuery with the current value to trigger the API call
    setSearchQuery(searchQuery);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-xs">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Search events..."
          className="pl-8 w-full"
          value={searchQuery}
          onChange={handleSearchInput}
        />
        <Button
          type="submit"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 rounded-l-none text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm py-2.5 text-center"
        >
          Search
        </Button>
      </form>

      <div className="flex flex-wrap items-center gap-2 self-end">
        <span className="text-sm text-gray-500">
          {totalEvents} {totalEvents === 1 ? 'event' : 'events'} found
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              {currentFilter === 'all'
                ? 'All Events'
                : currentFilter === 'active'
                  ? 'Active Events'
                  : currentFilter === 'inactive'
                    ? 'Inactive Events'
                    : 'Featured Events'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter Events</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleFilterChange('all')}
              className={`justify-between ${currentFilter === 'all' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            >
              All
              <Badge variant="outline" className="ml-2">
                {totalEvents}
              </Badge>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleFilterChange('active')}
              className={`justify-between ${currentFilter === 'active' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            >
              Active
              <Badge variant="outline" className="ml-2">
                {activeEvents}
              </Badge>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleFilterChange('inactive')}
              className={`justify-between ${currentFilter === 'inactive' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            >
              Inactive
              <Badge variant="outline" className="ml-2">
                {inactiveEvents}
              </Badge>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleFilterChange('featured')}
              className={`justify-between ${currentFilter === 'featured' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            >
              Featured
              <Badge variant="outline" className="ml-2">
                {featuredEvents}
              </Badge>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default EventsFilters;
