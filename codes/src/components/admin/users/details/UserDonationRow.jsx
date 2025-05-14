// components/users/UserDonationRow.jsx
"use client";

import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import {
  ChevronDown,
  Receipt,
  Download,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  DollarSign,
  User,
  Clock,
  Clipboard,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

// Status badge styles
const statusStyles = {
  completed:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  pending: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  refunded: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
};

// Status icons
const StatusIcon = ({ status }) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case "pending":
      return <Clock className="h-4 w-4 text-blue-600" />;
    case "failed":
      return <XCircle className="h-4 w-4 text-red-600" />;
    case "refunded":
      return <RefreshCcw className="h-4 w-4 text-amber-600" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-600" />;
  }
};

const UserDonationRow = ({ donation, eventName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Format date
  const formattedDate = donation.date
    ? format(parseISO(donation.date), "MMM d, yyyy 'at' h:mm a")
    : "N/A";

  // Format amount with dollar sign
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(donation.amount);

  // Handle receipt viewing
  const handleViewReceipt = () => {
    router.push(
      `/admin/events/${donation.event_id}/donations/${donation.id}/receipt`
    );
  };

  // Handle receipt download
  const handleDownloadReceipt = () => {
    toast.info(`Downloading receipt for donation #${donation.id} as PDF...`);

    // Simulate download delay
    setTimeout(() => {
      toast.success("Receipt downloaded successfully");
    }, 1500);
  };

  // Handle copying donation ID to clipboard
  const handleCopyId = () => {
    navigator.clipboard.writeText(donation.id);
    toast.success("Donation ID copied to clipboard");
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border rounded-lg mb-4 bg-white dark:bg-gray-800"
    >
      <CollapsibleTrigger asChild>
        <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
          <div className="flex items-center gap-3">
            <ChevronDown
              className={`h-5 w-5 flex-shrink-0 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />

            <div className="flex items-center gap-3">
              <div>
                <div className="font-medium">{eventName}</div>
                <div className="text-sm text-muted-foreground">
                  {donation.id}
                </div>
              </div>

              <Badge className={statusStyles[donation.status]}>
                <StatusIcon status={donation.status} />
                <span className="ml-1 capitalize">{donation.status}</span>
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 ml-auto">
            <div className="text-sm text-muted-foreground">{formattedDate}</div>
            <div className="text-sm font-medium">{formattedAmount}</div>
          </div>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <Separator />
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Information */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Event Information</h3>

              <div className="space-y-2">
                <div className="flex items-start">
                  <Calendar className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{eventName}</div>
                    <div className="text-sm text-muted-foreground">
                      Event ID: {donation.event_id}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Payment Information</h3>

              <div className="space-y-2">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{formattedAmount}</div>
                    {donation.is_recurring && (
                      <div className="text-sm text-muted-foreground">
                        Recurring
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div className="text-sm">{donation.payment_method}</div>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div className="text-sm">{formattedDate}</div>
                </div>

                <div className="flex items-center">
                  <Clipboard className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div className="text-sm">
                    Transaction ID: {donation.transaction_id || "N/A"}
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyId();
                          }}
                        >
                          <Clipboard className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy ID</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Additional Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {donation.campaign && (
                <div>
                  <div className="text-sm font-medium">Campaign</div>
                  <div className="text-sm text-muted-foreground">
                    {donation.campaign}
                  </div>
                </div>
              )}

              {donation.notes && (
                <div className="col-span-2">
                  <div className="text-sm font-medium">Notes</div>
                  <div className="text-sm text-muted-foreground">
                    {donation.notes}
                  </div>
                </div>
              )}

              {donation.tribute_info && (
                <div className="col-span-2">
                  <div className="text-sm font-medium">Tribute Information</div>
                  <div className="text-sm text-muted-foreground">
                    In {donation.tribute_info.type} of{" "}
                    {donation.tribute_info.name}
                    {donation.tribute_info.message && (
                      <div className="mt-1 italic">
                        "{donation.tribute_info.message}"
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleViewReceipt();
              }}
            >
              <Receipt className="mr-2 h-4 w-4" />
              View Receipt
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleDownloadReceipt();
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default UserDonationRow;
