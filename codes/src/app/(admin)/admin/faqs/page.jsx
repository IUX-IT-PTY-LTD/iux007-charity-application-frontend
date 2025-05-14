"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminContext } from "@/components/admin/admin-context";

import {
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  ArrowUpDown,
  MessageSquare,
  HelpCircle,
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

const AdminFAQsList = () => {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();

  // State management
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("ordering");
  const [sortDirection, setSortDirection] = useState("asc");
  const [faqToDelete, setFaqToDelete] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Set page title and subtitle
  useEffect(() => {
    setPageTitle("FAQs");
    setPageSubtitle("Manage frequently asked questions for your users");
  }, [setPageTitle, setPageSubtitle]);

  // Fetch FAQs from localStorage (for testing) or API
  useEffect(() => {
    const fetchFaqs = () => {
      setIsLoading(true);

      try {
        // Check localStorage first
        const storedFaqs = localStorage.getItem("faqs");
        let faqData = [];

        if (storedFaqs) {
          faqData = JSON.parse(storedFaqs);
        }

        // If no stored FAQs, use sample data
        if (!faqData || faqData.length === 0) {
          faqData = [
            {
              id: "1",
              question: "What is your return policy?",
              answer:
                "We offer a 30-day money-back guarantee on all our products. If you're not satisfied with your purchase, you can return it within 30 days for a full refund.",
              ordering: 1,
              status: "1",
            },
            {
              id: "2",
              question: "How long does shipping take?",
              answer:
                "Standard shipping takes 3-5 business days within the continental US. International shipping can take 7-14 business days depending on the destination.",
              ordering: 2,
              status: "1",
            },
            {
              id: "3",
              question: "Do you offer international shipping?",
              answer:
                "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location. Please check our shipping page for more details.",
              ordering: 3,
              status: "0",
            },
            {
              id: "4",
              question: "How can I track my order?",
              answer:
                "Once your order ships, you'll receive a confirmation email with a tracking number. You can use this number to track your package on our website or the carrier's site.",
              ordering: 4,
              status: "1",
            },
            {
              id: "5",
              question: "What payment methods do you accept?",
              answer:
                "We accept Visa, Mastercard, American Express, PayPal, and Apple Pay. All payments are securely processed and encrypted.",
              ordering: 5,
              status: "1",
            },
          ];

          // Store sample data for testing
          localStorage.setItem("faqs", JSON.stringify(faqData));
        }

        setFaqs(faqData);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        toast.error("Failed to load FAQs");
      } finally {
        setIsLoading(false);
      }

      /* API Implementation (Commented out for future use)
      // Fetch from API
      fetch('/api/faqs')
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch FAQs');
          }
          return response.json();
        })
        .then(data => {
          setFaqs(data);
          // Optionally cache in localStorage
          localStorage.setItem("faqs", JSON.stringify(data));
        })
        .catch(error => {
          console.error('Error fetching FAQs:', error);
          toast.error("Failed to load FAQs. Please try again.");
          
          // Fall back to localStorage or sample data if API fails
          const storedFaqs = JSON.parse(localStorage.getItem("faqs") || "[]");
          if (storedFaqs.length > 0) {
            setFaqs(storedFaqs);
          } else {
            // Use sample data as last resort
            setFaqs(sampleFaqs);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
      */
    };

    fetchFaqs();
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

  // Filter and sort FAQs
  const filteredAndSortedFaqs = [...faqs]
    .filter((faq) => {
      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();

      if (query === "active") return faq.status === "1";
      if (query === "inactive") return faq.status === "0";

      return (
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      const modifier = sortDirection === "asc" ? 1 : -1;

      if (sortField === "question" || sortField === "answer") {
        return a[sortField].localeCompare(b[sortField]) * modifier;
      } else {
        return (Number(a[sortField]) - Number(b[sortField])) * modifier;
      }
    });

  // Calculate pagination
  const totalFaqs = filteredAndSortedFaqs.length;
  const totalPages = Math.ceil(totalFaqs / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFaqs = filteredAndSortedFaqs.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Handle FAQ deletion
  const handleDelete = (id) => {
    try {
      const updatedFaqs = faqs.filter((faq) => faq.id !== id);
      setFaqs(updatedFaqs);
      localStorage.setItem("faqs", JSON.stringify(updatedFaqs));

      toast.success("FAQ deleted successfully");

      /* API Implementation (Commented out for future use)
      fetch(`/api/faqs/${id}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to delete FAQ');
          }
          
          // Update state after successful deletion
          const updatedFaqs = faqs.filter(faq => faq.id !== id);
          setFaqs(updatedFaqs);
          
          // Update localStorage for offline capability
          localStorage.setItem("faqs", JSON.stringify(updatedFaqs));
          
          toast.success("FAQ deleted successfully");
        })
        .catch(error => {
          console.error('Error deleting FAQ:', error);
          toast.error("Failed to delete FAQ. Please try again.");
        });
      */
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      toast.error("Failed to delete FAQ");
    }
  };

  // Handle status toggle
  const handleStatusChange = (id, currentStatus) => {
    try {
      const updatedFaqs = faqs.map((faq) => {
        if (faq.id === id) {
          return { ...faq, status: currentStatus === "1" ? "0" : "1" };
        }
        return faq;
      });

      setFaqs(updatedFaqs);
      localStorage.setItem("faqs", JSON.stringify(updatedFaqs));

      toast.success(
        `FAQ ${
          currentStatus === "1" ? "deactivated" : "activated"
        } successfully`
      );

      /* API Implementation (Commented out for future use)
      const faqToUpdate = faqs.find(faq => faq.id === id);
      const updatedStatus = currentStatus === "1" ? "0" : "1";
      
      fetch(`/api/faqs/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: updatedStatus }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to update FAQ status');
          }
          
          // Update state after successful update
          const updatedFaqs = faqs.map(faq => {
            if (faq.id === id) {
              return { ...faq, status: updatedStatus };
            }
            return faq;
          });
          
          setFaqs(updatedFaqs);
          
          // Update localStorage for offline capability
          localStorage.setItem("faqs", JSON.stringify(updatedFaqs));
          
          toast.success(`FAQ ${currentStatus === "1" ? "deactivated" : "activated"} successfully`);
        })
        .catch(error => {
          console.error('Error updating FAQ status:', error);
          toast.error("Failed to update FAQ status. Please try again.");
        });
      */
    } catch (error) {
      console.error("Error updating FAQ status:", error);
      toast.error("Failed to update FAQ status");
    }
  };

  // Column definitions for sortable headers
  const columns = [
    { field: "ordering", label: "#", sortable: true },
    { field: "question", label: "Question", sortable: true },
    { field: "answer", label: "Answer", sortable: true },
    { field: "status", label: "Status", sortable: true },
    { field: "actions", label: "Actions", sortable: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Manage FAQs displayed on your website
              </CardDescription>
            </div>

            <Button
              onClick={() => router.push("/admin/faqs/create")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create FAQ
            </Button>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search FAQs..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 self-end">
                <span className="text-sm text-gray-500">
                  {filteredAndSortedFaqs.length}{" "}
                  {filteredAndSortedFaqs.length === 1 ? "FAQ" : "FAQs"} found
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
                        {faqs.length}
                      </Badge>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSearchQuery("active")}
                      className="justify-between"
                    >
                      Active
                      <Badge variant="outline" className="ml-2">
                        {faqs.filter((faq) => faq.status === "1").length}
                      </Badge>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSearchQuery("inactive")}
                      className="justify-between"
                    >
                      Inactive
                      <Badge variant="outline" className="ml-2">
                        {faqs.filter((faq) => faq.status === "0").length}
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
                        Loading FAQs...
                      </TableCell>
                    </TableRow>
                  ) : filteredAndSortedFaqs.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No FAQs found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentFaqs.map((faq) => (
                      <TableRow
                        key={faq.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <TableCell className="font-medium">
                          {faq.ordering}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <HelpCircle className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">{faq.question}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-md">
                            <p className="truncate" title={faq.answer}>
                              {faq.answer}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={faq.status === "1"}
                              onCheckedChange={() =>
                                handleStatusChange(faq.id, faq.status)
                              }
                              aria-label={`Toggle status for ${faq.question}`}
                              className="data-[state=checked]:bg-black data-[state=checked]:text-white"
                            />
                            <Badge
                              variant={
                                faq.status === "1" ? "success" : "destructive"
                              }
                              className={
                                faq.status === "1"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {faq.status === "1" ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                router.push(`/admin/faqs/${faq.id}/edit`)
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
                                    This will permanently delete this FAQ. This
                                    action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(faq.id)}
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
              {Math.min(indexOfLastItem, totalFaqs)} of {totalFaqs} FAQs
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

export default AdminFAQsList;
