'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Activity,
  BarChart3,
  Calendar,
  CreditCard,
  DollarSign,
  Download,
  ExternalLink,
  FileText,
  PieChart,
  Printer,
  Users,
  ChevronRight,
  Search,
  Filter,
  Bell,
  TrendingUp,
} from 'lucide-react';
import { LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line } from 'recharts';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Import Dashboard Components - using destructured named imports to avoid undefined errors
import {
  StatCard,
  CampaignPerformance,
  RecentDonations,
} from '@/components/admin/dashboard/Components';

import { NotificationsButton } from '@/components/admin/dashboard/Notifications';
import { DashboardAnalytics } from '@/components/admin/dashboard/Analytics';
import {
  getStatistics,
  getEventsStatistics,
  getMonthlyDonationsStatistics,
} from '@/api/services/admin/adminService';

const AdminDashboard = () => {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();
  const [timeframe, setTimeframe] = useState('month');
  const [stats, setStats] = useState(null);
  const [recentDonations, setRecentDonations] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [monthlyDonationsData, setMonthlyDonationsData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Set page title and subtitle
  useEffect(() => {
    setPageTitle('Dashboard');
    setPageSubtitle('Charity management overview');
  }, [setPageTitle, setPageSubtitle]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch real statistics from API
        const statisticsResponse = await getStatistics();
        if (statisticsResponse.status === 'success') {
          const statsData = statisticsResponse.data;
          const mappedStats = {
            totalDonations: statsData.total_donations,
            totalRaised: statsData.total_amount_raised,
            activeEvents: statsData.active_events,
            totalDonors: statsData.total_donors,
            totalEvents: statsData.total_events,
            featuredEvents: statsData.featured_events,
          };
          setStats(mappedStats);
        } else {
          // Fallback to mock stats if API fails
          const mockStats = {
            totalDonations: 0,
            totalRaised: 0,
            activeEvents: 0,
            totalDonors: 0,
          };
          setStats(mockStats);
        }

        // Fetch real events statistics
        try {
          const eventsResponse = await getEventsStatistics();
          if (eventsResponse.status === 'success') {
            setEventsData(eventsResponse.data);

            // Transform events data for campaign performance component
            const transformedCampaigns = eventsResponse.data.map((event) => ({
              id: event.id,
              name: event.title,
              raised: event.total_raised,
              target: event.target_amount,
              percentage: event.completion_percentage,
              days_left: Math.ceil((new Date(event.end_date) - new Date()) / (1000 * 60 * 60 * 24)),
            }));
            setCampaigns(transformedCampaigns);
          } else {
            // Keep existing mock campaigns if API fails
          }
        } catch (error) {
          console.error('Error fetching events statistics:', error);
          // Keep existing mock campaigns
        }

        // Fetch monthly donations statistics
        try {
          const monthlyResponse = await getMonthlyDonationsStatistics();
          if (monthlyResponse.status === 'success') {
            setMonthlyDonationsData(monthlyResponse.data.monthly_data);
          }
        } catch (error) {
          console.error('Error fetching monthly donations statistics:', error);
        }

        // Generate recent donations
        const recentDonationsMock = [];
        const names = [
          'John Smith',
          'Emma Wilson',
          'Michael Johnson',
          'Sarah Davis',
          'Robert Brown',
        ];
        const events = [
          'Winter Clothes Drive',
          'Education for All',
          'Food Bank Fundraiser',
          'Flood Relief',
          'Annual Charity Gala',
        ];
        const now = new Date();

        for (let i = 0; i < 5; i++) {
          recentDonationsMock.push({
            id: `don-${i + 1}`,
            donor_name: names[i],
            amount: Math.floor(Math.random() * 900) + 100,
            event_name: events[i],
            date: new Date(now - Math.floor(Math.random() * 5 * 24 * 60 * 60 * 1000)).toISOString(),
            anonymous: i === 2, // Make one donation anonymous
          });
        }
        setRecentDonations(recentDonationsMock);

        // Generate campaign data
        const campaignsMock = [
          {
            id: 1,
            name: 'Education Fund',
            raised: 35000,
            target: 50000,
            days_left: 15,
          },
          {
            id: 2,
            name: 'Clean Water Project',
            raised: 28000,
            target: 30000,
            days_left: 7,
          },
          {
            id: 3,
            name: 'Medical Aid',
            raised: 12000,
            target: 40000,
            days_left: 28,
          },
        ];
        // setCampaigns(campaignsMock);

        // Generate notifications
        const notificationsMock = [
          {
            id: '1',
            type: 'donation',
            title: 'New Donation Received',
            message:
              'You received a $1,200 donation from John Smith for the Education Fund campaign.',
            timestamp: new Date(now - 12 * 60 * 1000).toISOString(),
            read: false,
            actionUrl: '/admin/donations/123',
            actionText: 'View Donation',
          },
          {
            id: '2',
            type: 'user',
            title: 'New Volunteer Registration',
            message: 'Sarah Davis has signed up as a volunteer for your organization.',
            timestamp: new Date(now - 60 * 60 * 1000).toISOString(),
            read: false,
            actionUrl: '/admin/users/456',
            actionText: 'View Profile',
          },
          {
            id: '3',
            type: 'system',
            title: 'Event Location Updated',
            message:
              "The Winter Clothes Drive event location has been updated to 'Community Center'.",
            timestamp: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
            read: true,
            actionUrl: '/admin/events/789',
            actionText: 'View Event',
          },
        ];
        setNotifications(notificationsMock);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to mock stats if API call fails
        const mockStats = {
          totalDonations: 2834,
          totalRaised: 367921,
          activeEvents: 8,
          totalDonors: 1532,
        };
        setStats(mockStats);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Handle mark all notifications as read
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Top Header with Search and Notifications */}
        {/* <div className="flex items-center justify-between mb-6">
          <div className="relative max-w-md w-full lg:max-w-sm hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 w-full rounded-full bg-white dark:bg-gray-800"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <NotificationsButton
              unreadCount={notifications.filter((n) => !n.read).length}
              notifications={notifications}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
            <Button variant="ghost" size="icon">
              <PieChart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <ExternalLink className="h-5 w-5" />
            </Button>
          </div>
        </div> */}

        {/* Stat Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard
            title="Total Donations"
            value={stats.totalDonations.toLocaleString()}
            description="All time donations"
            icon={Activity}
            trend="up"
            trendValue="12.5%"
          />
          <StatCard
            title="Total Raised"
            value={`$${stats.totalRaised.toLocaleString()}`}
            description="Across all campaigns"
            icon={DollarSign}
            trend="up"
            trendValue="8.2%"
          />
          <StatCard
            title="Active Events"
            value={stats.activeEvents}
            description="Currently running events"
            icon={Calendar}
            trend="down"
            trendValue="3.1%"
          />
          <StatCard
            title="Total Donors"
            value={stats.totalDonors.toLocaleString()}
            description="Unique contributors"
            icon={Users}
            trend="up"
            trendValue="4.3%"
          />
          {stats.totalEvents && (
            <StatCard
              title="Total Events"
              value={stats.totalEvents}
              description="All events created"
              icon={Calendar}
              trend="up"
              trendValue="2.1%"
            />
          )}
          {stats.featuredEvents && (
            <StatCard
              title="Featured Events"
              value={stats.featuredEvents}
              description="Events in spotlight"
              icon={Calendar}
              trend="up"
              trendValue="5.7%"
            />
          )}
        </div>

        {/* Main Dashboard Content */}
        <div className="mt-6">
          <Tabs defaultValue="overview" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/admin/events/create')}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Create Event
                </Button>
              </div>
            </div>

            {/* Overview Tab - Simplified to just CampaignPerformance and RecentDonations */}
            <TabsContent value="overview">
              <div className="flex flex-row gap-6">
                <div className="flex-1">
                  <CampaignPerformance campaigns={campaigns} />
                </div>
                <div className="flex-1">
                  <RecentDonations donations={recentDonations} />
                </div>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="grid gap-6">
                {/* Monthly Donations Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Monthly Donations Trend
                    </CardTitle>
                    <CardDescription>
                      Monthly donation amounts and transaction counts for{' '}
                      {monthlyDonationsData.length > 0 ? monthlyDonationsData[0]?.year : '2025'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {monthlyDonationsData.length > 0 ? (
                      <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={monthlyDonationsData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                          >
                            <XAxis
                              dataKey="month_name"
                              fontSize={12}
                              tick={{ fill: '#6b7280' }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis
                              fontSize={12}
                              tick={{ fill: '#6b7280' }}
                              axisLine={false}
                              tickLine={false}
                              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                            />
                            <Tooltip
                              content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="bg-white p-4 border rounded-lg shadow-lg">
                                      <p className="font-semibold text-gray-900">
                                        {label} {data.year}
                                      </p>
                                      <p className="text-blue-600 font-medium">
                                        Total Amount: ${data.total_amount.toLocaleString()}
                                      </p>
                                      <p className="text-gray-600 text-sm">
                                        Transactions: {data.total_transactions}
                                      </p>
                                      <p className="text-gray-600 text-sm">
                                        Unique Donors: {data.unique_donors}
                                      </p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="total_amount"
                              stroke="#2563eb"
                              strokeWidth={3}
                              dot={{ fill: '#2563eb', strokeWidth: 2, r: 5 }}
                              activeDot={{ r: 7, stroke: '#2563eb', strokeWidth: 2, fill: '#fff' }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="text-center py-20">
                        <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">Loading Monthly Data</h3>
                        <p className="text-muted-foreground">
                          Monthly donation statistics are being loaded...
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Summary Statistics */}
                {monthlyDonationsData.length > 0 && (
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Year Total</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          $
                          {monthlyDonationsData
                            .reduce((sum, month) => sum + month.total_amount, 0)
                            .toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">Total donations this year</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Peak Month</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {
                            monthlyDonationsData.reduce(
                              (peak, month) =>
                                month.total_amount > peak.total_amount ? month : peak,
                              { total_amount: 0, month_name: 'None' }
                            ).month_name
                          }
                        </div>
                        <p className="text-xs text-muted-foreground">Highest donation month</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Average</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          $
                          {(
                            monthlyDonationsData.reduce(
                              (sum, month) => sum + month.total_amount,
                              0
                            ) / 12
                          ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                        <p className="text-xs text-muted-foreground">Average per month</p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
