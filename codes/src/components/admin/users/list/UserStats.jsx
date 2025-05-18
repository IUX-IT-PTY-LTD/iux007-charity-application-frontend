// components/users/UserStats.jsx
'use client';

import React from 'react';
import { Users, DollarSign, Clock } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, description }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="rounded-full bg-primary/10 p-2">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
    </div>
  );
};

const UserStats = ({
  totalUsers,
  totalDonations,
  averageDonationsPerUser,
  recentlyActiveUsers,
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
        description={`${recentlyActiveUsers} users active in the last 30 days`}
      />

      <StatCard
        title="Total Donations"
        value={totalDonations}
        icon={DollarSign}
        description={`Avg ${averageDonationsPerUser.toFixed(1)} per user`}
      />

      {/* <StatCard
        title="Last Database Update"
        value={formatUpdateDate(lastUpdateDate)}
        icon={Clock}
        description="Data shown reflects most recent information"
      /> */}
    </div>
  );
};

export default UserStats;
