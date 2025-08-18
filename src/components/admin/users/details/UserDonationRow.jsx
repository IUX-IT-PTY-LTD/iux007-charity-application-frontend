// components/admin/users/details/UserDonationRow.jsx
'use client';

import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import {
  ChevronDown,
  Receipt,
  Download,
  Calendar,
  CreditCard,
  DollarSign,
  Clock,
  Clipboard,
  CheckCircle2,
  HandCoins,
  CalendarCheck,
  Bookmark,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

// Status badge styles - using a single style since all donations in the current API have completed status
const statusStyles = {
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
};

// Status icon - using only completed status for now based on the API response
const StatusIcon = () => {
  return <CheckCircle2 className="h-4 w-4 text-green-600" />;
};

const UserDonationRow = ({ donation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Status is always completed in the current API response
  const status = 'completed';

  // Format date from donation
  const donationDate = parseISO(donation.donated_at);
  const formattedDate = format(donationDate, "MMM d, yyyy 'at' h:mm a");

  // Format amount with dollar sign
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(donation.total_price || 0);

  // Get event details
  const eventTitle = donation.event?.title || 'Unknown Event';
  const eventId = donation.event?.uuid || '';

  // Handle receipt viewing
  const handleViewReceipt = () => {
    router.push(`/admin/events/${eventId}/donations/${donation.id}/receipt`);
  };

  // Handle receipt download
  const handleDownloadReceipt = () => {
    toast.info(`Downloading receipt for donation #${donation.id} as PDF...`);

    // Simulate download delay
    setTimeout(() => {
      toast.success('Receipt downloaded successfully');
    }, 1500);
  };

  // Handle copying donation ID to clipboard
  const handleCopyId = () => {
    navigator.clipboard.writeText(donation.id.toString());
    toast.success('Donation ID copied to clipboard');
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
              className={`h-5 w-5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />

            <div className="flex items-center gap-3">
              <div>
                <div className="font-medium">{eventTitle}</div>
                <div className="text-sm text-muted-foreground">ID: {donation.id}</div>
              </div>

              <Badge className={statusStyles[status]}>
                <StatusIcon />
                <span className="ml-1 capitalize">{status}</span>
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
                    <div className="font-medium">{eventTitle}</div>
                    <div className="text-sm text-muted-foreground">Event ID: {eventId}</div>
                    {donation.event?.description && (
                      <div className="text-sm text-muted-foreground mt-2">
                        {donation.event.description.length > 150
                          ? `${donation.event.description.substring(0, 150)}...`
                          : donation.event.description}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Payment Information</h3>

              <div className="space-y-2">
                <div className="flex items-center">
                  <HandCoins className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{formattedAmount}</div>
                    <div className="text-sm text-muted-foreground">
                      {donation.quantity} item{donation.quantity > 1 ? 's' : ''} ×{' '}
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(donation.per_unit_price)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <CalendarCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div className="text-sm">{formattedDate}</div>
                </div>

                <div className="flex items-center">
                  <Bookmark className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div className="text-sm">Donation ID: {donation.id}</div>
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

          {/* Additional Information - only display if we have notes */}
          {donation.notes && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Additional Information</h3>

              <div className="grid grid-cols-1 gap-4">
                <div className="col-span-1">
                  <div className="text-sm font-medium">Notes</div>
                  <div className="text-sm text-muted-foreground">{donation.notes}</div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          {/* <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
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
          </div> */}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default UserDonationRow;
