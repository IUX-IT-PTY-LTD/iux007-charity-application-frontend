// components/admin/org/admin/AdminsSearchBar.jsx
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const AdminsSearchBar = ({
  searchQuery,
  setSearchQuery,
  totalAdmins,
  activeAdmins,
  inactiveAdmins,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Search admins..."
          className="pl-8 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 self-end">
        <span className="text-sm text-gray-500">
          {totalAdmins} {totalAdmins === 1 ? 'admin' : 'admins'} found
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSearchQuery('')} className="justify-between">
              All
              <Badge variant="outline" className="ml-2">
                {totalAdmins}
              </Badge>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchQuery('active')} className="justify-between">
              Active
              <Badge variant="outline" className="ml-2">
                {activeAdmins}
              </Badge>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSearchQuery('inactive')}
              className="justify-between"
            >
              Inactive
              <Badge variant="outline" className="ml-2">
                {inactiveAdmins}
              </Badge>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default AdminsSearchBar;
