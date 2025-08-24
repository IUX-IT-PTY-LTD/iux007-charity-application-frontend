// src/components/admin/settings/footerMangement/SocialLinksSection.jsx

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
  Lock,
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

// Import the protected settings service
import {
  safeCreateSetting,
  safeUpdateSetting,
  validateSettingData,
} from '@/api/services/admin/protected/settingsService';

// Import permission utilities
import { isPermissionError, getPermissionErrorMessage } from '@/api/utils/permissionErrors';

// Social media platforms with their icons and API keys
const socialPlatforms = [
  { value: 'facebook_link', label: 'Facebook', icon: Facebook, color: 'text-blue-600' },
  { value: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { value: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-blue-400' },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
  { value: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-600' },
  { value: 'tiktok', label: 'TikTok', icon: Share2, color: 'text-black' },
];

const SocialLinksSection = ({ socialLinks, setSocialLinks, onRefresh, adminPermissions }) => {
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

    // Check if platform already exists
    const platformExists = socialLinks.some((link) => link.key === socialForm.platform);
    if (platformExists) {
      errors.platform = 'This platform already exists';
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

  const isReadOnly = !adminPermissions?.canEdit;

  // Social media handlers
  const handleAddSocialLink = async () => {
    if (!adminPermissions.canCreate) {
      toast.error("You don't have permission to create social media links");
      return;
    }

    if (!validateSocialForm()) return;

    if (socialLinks.length >= 4) {
      toast.error('Maximum 4 social links allowed');
      return;
    }

    setLoading(true);
    try {
      const settingData = {
        key: socialForm.platform,
        value: socialForm.url,
        type: 'text',
        status: 1,
      };

      const response = await safeCreateSetting(settingData);

      if (response.status === 'success') {
        const platformInfo = socialPlatforms.find((p) => p.value === socialForm.platform);
        const newSocialLink = {
          id: response.data.id,
          platform: platformInfo.label,
          url: response.data.value,
          status: response.data.status,
          key: response.data.key,
        };

        setSocialLinks((prev) => [...prev, newSocialLink]);
        setSocialForm({ platform: '', url: '' });
        setSocialErrors({});
        setAddSocialOpen(false);

        // Refresh parent data to get latest from server
        if (onRefresh) {
          await onRefresh();
        }

        toast.success('Social media link added successfully');
      } else {
        throw new Error(response.message || 'Failed to create social media link');
      }
    } catch (error) {
      console.error('Error adding social link:', error);

      if (isPermissionError(error)) {
        toast.error(getPermissionErrorMessage(error));
      } else {
        toast.error(`Failed to add social media link: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditSocialLink = (socialLink) => {
    if (!adminPermissions.canEdit) {
      toast.error("You don't have permission to edit social media links");
      return;
    }

    setEditingSocialLink(socialLink);
    setSocialForm({
      platform: socialLink.key,
      url: socialLink.url,
    });
    setSocialErrors({});
    setEditSocialOpen(true);
  };

  const handleUpdateSocialLink = async (field, newValue) => {
    if (!adminPermissions.canEdit) {
      toast.error("You don't have permission to edit social media links");
      throw new Error('Edit permission required');
    }

    if (!editingSocialLink) return;

    try {
      setLoading(true);

      const settingData = {
        key: editingSocialLink.key,
        value: newValue,
        type: 'text',
        status: editingSocialLink.status,
      };

      const response = await safeUpdateSetting(editingSocialLink.id, settingData);

      if (response.status === 'success') {
        setEditingSocialLink((prev) => ({ ...prev, [field]: newValue }));

        setSocialLinks((prev) =>
          prev.map((link) =>
            link.id === editingSocialLink.id ? { ...link, [field]: newValue } : link
          )
        );

        // Refresh parent data
        if (onRefresh) {
          await onRefresh();
        }

        toast.success(`Social link updated successfully`);
        return true;
      } else {
        throw new Error(response.message || 'Failed to update social link');
      }
    } catch (err) {
      console.error(`Error updating social link:`, err);

      if (isPermissionError(err)) {
        toast.error(getPermissionErrorMessage(err));
      } else {
        toast.error(`Failed to update social link: ${err.message}`);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSocialLink = async (socialLinkId) => {
    if (!adminPermissions.canDelete) {
      toast.error("You don't have permission to delete social media links");
      return;
    }

    // Note: The API doesn't seem to have a delete endpoint for settings
    // You may need to implement this or use status=0 to "delete"
    try {
      setLoading(true);
      const socialLink = socialLinks.find((link) => link.id === socialLinkId);
      if (!socialLink) return;

      // Instead of deleting, set status to 0 to hide it
      const settingData = {
        key: socialLink.key,
        value: socialLink.url,
        type: 'text',
        status: 0,
      };

      const response = await safeUpdateSetting(socialLinkId, settingData);

      if (response.status === 'success') {
        setSocialLinks((prev) => prev.filter((link) => link.id !== socialLinkId));

        // Refresh parent data
        if (onRefresh) {
          await onRefresh();
        }

        toast.success('Social media link removed successfully');
      }
    } catch (error) {
      console.error('Error removing social link:', error);

      if (isPermissionError(error)) {
        toast.error(getPermissionErrorMessage(error));
      } else {
        toast.error(`Failed to remove social media link: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSocialStatus = async (socialLinkId, newStatus) => {
    if (!adminPermissions.canEdit) {
      toast.error("You don't have permission to edit social media links");
      return;
    }

    const socialLink = socialLinks.find((link) => link.id === socialLinkId);
    if (!socialLink) return;

    try {
      setLoading(true);

      const settingData = {
        key: socialLink.key,
        value: socialLink.url,
        type: 'text',
        status: newStatus,
      };

      const response = await safeUpdateSetting(socialLinkId, settingData);

      if (response.status === 'success') {
        setSocialLinks((prev) =>
          prev.map((link) => (link.id === socialLinkId ? { ...link, status: newStatus } : link))
        );

        // Refresh parent data
        if (onRefresh) {
          await onRefresh();
        }

        toast.success(`Social link ${newStatus === 1 ? 'enabled' : 'disabled'} on website`);
      }
    } catch (error) {
      console.error('Error updating social link status:', error);

      if (isPermissionError(error)) {
        toast.error(getPermissionErrorMessage(error));
      } else {
        toast.error(`Failed to update social link status: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">
            Social Media Links
            {isReadOnly && <span className="text-orange-600 ml-2 text-sm">(Read-only)</span>}
          </h3>
        </div>

        {/* Add Social Link Button */}
        {isReadOnly ? (
          <Button
            size="sm"
            disabled
            className="opacity-50 cursor-not-allowed"
            title="You don't have permission to create social media links"
          >
            <Lock className="h-4 w-4 mr-2" />
            Add Social Link
          </Button>
        ) : (
          <Dialog open={addSocialOpen} onOpenChange={setAddSocialOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                disabled={socialLinks.length >= 4 || loading || !adminPermissions.canCreate}
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
                  Add a social media link to display in the footer (Max: 6 links)
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
                      {socialPlatforms
                        .filter(
                          (platform) => !socialLinks.some((link) => link.key === platform.value)
                        )
                        .map((platform) => {
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
                  <Button
                    variant="outline"
                    onClick={() => setAddSocialOpen(false)}
                    disabled={loading}
                  >
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
        )}
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
                  {isReadOnly ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled
                        title="You don't have permission to edit social links"
                        className="opacity-50 cursor-not-allowed"
                      >
                        <Lock className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled
                        title="You don't have permission to delete social links"
                        className="opacity-50 cursor-not-allowed text-red-500"
                      >
                        <Lock className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditSocialLink(socialLink)}
                        disabled={loading}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSocialLink(socialLink.id)}
                        className="text-red-500 hover:text-red-700"
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="ml-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <Label htmlFor={`social-toggle-${socialLink.id}`} className="text-sm font-medium">
                    Show {socialLink.platform} on website
                  </Label>
                  <div className="flex items-center gap-2">
                    {isReadOnly && <Lock className="h-4 w-4 text-gray-400" />}
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Switch
                        id={`social-toggle-${socialLink.id}`}
                        checked={socialLink.status === 1}
                        onCheckedChange={(checked) =>
                          handleToggleSocialStatus(socialLink.id, checked ? 1 : 0)
                        }
                        disabled={loading || isReadOnly}
                      />
                    )}
                  </div>
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
            {isReadOnly && (
              <span className="text-orange-600 ml-1">
                Changes are restricted due to read-only access.
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Edit Social Link Dialog */}
      <Dialog open={editSocialOpen} onOpenChange={setEditSocialOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Social Media Link</DialogTitle>
            <DialogDescription>
              Update the social media link URL
              {isReadOnly && <span className="text-orange-600 ml-1">(Read-only mode)</span>}
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
                disabled={isReadOnly}
              />

              <div className="flex justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => setEditSocialOpen(false)}
                  disabled={loading}
                >
                  {isReadOnly ? 'Close' : 'Done'}
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
