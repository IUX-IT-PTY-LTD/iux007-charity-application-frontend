'use client';

import { useState, useEffect } from 'react';
import { Loader2, RefreshCcw, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import AccreditationsSection from './footerMangement/AccreditationsSection';
import SocialLinksSection from './footerMangement/SocialLinksSection';

// Demo data - keep separate from design code
const demoAccreditations = [
  {
    id: 1,
    title: 'ISO 9001:2015 Certified',
    logo: '/uploads/iso-logo.png',
    link: 'https://example.com/iso-certificate',
    status: 1
  },
  {
    id: 2,
    title: 'Better Business Bureau',
    logo: '/uploads/bbb-logo.png',
    link: 'https://example.com/bbb-profile',
    status: 0
  }
];

const demoSocialLinks = [
  {
    id: 1,
    platform: 'Facebook',
    url: 'https://facebook.com/company',
    status: 1
  },
  {
    id: 2,
    platform: 'Twitter',
    url: 'https://twitter.com/company',
    status: 1
  },
  {
    id: 3,
    platform: 'LinkedIn',
    url: 'https://linkedin.com/company/company',
    status: 0
  }
];

const FooterLinkManagementSection = () => {
  const [accreditations, setAccreditations] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAccreditations(demoAccreditations);
      setSocialLinks(demoSocialLinks);
    } catch (err) {
      console.error('Error fetching footer data:', err);
      setError('Failed to load footer link information. Please try again.');
      toast.error('Could not load footer link information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Footer Link Management</CardTitle>
          <CardDescription>Manage accreditations and social media links displayed in the website footer</CardDescription>
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
          <CardDescription>Manage accreditations and social media links displayed in the website footer</CardDescription>
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
        <CardDescription>Manage accreditations and social media links displayed in the website footer</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Accreditations Section */}
        <AccreditationsSection 
          accreditations={accreditations} 
          setAccreditations={setAccreditations} 
        />
        
        {/* Social Media Links Section */}
        <SocialLinksSection 
          socialLinks={socialLinks} 
          setSocialLinks={setSocialLinks} 
        />
      </CardContent>
    </Card>
  );
};

export default FooterLinkManagementSection;