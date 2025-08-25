// src/components/admin/settings/FooterLinkManagementSection.jsx

'use client';

import { useState, useEffect } from 'react';
import { Loader2, RefreshCcw, AlertCircle, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import AccreditationsSection from './footerMangement/AccreditationsSection';
import SocialLinksSection from './footerMangement/SocialLinksSection';

// Import the protected settings service
import {
  getAllSettings,
  getSocialMediaSettings,
  getAccreditationSettings,
} from '@/api/services/admin/protected/settingsService';

// Import permission hooks
import { useAdminPermissions } from '@/api/hooks/useModulePermissions';
import { isPermissionError, getPermissionErrorMessage } from '@/api/utils/permissionErrors';

const FooterLinkManagementSection = () => {
  const adminPermissions = useAdminPermissions();

  const [allSettings, setAllSettings] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [accreditations, setAccreditations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    // Only fetch if user has admin view permission
    if (!adminPermissions.isLoading && !adminPermissions.canView) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await getAllSettings();
      if (response.status === 'success') {
        const settings = response.data || [];
        setAllSettings(settings);

        // Extract social media settings
        const socialMediaSettings = getSocialMediaSettings(settings);
        const formattedSocialLinks = socialMediaSettings.map((setting) => ({
          id: setting.id,
          platform: formatPlatformName(setting.key),
          url: setting.value,
          status: setting.status,
          key: setting.key, // Keep the original key for updates
        }));
        setSocialLinks(formattedSocialLinks);

        // Extract accreditation settings (ACNC)
        const accreditationSettings = getAccreditationSettings(settings);
        const formattedAccreditations = [];

        // Create accreditation object if both logo and link exist
        if (accreditationSettings.logo && accreditationSettings.link) {
          formattedAccreditations.push({
            id: 'acnc', // Use a consistent ID for ACNC
            title: 'ACNC Registration',
            logo: accreditationSettings.logo.value,
            link: accreditationSettings.link.value,
            status: accreditationSettings.logo.status && accreditationSettings.link.status ? 1 : 0,
            logoId: accreditationSettings.logo.id,
            linkId: accreditationSettings.link.id,
          });
        }
        setAccreditations(formattedAccreditations);
      } else {
        throw new Error(response.message || 'Failed to fetch footer link information');
      }
    } catch (err) {
      console.error('Error fetching footer data:', err);

      if (isPermissionError(err)) {
        setError(getPermissionErrorMessage(err));
        toast.error(getPermissionErrorMessage(err));
      } else if (err.message?.includes('permission')) {
        setError('You do not have permission to view footer settings.');
        toast.error('You do not have permission to view footer settings.');
      } else {
        setError('Failed to load footer link information. Please try again.');
        toast.error('Could not load footer link information');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!adminPermissions.isLoading) {
      fetchData();
    }
  }, [adminPermissions.isLoading, adminPermissions.canView]);

  // Helper function to format platform names
  const formatPlatformName = (key) => {
    const platformMap = {
      facebook_link: 'Facebook',
      instagram: 'Instagram',
      twitter: 'Twitter',
      linkedin: 'LinkedIn',
      youtube: 'YouTube',
      tiktok: 'TikTok',
    };
    return platformMap[key.toLowerCase()] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  // Function to refresh data after updates
  const refreshData = async () => {
    await fetchData();
  };

  // Show loading state while permissions are loading
  if (adminPermissions.isLoading || loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Footer Link Management</CardTitle>
          <CardDescription>
            Manage accreditations and social media links displayed in the website footer
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-muted-foreground">Loading footer information...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show access denied if user has no admin permissions
  if (!adminPermissions.hasAccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Footer Link Management</CardTitle>
          <CardDescription>
            Manage accreditations and social media links displayed in the website footer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <Lock className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You don't have access to footer settings management. Please contact an administrator.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Show view permission denied if user can't view
  if (!adminPermissions.canView) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Footer Link Management</CardTitle>
          <CardDescription>
            Manage accreditations and social media links displayed in the website footer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <Lock className="h-4 w-4" />
            <AlertTitle>View Permission Required</AlertTitle>
            <AlertDescription>You don't have permission to view footer settings.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Footer Link Management</CardTitle>
          <CardDescription>
            Manage accreditations and social media links displayed in the website footer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          {adminPermissions.canView && (
            <Button onClick={fetchData} className="mt-2">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Footer Link Management
          {!adminPermissions.canEdit && (
            <span className="text-orange-600 ml-2 text-sm">(Read-only)</span>
          )}
        </CardTitle>
        <CardDescription>
          Manage accreditations and social media links displayed in the website footer
          {!adminPermissions.canEdit && (
            <span className="text-orange-600 ml-1">- View-only access</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Show permission warning for read-only access */}
        {!adminPermissions.canEdit && (
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertTitle>Read-Only Access</AlertTitle>
            <AlertDescription>
              You can view footer settings but cannot make changes. Contact an administrator to
              modify footer links.
            </AlertDescription>
          </Alert>
        )}

        {/* Accreditations Section */}
        <AccreditationsSection
          accreditations={accreditations}
          setAccreditations={setAccreditations}
          onRefresh={refreshData}
          adminPermissions={adminPermissions}
        />

        {/* Social Media Links Section */}
        <SocialLinksSection
          socialLinks={socialLinks}
          setSocialLinks={setSocialLinks}
          onRefresh={refreshData}
          adminPermissions={adminPermissions}
        />
      </CardContent>
    </Card>
  );
};

export default FooterLinkManagementSection;
