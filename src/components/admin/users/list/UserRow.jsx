// components/users/UserRow.jsx
'use client';

import React from 'react';
import { format, parseISO } from 'date-fns';
import {
  MoreHorizontal,
  User,
  Edit,
  Trash2,
  ExternalLink,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const UserRow = ({ user, onDelete }) => {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  // Format date
  const registeredDate = user.created_at ? format(parseISO(user.created_at), 'MMM d, yyyy') : 'N/A';

  // Calculate days since registration
  const daysSinceRegistration = () => {
    if (!user.created_at) return null;
    const now = new Date();
    const regDate = new Date(user.created_at);
    const diffTime = Math.abs(now - regDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Format donation amount
  const formatDonationAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Format name initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // View user details
  const handleViewUser = () => {
    router.push(`/admin/users/${user.id}/details`);
  };

  // Edit user - Kept for future implementation
  // const handleEditUser = () => {
  //   // router.push(`/admin/users/${user.id}/edit`);
  //   toast.info('Edit functionality will be implemented in the future');
  // };

  // Delete user - Kept for future implementation
  // const handleDeleteUser = () => {
  //   setShowDeleteDialog(false);

  //   // Call the delete function passed from parent
  //   onDelete(user.id);
  // };

  // Get donation status badge
  const getDonationBadge = () => {
    const donations = user.total_donors || 0;
    if (donations === 0) {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-600">
          No Donations
        </Badge>
      );
    } else if (donations <= 5) {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
          Donor
        </Badge>
      );
    } else if (donations <= 20) {
      return (
        <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-200">
          Regular Donor
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
          Major Donor
        </Badge>
      );
    }
  };

  // Determine if user is recently registered (within 14 days)
  const isRecentlyRegistered = daysSinceRegistration() <= 14;

  return (
    <>
      <div
        className="relative group transition-all duration-200 ease-in-out border-b hover:bg-gray-50/70 dark:hover:bg-gray-800/70"
        onClick={handleViewUser}
        style={{ cursor: 'pointer' }}
      >
        {/* Main content */}
        <div className="flex items-center p-4 md:p-5">
          {/* Left side - Avatar and user info */}
          <div className="flex-grow flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-12 w-12 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ring-gray-100 dark:ring-gray-700">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback className="text-lg bg-gradient-to-br from-primary/80 to-primary/50">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              {isRecentlyRegistered && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative rounded-full h-4 w-4 bg-green-500"></span>
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-base">{user.name}</h3>
                {getDonationBadge()}
              </div>
              <div className="text-sm text-muted-foreground flex items-center">
                <Mail className="h-3.5 w-3.5 mr-1 inline" />
                {user.email}
              </div>
              <div className="hidden md:flex text-xs text-muted-foreground items-center mt-1">
                <Calendar className="h-3 w-3 mr-1 inline" />
                <span>{registeredDate}</span>
                {isRecentlyRegistered && (
                  <Badge
                    variant="outline"
                    size="sm"
                    className="ml-2 text-[10px] py-0 h-4 bg-green-50 text-green-600 border-green-100"
                  >
                    New
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Donation info and actions */}
          <div className="flex-shrink-0 flex flex-col md:flex-row items-end md:items-center space-y-2 md:space-y-0 md:space-x-6">
            {/* Donation stats */}
            <div className="flex flex-col items-end md:items-center">
              <div className="text-sm font-medium">{user.total_donors || 0} donations</div>
              <div className="text-xs text-muted-foreground">
                {formatDonationAmount(user.total_donation_amount || 0)}
              </div>
            </div>

            {/* View details indicator */}
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Button>

            {/* Dropdown menu - commented out as per requirement */}
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleViewUser}>
                  <User className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEditUser}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit User
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 dark:text-red-400"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>
        </div>

        {/* Mobile registration date - only shown on small screens */}
        <div className="md:hidden px-4 pb-3 -mt-2 text-xs text-muted-foreground flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          Joined {registeredDate}
        </div>
      </div>

      {/* Delete Confirmation Dialog - commented out as per requirement */}
      {/* <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm User Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user "{user.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </>
  );
};

export default UserRow;
