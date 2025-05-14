// components/blog/RichTextEditor.jsx
"use client";

import React, { useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Heading,
} from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const RichTextEditor = ({ value, onChange, editorRef }) => {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // Helper to execute commands
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    // This is necessary to update the value after a command
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  // Handle special commands
  const handleHeading = (level) => {
    execCommand("formatBlock", `<h${level}>`);
  };

  const handleLink = () => {
    if (linkUrl && linkText) {
      execCommand(
        "insertHTML",
        `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`
      );
      setLinkUrl("");
      setLinkText("");
      setIsLinkDialogOpen(false);
    }
  };

  const handleImage = () => {
    if (imageFile) {
      // For local testing, we can create a data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        execCommand(
          "insertHTML",
          `<img src="${reader.result}" alt="${imageAlt}" class="max-w-full h-auto rounded-md my-4" />`
        );
        setImageUrl("");
        setImageAlt("");
        setImageFile(null);
        setIsImageDialogOpen(false);
      };
      reader.readAsDataURL(imageFile);
    } else if (imageUrl) {
      execCommand(
        "insertHTML",
        `<img src="${imageUrl}" alt="${imageAlt}" class="max-w-full h-auto rounded-md my-4" />`
      );
      setImageUrl("");
      setImageAlt("");
      setImageFile(null);
      setIsImageDialogOpen(false);
    }
  };

  const handlePaste = (e) => {
    // Get clipboard data
    const clipboardData = e.clipboardData || window.clipboardData;

    // Check if there are files in the clipboard (like images)
    if (clipboardData.files && clipboardData.files.length > 0) {
      e.preventDefault();
      const file = clipboardData.files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          execCommand(
            "insertHTML",
            `<img src="${reader.result}" alt="Pasted image" class="max-w-full h-auto rounded-md my-4" />`
          );
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="border rounded-md">
      {/* Toolbar */}
      <div className="bg-gray-50 dark:bg-gray-800 p-2 border-b flex flex-wrap gap-2">
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="mb-2">
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="headings">Headings</TabsTrigger>
            <TabsTrigger value="blocks">Blocks</TabsTrigger>
            <TabsTrigger value="insert">Insert</TabsTrigger>
            <TabsTrigger value="align">Alignment</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="flex flex-wrap gap-1">
            <ToggleGroup type="multiple">
              <ToggleGroupItem
                value="bold"
                onClick={() => execCommand("bold")}
                aria-label="Toggle bold"
              >
                <Bold className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="italic"
                onClick={() => execCommand("italic")}
                aria-label="Toggle italic"
              >
                <Italic className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="underline"
                onClick={() => execCommand("underline")}
                aria-label="Toggle underline"
              >
                <Underline className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </TabsContent>

          <TabsContent value="headings" className="flex flex-wrap gap-1">
            <ToggleGroup type="single">
              <ToggleGroupItem
                value="h1"
                onClick={() => handleHeading(1)}
                aria-label="Heading 1"
              >
                <Heading1 className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="h2"
                onClick={() => handleHeading(2)}
                aria-label="Heading 2"
              >
                <Heading2 className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="h3"
                onClick={() => handleHeading(3)}
                aria-label="Heading 3"
              >
                <Heading3 className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="h4"
                onClick={() => handleHeading(4)}
                aria-label="Heading 4"
              >
                <Heading className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </TabsContent>

          <TabsContent value="blocks" className="flex flex-wrap gap-1">
            <ToggleGroup type="single">
              <ToggleGroupItem
                value="ul"
                onClick={() => execCommand("insertUnorderedList")}
                aria-label="Bullet list"
              >
                <List className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="ol"
                onClick={() => execCommand("insertOrderedList")}
                aria-label="Numbered list"
              >
                <ListOrdered className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="quote"
                onClick={() => execCommand("formatBlock", "<blockquote>")}
                aria-label="Quote"
              >
                <Quote className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="code"
                onClick={() => execCommand("formatBlock", "<pre>")}
                aria-label="Code block"
              >
                <Code className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </TabsContent>

          <TabsContent value="insert" className="flex flex-wrap gap-1">
            <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Link
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Insert Link</DialogTitle>
                  <DialogDescription>
                    Add a link to your content
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="link-text" className="text-right">
                      Text
                    </Label>
                    <Input
                      id="link-text"
                      value={linkText}
                      onChange={(e) => setLinkText(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="link-url" className="text-right">
                      URL
                    </Label>
                    <Input
                      id="link-url"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsLinkDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleLink}>Insert Link</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog
              open={isImageDialogOpen}
              onOpenChange={setIsImageDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Image
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Insert Image</DialogTitle>
                  <DialogDescription>
                    Add an image to your content
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="image-url" className="text-right">
                      Image URL
                    </Label>
                    <Input
                      id="image-url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Or upload an image below"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="image-alt" className="text-right">
                      Alt Text
                    </Label>
                    <Input
                      id="image-alt"
                      value={imageAlt}
                      onChange={(e) => setImageAlt(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="image-file" className="text-right">
                      Upload
                    </Label>
                    <Input
                      id="image-file"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsImageDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleImage}>Insert Image</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="align" className="flex flex-wrap gap-1">
            <ToggleGroup type="single">
              <ToggleGroupItem
                value="left"
                onClick={() => execCommand("justifyLeft")}
                aria-label="Align left"
              >
                <AlignLeft className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="center"
                onClick={() => execCommand("justifyCenter")}
                aria-label="Align center"
              >
                <AlignCenter className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="right"
                onClick={() => execCommand("justifyRight")}
                aria-label="Align right"
              >
                <AlignRight className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </TabsContent>
        </Tabs>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        className="min-h-[400px] p-4 focus:outline-none"
        contentEditable="true"
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onPaste={handlePaste}
      />
    </div>
  );
};

export default RichTextEditor;
