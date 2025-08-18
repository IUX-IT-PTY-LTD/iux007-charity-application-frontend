'use client';

import { Users, DollarSign, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const EventDetailsStats = ({ event }) => {
  // Calculate progress percentage
  const totalDonated = event.total_donation_amount || 0;
  const target = event.target_amount || 1; // Prevent division by zero
  const progressPercentage = Math.min(Math.round((totalDonated / target) * 100), 100);

  // Average donation calculation
  const averageDonation =
    event.total_donors && event.total_donors > 0
      ? Math.round(totalDonated / event.total_donors)
      : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md">Donation Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Progress</span>
            <span className="font-medium">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              ${totalDonated.toLocaleString()} raised
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              ${target.toLocaleString()} goal
            </span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Donors</span>
            </div>
            <p className="text-2xl font-bold mt-1">{event.total_donors || 0}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Raised</span>
            </div>
            <p className="text-2xl font-bold mt-1">${totalDonated.toLocaleString()}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Average Donation</span>
            </div>
            <p className="text-2xl font-bold mt-1">${averageDonation}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-red-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Remaining</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              ${Math.max(0, target - totalDonated).toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventDetailsStats;
