'use client';

import React, { useState } from 'react';
import { Area, Bar, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  CreditCard,
  DollarSign,
  Download,
  Users,
  Calendar,
  TrendingUp,
  Heart,
  Clock,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Component for stats cards with icon
const StatCard = ({ title, value, description, icon, trend, trendValue }) => {
  const Icon = icon;
  const isPositive = trend === 'up';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-2">
          <p className="text-xs text-muted-foreground">{description}</p>
          {trend && (
            <span
              className={`flex items-center text-xs font-medium ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-1" />
              )}
              {trendValue}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Component for the overview chart
const OverviewChart = ({ data, timeframe }) => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Donation Overview</CardTitle>
        <CardDescription>
          {timeframe === 'year'
            ? 'Monthly donation amounts for the current year'
            : timeframe === 'month'
              ? 'Daily donation amounts for the current month'
              : 'Weekly donation amounts for the current quarter'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] w-full">
          <Area
            data={data}
            margin={{
              top: 20,
              right: 5,
              left: 0,
              bottom: 5,
            }}
            type="monotone"
            dataKey="amount"
            stroke="#2563eb"
            strokeWidth={2}
            fill="url(#colorAmount)"
          >
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
          </Area>
        </div>
      </CardContent>
    </Card>
  );
};

// Component for recent donations
const RecentDonations = ({ donations }) => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Donations</CardTitle>
        <CardDescription>Latest donations across all campaigns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {donations.map((donation) => (
            <div key={donation.id} className="flex items-center">
              <div className="flex items-center justify-center h-9 w-9 rounded-full bg-blue-50 text-blue-700 mr-4">
                {donation.anonymous ? (
                  <Heart className="h-5 w-5" />
                ) : (
                  <span className="font-semibold text-sm">
                    {donation.donor_name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .substring(0, 2)}
                  </span>
                )}
              </div>
              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium leading-none">
                  {donation.anonymous ? 'Anonymous Donor' : donation.donor_name}
                </p>
                <p className="text-xs text-muted-foreground">{donation.event_name}</p>
              </div>
              <div className="ml-auto font-medium">${donation.amount.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" size="sm">
          View All Donations
          <ChevronRight className="ml-auto h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

// Component for upcoming events
const UpcomingEvents = ({ events }) => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>Events scheduled in the next 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {events.map((event) => (
            <div key={event.id} className="flex items-start space-x-4">
              <div className="bg-muted rounded-md p-2 w-14 h-14 flex flex-col items-center justify-center text-center">
                <span className="text-sm font-semibold">
                  {new Date(event.start_date).toLocaleDateString('en-US', {
                    month: 'short',
                  })}
                </span>
                <span className="text-xl font-bold">{new Date(event.start_date).getDate()}</span>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">{event.title}</h4>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      event.status === '1'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {event.status === '1' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{event.description}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3" />
                  <span>
                    {new Date(event.start_date).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" size="sm">
          View All Events
          <ChevronRight className="ml-auto h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

// Component for donor activity chart
const DonorActivity = ({ data }) => {
  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center">
        <div className="flex-1">
          <CardTitle>Donor Activity</CardTitle>
          <CardDescription>New vs. returning donors over time</CardDescription>
        </div>
        <div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Bar
            data={data}
            margin={{
              top: 20,
              right: 5,
              left: 0,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="colorReturning" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <Bar dataKey="new" name="New Donors" fill="url(#colorNew)" radius={[4, 4, 0, 0]} />
            <Bar
              dataKey="returning"
              name="Returning Donors"
              fill="url(#colorReturning)"
              radius={[4, 4, 0, 0]}
            />
          </Bar>
        </div>
      </CardContent>
    </Card>
  );
};

// Component for campaign performance
const CampaignPerformance = ({ campaigns }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedCampaigns = showAll ? campaigns : campaigns.slice(0, 5);
  const hasMoreCampaigns = campaigns.length > 5;

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Campaign Performance</CardTitle>
        <CardDescription>Progress towards fundraising goals</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayedCampaigns.map((campaign) => {
            // Use the real completion percentage from API if available, otherwise calculate
            const percentage = campaign.percentage !== undefined 
              ? Math.round(campaign.percentage) 
              : Math.round((campaign.raised / campaign.target) * 100);
            
            return (
              <div key={campaign.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{campaign.name}</div>
                  <div className="text-xs text-muted-foreground">
                    ${campaign.raised.toLocaleString()} / ${campaign.target.toLocaleString()}
                  </div>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      percentage < 30
                        ? 'bg-red-500'
                        : percentage < 70
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>{percentage}% Complete</span>
                  <span className="text-muted-foreground">
                    {campaign.days_left > 0 ? `${campaign.days_left} days left` : 'Ended'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter>
        {hasMoreCampaigns ? (
          <Button 
            variant="outline" 
            className="w-full" 
            size="sm"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `Show More (${campaigns.length - 5} more)`}
            <ChevronRight className={`ml-auto h-4 w-4 transition-transform ${showAll ? 'rotate-90' : ''}`} />
          </Button>
        ) : (
          <Button variant="outline" className="w-full" size="sm">
            View All Campaigns
            <ChevronRight className="ml-auto h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export {
  StatCard,
  OverviewChart,
  RecentDonations,
  UpcomingEvents,
  DonorActivity,
  CampaignPerformance,
};
