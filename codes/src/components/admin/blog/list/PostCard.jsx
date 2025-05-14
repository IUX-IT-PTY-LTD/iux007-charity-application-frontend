// components/blog/PostCard.jsx
"use client";

import React from "react";
import { format, parseISO } from "date-fns";
import {
  Calendar,
  Clock,
  Tag,
  Edit,
  Trash2,
  Eye,
  Star,
  MessageSquare,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const statusColors = {
  published:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
};

const PostCardGrid = ({
  post,
  categories = [],
  onView,
  onEdit,
  onDelete,
  confirmDelete,
}) => {
  const router = useRouter();

  // Find category name
  const category = categories.find((c) => c.id === post.category_id);
  const categoryName = category ? category.name : "Uncategorized";

  // Format date
  const formattedDate = post.publish_date
    ? format(parseISO(post.publish_date), "MMM d, yyyy")
    : "";

  return (
    <Card className="h-full flex flex-col">
      <div className="relative">
        {post.featured_image ? (
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}

        <Badge
          className={`absolute top-2 right-2 ${statusColors[post.status]}`}
        >
          {post.status}
        </Badge>

        {post.is_featured && (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              <Star className="h-3 w-3 mr-1 fill-current" />
              Featured
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="flex-grow p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-2">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {formattedDate}
          </div>

          {post.estimated_read_time && (
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {post.estimated_read_time}
            </div>
          )}

          <div className="flex items-center">
            <Tag className="h-3 w-3 mr-1" />
            {categoryName}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="secondary" size="sm" onClick={() => onView(post.id)}>
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => onEdit(post.id)}>
            <Edit className="h-4 w-4" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="text-red-600 hover:text-red-800 hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the blog post "{post.title}".
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => confirmDelete(post.id)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
};

const PostCardList = ({
  post,
  categories = [],
  onView,
  onEdit,
  onDelete,
  confirmDelete,
}) => {
  const router = useRouter();

  // Find category name
  const category = categories.find((c) => c.id === post.category_id);
  const categoryName = category ? category.name : "Uncategorized";

  // Format date
  const formattedDate = post.publish_date
    ? format(parseISO(post.publish_date), "MMM d, yyyy")
    : "";

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {post.featured_image ? (
          <div className="w-full md:w-48 h-32 md:h-full shrink-0">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full md:w-48 h-32 md:h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center shrink-0">
            <span className="text-gray-400">No image</span>
          </div>
        )}

        <div className="p-4 flex-grow flex flex-col">
          <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
            <h3 className="text-lg font-semibold">{post.title}</h3>
            <div className="flex gap-1">
              <Badge className={statusColors[post.status]}>{post.status}</Badge>

              {post.is_featured && (
                <Badge
                  variant="secondary"
                  className="bg-amber-100 text-amber-800"
                >
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Featured
                </Badge>
              )}

              {post.allow_comments && (
                <Badge variant="outline">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Comments
                </Badge>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-grow">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap justify-between items-center mt-auto">
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {formattedDate}
              </div>

              {post.estimated_read_time && (
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {post.estimated_read_time}
                </div>
              )}

              <div className="flex items-center">
                <Tag className="h-3 w-3 mr-1" />
                {categoryName}
              </div>
            </div>

            <div className="flex gap-2 mt-2 md:mt-0">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onView(post.id)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(post.id)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-800 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the blog post "{post.title}".
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => confirmDelete(post.id)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export { PostCardGrid, PostCardList };
