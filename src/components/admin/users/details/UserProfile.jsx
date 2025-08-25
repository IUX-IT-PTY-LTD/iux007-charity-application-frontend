// components/admin/users/details/UserProfile.jsx
'use client';

import React from 'react';
import { format, parseISO } from 'date-fns';
import { Mail, Calendar, DollarSign, User as UserIcon, Lock, Eye, Shield } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Import permission hooks
import { useUserPermissions } from '@/api/hooks/useModulePermissions';

const UserProfile = ({ user }) => {
  const userPermissions = useUserPermissions();

  if (!user) return null;

  // Format registration date - mask if no permission
  const registeredDate =
    userPermissions.canView && user.created_at
      ? format(parseISO(user.created_at), 'MMMM d, yyyy')
      : 'N/A';

  // Format total donated amount - mask if no permission
  const formattedTotalDonated = userPermissions.canView
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(user.total_donation_amount || 0)
    : '$••••';

  // Format name initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Mask sensitive data if no permission
  const displayName = userPermissions.canView ? user.name : '••••• •••••';
  const displayEmail = userPermissions.canView ? user.email : '•••••@••••.com';
  const displayDonationCount = userPermissions.canView ? user.total_donors || 0 : '••';

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-2">
          User Profile
          {!userPermissions.canView && <Eye className="h-5 w-5 text-blue-500" />}
        </CardTitle>
        {!userPermissions.canView && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-2">
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-blue-600 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">Limited Access</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Some user details are hidden. You need view permissions to see full profile
                  information.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6 pt-4">
          {/* User Basic Info */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={userPermissions.canView ? user.image : undefined}
                    alt={displayName}
                  />
                  <AvatarFallback className="text-lg">
                    {userPermissions.canView ? getInitials(user.name) : '••'}
                  </AvatarFallback>
                </Avatar>
                {/* Permission indicator overlay */}
                {!userPermissions.canView && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 rounded-full">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <h2
                  className={`text-2xl font-bold flex items-center gap-2 ${
                    !userPermissions.canView ? 'text-gray-400' : ''
                  }`}
                >
                  {displayName}
                  {!userPermissions.canView && <Lock className="h-5 w-5" />}
                </h2>
                {/* <p className="text-muted-foreground">{displayEmail}</p> */}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail
                  className={`h-4 w-4 ${!userPermissions.canView ? 'text-gray-400' : 'text-muted-foreground'}`}
                />
                <span className={!userPermissions.canView ? 'text-gray-400' : ''}>
                  {displayEmail}
                </span>
                {!userPermissions.canView && <Lock className="h-3 w-3 text-gray-400" />}
              </div>

              <div className="flex items-center gap-2">
                <Calendar
                  className={`h-4 w-4 ${!userPermissions.canView ? 'text-gray-400' : 'text-muted-foreground'}`}
                />
                <span className={!userPermissions.canView ? 'text-gray-400' : ''}>
                  Member since {userPermissions.canView ? registeredDate : '••••••••'}
                </span>
                {!userPermissions.canView && <Lock className="h-3 w-3 text-gray-400" />}
              </div>
            </div>
          </div>

          {/* User Stats */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-lg ${
                  userPermissions.canView
                    ? 'bg-gray-50 dark:bg-gray-800'
                    : 'bg-gray-100 dark:bg-gray-700 opacity-75'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Calendar
                    className={`h-4 w-4 ${!userPermissions.canView ? 'text-gray-400' : 'text-muted-foreground'}`}
                  />
                  <span
                    className={`text-sm font-medium ${!userPermissions.canView ? 'text-gray-400' : ''}`}
                  >
                    Registration Date
                  </span>
                  {!userPermissions.canView && <Lock className="h-3 w-3 text-gray-400" />}
                </div>
                <p className={`font-semibold ${!userPermissions.canView ? 'text-gray-400' : ''}`}>
                  {registeredDate}
                </p>
              </div>

              <div
                className={`p-4 rounded-lg ${
                  userPermissions.canView
                    ? 'bg-gray-50 dark:bg-gray-800'
                    : 'bg-gray-100 dark:bg-gray-700 opacity-75'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign
                    className={`h-4 w-4 ${!userPermissions.canView ? 'text-gray-400' : 'text-muted-foreground'}`}
                  />
                  <span
                    className={`text-sm font-medium ${!userPermissions.canView ? 'text-gray-400' : ''}`}
                  >
                    Total Donated
                  </span>
                  {!userPermissions.canView && <Lock className="h-3 w-3 text-gray-400" />}
                </div>
                <p className={`font-semibold ${!userPermissions.canView ? 'text-gray-400' : ''}`}>
                  {formattedTotalDonated}
                </p>
              </div>

              <div
                className={`p-4 rounded-lg ${
                  userPermissions.canView
                    ? 'bg-gray-50 dark:bg-gray-800'
                    : 'bg-gray-100 dark:bg-gray-700 opacity-75'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <UserIcon
                    className={`h-4 w-4 ${!userPermissions.canView ? 'text-gray-400' : 'text-muted-foreground'}`}
                  />
                  <span
                    className={`text-sm font-medium ${!userPermissions.canView ? 'text-gray-400' : ''}`}
                  >
                    Donation Count
                  </span>
                  {!userPermissions.canView && <Lock className="h-3 w-3 text-gray-400" />}
                </div>
                <p className={`font-semibold ${!userPermissions.canView ? 'text-gray-400' : ''}`}>
                  {displayDonationCount} donations
                </p>
              </div>

              {/* Permission Status Card */}
              <div
                className={`p-4 rounded-lg border-2 ${
                  userPermissions.canView
                    ? 'bg-green-50 border-green-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {userPermissions.canView ? (
                    <Eye className="h-4 w-4 text-green-600" />
                  ) : (
                    <Lock className="h-4 w-4 text-yellow-600" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      userPermissions.canView ? 'text-green-800' : 'text-yellow-800'
                    }`}
                  >
                    Access Level
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={userPermissions.canView ? 'success' : 'warning'}
                    className={
                      userPermissions.canView
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }
                  >
                    {userPermissions.canView ? 'Full Access' : 'Limited Access'}
                  </Badge>
                </div>
                {!userPermissions.canView && (
                  <p className="text-xs text-yellow-700 mt-1">Contact admin for view permissions</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
