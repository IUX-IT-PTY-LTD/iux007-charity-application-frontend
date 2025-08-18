// components/donations/UpdatedDonationStats.jsx
'use client';

import React from 'react';
import { DollarSign, Users, Calendar } from 'lucide-react';

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

const UpdatedDonationStats = ({
  totalDonations,
  totalAmount,
  donorCount,
  averageDonation,
  eventStartDate,
  eventEndDate,
  isFixedDonation,
}) => {
  // Format dollar amounts
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format dates for event duration
  const formatEventDates = () => {
    if (!eventStartDate) return 'N/A';

    const startDate = new Date(eventStartDate);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };

    if (eventEndDate) {
      const endDate = new Date(eventEndDate);
      return `${startDate.toLocaleDateString(
        'en-US',
        options
      )} - ${endDate.toLocaleDateString('en-US', options)}`;
    }

    return startDate.toLocaleDateString('en-US', options);
  };

  // Calculate event progress (as days or percentage)
  const calculateEventProgress = () => {
    if (!eventStartDate || !eventEndDate) return null;

    const start = new Date(eventStartDate);
    const end = new Date(eventEndDate);
    const today = new Date();

    // If event hasn't started
    if (today < start) return "Event hasn't started";

    // If event is over
    if (today > end) return 'Event completed';

    // Calculate days elapsed and total days
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const daysElapsed = Math.ceil((today - start) / (1000 * 60 * 60 * 24));
    const percentage = Math.round((daysElapsed / totalDays) * 100);

    return `Day ${daysElapsed} of ${totalDays} (${percentage}%)`;
  };

  const eventDuration = formatEventDates();
  const eventProgress = calculateEventProgress();

  // Add donation type info to average donation description
  const donationTypeDescription = isFixedDonation
    ? `Fixed donation: ${formatCurrency(averageDonation)}`
    : `Average: ${formatCurrency(averageDonation)}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <StatCard
        title="Total Donations"
        value={formatCurrency(totalAmount)}
        icon={DollarSign}
        description={`From ${totalDonations} contributions`}
      />

      <StatCard
        title="Donors"
        value={donorCount}
        icon={Users}
        description={donationTypeDescription}
      />

      <StatCard
        title="Event Duration"
        value={eventDuration}
        icon={Calendar}
        description={eventProgress}
      />
    </div>
  );
};

export default UpdatedDonationStats;
