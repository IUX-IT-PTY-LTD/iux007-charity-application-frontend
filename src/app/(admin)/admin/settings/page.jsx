'use client';

import { useEffect } from 'react';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Phone, ExternalLink } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

import ContactInformationSection from '@/components/admin/settings/ContactInformationSection';
import FooterLinkManagementSection from '@/components/admin/settings/FooterLinkManagementSection';

const SettingsPage = () => {
  const { setPageTitle, setPageSubtitle } = useAdminContext();

  // Set page title
  useEffect(() => {
    setPageTitle('Settings');
    setPageSubtitle('Manage your company information and website settings');
  }, [setPageTitle, setPageSubtitle]);

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col">
        <Tabs defaultValue="contact" className="w-full">
          <TabsList className="mb-6 grid grid-cols-2 w-full max-w-7xl">
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Contact Information</span>
            </TabsTrigger>
            <TabsTrigger value="footer" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Footer Management</span>
            </TabsTrigger>
          </TabsList>

          {/* Contact Information Tab */}
          <TabsContent value="contact" className="space-y-6">
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
          </TabsContent>

          {/* Footer Management Tab */}
          <TabsContent value="footer" className="space-y-6">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;
