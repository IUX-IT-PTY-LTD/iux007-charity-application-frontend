'use client';

import { useEffect } from 'react';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, User, Building2, Bell, ExternalLink } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import ProfileInformationSection from '@/components/admin/settings/ProfileInformationSection';
import ContactInformationSection from '@/components/admin/settings/ContactInformationSection';
import FooterLinkManagementSection from '@/components/admin/settings/FooterLinkManagementSection';

const SettingsPage = () => {
  const { setPageTitle, setPageSubtitle } = useAdminContext();

  // Set page title
  useEffect(() => {
    setPageTitle('Settings');
    setPageSubtitle('Manage your account and application settings');
  }, [setPageTitle, setPageSubtitle]);

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col">
        {/* <h1 className="text-3xl font-bold tracking-tight mb-1">Settings</h1>
        <p className="text-muted-foreground mb-6">
          Manage your account preferences and company information
        </p> */}

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6 grid grid-cols-2 w-full max-w-7xl ">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Company</span>
            </TabsTrigger>
            {/* <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger> */}
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3">
                <h2 className="text-xl font-semibold mb-1">Profile Settings</h2>
                <p className="text-muted-foreground mb-4">
                  Manage your personal information and account credentials
                </p>
                <Separator className="my-4" />
              </div>

              <div className="md:col-span-3 lg:col-span-2">
                <ProfileInformationSection />
              </div>

              <div className="md:col-span-3 lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Security</CardTitle>
                    <CardDescription>Security recommendations for your account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 rounded-md text-sm">
                      <p className="font-medium mb-1">Enable Two-Factor Authentication</p>
                      <p className="text-amber-700 dark:text-amber-400">
                        Enhance your account security by enabling 2FA.
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-300 rounded-md text-sm">
                      <p className="font-medium mb-1">Password strength: Good</p>
                      <p className="text-green-700 dark:text-green-400">
                        Your password was last changed 2 months ago.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Company Tab */}
          <TabsContent value="company" className="space-y-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">Company Settings</h2>
                <p className="text-muted-foreground mb-4">
                  Manage your company information and public contact details
                </p>
                <Separator className="my-4" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="w-full">
                  <ContactInformationSection />
                </div>

                <div className="w-full">
                  <FooterLinkManagementSection />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Notifications Tab - Placeholder for future implementation */}
          {/* <TabsContent value="notifications" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3">
                <h2 className="text-xl font-semibold mb-1">Notification Settings</h2>
                <p className="text-muted-foreground mb-4">
                  Manage how you receive notifications and alerts
                </p>
                <Separator className="my-4" />
              </div>
              
              <div className="md:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Coming soon</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-8 flex flex-col items-center justify-center text-center">
                      <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Notification Settings</h3>
                      <p className="text-muted-foreground mb-4 max-w-md">
                        This feature is coming soon. You'll be able to customize how you receive
                        notifications about user activities, donations, and system alerts.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;
