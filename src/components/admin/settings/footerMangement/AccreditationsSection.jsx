'use client';

import { useState } from 'react';
import { Award, Loader2, Edit, ExternalLink, Upload } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

// Import the protected settings service
import {
  updateAccreditationSetting,
  safeUpdateSetting,
} from '@/api/services/admin/protected/settingsService';

const AccreditationsSection = ({ accreditations, setAccreditations, onRefresh }) => {
  // Dialog states
  const [editAccreditationOpen, setEditAccreditationOpen] = useState(false);

  // Edit states
  const [editingAccreditation, setEditingAccreditation] = useState(null);

  // Loading state
  const [loading, setLoading] = useState(false);

  const handleEditAccreditation = (accreditation) => {
    setEditingAccreditation(accreditation);
    setEditAccreditationOpen(true);
  };

  const handleUpdateAccreditation = async (field, newValue) => {
    if (!editingAccreditation) return;

    try {
      setLoading(true);

      // Determine which setting to update based on the field
      let settingId, settingKey, settingData;

      if (field === 'title') {
        // For title changes, we don't actually update anything since ACNC title is fixed
        toast.info('ACNC accreditation title cannot be changed');
        return true;
      } else if (field === 'link') {
        settingId = editingAccreditation.linkId;
        settingKey = 'acnc_link';
      } else if (field === 'logo') {
        settingId = editingAccreditation.logoId;
        settingKey = 'acnc_logo';
      } else {
        throw new Error('Unknown field');
      }

      // Get current setting data and update it
      const currentValue = field === 'link' ? editingAccreditation.link : editingAccreditation.logo;

      settingData = {
        key: settingKey,
        value: newValue,
        type: 'text', // Based on API, type is usually 'text'
        status: 1, // Keep active status
      };

      const response = await safeUpdateSetting(settingId, settingData);

      if (response.status === 'success') {
        // Update the editing state
        setEditingAccreditation((prev) => ({
          ...prev,
          [field]: newValue,
        }));

        // Update the main accreditations state
        setAccreditations((prev) =>
          prev.map((acc) =>
            acc.id === editingAccreditation.id ? { ...acc, [field]: newValue } : acc
          )
        );

        // Refresh parent data to get latest from server
        if (onRefresh) {
          await onRefresh();
        }

        toast.success(`ACNC ${field} updated successfully`);
        return true;
      } else {
        throw new Error(response.message || 'Failed to update accreditation');
      }
    } catch (err) {
      console.error(`Error updating accreditation ${field}:`, err);
      toast.error(`Failed to update ACNC ${field}: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAccreditationStatus = async (accreditationId, newStatus) => {
    const accreditation = accreditations.find((acc) => acc.id === accreditationId);
    if (!accreditation) return;

    try {
      setLoading(true);

      // Update both logo and link status since they work together
      const logoData = {
        key: 'acnc_logo',
        value: accreditation.logo,
        type: 'text',
        status: newStatus,
      };

      const linkData = {
        key: 'acnc_link',
        value: accreditation.link,
        type: 'text',
        status: newStatus,
      };

      // Update both settings
      await Promise.all([
        safeUpdateSetting(accreditation.logoId, logoData),
        safeUpdateSetting(accreditation.linkId, linkData),
      ]);

      // Update local state
      setAccreditations((prev) =>
        prev.map((acc) => (acc.id === accreditationId ? { ...acc, status: newStatus } : acc))
      );

      // Refresh parent data
      if (onRefresh) {
        await onRefresh();
      }

      toast.success(`ACNC accreditation ${newStatus === 1 ? 'enabled' : 'disabled'} on website`);
    } catch (error) {
      console.error('Error updating accreditation status:', error);
      toast.error(`Failed to update accreditation status: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !editingAccreditation) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    try {
      setLoading(true);

      // Convert file to base64
      const base64String = await convertFileToBase64(file);

      // Update the accreditation with base64 string
      await handleUpdateAccreditation('logo', base64String);
      toast.success('Logo updated successfully');
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to update logo');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert file to base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // FileReader result includes data URL prefix (data:image/jpeg;base64,...)
        // We send the full data URL to the API
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        reject(new Error('Failed to read file'));
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Accreditations</h3>
        </div>
      </div>

      {/* Accreditations List */}
      <div className="space-y-4">
        {accreditations.map((accreditation) => (
          <div key={accreditation.id} className="space-y-3">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <h4 className="font-medium">{accreditation.title}</h4>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    {accreditation.link}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditAccreditation(accreditation)}
                  disabled={loading}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="ml-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <Label htmlFor={`acc-toggle-${accreditation.id}`} className="text-sm font-medium">
                  Show {accreditation.title} on website
                </Label>
                <div className="flex items-center gap-2">
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Switch
                      id={`acc-toggle-${accreditation.id}`}
                      checked={accreditation.status === 1}
                      onCheckedChange={(checked) =>
                        handleToggleAccreditationStatus(accreditation.id, checked ? 1 : 0)
                      }
                      disabled={loading}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {accreditations.length === 0 && (
          <div className="text-center py-8">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No accreditations found</p>
            <p className="text-sm text-muted-foreground mt-2">
              ACNC accreditation settings are managed through the general settings
            </p>
          </div>
        )}
      </div>

      {/* Edit Accreditation Dialog */}
      <Dialog open={editAccreditationOpen} onOpenChange={setEditAccreditationOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit ACNC Accreditation</DialogTitle>
            <DialogDescription>Update the ACNC accreditation information</DialogDescription>
          </DialogHeader>
          {editingAccreditation && (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This is your ACNC (Australian Charities and Not-for-profits Commission)
                  accreditation. You can update the logo and link URL.
                </AlertDescription>
              </Alert>

              {/* Logo Upload Section */}
              <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <Label className="text-sm font-medium">Update ACNC Logo</Label>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Current logo: {editingAccreditation.logo}
                    </p>

                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="cursor-pointer"
                      disabled={loading}
                    />

                    <p className="text-xs text-muted-foreground">
                      Supported formats: PNG, JPG, GIF (Max: 5MB)
                    </p>
                  </div>
                </div>
              </div>

              <EditableField
                label="ACNC Certificate Link"
                value={editingAccreditation.link}
                onSave={(newValue) => handleUpdateAccreditation('link', newValue)}
                type="text"
                placeholder="Enter ACNC certificate link..."
                required={true}
              />

              <div className="flex justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => setEditAccreditationOpen(false)}
                  disabled={loading}
                >
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

export default AccreditationsSection;
