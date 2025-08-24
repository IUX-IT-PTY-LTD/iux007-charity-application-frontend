'use client';

import { User, Mail, Phone, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import EditableField from '@/components/admin/shared/EditableField';
import { toast } from 'sonner';

const ProfileInformationSection = () => {
  // Placeholder functions for profile updates - to be implemented later
  const handleUpdateProfileField = async (field, value) => {
    console.log(`Updating ${field} to ${value}`);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Success toast for demo purposes
    toast.success(`${field} updated successfully`);
    return true;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Manage your personal account details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <EditableField
          label="Full Name"
          value="Admin User"
          icon={User}
          onSave={(value) => handleUpdateProfileField('Full Name', value)}
          placeholder="Enter your full name..."
          required={true}
        />

        <EditableField
          label="Email Address"
          value="admin@example.com"
          icon={Mail}
          onSave={(value) => handleUpdateProfileField('Email Address', value)}
          type="email"
          placeholder="Enter your email address..."
          required={true}
        />

        <EditableField
          label="Phone Number"
          value="+1 (555) 123-4567"
          icon={Phone}
          onSave={(value) => handleUpdateProfileField('Phone Number', value)}
          placeholder="Enter your phone number..."
        />

        <EditableField
          label="Role"
          value="Administrator"
          icon={Shield}
          disabled={true}
          onSave={() => {}}
        />
      </CardContent>
    </Card>
  );
};

export default ProfileInformationSection;
