'use client';

import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
    <div className="mb-6">
      {/* Search and tabs row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
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

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">
            {totalEvents} {totalEvents === 1 ? 'event' : 'events'} found
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                {currentFilter === 'featured' ? 'Featured Events' : 'More Filters'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Additional Filters</DropdownMenuLabel>
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

      {/* Tabs for Active/Inactive */}
      <Tabs 
        value={currentFilter === 'inactive' ? 'inactive' : 'active'} 
        onValueChange={(value) => handleFilterChange(value)}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="active" className="flex items-center gap-2">
            Active Events
            <Badge className="ml-1 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
              {activeEvents}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="inactive" className="flex items-center gap-2">
            Inactive Events
            <Badge className="ml-1 bg-white text-black border border-black hover:bg-gray-100 dark:bg-black dark:text-white dark:border-white dark:hover:bg-gray-800">
              {inactiveEvents}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default EventsFilters;
