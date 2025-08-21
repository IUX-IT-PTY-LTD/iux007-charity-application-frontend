// src/app/(admin)/admin/users/[userId]/details/page.jsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { Loader2, Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

// Import protected user service
import { getUserDetails } from '@/api/services/admin/protected/userService';

// Import permission hooks and context
import { PermissionProvider } from '@/api/contexts/PermissionContext';
import { useUserPermissions } from '@/api/hooks/useModulePermissions';
import { isPermissionError, getPermissionErrorMessage } from '@/api/utils/permissionErrors';

// Import custom components
import UserProfile from '@/components/admin/users/details/UserProfile';
import UserDonationsList from '@/components/admin/users/details/UserDonationsList';
import UserActionsHeader from '@/components/admin/users/details/UserActionsHeader';

// Import shadcn components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Main User Details Component
const UserDetailsPageContent = ({ params }) => {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();
  const userPermissions = useUserPermissions();

  // State for user data
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for access and redirect if necessary
  useEffect(() => {
    if (!userPermissions.isLoading && !userPermissions.hasAccess) {
      toast.error("You don't have access to the Users module.");
      router.push('/admin/dashboard');
    }
  }, [userPermissions.isLoading, userPermissions.hasAccess, router]);

  // Set page title based on user
  useEffect(() => {
    if (userData) {
      setPageTitle(`User Details - ${userData.name}`);
      setPageSubtitle(`View and manage user information`);
    } else {
      setPageTitle('User Details');
      setPageSubtitle('Loading user data...');
    }
  }, [userData, setPageTitle, setPageSubtitle]);

  // Load user data - only when permissions are loaded
  useEffect(() => {
    const fetchData = async () => {
      // Don't fetch if user doesn't have view permission
      if (!userPermissions.isLoading && !userPermissions.canView) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        if (!params?.userId) {
          throw new Error('Missing user ID');
        }

        // Fetch user data from protected API
        const response = await getUserDetails(params.userId);

        if (response.status === 'success') {
          setUserData(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch user details');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);

        if (isPermissionError(error)) {
          setError(getPermissionErrorMessage(error));
          toast.error(getPermissionErrorMessage(error));
        } else {
          setError(error.message || 'Failed to load user data');
          toast.error('Failed to load user data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch when permissions are loaded
    if (!userPermissions.isLoading) {
      fetchData();
    }
  }, [params.userId, userPermissions.isLoading, userPermissions.canView]);

  // Show loading state while permissions are loading
  if (userPermissions.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading permissions...</p>
        </div>
      </div>
    );
  }

  // Show access denied if user has no user permissions
  if (!userPermissions.hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access the Users module.
          </p>
          <Button onClick={() => router.push('/admin/dashboard')}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  // Show access denied if user can't view user details
  if (!userPermissions.canView) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 py-6 mx-auto max-w-7xl">
          {/* Back button */}
          <div className="mb-6">
            <Button variant="ghost" onClick={() => router.push('/admin/users')} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Button>
          </div>

          {/* Access denied content */}
          <div className="flex flex-col items-center justify-center py-12">
            <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
            <p className="text-gray-600 mb-4 text-center max-w-md">
              You don't have permission to view user details. Contact your administrator to request
              access.
            </p>
            <Button onClick={() => router.push('/admin/users')}>Back to Users List</Button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state for data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500 mb-2" />
          <p className="text-muted-foreground">Loading user data...</p>
        </div>
      </div>
    );
  }

  // Show error state if there was an error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 py-6 mx-auto max-w-7xl">
          {/* Back button */}
          <div className="mb-6">
            <Button variant="ghost" onClick={() => router.push('/admin/users')} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Button>
          </div>

          {/* Error content */}
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Error Loading User</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
              <Button onClick={() => router.push('/admin/users')}>Return to Users List</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if user not found
  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 py-6 mx-auto max-w-7xl">
          {/* Back button */}
          <div className="mb-6">
            <Button variant="ghost" onClick={() => router.push('/admin/users')} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Button>
          </div>

          {/* Not found content */}
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">User Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The user you're looking for could not be found.
            </p>
            <Button onClick={() => router.push('/admin/users')}>Return to Users List</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        {/* Permission Status Banner */}
        {/* <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Your User Details Permissions:</h4>
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge variant={userPermissions.canView ? 'default' : 'secondary'}>
              View Details: {userPermissions.canView ? '✓' : '✗'}
            </Badge>
          </div>
        </div> */}

        {/* User Actions Header - Pass permission info */}
        <UserActionsHeader
          userId={userData.id}
          userName={userData.name}
          canView={userPermissions.canView}
        />

        {/* User Profile */}
        <UserProfile user={userData} />

        {/* User Donations List */}
        <UserDonationsList donations={userData.donation_details} />
      </div>
    </div>
  );
};

// Wrapper component that provides permission context
const UserDetailsPage = ({ params }) => {
  return (
    <PermissionProvider>
      <UserDetailsPageContent params={params} />
    </PermissionProvider>
  );
};

export default UserDetailsPage;
