// components/users/UserStats.jsx
'use client';

import React from 'react';
import { Users, DollarSign, Clock, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, description, trend, trendValue }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>

          {trend && trendValue > 0 && (
            <div className="flex items-center mt-1.5 text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs font-medium">+{trendValue}% from last month</span>
            </div>
          )}
        </div>
        <div className="rounded-full bg-primary/10 p-3">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
      {description && <p className="text-xs text-muted-foreground mt-3">{description}</p>}
    </div>
  );
};

const UserStats = ({
  totalUsers,
  totalDonations,
  averageDonationsPerUser,
  recentlyAddedUsers,
  lastUpdateDate,
}) => {
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatUpdateDate = (date) => {
    if (!date) return 'N/A';

    const now = new Date();
    const updateDate = new Date(date);
    const diffInHours = Math.floor((now - updateDate) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <StatCard
        title="Registered Users"
        value={totalUsers}
        icon={Users}
        description={`${recentlyAddedUsers} new users in the last 30 days`}
        trend={true}
        trendValue={5} // Mock value, would be calculated in a real implementation
      />

      <StatCard
        title="Total Donations"
        value={totalDonations}
        icon={DollarSign}
        description={`Average ${averageDonationsPerUser.toFixed(1)} donations per user`}
        trend={true}
        trendValue={3} // Mock value, would be calculated in a real implementation
      />
    </div>
  );
};

export default UserStats;
