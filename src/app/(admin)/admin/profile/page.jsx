// src/app/(admin)/admin/profile/page.jsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Shield, Key, Bell, Lock, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';

import ProfileInformationSection from '@/components/admin/profile/ProfileInformationSection';
import AccountSecuritySection from '@/components/admin/profile/AccountSecuritySection';

// Import permission hooks and context
import { PermissionProvider } from '@/api/contexts/PermissionContext';
import { useAdminPermissions } from '@/api/hooks/useModulePermissions';
import { isAuthenticated } from '@/api/services/admin/authService';

// Main Profile Page Component
const ProfilePageContent = () => {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();
  const adminPermissions = useAdminPermissions();

  // Set page title
  useEffect(() => {
    setPageTitle('Profile');
    setPageSubtitle('Manage your personal account information and security settings');
  }, [setPageTitle, setPageSubtitle]);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error('Authentication required. Please log in.');
      router.push('/admin/login');
    }
  }, [router]);

  // Check if user has any admin access (for profile management)
  useEffect(() => {
    if (!adminPermissions.isLoading && !adminPermissions.hasAccess) {
      toast.error("You don't have access to profile management.");
      router.push('/admin/dashboard');
    }
  }, [adminPermissions.isLoading, adminPermissions.hasAccess, router]);

  // Show loading state while permissions are loading
  if (adminPermissions.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile permissions...</p>
        </div>
      </div>
    );
  }

  // Show access denied if user has no admin permissions
  if (!adminPermissions.hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access profile management.
          </p>
          <Button onClick={() => router.push('/admin/dashboard')}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col">
        {/* Show permission warning for read-only access */}
        {!adminPermissions.canEdit && (
          <Alert className="mb-6">
            <Lock className="h-4 w-4" />
            <AlertTitle>Read-Only Access</AlertTitle>
            <AlertDescription>
              You have view-only access to your profile. You can see your information but cannot
              make changes. Contact an administrator if you need to update your profile.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="information" className="w-full">
          <TabsList className="mb-6 grid grid-cols-2 w-full max-w-7xl">
            <TabsTrigger value="information" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Information</span>
              {!adminPermissions.canView && <Lock className="h-3 w-3 ml-1" />}
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
              {!adminPermissions.canEdit && <Lock className="h-3 w-3 ml-1" />}
            </TabsTrigger>
          </TabsList>

          {/* Profile Information Tab */}
          <TabsContent value="information" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3">
                <h2 className="text-xl font-semibold mb-1">
                  Personal Information
                  {!adminPermissions.canEdit && (
                    <span className="text-orange-600 ml-2 text-sm">(Read-only)</span>
                  )}
                </h2>
                <p className="text-muted-foreground mb-4">
                  Update your personal details and contact information
                  {!adminPermissions.canEdit && (
                    <span className="text-orange-600 ml-1">- View-only access</span>
                  )}
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

                    {adminPermissions.canEdit ? (
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 rounded-md text-sm">
                        <p className="font-medium mb-1">Full Access</p>
                        <p className="text-blue-700 dark:text-blue-400">
                          You can view and edit your profile information.
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 bg-orange-50 dark:bg-orange-950/20 text-orange-800 dark:text-orange-300 rounded-md text-sm">
                        <p className="font-medium mb-1">Limited Access</p>
                        <p className="text-orange-700 dark:text-orange-400">
                          You have read-only access to your profile.
                        </p>
                      </div>
                    )}

                    {/* Permission breakdown */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span>View Profile:</span>
                        <span
                          className={adminPermissions.canView ? 'text-green-600' : 'text-red-600'}
                        >
                          {adminPermissions.canView ? '✓ Allowed' : '✗ Denied'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Edit Profile:</span>
                        <span
                          className={adminPermissions.canEdit ? 'text-green-600' : 'text-red-600'}
                        >
                          {adminPermissions.canEdit ? '✓ Allowed' : '✗ Denied'}
                        </span>
                      </div>
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
                <h2 className="text-xl font-semibold mb-1">
                  Security Settings
                  {!adminPermissions.canEdit && (
                    <span className="text-orange-600 ml-2 text-sm">(Read-only)</span>
                  )}
                </h2>
                <p className="text-muted-foreground mb-4">
                  Manage your account security preferences and authentication methods
                  {!adminPermissions.canEdit && (
                    <span className="text-orange-600 ml-1">- View-only access</span>
                  )}
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

                    {!adminPermissions.canEdit && (
                      <div className="p-3 bg-orange-50 dark:bg-orange-950/20 text-orange-800 dark:text-orange-300 rounded-md text-sm">
                        <p className="font-medium mb-1 flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          Limited Access
                        </p>
                        <p className="text-orange-700 dark:text-orange-400">
                          Contact an administrator to change your security settings.
                        </p>
                      </div>
                    )}
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

// Wrapper component that provides permission context
const ProfilePage = () => {
  return (
    <PermissionProvider>
      <ProfilePageContent />
    </PermissionProvider>
  );
};

export default ProfilePage;
