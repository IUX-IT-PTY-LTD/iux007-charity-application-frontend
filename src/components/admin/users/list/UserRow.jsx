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
  Lock,
  Eye,
  Key,
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

// Import permission hooks
import { useUserPermissions } from '@/api/hooks/useModulePermissions';

// Import password reset functionality
import { resetUserPassword } from '@/api/services/admin/protected/userService';
import PasswordResetModal from '@/components/admin/users/PasswordResetModal';

// Permission-aware view button component
const PermissionAwareViewButton = ({ user, onViewUser }) => {
  const userPermissions = useUserPermissions();

  if (!userPermissions.canView) {
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        title="You don't have permission to view user details"
        className="opacity-0 group-hover:opacity-50 transition-opacity cursor-not-allowed"
      >
        <Lock className="h-5 w-5 text-muted-foreground" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={onViewUser}
    >
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </Button>
  );
};

const UserRow = ({ user, onDelete }) => {
  const router = useRouter();
  const userPermissions = useUserPermissions();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showPasswordReset, setShowPasswordReset] = React.useState(false);
  const [isResettingPassword, setIsResettingPassword] = React.useState(false);

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

  // View user details - with permission check
  const handleViewUser = () => {
    if (!userPermissions.canView) {
      toast.error("You don't have permission to view user details");
      return;
    }
    router.push(`/admin/users/${user.id}/details`);
  };

  // Handle row click - with permission check
  const handleRowClick = () => {
    if (userPermissions.canView) {
      handleViewUser();
    }
  };

  // Handle password reset
  const handlePasswordReset = async (userId, newPassword) => {
    if (!userPermissions.canView) {
      toast.error("You don't have permission to reset user passwords");
      return;
    }

    setIsResettingPassword(true);
    
    try {
      const response = await resetUserPassword(userId, newPassword);
      
      if (response.status === 'success') {
        toast.success('Password reset successfully');
      } else {
        throw new Error(response.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(error.message || 'Failed to reset password. Please try again.');
      throw error; // Re-throw to prevent modal from closing
    } finally {
      setIsResettingPassword(false);
    }
  };

  // Edit user - Kept for future implementation
  // const handleEditUser = () => {
  //   if (!userPermissions.canEdit) {
  //     toast.error("You don't have permission to edit users");
  //     return;
  //   }
  //   // router.push(`/admin/users/${user.id}/edit`);
  //   toast.info('Edit functionality will be implemented in the future');
  // };

  // Delete user - Kept for future implementation
  // const handleDeleteUser = () => {
  //   if (!userPermissions.canDelete) {
  //     toast.error("You don't have permission to delete users");
  //     return;
  //   }
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
        className={`relative group transition-all duration-200 ease-in-out border-b hover:bg-gray-50/70 dark:hover:bg-gray-800/70 ${
          userPermissions.canView ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'
        }`}
        onClick={handleRowClick}
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
              {/* Permission indicator overlay */}
              {!userPermissions.canView && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 rounded-full">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <h3
                  className={`font-semibold text-base flex items-center gap-2 ${
                    !userPermissions.canView ? 'text-gray-400' : ''
                  }`}
                >
                  {user.name}
                  {!userPermissions.canView && <Lock className="h-4 w-4" />}
                </h3>
                {getDonationBadge()}
              </div>
              <div className="text-sm text-muted-foreground flex items-center">
                <Mail className="h-3.5 w-3.5 mr-1 inline" />
                {userPermissions.canView ? user.email : '••••••@••••.com'}
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
              <div className="text-sm font-medium">
                {userPermissions.canView ? `${user.total_donors || 0} donations` : '•• donations'}
              </div>
              <div className="text-xs text-muted-foreground">
                {userPermissions.canView
                  ? formatDonationAmount(user.total_donation_amount || 0)
                  : '$••••'}
              </div>
            </div>

            {/* Reset Password Button */}
            <Button
              variant="ghost"
              size="sm"
              disabled={!userPermissions.canView}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                setShowPasswordReset(true);
              }}
              title="Reset Password"
            >
              {userPermissions.canView ? (
                <>
                  <Key className="mr-2 h-4 w-4" />
                  Reset Password
                </>
              ) : (
                <Lock className="h-4 w-4" />
              )}
            </Button>

            {/* View details indicator */}
            <PermissionAwareViewButton user={user} onViewUser={handleViewUser} />
          </div>
        </div>

        {/* Mobile registration date - only shown on small screens */}
        <div className="md:hidden px-4 pb-3 -mt-2 text-xs text-muted-foreground flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          Joined {registeredDate}
        </div>

        {/* Permission overlay for entire row when no access */}
        {!userPermissions.canView && (
          <div className="absolute inset-0 bg-white/10 dark:bg-gray-900/10 pointer-events-none" />
        )}
      </div>

      {/* Password Reset Modal */}
      <PasswordResetModal
        user={user}
        isOpen={showPasswordReset}
        onClose={() => setShowPasswordReset(false)}
        onResetPassword={handlePasswordReset}
        isLoading={isResettingPassword}
      />

      {/* Delete Confirmation Dialog - commented out as per requirement, but would include permission checks */}
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
            <Button 
              variant="destructive" 
              onClick={handleDeleteUser}
              disabled={!userPermissions.canDelete}
            >
              {userPermissions.canDelete ? 'Delete User' : 'No Permission'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </>
  );
};

export default UserRow;
