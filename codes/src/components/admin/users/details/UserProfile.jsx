// components/users/UserProfile.jsx
"use client";

import React from "react";
import { format, parseISO } from "date-fns";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  User as UserIcon,
  Clock,
  Bell,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const UserProfile = ({ user }) => {
  if (!user) return null;

  // Format registration date
  const registeredDate = user.created_at
    ? format(parseISO(user.created_at), "MMMM d, yyyy")
    : "N/A";

  // Format last active date
  const lastActiveDate = user.last_active
    ? format(parseISO(user.last_active), "MMMM d, yyyy 'at' h:mm a")
    : "N/A";

  // Format total donated amount
  const formattedTotalDonated = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(user.total_donated || 0);

  // Format name initials for avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-0">
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6 pt-4">
          {/* User Basic Info */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-lg">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground">{user.role}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>

              {user.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user.phone}</span>
                </div>
              )}

              {user.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p>{user.address.street}</p>
                    <p>
                      {user.address.city}, {user.address.state}{" "}
                      {user.address.zip}
                    </p>
                    <p>{user.address.country}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Stats */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Registration Date</span>
                </div>
                <p className="font-semibold">{registeredDate}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Last Active</span>
                </div>
                <p className="font-semibold">{lastActiveDate}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Total Donated</span>
                </div>
                <p className="font-semibold">{formattedTotalDonated}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Donation Count</span>
                </div>
                <p className="font-semibold">
                  {user.donation_count || 0} donations
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Newsletter Subscription
                </span>
              </div>
              <div className="flex items-center">
                {user.newsletter ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="font-semibold">Subscribed</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-600 mr-2" />
                    <span className="font-semibold">Not subscribed</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
