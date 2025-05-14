// components/blog/PostHeader.jsx
"use client";

import React from "react";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, Tag, User, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PostHeader = ({ post, category }) => {
  // Format date
  const formattedDate = post.publish_date
    ? format(parseISO(post.publish_date), "MMMM d, yyyy")
    : "";

  return (
    <div className="space-y-4">
      {/* Status badge */}
      <div className="flex flex-wrap gap-2">
        {post.status !== "published" && (
          <Badge
            variant={post.status === "scheduled" ? "secondary" : "outline"}
            className={
              post.status === "draft"
                ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                : post.status === "scheduled"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                : ""
            }
          >
            {post.status === "draft" ? "Draft" : "Scheduled"}
          </Badge>
        )}

        {post.is_featured && (
          <Badge
            variant="secondary"
            className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
          >
            <Star className="h-3 w-3 mr-1 fill-current" />
            Featured
          </Badge>
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
        {post.title}
      </h1>

      {/* Metadata */}
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pb-2">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          {formattedDate}
        </div>

        {post.estimated_read_time && (
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {post.estimated_read_time}
          </div>
        )}

        {category && (
          <div className="flex items-center">
            <Tag className="h-4 w-4 mr-1" />
            {category.name}
          </div>
        )}

        <div className="flex items-center">
          <User className="h-4 w-4 mr-1" />
          Admin User
        </div>
      </div>

      {/* Excerpt/Summary */}
      {post.excerpt && (
        <p className="text-lg text-muted-foreground italic leading-relaxed">
          {post.excerpt}
        </p>
      )}
    </div>
  );
};

export default PostHeader;
