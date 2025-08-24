'use client';

import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Printer, Loader2, RefreshCcw, AlertCircle } from 'lucide-react';
import EditableField from '@/components/admin/shared/EditableField';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Import the protected settings service
import {
  getAllContacts,
  updateContact,
  prepareContactDataForForm,
  safeUpdateContact,
} from '@/api/services/admin/protected/settingsService';

const ContactInformationSection = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllContacts();
      if (response.status === 'success') {
        setContacts(response.data || []);
      } else {
        throw new Error(response.message || 'Failed to fetch contact information');
      }
    } catch (err) {
      console.error('Error fetching contacts:', err);

      // Handle permission errors gracefully
      if (err.message?.includes('permission')) {
        setError('You do not have permission to view contact information.');
      } else {
        setError('Failed to load contact information. Please try again.');
      }

      toast.error('Could not load contact information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleUpdateContact = async (contactId, newValue) => {
    try {
      const contactToUpdate = contacts.find((contact) => contact.id === contactId);
      if (!contactToUpdate) {
        throw new Error('Contact not found');
      }

      // Prepare the updated contact data with all required fields
      const updatedContactData = {
        name: contactToUpdate.name,
        value: newValue,
        icon: contactToUpdate.icon || '', // Ensure icon is included (can be empty string)
        status: contactToUpdate.status,
      };

      // Use the safe update function which handles permissions gracefully
      const response = await safeUpdateContact(contactId, updatedContactData);

      if (response.status === 'success') {
        // Update the local state
        setContacts(
          contacts.map((contact) =>
            contact.id === contactId ? { ...contact, value: newValue } : contact
          )
        );
        toast.success(`${getContactName(contactId)} updated successfully`);
        return true;
      } else {
        throw new Error(response.message || 'Failed to update contact');
      }
    } catch (err) {
      console.error(`Error updating contact ${contactId}:`, err);
      toast.error(`Failed to update ${getContactName(contactId)}: ${err.message}`);
      throw err;
    }
  };

  const handleToggleStatus = async (contactId, newStatus) => {
    try {
      const contactToUpdate = contacts.find((contact) => contact.id === contactId);
      if (!contactToUpdate) {
        throw new Error('Contact not found');
      }

      // Prepare the updated contact data with all required fields
      const updatedContactData = {
        name: contactToUpdate.name,
        value: contactToUpdate.value,
        icon: contactToUpdate.icon || '', // Ensure icon is included (can be empty string)
        status: newStatus,
      };

      // Use the safe update function which handles permissions gracefully
      const response = await safeUpdateContact(contactId, updatedContactData);

      if (response.status === 'success') {
        // Update the local state
        setContacts(
          contacts.map((contact) =>
            contact.id === contactId ? { ...contact, status: newStatus } : contact
          )
        );
        toast.success(`${getContactName(contactId)} ${newStatus === 1 ? 'enabled' : 'disabled'}`);
        return true;
      } else {
        throw new Error(response.message || 'Failed to update contact status');
      }
    } catch (err) {
      console.error(`Error updating contact status ${contactId}:`, err);
      toast.error(`Failed to update ${getContactName(contactId)} status: ${err.message}`);
      throw err;
    }
  };

  const getContactIcon = (contactName) => {
    const name = contactName.toLowerCase();
    if (name.includes('visit') || name.includes('office') || name.includes('location')) {
      return MapPin;
    } else if (name.includes('call') || name.includes('phone')) {
      return Phone;
    } else if (name.includes('chat') || name.includes('email')) {
      return Mail;
    } else if (name.includes('fax')) {
      return Printer;
    }
    return Phone; // Default icon
  };

  const getContactName = (contactId) => {
    const contact = contacts.find((c) => c.id === contactId);
    return contact ? contact.name : 'Contact';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Manage company contact details displayed on the website</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-muted-foreground">Loading contact information...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Manage company contact details displayed on the website</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={fetchContacts} className="mt-2">
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
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>Manage company contact details displayed on the website</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {contacts.length === 0 ? (
          <div className="text-center py-8">
            <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No contact information found</p>
          </div>
        ) : (
          contacts.map((contact) => (
            <div key={contact.id} className="mb-4">
              <EditableField
                label={contact.name}
                value={contact.value}
                icon={getContactIcon(contact.name)}
                onSave={(newValue) => handleUpdateContact(contact.id, newValue)}
                type="text"
                placeholder={`Enter ${contact.name.toLowerCase()}...`}
                required={true}
              />
              <div className="mt-2">
                <EditableField
                  label={`Show ${contact.name} on website`}
                  value={contact.status}
                  type="toggle"
                  onSave={(newStatus) => handleToggleStatus(contact.id, newStatus)}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ContactInformationSection;
