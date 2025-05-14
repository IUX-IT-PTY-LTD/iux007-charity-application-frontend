"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { useAdminContext } from "@/components/admin/admin-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Import Dashboard Components - using destructured named imports to avoid undefined errors
import {
  StatCard,
  CampaignPerformance,
  RecentDonations,
} from "@/components/admin/dashboard/Components";

// Import Notifications Component
import { NotificationsButton } from "@/components/admin/dashboard/Notifications";

// Import Analytics Component directly - comment this out initially to test if other parts work
// The error suggests this import might be problematic
import { DashboardAnalytics } from "@/components/admin/dashboard/Analytics";

const AdminDashboard = () => {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();
  const [timeframe, setTimeframe] = useState("month");
  const [stats, setStats] = useState(null);
  const [recentDonations, setRecentDonations] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Set page title and subtitle
  useEffect(() => {
    setPageTitle("Dashboard");
    setPageSubtitle("Charity management overview");
  }, [setPageTitle, setPageSubtitle]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Generate stats
        const mockStats = {
          totalDonations: 2834,
          totalRaised: 367921,
          activeEvents: 8,
          totalDonors: 1532,
        };
        setStats(mockStats);

        // Generate recent donations
        const recentDonationsMock = [];
        const names = [
          "John Smith",
          "Emma Wilson",
          "Michael Johnson",
          "Sarah Davis",
          "Robert Brown",
        ];
        const events = [
          "Winter Clothes Drive",
          "Education for All",
          "Food Bank Fundraiser",
          "Flood Relief",
          "Annual Charity Gala",
        ];
        const now = new Date();

        for (let i = 0; i < 5; i++) {
          recentDonationsMock.push({
            id: `don-${i + 1}`,
            donor_name: names[i],
            amount: Math.floor(Math.random() * 900) + 100,
            event_name: events[i],
            date: new Date(
              now - Math.floor(Math.random() * 5 * 24 * 60 * 60 * 1000)
            ).toISOString(),
            anonymous: i === 2, // Make one donation anonymous
          });
        }
        setRecentDonations(recentDonationsMock);

        // Generate campaign data
        const campaignsMock = [
          {
            id: 1,
            name: "Education Fund",
            raised: 35000,
            target: 50000,
            days_left: 15,
          },
          {
            id: 2,
            name: "Clean Water Project",
            raised: 28000,
            target: 30000,
            days_left: 7,
          },
          {
            id: 3,
            name: "Medical Aid",
            raised: 12000,
            target: 40000,
            days_left: 28,
          },
        ];
        setCampaigns(campaignsMock);

        // Generate notifications
        const notificationsMock = [
          {
            id: "1",
            type: "donation",
            title: "New Donation Received",
            message:
              "You received a $1,200 donation from John Smith for the Education Fund campaign.",
            timestamp: new Date(now - 12 * 60 * 1000).toISOString(),
            read: false,
            actionUrl: "/admin/donations/123",
            actionText: "View Donation",
          },
          {
            id: "2",
            type: "user",
            title: "New Volunteer Registration",
            message:
              "Sarah Davis has signed up as a volunteer for your organization.",
            timestamp: new Date(now - 60 * 60 * 1000).toISOString(),
            read: false,
            actionUrl: "/admin/users/456",
            actionText: "View Profile",
          },
          {
            id: "3",
            type: "system",
            title: "Event Location Updated",
            message:
              "The Winter Clothes Drive event location has been updated to 'Community Center'.",
            timestamp: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
            read: true,
            actionUrl: "/admin/events/789",
            actionText: "View Event",
          },
        ];
        setNotifications(notificationsMock);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
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
        <div className="flex items-center justify-between mb-6">
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
            {/* <Button variant="ghost" size="icon">
              <PieChart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <ExternalLink className="h-5 w-5" />
            </Button> */}
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
        </div>

        {/* Main Dashboard Content */}
        <div className="mt-6">
          <Tabs defaultValue="overview" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button size="sm">
                  <PieChart className="mr-2 h-4 w-4" />
                  Generate Report
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

            {/* Analytics Tab - Comment out for now due to the error */}
            <TabsContent value="analytics">
              <Card className="p-6">
                <CardHeader>
                  <CardTitle>Analytics Dashboard</CardTitle>
                  <CardDescription>
                    Detailed analytics and metrics for your charity
                    organization.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-10">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Analytics Module
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      The analytics module is currently being updated. Please
                      check back later.
                    </p>
                    {/* <Button
                      variant="outline"
                      onClick={() => router.push("/admin/analytics")}
                    >
                      Go to Analytics Page
                    </Button> */}
                  </div>
                </CardContent>
              </Card>
              {/* <DashboardAnalytics /> */}
            </TabsContent>

            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle>Generated Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-muted-foreground mr-3" />
                        <div>
                          <p className="text-sm font-medium">
                            Annual Donation Report 2024
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Generated on May 5, 2024
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <Printer className="h-4 w-4 mr-1" />
                          Print
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-muted-foreground mr-3" />
                        <div>
                          <p className="text-sm font-medium">
                            Quarterly Event Performance
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Generated on April 12, 2024
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <Printer className="h-4 w-4 mr-1" />
                          Print
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-muted-foreground mr-3" />
                        <div>
                          <p className="text-sm font-medium">
                            Donor Engagement Analysis
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Generated on March 28, 2024
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <Printer className="h-4 w-4 mr-1" />
                          Print
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button variant="outline" className="w-full">
                        Generate New Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activities">
              <Card>
                <CardHeader>
                  <CardTitle>Recent System Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center border-b pb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                          <p className="text-sm font-medium">Admin User</p>
                          <p className="text-xs text-muted-foreground ml-2">
                            admin@charity.org
                          </p>
                        </div>
                        <p className="text-sm">
                          Created a new campaign: "Summer Food Drive"
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Today, 10:42 AM
                      </div>
                    </div>

                    <div className="flex items-center border-b pb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                          <p className="text-sm font-medium">System</p>
                        </div>
                        <p className="text-sm">
                          Automatically updated donor metrics for April
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Yesterday, 11:30 PM
                      </div>
                    </div>

                    <div className="flex items-center border-b pb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                          <p className="text-sm font-medium">Content Editor</p>
                          <p className="text-xs text-muted-foreground ml-2">
                            editor@charity.org
                          </p>
                        </div>
                        <p className="text-sm">Published 3 new blog articles</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Yesterday, 3:15 PM
                      </div>
                    </div>

                    <div className="flex items-center border-b pb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                          <p className="text-sm font-medium">System Alert</p>
                        </div>
                        <p className="text-sm">
                          Storage quota reaching 80% capacity
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        May 12, 2024, 9:22 AM
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                          <p className="text-sm font-medium">Security Alert</p>
                        </div>
                        <p className="text-sm">
                          Failed login attempts detected
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        May 10, 2024, 11:47 PM
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-auto flex flex-col items-center justify-center py-4"
                  onClick={() => router.push("/admin/events/create")}
                >
                  <Calendar className="h-8 w-8 mb-2" />
                  <span>Create Event</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto flex flex-col items-center justify-center py-4"
                  onClick={() => router.push("/admin/blogs/create")}
                >
                  <FileText className="h-8 w-8 mb-2" />
                  <span>Write Blog</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto flex flex-col items-center justify-center py-4"
                  onClick={() => router.push("/admin/users")}
                >
                  <Users className="h-8 w-8 mb-2" />
                  <span>View Users</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto flex flex-col items-center justify-center py-4"
                  onClick={() => {}}
                >
                  <BarChart3 className="h-8 w-8 mb-2" />
                  <span>Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm">Storage</p>
                    <p className="text-sm font-medium">65%</p>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm">Performance</p>
                    <p className="text-sm font-medium">92%</p>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm">Uptime</p>
                    <p className="text-sm font-medium">99.9%</p>
                  </div>
                  <Progress value={99.9} className="h-2" />
                </div>
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    View System Status
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
