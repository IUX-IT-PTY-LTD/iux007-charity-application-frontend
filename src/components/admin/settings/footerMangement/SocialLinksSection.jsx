'use client';

import { useState } from 'react';
import {
  Share2,
  PlusCircle,
  Loader2,
  Trash2,
  Edit,
  ExternalLink,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
} from 'lucide-react';
import EditableField from '@/components/admin/shared/EditableField';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

// Social media platforms with their icons
const socialPlatforms = [
  { value: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-600' },
  { value: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-blue-400' },
  { value: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
  { value: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-600' },
  { value: 'tiktok', label: 'TikTok', icon: Share2, color: 'text-black' },
  { value: 'pinterest', label: 'Pinterest', icon: Share2, color: 'text-red-500' },
  { value: 'snapchat', label: 'Snapchat', icon: Share2, color: 'text-yellow-400' },
];

const SocialLinksSection = ({ socialLinks, setSocialLinks }) => {
  // Dialog states
  const [addSocialOpen, setAddSocialOpen] = useState(false);
  const [editSocialOpen, setEditSocialOpen] = useState(false);

  // Edit states
  const [editingSocialLink, setEditingSocialLink] = useState(null);

  // Form states
  const [socialForm, setSocialForm] = useState({
    platform: '',
    url: '',
  });

  // Error states
  const [socialErrors, setSocialErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Get platform icon component
  const getPlatformIcon = (platformName) => {
    const platform = socialPlatforms.find(
      (p) => p.label.toLowerCase() === platformName.toLowerCase()
    );
    return platform
      ? { icon: platform.icon, color: platform.color }
      : { icon: Share2, color: 'text-gray-500' };
  };

  // Validation functions
  const validateSocialForm = () => {
    const errors = {};

    if (!socialForm.platform) {
      errors.platform = 'Platform selection is required';
    }

    if (!socialForm.url.trim()) {
      errors.url = 'URL is required';
    } else if (!isValidUrl(socialForm.url)) {
      errors.url = 'Please enter a valid URL';
    }

    setSocialErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Social media handlers
  const handleAddSocialLink = async () => {
    if (!validateSocialForm()) return;

    if (socialLinks.length >= 4) {
      toast.error('Maximum 4 social links allowed');
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const platformInfo = socialPlatforms.find((p) => p.value === socialForm.platform);
      const newSocialLink = {
        id: Date.now(),
        platform: platformInfo.label,
        url: socialForm.url,
        status: 1,
      };

      setSocialLinks((prev) => [...prev, newSocialLink]);
      setSocialForm({ platform: '', url: '' });
      setSocialErrors({});
      setAddSocialOpen(false);
      toast.success('Social media link added successfully');
    } catch (error) {
      toast.error('Failed to add social media link');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSocialLink = (socialLink) => {
    setEditingSocialLink(socialLink);
    const platformValue = socialPlatforms.find((p) => p.label === socialLink.platform)?.value || '';
    setSocialForm({
      platform: platformValue,
      url: socialLink.url,
    });
    setSocialErrors({});
    setEditSocialOpen(true);
  };

  const handleUpdateSocialLink = async (field, newValue) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setEditingSocialLink((prev) => ({ ...prev, [field]: newValue }));

      setSocialLinks((prev) =>
        prev.map((link) =>
          link.id === editingSocialLink.id ? { ...link, [field]: newValue } : link
        )
      );

      toast.success(`Social link ${field} updated successfully`);
      return true;
    } catch (err) {
      toast.error(`Failed to update social link ${field}`);
      throw err;
    }
  };

  const handleDeleteSocialLink = async (socialLinkId) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSocialLinks((prev) => prev.filter((link) => link.id !== socialLinkId));
      toast.success('Social media link deleted successfully');
    } catch (error) {
      toast.error('Failed to delete social media link');
    }
  };

  const handleToggleSocialStatus = async (socialLinkId, newStatus) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setSocialLinks((prev) =>
        prev.map((link) => (link.id === socialLinkId ? { ...link, status: newStatus } : link))
      );
      toast.success(`Social link ${newStatus === 1 ? 'enabled' : 'disabled'} on website`);
    } catch (error) {
      toast.error('Failed to update social link status');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Social Media Links</h3>
        </div>
        <Dialog open={addSocialOpen} onOpenChange={setAddSocialOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              disabled={socialLinks.length >= 4}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Social Link
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Social Media Link</DialogTitle>
              <DialogDescription>
                Add a social media link to display in the footer (Max: 4 links)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="social-platform">Platform *</Label>
                <Select
                  value={socialForm.platform}
                  onValueChange={(value) => setSocialForm({ ...socialForm, platform: value })}
                >
                  <SelectTrigger className={socialErrors.platform ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select a platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {socialPlatforms.map((platform) => {
                      const IconComponent = platform.icon;
                      return (
                        <SelectItem key={platform.value} value={platform.value}>
                          <div className="flex items-center gap-2">
                            <IconComponent className={`h-4 w-4 ${platform.color}`} />
                            <span>{platform.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {socialErrors.platform && (
                  <p className="text-sm text-red-500 mt-1">{socialErrors.platform}</p>
                )}
              </div>

              <div>
                <Label htmlFor="social-url">URL *</Label>
                <Input
                  id="social-url"
                  value={socialForm.url}
                  onChange={(e) => setSocialForm({ ...socialForm, url: e.target.value })}
                  placeholder="https://facebook.com/yourcompany"
                  className={socialErrors.url ? 'border-red-500' : ''}
                />
                {socialErrors.url && (
                  <p className="text-sm text-red-500 mt-1">{socialErrors.url}</p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setAddSocialOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddSocialLink}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Social Link
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Social Links List */}
      <div className="space-y-4">
        {socialLinks.map((socialLink) => {
          const { icon: IconComponent, color } = getPlatformIcon(socialLink.platform);
          return (
            <div key={socialLink.id} className="space-y-3">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <IconComponent className={`h-6 w-6 ${color}`} />
                  </div>
                  <div>
                    <h4 className="font-medium">{socialLink.platform}</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      {socialLink.url}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditSocialLink(socialLink)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSocialLink(socialLink.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="ml-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <Label htmlFor={`social-toggle-${socialLink.id}`} className="text-sm font-medium">
                    Show {socialLink.platform} on website
                  </Label>
                  <Switch
                    id={`social-toggle-${socialLink.id}`}
                    checked={socialLink.status === 1}
                    onCheckedChange={(checked) =>
                      handleToggleSocialStatus(socialLink.id, checked ? 1 : 0)
                    }
                  />
                </div>
              </div>
            </div>
          );
        })}

        {socialLinks.length === 0 && (
          <div className="text-center py-8">
            <Share2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No social media links added yet</p>
          </div>
        )}
      </div>

      {socialLinks.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Currently showing {socialLinks.filter((link) => link.status === 1).length} active social
            links out of {socialLinks.length} total. You can add up to {4 - socialLinks.length} more
            links.
          </AlertDescription>
        </Alert>
      )}

      {/* Edit Social Link Dialog */}
      <Dialog open={editSocialOpen} onOpenChange={setEditSocialOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Social Media Link</DialogTitle>
            <DialogDescription>
              Update the social media link information using the fields below
            </DialogDescription>
          </DialogHeader>
          {editingSocialLink && (
            <div className="space-y-4">
              <EditableField
                label="Platform URL"
                value={editingSocialLink.url}
                icon={Share2}
                onSave={(newValue) => handleUpdateSocialLink('url', newValue)}
                type="text"
                placeholder="Enter platform URL..."
                required={true}
              />

              <div className="flex justify-end pt-4">
                <Button variant="outline" onClick={() => setEditSocialOpen(false)}>
                  Done
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SocialLinksSection;
