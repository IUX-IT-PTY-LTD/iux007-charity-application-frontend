'use client';

import { useEffect } from 'react';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Shield, Key, Bell } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import ProfileInformationSection from '@/components/admin/profile/ProfileInformationSection';
import AccountSecuritySection from '@/components/admin/profile/AccountSecuritySection';

const ProfilePage = () => {
  const { setPageTitle, setPageSubtitle } = useAdminContext();

  // Set page title
  useEffect(() => {
    setPageTitle('Profile');
    setPageSubtitle('Manage your personal account information and security settings');
  }, [setPageTitle, setPageSubtitle]);

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col">
        <Tabs defaultValue="information" className="w-full">
          <TabsList className="mb-6 grid grid-cols-2 w-full max-w-7xl">
            <TabsTrigger value="information" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Information</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Information Tab */}
          <TabsContent value="information" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3">
                <h2 className="text-xl font-semibold mb-1">Personal Information</h2>
                <p className="text-muted-foreground mb-4">
                  Update your personal details and contact information
                </p>
                <Separator className="my-4" />
              </div>

              <div className="md:col-span-3 lg:col-span-2">
                <ProfileInformationSection />
              </div>

              <div className="md:col-span-3 lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Status</CardTitle>
                    <CardDescription>Your account information overview</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-300 rounded-md text-sm">
                      <p className="font-medium mb-1">Profile Complete</p>
                      <p className="text-green-700 dark:text-green-400">
                        All required fields have been filled out.
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 rounded-md text-sm">
                      <p className="font-medium mb-1">Admin Account</p>
                      <p className="text-blue-700 dark:text-blue-400">
                        You have full administrative privileges.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3">
                <h2 className="text-xl font-semibold mb-1">Security Settings</h2>
                <p className="text-muted-foreground mb-4">
                  Manage your account security preferences and authentication methods
                </p>
                <Separator className="my-4" />
              </div>

              <div className="md:col-span-3 lg:col-span-2">
                <AccountSecuritySection />
              </div>

              <div className="md:col-span-3 lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Tips</CardTitle>
                    <CardDescription>Keep your account secure</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 rounded-md text-sm">
                      <p className="font-medium mb-1">Strong Password</p>
                      <p className="text-amber-700 dark:text-amber-400">
                        Use at least 12 characters with mixed case, numbers, and symbols.
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 rounded-md text-sm">
                      <p className="font-medium mb-1">Regular Updates</p>
                      <p className="text-blue-700 dark:text-blue-400">
                        Update your password every 3-6 months for better security.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
