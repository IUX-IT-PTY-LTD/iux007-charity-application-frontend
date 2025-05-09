"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  ArrowUpDown,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const AdminMenus = () => {
  const router = useRouter();

  // State management
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("ordering");
  const [sortDirection, setSortDirection] = useState("asc");
  const [menuToDelete, setMenuToDelete] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch menus from localStorage (for testing)
  useEffect(() => {
    const fetchMenus = () => {
      setIsLoading(true);

      try {
        // For testing: check localStorage first, then fall back to sample data
        const storedMenus = localStorage.getItem("menus");
        let menuData = [];

        if (storedMenus) {
          menuData = JSON.parse(storedMenus);
        }

        // If no stored menus, use sample data
        if (!menuData || menuData.length === 0) {
          menuData = [
            { id: "1", name: "Home", slug: "home", ordering: 1, status: 1 },
            { id: "2", name: "Blog", slug: "blog", ordering: 2, status: 1 },
            {
              id: "3",
              name: "Contact",
              slug: "contact",
              ordering: 3,
              status: 0,
            },
            {
              id: "4",
              name: "About Us",
              slug: "about-us",
              ordering: 4,
              status: 1,
            },
            {
              id: "5",
              name: "Services",
              slug: "services",
              ordering: 5,
              status: 1,
            },
          ];

          // Store sample data for testing
          localStorage.setItem("menus", JSON.stringify(menuData));
        }

        setMenus(menuData);
      } catch (error) {
        console.error("Error fetching menus:", error);
        toast.error("Failed to load menus");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenus();
  }, []);

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sort and filter menus
  const sortedAndFilteredMenus = [...menus]
    .filter((menu) => {
      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();
      return (
        menu.name.toLowerCase().includes(query) ||
        menu.slug.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      const modifier = sortDirection === "asc" ? 1 : -1;

      if (sortField === "name" || sortField === "slug") {
        return a[sortField].localeCompare(b[sortField]) * modifier;
      } else {
        return (a[sortField] - b[sortField]) * modifier;
      }
    });

  // Calculate total pages
  const totalMenus = sortedAndFilteredMenus.length;
  const totalPages = Math.ceil(totalMenus / itemsPerPage);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMenus = sortedAndFilteredMenus.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Handle menu deletion
  const handleDelete = (id) => {
    try {
      const updatedMenus = menus.filter((menu) => menu.id !== id);
      setMenus(updatedMenus);
      localStorage.setItem("menus", JSON.stringify(updatedMenus));

      toast.success("Menu deleted successfully");
    } catch (error) {
      console.error("Error deleting menu:", error);
      toast.error("Failed to delete menu");
    }
  };

  // Handle status toggle
  const handleStatusChange = (id, currentStatus) => {
    try {
      const updatedMenus = menus.map((menu) => {
        if (menu.id === id) {
          return { ...menu, status: currentStatus === 1 ? 0 : 1 };
        }
        return menu;
      });

      setMenus(updatedMenus);
      localStorage.setItem("menus", JSON.stringify(updatedMenus));

      toast.success(
        `Menu ${currentStatus === 1 ? "deactivated" : "activated"} successfully`
      );
    } catch (error) {
      console.error("Error updating menu status:", error);
      toast.error("Failed to update menu status");
    }
  };

  // Column definitions for sortable headers
  const columns = [
    { field: "id", label: "#", sortable: false },
    { field: "name", label: "Name", sortable: true },
    { field: "slug", label: "Slug", sortable: true },
    { field: "ordering", label: "Order", sortable: true },
    { field: "status", label: "Status", sortable: true },
    { field: "actions", label: "Actions", sortable: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle>All Menus</CardTitle>
              <CardDescription>
                Manage your website navigation menus
              </CardDescription>
            </div>

            <Button
              onClick={() => router.push("/admin/menus/create")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Menu
            </Button>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search menus..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 self-end">
                <span className="text-sm text-gray-500">
                  {sortedAndFilteredMenus.length}{" "}
                  {sortedAndFilteredMenus.length === 1 ? "menu" : "menus"} found
                </span>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setSearchQuery("")}
                      className="justify-between"
                    >
                      All
                      <Badge variant="outline" className="ml-2">
                        {menus.length}
                      </Badge>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSearchQuery("active")}
                      className="justify-between"
                    >
                      Active
                      <Badge variant="outline" className="ml-2">
                        {menus.filter((menu) => menu.status === 1).length}
                      </Badge>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSearchQuery("inactive")}
                      className="justify-between"
                    >
                      Inactive
                      <Badge variant="outline" className="ml-2">
                        {menus.filter((menu) => menu.status === 0).length}
                      </Badge>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead
                        key={column.field}
                        className={
                          column.sortable ? "cursor-pointer select-none" : ""
                        }
                        onClick={
                          column.sortable
                            ? () => handleSort(column.field)
                            : undefined
                        }
                      >
                        <div className="flex items-center space-x-1">
                          <span>{column.label}</span>
                          {column.sortable && (
                            <ArrowUpDown className="h-3 w-3" />
                          )}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        Loading menus...
                      </TableCell>
                    </TableRow>
                  ) : sortedAndFilteredMenus.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No menus found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentMenus.map((menu, index) => (
                      <TableRow
                        key={menu.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <TableCell className="font-medium">
                          {indexOfFirstItem + index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{menu.name}</div>
                        </TableCell>
                        <TableCell>{menu.slug}</TableCell>
                        <TableCell>{menu.ordering}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={menu.status === 1}
                              onCheckedChange={() =>
                                handleStatusChange(menu.id, menu.status)
                              }
                              aria-label={`Toggle status for ${menu.name}`}
                            />
                            <Badge
                              variant={
                                menu.status === 1 ? "success" : "destructive"
                              }
                              className={
                                menu.status === 1
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {menu.status === 1 ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                router.push(`/admin/menus/${menu.id}/edit`)
                              }
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-600 hover:text-red-800 hover:bg-red-100"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete the "
                                    {menu.name}" menu and all its items. This
                                    action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(menu.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="text-xs text-gray-500">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, totalMenus)} of {totalMenus} menus
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  &lt;
                </Button>

                <div className="flex items-center gap-1 mx-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show 5 pages around current page
                    const startPage = Math.max(1, currentPage - 2);
                    const endPage = Math.min(totalPages, startPage + 4);
                    const adjustedStartPage = Math.max(1, endPage - 4);
                    const pageNumber = adjustedStartPage + i;

                    if (pageNumber <= totalPages) {
                      return (
                        <Button
                          key={pageNumber}
                          variant={
                            currentPage === pageNumber ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setCurrentPage(pageNumber)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNumber}
                        </Button>
                      );
                    }
                    return null;
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </Button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Items per page:</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1); // Reset to first page when changing items per page
                }}
              >
                <SelectTrigger className="w-16 h-8">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminMenus;
