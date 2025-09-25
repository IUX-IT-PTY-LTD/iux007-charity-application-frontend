// src/app/(admin)/admin/settings/page.jsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Phone, ExternalLink, Lock, Palette } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';

import ContactInformationSection from '@/components/admin/settings/ContactInformationSection';
import FooterLinkManagementSection from '@/components/admin/settings/FooterLinkManagementSection';
import ColorSchemeSection from '@/components/admin/settings/ColorSchemeSection';

// Import permission hooks and context
import { PermissionProvider } from '@/api/contexts/PermissionContext';
import { useContactPermissions, useAdminPermissions } from '@/api/hooks/useModulePermissions';
import { isAuthenticated } from '@/api/services/admin/authService';

// Main Settings Page Component
const SettingsPageContent = () => {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();
  const contactPermissions = useContactPermissions();
  const adminPermissions = useAdminPermissions();

  // Set page title
  useEffect(() => {
    setPageTitle('Settings');
    setPageSubtitle('Manage your company information and website settings');
  }, [setPageTitle, setPageSubtitle]);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error('Authentication required. Please log in.');
      router.push('/admin/login');
    }
  }, [router]);

  // Check if user has access to any settings
  useEffect(() => {
    if (!contactPermissions.isLoading && !adminPermissions.isLoading) {
      const hasAnyAccess = contactPermissions.hasAccess || adminPermissions.hasAccess;
      if (!hasAnyAccess) {
        toast.error("You don't have access to settings management.");
        router.push('/admin/dashboard');
      }
    }
  }, [
    contactPermissions.isLoading,
    contactPermissions.hasAccess,
    adminPermissions.isLoading,
    adminPermissions.hasAccess,
    router,
  ]);

  // Show loading state while permissions are loading
  if (contactPermissions.isLoading || adminPermissions.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings permissions...</p>
        </div>
      </div>
    );
  }

  // Show access denied if user has no permissions
  const hasAnyAccess = contactPermissions.hasAccess || adminPermissions.hasAccess;
  if (!hasAnyAccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access settings management.
          </p>
          <Button onClick={() => router.push('/admin/dashboard')}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  // Determine which tabs to show based on permissions
  const showContactTab = contactPermissions.hasAccess;
  const showFooterTab = adminPermissions.hasAccess;
  const showColorSchemeTab = adminPermissions.hasAccess; // Color scheme requires admin permissions

  // If only one tab is available, show it directly
  if (showContactTab && !showFooterTab) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-1">Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              Manage your company contact details displayed on the website
            </p>
            <Separator className="my-4" />
          </div>

          <div className="max-w-4xl">
            <ContactInformationSection />
          </div>
        </div>
      </div>
    );
  }

  if (!showContactTab && showFooterTab) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-1">Footer Management</h2>
            <p className="text-muted-foreground mb-4">
              Manage accreditations and social media links displayed in the website footer
            </p>
            <Separator className="my-4" />
          </div>

          <div className="max-w-4xl">
            <FooterLinkManagementSection />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col">
        {/* Show permission warning if user has limited access */}
        {(!contactPermissions.canEdit && contactPermissions.hasAccess) ||
        (!adminPermissions.canEdit && adminPermissions.hasAccess) ? (
          <Alert className="mb-6">
            <Lock className="h-4 w-4" />
            <AlertTitle>Limited Access</AlertTitle>
            <AlertDescription>
              You have view-only access to some settings. Contact an administrator to make changes.
              {!contactPermissions.canEdit &&
                contactPermissions.hasAccess &&
                ' Contact information is read-only.'}
              {!adminPermissions.canEdit &&
                adminPermissions.hasAccess &&
                ' Footer settings are read-only.'}
            </AlertDescription>
          </Alert>
        ) : null}

        <Tabs defaultValue={showContactTab ? 'contact' : showColorSchemeTab ? 'colors' : 'footer'} className="w-full">
          <TabsList className="mb-6 grid grid-cols-3 w-full max-w-7xl">
            <TabsTrigger
              value="contact"
              className="flex items-center gap-2"
              disabled={!showContactTab}
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Contact Info</span>
              {!showContactTab && <Lock className="h-3 w-3 ml-1" />}
            </TabsTrigger>
            <TabsTrigger
              value="colors"
              className="flex items-center gap-2"
              disabled={!showColorSchemeTab}
            >
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Color Scheme</span>
              {!showColorSchemeTab && <Lock className="h-3 w-3 ml-1" />}
            </TabsTrigger>
            <TabsTrigger
              value="footer"
              className="flex items-center gap-2"
              disabled={!showFooterTab}
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Footer Links</span>
              {!showFooterTab && <Lock className="h-3 w-3 ml-1" />}
            </TabsTrigger>
          </TabsList>

          {/* Contact Information Tab */}
          {showContactTab && (
            <TabsContent value="contact" className="space-y-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">
                    Contact Information
                    {!contactPermissions.canEdit && (
                      <span className="text-orange-600 ml-2 text-sm">(Read-only)</span>
                    )}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Manage your company contact details displayed on the website
                    {!contactPermissions.canEdit && (
                      <span className="text-orange-600 ml-1">- View-only access</span>
                    )}
                  </p>
                  <Separator className="my-4" />
                </div>

                <div className="max-w-4xl">
                  <ContactInformationSection />
                </div>
              </div>
            </TabsContent>
          )}

          {/* Color Scheme Tab */}
          {showColorSchemeTab && (
            <TabsContent value="colors" className="space-y-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">
                    Color Scheme
                    {!adminPermissions.canEdit && (
                      <span className="text-orange-600 ml-2 text-sm">(Read-only)</span>
                    )}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Customize your website's color scheme. Colors will be applied across buttons, links, loaders, and footer.
                    {!adminPermissions.canEdit && (
                      <span className="text-orange-600 ml-1">- View-only access</span>
                    )}
                  </p>
                  <Separator className="my-4" />
                </div>

                <div className="max-w-4xl">
                  <ColorSchemeSection />
                </div>
              </div>
            </TabsContent>
          )}

          {/* Footer Management Tab */}
          {showFooterTab && (
            <TabsContent value="footer" className="space-y-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">
                    Footer Management
                    {!adminPermissions.canEdit && (
                      <span className="text-orange-600 ml-2 text-sm">(Read-only)</span>
                    )}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Manage accreditations and social media links displayed in the website footer
                    {!adminPermissions.canEdit && (
                      <span className="text-orange-600 ml-1">- View-only access</span>
                    )}
                  </p>
                  <Separator className="my-4" />
                </div>

                <div className="max-w-4xl">
                  <FooterLinkManagementSection />
                </div>
              </div>
            </TabsContent>
          )}

          {/* Access denied tabs */}
          {!showContactTab && (
            <TabsContent value="contact" className="space-y-6">
              <div className="flex items-center justify-center py-16">
                <Alert variant="destructive" className="max-w-md">
                  <Lock className="h-4 w-4" />
                  <AlertTitle>Access Denied</AlertTitle>
                  <AlertDescription>
                    You don't have permission to access contact information settings.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          )}

          {!showColorSchemeTab && (
            <TabsContent value="colors" className="space-y-6">
              <div className="flex items-center justify-center py-16">
                <Alert variant="destructive" className="max-w-md">
                  <Lock className="h-4 w-4" />
                  <AlertTitle>Access Denied</AlertTitle>
                  <AlertDescription>
                    You don't have permission to access color scheme settings.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          )}

          {!showFooterTab && (
            <TabsContent value="footer" className="space-y-6">
              <div className="flex items-center justify-center py-16">
                <Alert variant="destructive" className="max-w-md">
                  <Lock className="h-4 w-4" />
                  <AlertTitle>Access Denied</AlertTitle>
                  <AlertDescription>
                    You don't have permission to access footer management settings.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

// Wrapper component that provides permission context
const SettingsPage = () => {
  return (
    <PermissionProvider>
      <SettingsPageContent />
    </PermissionProvider>
  );
};

export default SettingsPage;
