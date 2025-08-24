'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, Shield, Loader2, RefreshCcw, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import EditableField from '@/components/admin/shared/EditableField';
import { toast } from 'sonner';

// Import the protected profile service
import {
  getCurrentUserProfile,
  updateCurrentUserProfile,
  prepareProfileDataForForm,
  hasProfileChanges,
} from '@/api/services/admin/protected/profileService';

const ProfileInformationSection = () => {
  const [profileData, setProfileData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile data
  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCurrentUserProfile();
      if (response.status === 'success' && response.data) {
        const formattedData = prepareProfileDataForForm(response.data);
        setProfileData(formattedData);
        setOriginalData(formattedData);
      } else {
        throw new Error(response.message || 'Failed to fetch profile information');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Failed to load profile information. Please try again.');
      toast.error('Could not load profile information');
    } finally {
      setLoading(false);
    }
  };

  // Load profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle updating profile fields
  const handleUpdateProfileField = async (field, value) => {
    try {
      if (!profileData) {
        throw new Error('Profile data not loaded');
      }

      // Create updated profile data
      const updatedData = {
        ...profileData,
        [field]: value,
      };

      // Check if there are actual changes
      if (!hasProfileChanges(originalData, updatedData)) {
        toast.info('No changes detected');
        return true;
      }

      // Prepare data for API submission (include all required fields)
      const submissionData = {
        name: updatedData.name,
        email: updatedData.email,
        role_id: updatedData.role_id,
        status: updatedData.status,
      };

      const response = await updateCurrentUserProfile(submissionData);

      if (response.status === 'success' && response.data) {
        // Update local state with fresh data from API
        const freshFormattedData = prepareProfileDataForForm(response.data);
        setProfileData(freshFormattedData);
        setOriginalData(freshFormattedData);

        toast.success(`${getFieldDisplayName(field)} updated successfully`);
        return true;
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error(`Error updating profile field ${field}:`, err);

      // Handle specific error cases
      if (err.message?.includes('permission')) {
        toast.error(`You don't have permission to update ${getFieldDisplayName(field)}`);
      } else if (err.message?.includes('Validation failed')) {
        toast.error(err.message.replace('Validation failed: ', ''));
      } else {
        toast.error(`Failed to update ${getFieldDisplayName(field)}`);
      }

      throw err;
    }
  };

  // Get user-friendly field names
  const getFieldDisplayName = (field) => {
    const fieldNames = {
      name: 'Full Name',
      email: 'Email Address',
      role_id: 'Role',
      status: 'Status',
    };
    return fieldNames[field] || field;
  };

  // Handle loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Manage your personal account details</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-muted-foreground">Loading profile information...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Manage your personal account details</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={fetchProfile} className="mt-2">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Handle case where profile data is not available
  if (!profileData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Manage your personal account details</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Profile information not available.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Manage your personal account details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <EditableField
          label="Full Name"
          value={profileData.name || ''}
          icon={User}
          onSave={(value) => handleUpdateProfileField('name', value)}
          placeholder="Enter your full name..."
          required={true}
        />

        <EditableField
          label="Email Address"
          value={profileData.email || ''}
          icon={Mail}
          onSave={(value) => handleUpdateProfileField('email', value)}
          type="email"
          placeholder="Enter your email address..."
          required={true}
        />

        {/* Role field - read-only display */}
        <EditableField
          label="Role"
          value={profileData.role?.name || 'Unknown Role'}
          icon={Shield}
          disabled={true}
          onSave={() => {}}
        />

        {/* Status field - read-only display */}
        <EditableField
          label="Account Status"
          value={profileData.status === 1 ? 'Active' : 'Inactive'}
          icon={Shield}
          disabled={true}
          onSave={() => {}}
        />

        {/* Display additional profile info */}
        {/* {profileData.id && (
          <div className="mt-6 pt-4 border-t">
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                <strong>User ID:</strong> {profileData.id}
              </p>
              {profileData.role && (
                <p>
                  <strong>Role ID:</strong> {profileData.role.id}
                </p>
              )}
            </div>
          </div>
        )} */}
      </CardContent>
    </Card>
  );
};

export default ProfileInformationSection;
