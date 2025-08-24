'use client';

import { useState, useEffect } from 'react';
import { Loader2, RefreshCcw, AlertCircle } from 'lucide-react';
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

const FooterLinkManagementSection = () => {
  const [allSettings, setAllSettings] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [accreditations, setAccreditations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
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

      // Handle permission errors gracefully
      if (err.message?.includes('permission')) {
        setError('You do not have permission to view footer settings.');
      } else {
        setError('Failed to load footer link information. Please try again.');
      }

      toast.error('Could not load footer link information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  if (loading) {
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
          <Button onClick={fetchData} className="mt-2">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Footer Link Management</CardTitle>
        <CardDescription>
          Manage accreditations and social media links displayed in the website footer
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Accreditations Section */}
        <AccreditationsSection
          accreditations={accreditations}
          setAccreditations={setAccreditations}
          onRefresh={refreshData}
        />

        {/* Social Media Links Section */}
        <SocialLinksSection
          socialLinks={socialLinks}
          setSocialLinks={setSocialLinks}
          onRefresh={refreshData}
        />
      </CardContent>
    </Card>
  );
};

export default FooterLinkManagementSection;
