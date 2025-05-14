// components/blog/SEOMetadata.jsx
"use client";

import React, { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp, Globe } from "lucide-react";

const SEOMetadata = ({ metadata, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (field, value) => {
    onChange({
      ...metadata,
      [field]: value,
    });
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full border rounded-lg p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-medium">SEO Settings</h3>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="mt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="meta-title">Meta Title</Label>
          <Input
            id="meta-title"
            placeholder="Meta title for SEO"
            value={metadata.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            {metadata.title?.length || 0}/60 - Recommended length is 50-60
            characters
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="meta-description">Meta Description</Label>
          <Textarea
            id="meta-description"
            placeholder="Meta description for SEO"
            value={metadata.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            {metadata.description?.length || 0}/160 - Recommended length is
            150-160 characters
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            placeholder="URL slug"
            value={metadata.slug || ""}
            onChange={(e) => handleChange("slug", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            The URL-friendly version of the title
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="canonical-url">Canonical URL (optional)</Label>
          <Input
            id="canonical-url"
            placeholder="https://example.com/original-post"
            value={metadata.canonicalUrl || ""}
            onChange={(e) => handleChange("canonicalUrl", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Use this if this content is a duplicate of content elsewhere
          </p>
        </div>

        <div>
          <div className="border rounded-lg p-4 bg-muted/50">
            <h4 className="text-sm font-medium mb-2">Search Engine Preview</h4>
            <div className="space-y-1">
              <p className="text-blue-600 text-sm font-medium truncate">
                {metadata.title || "Title of your blog post"}
              </p>
              <p className="text-green-700 text-xs">
                yourdomain.com/{metadata.slug || "post-slug"}
              </p>
              <p className="text-sm text-gray-600 line-clamp-2">
                {metadata.description ||
                  "A brief description of your blog post will appear here. Make sure it's compelling and accurately describes your content."}
              </p>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SEOMetadata;
