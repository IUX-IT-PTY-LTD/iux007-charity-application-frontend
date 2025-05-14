"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminContext } from "@/components/admin/admin-context";
import { ArrowLeft, Save, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";

// Import shadcn components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserEditPage = ({ params }) => {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();

  // State for user data
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    newsletter: false,
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  // Format name initials for avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Set page title
  useEffect(() => {
    if (user) {
      setPageTitle(`Edit User - ${user.name}`);
      setPageSubtitle("Update user information");
    } else {
      setPageTitle("Edit User");
      setPageSubtitle("Loading user data...");
    }
  }, [user, setPageTitle, setPageSubtitle]);

  // Load user data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        if (!params?.userId) {
          toast.error("Missing user ID");
          router.push("/admin/users");
          return;
        }

        // Fetch user data from localStorage
        const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
        const foundUser = storedUsers.find((u) => u.id === params.userId);

        if (!foundUser) {
          toast.error("User not found");
          router.push("/admin/users");
          return;
        }

        setUser(foundUser);

        // Initialize form data
        setFormData({
          name: foundUser.name || "",
          email: foundUser.email || "",
          phone: foundUser.phone || "",
          role: foundUser.role || "",
          newsletter: foundUser.newsletter || false,
          street: foundUser.address?.street || "",
          city: foundUser.address?.city || "",
          state: foundUser.address?.state || "",
          zip: foundUser.address?.zip || "",
          country: foundUser.address?.country || "",
        });

        /* API Implementation (Commented out for future use)
        // Fetch user data
        const userResponse = await fetch(`/api/users/${params.userId}`);
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await userResponse.json();
        setUser(userData);
        
        // Initialize form data
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          role: userData.role || "",
          newsletter: userData.newsletter || false,
          street: userData.address?.street || "",
          city: userData.address?.city || "",
          state: userData.address?.state || "",
          zip: userData.address?.zip || "",
          country: userData.address?.country || "",
        });
        */
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load user data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params?.userId, router]);

  // Handle form field changes
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Update user object
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        role: formData.role,
        newsletter: formData.newsletter,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country,
        },
      };

      // If any address field is empty, set address to null
      if (
        !formData.street &&
        !formData.city &&
        !formData.state &&
        !formData.zip &&
        !formData.country
      ) {
        updatedUser.address = null;
      }

      // Update user in localStorage
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const updatedUsers = storedUsers.map((u) =>
        u.id === user.id ? updatedUser : u
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      toast.success("User updated successfully");

      // Navigate back to user details
      setTimeout(() => {
        router.push(`/admin/users/${user.id}/details`);
      }, 500);

      /* API Implementation (Commented out for future use)
      // Update user in API
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      toast.success("User updated successfully");
      router.push(`/admin/users/${user.id}/details`);
      */
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle navigation back to user details
  const handleCancel = () => {
    router.push(`/admin/users/${user.id}/details`);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500 mb-2" />
          <p className="text-muted-foreground">Loading user data...</p>
        </div>
      </div>
    );
  }

  // Show error state if user not found
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">User Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The user you're looking for could not be found.
          </p>
          <button
            onClick={() => router.push("/admin/users")}
            className="text-primary hover:underline"
          >
            Return to users list
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 py-6 mx-auto max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={handleCancel}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to User Details
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar} alt={formData.name} />
                  <AvatarFallback>{getInitials(formData.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>Edit User</CardTitle>
                  <CardDescription>Update user information</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-medium">Basic Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone || ""}
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => handleChange("role", value)}
                      required
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Donor">Donor</SelectItem>
                        <SelectItem value="Volunteer">Volunteer</SelectItem>
                        <SelectItem value="Staff">Staff</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="font-medium">Address Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={formData.street}
                      onChange={(e) => handleChange("street", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State / Province</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleChange("state", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP / Postal Code</Label>
                    <Input
                      id="zip"
                      value={formData.zip}
                      onChange={(e) => handleChange("zip", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleChange("country", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Preferences */}
              <div className="space-y-4">
                <h3 className="font-medium">Preferences</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="newsletter">Newsletter Subscription</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about campaigns and events
                    </p>
                  </div>
                  <Switch
                    id="newsletter"
                    checked={formData.newsletter}
                    onCheckedChange={(checked) =>
                      handleChange("newsletter", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={handleCancel}>
                <XCircle className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default UserEditPage;
