// components/admin/users/details/UserProfile.jsx
'use client';

import React from 'react';
import { format, parseISO } from 'date-fns';
import { Mail, Calendar, DollarSign, User as UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const UserProfile = ({ user }) => {
  if (!user) return null;

  // Format registration date
  const registeredDate = user.created_at
    ? format(parseISO(user.created_at), 'MMMM d, yyyy')
    : 'N/A';

  // Format total donated amount
  const formattedTotalDonated = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(user.total_donation_amount || 0);

  // Format name initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-0">
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6 pt-4">
          {/* User Basic Info */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                {/* <p className="text-muted-foreground">{user.email}</p> */}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Member since {registeredDate}</span>
              </div>
            </div>
          </div>

          {/* User Stats */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Registration Date</span>
                </div>
                <p className="font-semibold">{registeredDate}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Total Donated</span>
                </div>
                <p className="font-semibold">{formattedTotalDonated}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Donation Count</span>
                </div>
                <p className="font-semibold">{user.total_donors} donations</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
