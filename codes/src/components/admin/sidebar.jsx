"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Menu as MenuIcon,
  Calendar,
  FileText,
  HelpCircle,
  Images,
  LogOut,
  User,
  ChevronDown,
  Plus,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();
  const sidebar = useSidebar();

  // Check if a path is active
  const isActive = (href) => {
    if (href === "/admin/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      {/* Sidebar Header with User Profile */}
      <SidebarHeader className="h-16 flex items-center px-4 border-b border-border/40">
        <div className="flex items-center gap-3 w-full">
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage src="/assets/img/avatar.jpg" alt="Admin" />
            <AvatarFallback className="bg-primary/10 text-primary">
              AA
            </AvatarFallback>
          </Avatar>
          {!sidebar.collapsed && (
            <div className="flex flex-col text-sm leading-tight">
              <span className="font-medium text-foreground truncate max-w-[120px]">
                Super Admin
              </span>
              <span className="text-xs text-muted-foreground">
                Administrator
              </span>
            </div>
          )}
          <SidebarTrigger className="ml-auto h-8 w-8 rounded-md hover:bg-accent hover:text-accent-foreground" />
        </div>
      </SidebarHeader>

      {/* Sidebar Content with Navigation */}
      <SidebarContent className="px-2 py-4">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/admin/dashboard")}
                  className={cn(
                    "gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    isActive("/admin/dashboard") &&
                      "bg-primary/10 text-primary font-medium hover:bg-primary/15"
                  )}
                >
                  <Link href="/admin/dashboard">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/admin/menus")}
                  className={cn(
                    "gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    isActive("/admin/menus") &&
                      "bg-primary/10 text-primary font-medium hover:bg-primary/15"
                  )}
                >
                  <Link href="/admin/menus">
                    <MenuIcon className="h-5 w-5" />
                    <span>Menus</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/admin/events")}
                  className={cn(
                    "gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    isActive("/admin/events") &&
                      "bg-primary/10 text-primary font-medium hover:bg-primary/15"
                  )}
                >
                  <Link href="/admin/events">
                    <Calendar className="h-5 w-5" />
                    <span>Events</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Content Management */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground">
            Content
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Collapsible Contents Menu */}
              <Collapsible
                defaultOpen={isActive("/admin/contents")}
                className="group/collapsible w-full"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={isActive("/admin/contents")}
                      className={cn(
                        "w-full gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                        isActive("/admin/contents") &&
                          "bg-primary/10 text-primary font-medium hover:bg-primary/15"
                      )}
                    >
                      <FileText className="h-5 w-5" />
                      <span>Contents</span>
                      <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="pt-1 pb-1">
                    <SidebarMenu className="pl-8">
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive("/admin/pages")}
                          className={cn(
                            "gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                            isActive("/admin/pages") &&
                              "bg-primary/10 text-primary font-medium hover:bg-primary/15"
                          )}
                        >
                          <Link href="/admin/pages">
                            <span>Pages</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive("/admin/blogs")}
                          className={cn(
                            "gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                            isActive("/admin/blogs") &&
                              "bg-primary/10 text-primary font-medium hover:bg-primary/15"
                          )}
                        >
                          <Link href="/admin/blogs">
                            <span>Blog Posts</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/admin/faqs")}
                  className={cn(
                    "gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    isActive("/admin/faqs") &&
                      "bg-primary/10 text-primary font-medium hover:bg-primary/15"
                  )}
                >
                  <Link href="/admin/faqs">
                    <HelpCircle className="h-5 w-5" />
                    <span>FAQs</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/admin/sliders")}
                  className={cn(
                    "gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    isActive("/admin/sliders") &&
                      "bg-primary/10 text-primary font-medium hover:bg-primary/15"
                  )}
                >
                  <Link href="/admin/sliders">
                    <Images className="h-5 w-5" />
                    <span>Sliders</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer with Logout */}
      <SidebarFooter className="border-t border-border/40 py-2 mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => console.log("Logging out...")}
              className="gap-3 rounded-lg px-3 py-2 text-destructive hover:bg-destructive/10 mx-2"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

// Main content wrapper component
export function MainContent({ children }) {
  return <div className="flex-1 flex flex-col overflow-hidden">{children}</div>;
}
