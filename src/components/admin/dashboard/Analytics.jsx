'use client';

import React, { useState, useEffect } from 'react';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { Bar, Line } from 'recharts';
import { Doughnut } from 'react-chartjs-2';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart4,
  Calendar,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Filter,
  Globe,
  HelpCircle,
  Mail,
  MapPin,
  PieChart,
  Search,
  Settings,
  Share2,
  TrendingUp,
  Users,
} from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Dashboard Analytics Component - can be used in different views
const DashboardAnalytics = () => {
  const [timeframe, setTimeframe] = useState('month');
  const [donorData, setDonorData] = useState([]);
  const [donationMethods, setDonationMethods] = useState([]);

  useEffect(() => {
    // Generate donor acquisition data
    const generateDonorData = () => {
      const data = [];
      const now = new Date();

      if (timeframe === 'year') {
        // Monthly data for year
        for (let i = 0; i < 12; i++) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - (11 - i));
          data.push({
            name: date.toLocaleDateString('en-US', { month: 'short' }),
            'New Donors': Math.floor(Math.random() * 80) + 20,
            'Returning Donors': Math.floor(Math.random() * 120) + 50,
          });
        }
      } else if (timeframe === 'quarter') {
        // Weekly data for quarter
        for (let i = 0; i < 13; i++) {
          data.push({
            name: `W${i + 1}`,
            'New Donors': Math.floor(Math.random() * 30) + 5,
            'Returning Donors': Math.floor(Math.random() * 40) + 10,
          });
        }
      } else {
        // Daily data for month
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        for (let i = 1; i <= daysInMonth; i++) {
          data.push({
            name: i.toString(),
            'New Donors': Math.floor(Math.random() * 10) + 1,
            'Returning Donors': Math.floor(Math.random() * 15) + 2,
          });
        }
      }

      setDonorData(data);
    };

    // Generate donation methods data
    const generateDonationMethods = () => {
      setDonationMethods([
        { name: 'Credit Card', value: 58 },
        { name: 'PayPal', value: 24 },
        { name: 'Bank Transfer', value: 12 },
        { name: 'Cash', value: 6 },
      ]);
    };

    generateDonorData();
    generateDonationMethods();
  }, [timeframe]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Analytics</h2>
          <p className="text-muted-foreground">Donation and donor metrics overview</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={timeframe === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeframe('month')}
          >
            Month
          </Button>
          <Button
            variant={timeframe === 'quarter' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeframe('quarter')}
          >
            Quarter
          </Button>
          <Button
            variant={timeframe === 'year' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeframe('year')}
          >
            Year
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>Donor Acquisition</CardTitle>
            <CardDescription>New vs returning donors over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <Bar
                data={donorData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <defs>
                  <linearGradient id="colorNewDonors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="colorReturningDonors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <Bar
                  dataKey="New Donors"
                  name="New Donors"
                  fill="url(#colorNewDonors)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="Returning Donors"
                  name="Returning Donors"
                  fill="url(#colorReturningDonors)"
                  radius={[4, 4, 0, 0]}
                />
              </Bar>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Donation Methods</CardTitle>
            <CardDescription>Breakdown by payment type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] flex items-center justify-center">
              <Doughnut
                data={donationMethods}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                <defs>
                  <radialGradient
                    id="colorCreditCard"
                    cx="50%"
                    cy="50%"
                    r="50%"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </radialGradient>
                  <radialGradient
                    id="colorPayPal"
                    cx="50%"
                    cy="50%"
                    r="50%"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#10b981" />
                  </radialGradient>
                  <radialGradient
                    id="colorBank"
                    cx="50%"
                    cy="50%"
                    r="50%"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </radialGradient>
                  <radialGradient
                    id="colorCash"
                    cx="50%"
                    cy="50%"
                    r="50%"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </radialGradient>
                </defs>
              </Doughnut>
            </div>
            <div className="space-y-2 mt-4">
              {donationMethods.map((method, index) => (
                <div key={method.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{
                        background:
                          index === 0
                            ? 'var(--color-blue-500)'
                            : index === 1
                              ? 'var(--color-green-500)'
                              : index === 2
                                ? 'var(--color-yellow-500)'
                                : 'var(--color-purple-500)',
                      }}
                    ></div>
                    <span>{method.name}</span>
                  </div>
                  <span className="font-medium">{method.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Donation Frequency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4</div>
            <p className="text-xs text-muted-foreground">Donations per donor</p>
            <div className="mt-4 h-[60px]">
              <Line
                data={[
                  { name: 'Jan', value: 2.1 },
                  { name: 'Feb', value: 2.2 },
                  { name: 'Mar', value: 2.0 },
                  { name: 'Apr', value: 2.3 },
                  { name: 'May', value: 2.4 },
                ]}
                margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Donation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$86.72</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 inline-flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                12.3%
              </span>{' '}
              vs previous period
            </p>
            <div className="mt-4 h-[60px]">
              <Line
                data={[
                  { name: 'Jan', value: 76.2 },
                  { name: 'Feb', value: 82.4 },
                  { name: 'Mar', value: 80.1 },
                  { name: 'Apr', value: 79.8 },
                  { name: 'May', value: 86.7 },
                ]}
                margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recurring Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32.6%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 inline-flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                4.2%
              </span>{' '}
              vs previous period
            </p>
            <div className="mt-4 h-[60px]">
              <Line
                data={[
                  { name: 'Jan', value: 28.1 },
                  { name: 'Feb', value: 27.9 },
                  { name: 'Mar', value: 30.2 },
                  { name: 'Apr', value: 31.8 },
                  { name: 'May', value: 32.6 },
                ]}
                margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                type="monotone"
                dataKey="value"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Donor Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68.4%</div>
            <p className="text-xs text-muted-foreground">Year-over-year retention</p>
            <div className="mt-4 h-[60px]">
              <Line
                data={[
                  { name: 'Jan', value: 65.3 },
                  { name: 'Feb', value: 64.8 },
                  { name: 'Mar', value: 66.2 },
                  { name: 'Apr', value: 67.9 },
                  { name: 'May', value: 68.4 },
                ]}
                margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                type="monotone"
                dataKey="value"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Donation sources by location</CardDescription>
            </div>
            <Select defaultValue="donations">
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="donations">Total Donations</SelectItem>
                <SelectItem value="donors">Unique Donors</SelectItem>
                <SelectItem value="amount">Donation Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full bg-muted/20 rounded-md flex items-center justify-center">
            <div className="text-center">
              <Globe className="h-12 w-12 text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Interactive Map Visualization</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                This area would contain an interactive map showing donation sources by geographic
                location. The map would be colored to indicate donation density by region.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">New York</span>
                <span className="text-sm">21%</span>
              </div>
              <Progress value={21} className="h-2" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">California</span>
                <span className="text-sm">18%</span>
              </div>
              <Progress value={18} className="h-2" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Texas</span>
                <span className="text-sm">14%</span>
              </div>
              <Progress value={14} className="h-2" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Florida</span>
                <span className="text-sm">12%</span>
              </div>
              <Progress value={12} className="h-2" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Illinois</span>
                <span className="text-sm">9%</span>
              </div>
              <Progress value={9} className="h-2" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Other</span>
                <span className="text-sm">26%</span>
              </div>
              <Progress value={26} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardAnalytics;
