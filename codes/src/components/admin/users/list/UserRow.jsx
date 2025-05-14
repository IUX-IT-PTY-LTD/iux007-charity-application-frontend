// components/users/UserRow.jsx
"use client";

import React from "react";
import { format, parseISO } from "date-fns";
import {
  MoreHorizontal,
  User,
  Edit,
  Trash2,
  ExternalLink,
  Mail,
  Phone,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const UserRow = ({ user, onDelete }) => {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  // Format date
  const registeredDate = user.created_at
    ? format(parseISO(user.created_at), "MMM d, yyyy")
    : "N/A";

  // Format name initials for avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // View user details
  const handleViewUser = () => {
    router.push(`/admin/users/${user.id}/details`);
  };

  // Edit user
  const handleEditUser = () => {
    router.push(`/admin/users/${user.id}/edit`);
  };

  // Delete user
  const handleDeleteUser = () => {
    setShowDeleteDialog(false);

    // Call the delete function passed from parent
    onDelete(user.id);

    toast.success(`User ${user.name} has been deleted`);
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b hover:bg-gray-50 dark:hover:bg-gray-800">
        <div
          className="flex items-center space-x-4"
          onClick={handleViewUser}
          style={{ cursor: "pointer" }}
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:block text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>Joined {registeredDate}</span>
            </div>
          </div>

          <div className="hidden md:flex items-center">
            <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-sm">
              {user.donation_count || 0} donations
            </span>
          </div>

          {/* <div className="hidden md:block text-sm">
            <span className="font-medium">{user.role}</span>
          </div> */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleViewUser}>
                <User className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEditUser}>
                <Edit className="mr-2 h-4 w-4" />
                Edit User
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 dark:text-red-400"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm User Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user "{user.name}"? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserRow;
