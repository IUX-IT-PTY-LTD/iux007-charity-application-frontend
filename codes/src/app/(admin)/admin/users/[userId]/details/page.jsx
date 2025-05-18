'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminContext } from '@/components/admin/admin-context';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Import custom components
import UserProfile from '@/components/admin/users/details/UserProfile';
import UserDonationsList from '@/components/admin/users/details/UserDonationsList';
import UserActionsHeader from '@/components/admin/users/details/UserActionsHeader';

const UserDetailsPage = ({ params }) => {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();

  // State for user and donations
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Set page title based on user
  useEffect(() => {
    if (user) {
      setPageTitle(`User Details - ${user.name}`);
      setPageSubtitle(`View and manage user information`);
    } else {
      setPageTitle('User Details');
      setPageSubtitle('Loading user data...');
    }
  }, [user, setPageTitle, setPageSubtitle]);

  // Load user and donations data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        if (!params?.userId) {
          toast.error('Missing user ID');
          router.push('/admin/users');
          return;
        }

        // Fetch user data from localStorage
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const foundUser = storedUsers.find((u) => u.id === params.userId);

        if (!foundUser) {
          toast.error('User not found');
          router.push('/admin/users');
          return;
        }

        setUser(foundUser);

        // Fetch events data
        const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
        setEvents(storedEvents);

        // Fetch all donations from all events
        let allDonations = [];
        storedEvents.forEach((event) => {
          const eventDonations = JSON.parse(localStorage.getItem(`donations_${event.id}`) || '[]');
          allDonations = [...allDonations, ...eventDonations];
        });

        // Filter donations for this user
        // Match by email since we don't have a proper user_id in the donation data
        const userDonations = allDonations.filter((donation) => donation.email === foundUser.email);

        setDonations(userDonations);

        /* API Implementation (Commented out for future use)
        // Fetch user data
        const userResponse = await fetch(`/api/users/${params.userId}`);
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await userResponse.json();
        setUser(userData);
        
        // Fetch events data
        const eventsResponse = await fetch('/api/events');
        if (!eventsResponse.ok) {
          throw new Error('Failed to fetch events data');
        }
        const eventsData = await eventsResponse.json();
        setEvents(eventsData);
        
        // Fetch donations for this user
        const donationsResponse = await fetch(`/api/users/${params.userId}/donations`);
        if (!donationsResponse.ok) {
          throw new Error('Failed to fetch donations data');
        }
        const donationsData = await donationsResponse.json();
        setDonations(donationsData);
        */
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load user and donation data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.userId, router]);

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

  // Show error state if user not found
  if (!user) {
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
        <UserActionsHeader userId={user.id} userName={user.name} />

        <UserProfile user={user} />

        <UserDonationsList donations={donations} events={events} />
      </div>
    </div>
  );
};

export default UserDetailsPage;
