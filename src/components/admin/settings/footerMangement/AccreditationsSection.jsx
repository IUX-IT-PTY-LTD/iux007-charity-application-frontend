'use client';

import { useState } from 'react';
import { Award, PlusCircle, Loader2, Trash2, Edit, ExternalLink, Upload } from 'lucide-react';
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
import { toast } from 'sonner';

const AccreditationsSection = ({ accreditations, setAccreditations }) => {
  // Dialog states
  const [addAccreditationOpen, setAddAccreditationOpen] = useState(false);
  const [editAccreditationOpen, setEditAccreditationOpen] = useState(false);

  // Edit states
  const [editingAccreditation, setEditingAccreditation] = useState(null);

  // Form states
  const [accreditationForm, setAccreditationForm] = useState({
    title: '',
    logo: null,
    link: '',
  });

  // Error states
  const [accreditationErrors, setAccreditationErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validation functions
  const validateAccreditationForm = () => {
    const errors = {};

    if (!accreditationForm.title.trim()) {
      errors.title = 'Accreditation title is required';
    }

    if (!accreditationForm.logo && !editingAccreditation) {
      errors.logo = 'Logo file is required';
    }

    if (!accreditationForm.link.trim()) {
      errors.link = 'Accreditation link is required';
    } else if (!isValidUrl(accreditationForm.link)) {
      errors.link = 'Please enter a valid URL';
    }

    setAccreditationErrors(errors);
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

  // File upload handler
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setAccreditationForm((prev) => ({ ...prev, logo: file }));
    }
  };

  // Accreditation handlers
  const handleAddAccreditation = async () => {
    if (!validateAccreditationForm()) return;

    setLoading(true);
    try {
      // Simulate file upload and API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newAccreditation = {
        id: Date.now(),
        title: accreditationForm.title,
        logo: `/uploads/${accreditationForm.logo.name}`, // Simulated upload path
        link: accreditationForm.link,
        status: 1,
      };

      setAccreditations((prev) => [...prev, newAccreditation]);
      setAccreditationForm({ title: '', logo: null, link: '' });
      setAccreditationErrors({});
      setAddAccreditationOpen(false);
      toast.success('Accreditation added successfully');
    } catch (error) {
      toast.error('Failed to add accreditation');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAccreditation = (accreditation) => {
    setEditingAccreditation(accreditation);
    setAccreditationForm({
      title: accreditation.title,
      logo: null, // File will be optional for editing
      link: accreditation.link,
    });
    setAccreditationErrors({});
    setEditAccreditationOpen(true);
  };

  const handleUpdateAccreditation = async (field, newValue) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setEditingAccreditation((prev) => ({ ...prev, [field]: newValue }));

      // Update in main list
      setAccreditations((prev) =>
        prev.map((acc) =>
          acc.id === editingAccreditation.id ? { ...acc, [field]: newValue } : acc
        )
      );

      toast.success(`Accreditation ${field} updated successfully`);
      return true;
    } catch (err) {
      toast.error(`Failed to update accreditation ${field}`);
      throw err;
    }
  };

  const handleDeleteAccreditation = async (accreditationId) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAccreditations((prev) => prev.filter((acc) => acc.id !== accreditationId));
      toast.success('Accreditation deleted successfully');
    } catch (error) {
      toast.error('Failed to delete accreditation');
    }
  };

  const handleToggleAccreditationStatus = async (accreditationId, newStatus) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setAccreditations((prev) =>
        prev.map((acc) => (acc.id === accreditationId ? { ...acc, status: newStatus } : acc))
      );
      toast.success(`Accreditation ${newStatus === 1 ? 'enabled' : 'disabled'} on website`);
    } catch (error) {
      toast.error('Failed to update accreditation status');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Accreditations</h3>
        </div>
        <Dialog open={addAccreditationOpen} onOpenChange={setAddAccreditationOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Accreditation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Accreditation</DialogTitle>
              <DialogDescription>
                Add a new accreditation to display in the footer
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="acc-title">Accreditation Title *</Label>
                <Input
                  id="acc-title"
                  value={accreditationForm.title}
                  onChange={(e) =>
                    setAccreditationForm({ ...accreditationForm, title: e.target.value })
                  }
                  placeholder="e.g., ISO 9001:2015 Certified"
                  className={accreditationErrors.title ? 'border-red-500' : ''}
                />
                {accreditationErrors.title && (
                  <p className="text-sm text-red-500 mt-1">{accreditationErrors.title}</p>
                )}
              </div>

              <div>
                <Label htmlFor="acc-logo">Logo File *</Label>
                <div className="mt-2">
                  <Input
                    id="acc-logo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className={accreditationErrors.logo ? 'border-red-500' : ''}
                  />
                  {accreditationForm.logo && (
                    <p className="text-sm text-green-600 mt-1">
                      Selected: {accreditationForm.logo.name}
                    </p>
                  )}
                </div>
                {accreditationErrors.logo && (
                  <p className="text-sm text-red-500 mt-1">{accreditationErrors.logo}</p>
                )}
              </div>

              <div>
                <Label htmlFor="acc-link">Accreditation Link *</Label>
                <Input
                  id="acc-link"
                  value={accreditationForm.link}
                  onChange={(e) =>
                    setAccreditationForm({ ...accreditationForm, link: e.target.value })
                  }
                  placeholder="https://example.com/certificate"
                  className={accreditationErrors.link ? 'border-red-500' : ''}
                />
                {accreditationErrors.link && (
                  <p className="text-sm text-red-500 mt-1">{accreditationErrors.link}</p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setAddAccreditationOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddAccreditation}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Accreditation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteAccreditation(accreditation.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="ml-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <Label htmlFor={`acc-toggle-${accreditation.id}`} className="text-sm font-medium">
                  Show {accreditation.title} on website
                </Label>
                <Switch
                  id={`acc-toggle-${accreditation.id}`}
                  checked={accreditation.status === 1}
                  onCheckedChange={(checked) =>
                    handleToggleAccreditationStatus(accreditation.id, checked ? 1 : 0)
                  }
                />
              </div>
            </div>
          </div>
        ))}

        {accreditations.length === 0 && (
          <div className="text-center py-8">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No accreditations added yet</p>
          </div>
        )}
      </div>

      {/* Edit Accreditation Dialog */}
      <Dialog open={editAccreditationOpen} onOpenChange={setEditAccreditationOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Accreditation</DialogTitle>
            <DialogDescription>
              Update the accreditation information using the fields below
            </DialogDescription>
          </DialogHeader>
          {editingAccreditation && (
            <div className="space-y-4">
              <EditableField
                label="Accreditation Title"
                value={editingAccreditation.title}
                icon={Award}
                onSave={(newValue) => handleUpdateAccreditation('title', newValue)}
                type="text"
                placeholder="Enter accreditation title..."
                required={true}
              />

              {/* Logo Upload Section */}
              <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <Label className="text-sm font-medium">Update Logo</Label>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Current logo: {editingAccreditation.logo}
                    </p>

                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          // Validate file
                          if (!file.type.startsWith('image/')) {
                            toast.error('Please select an image file');
                            return;
                          }
                          if (file.size > 5 * 1024 * 1024) {
                            toast.error('File size must be less than 5MB');
                            return;
                          }

                          // Simulate upload and update
                          setLoading(true);
                          setTimeout(async () => {
                            try {
                              const newLogoPath = `/uploads/${file.name}`;
                              await handleUpdateAccreditation('logo', newLogoPath);
                              toast.success('Logo updated successfully');
                            } catch (error) {
                              toast.error('Failed to update logo');
                            } finally {
                              setLoading(false);
                            }
                          }, 1000);
                        }
                      }}
                      className="cursor-pointer"
                    />

                    <p className="text-xs text-muted-foreground">
                      Supported formats: PNG, JPG, GIF (Max: 5MB)
                    </p>
                  </div>
                </div>
              </div>

              <EditableField
                label="Certificate Link"
                value={editingAccreditation.link}
                onSave={(newValue) => handleUpdateAccreditation('link', newValue)}
                type="text"
                placeholder="Enter certificate link..."
                required={true}
              />

              <div className="flex justify-end pt-4">
                <Button variant="outline" onClick={() => setEditAccreditationOpen(false)}>
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
