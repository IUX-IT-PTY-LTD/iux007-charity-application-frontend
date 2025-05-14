// components/blog/PostContent.jsx
"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";

const PostContent = ({ content }) => {
  return (
    <div className="my-8">
      <Separator className="mb-8" />

      <div
        className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-img:rounded-md"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default PostContent;
