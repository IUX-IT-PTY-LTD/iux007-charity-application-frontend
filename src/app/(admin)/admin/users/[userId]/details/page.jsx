// src/app/(admin)/admin/users/[userId]/details/page.jsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Import user service
import { userService } from '@/api/services/admin/userService';

// Import custom components
import UserProfile from '@/components/admin/users/details/UserProfile';
import UserDonationsList from '@/components/admin/users/details/UserDonationsList';
import UserActionsHeader from '@/components/admin/users/details/UserActionsHeader';

const UserDetailsPage = ({ params }) => {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();

  // State for user data
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Load user data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!params?.userId) {
          throw new Error('Missing user ID');
        }

        // Fetch user data from API
        const response = await userService.getUserDetails(params.userId);

        if (response.status === 'success') {
          setUserData(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch user details');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.message || 'Failed to load user data');
        toast.error('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.userId]);

  // Show loading state
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Error Loading User</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => router.push('/admin/users')}
            className="text-primary hover:underline"
          >
            Return to users list
          </button>
        </div>
      </div>
    );
  }

  // Show error state if user not found
  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">User Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The user you're looking for could not be found.
          </p>
          <button
            onClick={() => router.push('/admin/users')}
            className="text-primary hover:underline"
          >
            Return to users list
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <UserActionsHeader userId={userData.id} userName={userData.name} />

        <UserProfile user={userData} />

        <UserDonationsList donations={userData.donation_details} />
      </div>
    </div>
  );
};

export default UserDetailsPage;
