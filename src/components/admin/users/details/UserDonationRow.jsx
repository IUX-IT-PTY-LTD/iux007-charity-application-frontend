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
  Lock,
  Eye,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

// Import permission hooks
import { useUserPermissions } from '@/api/hooks/useModulePermissions';

// Status badge styles - using a single style since all donations in the current API have completed status
const statusStyles = {
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
};

// Status icon - using only completed status for now based on the API response
const StatusIcon = () => {
  return <CheckCircle2 className="h-4 w-4 text-green-600" />;
};

// Permission-aware action buttons
const PermissionAwareReceiptButton = ({ donation, onViewReceipt }) => {
  const userPermissions = useUserPermissions();

  if (!userPermissions.canView) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className="opacity-50 cursor-not-allowed"
        title="You don't have permission to view receipts"
      >
        <Lock className="mr-2 h-4 w-4" />
        View Receipt
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={(e) => {
        e.stopPropagation();
        onViewReceipt();
      }}
    >
      <Receipt className="mr-2 h-4 w-4" />
      View Receipt
    </Button>
  );
};

const PermissionAwareDownloadButton = ({ donation, onDownloadReceipt }) => {
  const userPermissions = useUserPermissions();

  if (!userPermissions.canView) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className="opacity-50 cursor-not-allowed"
        title="You don't have permission to download receipts"
      >
        <Lock className="mr-2 h-4 w-4" />
        Download
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={(e) => {
        e.stopPropagation();
        onDownloadReceipt();
      }}
    >
      <Download className="mr-2 h-4 w-4" />
      Download Receipt
    </Button>
  );
};

const UserDonationRow = ({ donation, userPermissions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Use passed permissions or hook (for flexibility)
  const permissions = userPermissions || useUserPermissions();

  // Status is always completed in the current API response
  const status = 'completed';

  // Format date from donation
  const donationDate = parseISO(donation.donated_at);
  const formattedDate = format(donationDate, "MMM d, yyyy 'at' h:mm a");

  // Format amount with dollar sign - mask if no permission
  const formattedAmount = permissions.canView
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(donation.total_price || 0)
    : '$••••';

  // Get event details - mask if no permission
  const eventTitle = permissions.canView ? donation.event?.title || 'Unknown Event' : '••••••••';
  const eventId = donation.event?.uuid || '';

  // Handle receipt viewing
  const handleViewReceipt = () => {
    if (!permissions.canView) {
      toast.error("You don't have permission to view receipts");
      return;
    }
    router.push(`/admin/events/${eventId}/donations/${donation.id}/receipt`);
  };

  // Handle receipt download
  const handleDownloadReceipt = () => {
    if (!permissions.canView) {
      toast.error("You don't have permission to download receipts");
      return;
    }

    toast.info(`Downloading receipt for donation #${donation.id} as PDF...`);

    // Simulate download delay
    setTimeout(() => {
      toast.success('Receipt downloaded successfully');
    }, 1500);
  };

  // Handle copying donation ID to clipboard
  const handleCopyId = () => {
    if (!permissions.canView) {
      toast.error("You don't have permission to copy donation details");
      return;
    }

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
        <div
          className={`p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg ${
            !permissions.canView ? 'opacity-75' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            <ChevronDown
              className={`h-5 w-5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />

            <div className="flex items-center gap-3">
              <div>
                <div className="font-medium flex items-center gap-2">
                  {eventTitle}
                  {!permissions.canView && <Lock className="h-4 w-4 text-gray-400" />}
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  ID: {permissions.canView ? donation.id : '••••'}
                  {!permissions.canView && <Eye className="h-3 w-3 text-gray-400" />}
                </div>
              </div>

              <Badge className={statusStyles[status]}>
                <StatusIcon />
                <span className="ml-1 capitalize">{status}</span>
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 ml-auto">
            <div className="text-sm text-muted-foreground">
              {permissions.canView ? formattedDate : '•••••••••'}
            </div>
            <div className="text-sm font-medium">{formattedAmount}</div>
          </div>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <Separator />
        <div className="p-4 space-y-4">
          {!permissions.canView ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Lock className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
              <p className="text-muted-foreground text-center max-w-md">
                You need view permissions to see donation details. Contact your administrator for
                access.
              </p>
            </div>
          ) : (
            <>
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

              {/* Actions - commented out but would include permission checks */}
              {/* <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                <PermissionAwareReceiptButton 
                  donation={donation} 
                  onViewReceipt={handleViewReceipt} 
                />
                <PermissionAwareDownloadButton 
                  donation={donation} 
                  onDownloadReceipt={handleDownloadReceipt} 
                />
              </div> */}
            </>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default UserDonationRow;
