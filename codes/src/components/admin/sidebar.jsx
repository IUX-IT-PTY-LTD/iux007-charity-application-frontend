"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Menu,
  LogOut,
  Calendar,
  FileText,
  HelpCircle,
  Images,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const AdminSidebar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Define navigation items
  const navItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/admin/dashboard",
    },
    {
      title: "Menus",
      icon: <Menu className="h-5 w-5" />,
      href: "/admin/menus",
    },
    {
      title: "Events",
      icon: <Calendar className="h-5 w-5" />,
      href: "/admin/events",
    },
    {
      title: "Contents",
      icon: <FileText className="h-5 w-5" />,
      href: "/admin/contents",
      submenu: [
        {
          title: "Pages",
          href: "/admin/contents/pages",
        },
        {
          title: "Blog Posts",
          href: "/admin/contents/posts",
        },
      ],
    },
    {
      title: "FAQs",
      icon: <HelpCircle className="h-5 w-5" />,
      href: "/admin/faqs",
    },
    {
      title: "Slider",
      icon: <Images className="h-5 w-5" />,
      href: "/admin/slider",
    },
  ];

  // Toggle mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle logout
  const handleLogout = () => {
    console.log("Logging out...");
    // Add your logout logic here
    // router.push('/login')
  };

  // Determine if a nav item is active
  const isActive = (href) => {
    if (href === "/admin/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Render sidebar nav item with optional tooltip when collapsed
  const NavItem = ({ item }) => {
    const active = isActive(item.href);
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(active);

    const itemContent = (
      <div
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          active
            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-100"
            : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
        )}
      >
        {item.icon}
        {!isCollapsed && (
          <>
            <span className="flex-1">{item.title}</span>
            {item.submenu && (
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  isSubmenuOpen && "rotate-180"
                )}
              />
            )}
          </>
        )}
      </div>
    );

    return (
      <div>
        {item.submenu ? (
          <Collapsible
            open={isSubmenuOpen && !isCollapsed}
            onOpenChange={setIsSubmenuOpen}
            className="w-full"
          >
            <CollapsibleTrigger asChild className="w-full">
              {isCollapsed ? (
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <div className="cursor-pointer">{itemContent}</div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="ml-1">
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <div className="cursor-pointer">{itemContent}</div>
              )}
            </CollapsibleTrigger>

            <CollapsibleContent className="pl-9 pt-1">
              {item.submenu.map((subItem, i) => (
                <Link href={subItem.href} key={i} className="block">
                  <div
                    className={cn(
                      "flex items-center rounded-md py-2 pl-2 text-sm transition-colors",
                      isActive(subItem.href)
                        ? "text-blue-700 font-medium dark:text-blue-100"
                        : "text-gray-600 hover:text-blue-700 dark:text-gray-300 dark:hover:text-blue-100"
                    )}
                  >
                    <ChevronRight className="mr-1 h-3 w-3" />
                    <span>{subItem.title}</span>
                  </div>
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <Link href={item.href}>
            {isCollapsed ? (
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>{itemContent}</TooltipTrigger>
                  <TooltipContent side="right" className="ml-1">
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              itemContent
            )}
          </Link>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300 dark:bg-gray-900 dark:border-gray-800",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Sidebar Header */}
      <div
        className={cn(
          "flex items-center p-4",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
        {!isCollapsed && (
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 font-bold text-white">
              A
            </div>
            <span className="text-lg font-bold">Admin</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <ChevronRight
            className={cn(
              "h-5 w-5 transition-transform",
              isCollapsed ? "rotate-180" : ""
            )}
          />
        </Button>
      </div>

      {/* User Profile */}
      <div
        className={cn(
          "border-b border-gray-200 dark:border-gray-800",
          isCollapsed ? "py-4" : "p-4"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3",
            isCollapsed && "justify-center"
          )}
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src="/assets/img/avatar.jpg" alt="Admin" />
            <AvatarFallback>AA</AvatarFallback>
          </Avatar>

          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Admin Admin
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Administrator
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navItems.map((item, i) => (
            <NavItem key={i} item={item} />
          ))}
        </nav>
      </ScrollArea>

      {/* Sidebar Footer */}
      <div className="mt-auto border-t border-gray-200 p-3 dark:border-gray-800">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-gray-700 hover:bg-red-50 hover:text-red-700 dark:text-gray-200 dark:hover:bg-red-900/20 dark:hover:text-red-100",
            isCollapsed && "justify-center"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
