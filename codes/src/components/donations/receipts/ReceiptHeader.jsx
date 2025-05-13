// components/donations/receipt/ReceiptHeader.jsx
"use client";

import React from "react";
import { Heart } from "lucide-react";
import { format, parseISO } from "date-fns";
import Image from "next/image";

const ReceiptHeader = ({
  donationId,
  donationDate,
  organizationName = "Charity Organization",
  organizationLogo = "/images/logo.png", // Default logo path
  organizationAddress,
  organizationContact,
}) => {
  // Format date
  const formattedDate = donationDate
    ? format(parseISO(donationDate), "MMMM d, yyyy")
    : "N/A";

  // Generate receipt number
  const receiptNumber = `R-${donationId.replace("DON-", "")}`;

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          {/* Organization logo placeholder */}
          <div className="bg-primary/10 rounded-full p-3 mr-3">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{organizationName}</h2>
            {organizationContact && (
              <p className="text-sm text-muted-foreground">
                {organizationContact}
              </p>
            )}
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-primary">Receipt</div>
          <div className="text-sm text-muted-foreground">#{receiptNumber}</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between border-t border-b py-4 mb-6">
        <div>
          <div className="text-sm font-medium">Date</div>
          <div>{formattedDate}</div>
        </div>
        <div className="mt-2 md:mt-0">
          <div className="text-sm font-medium">Donation ID</div>
          <div>{donationId}</div>
        </div>
      </div>

      {organizationAddress && (
        <div className="text-sm text-muted-foreground">
          <div>{organizationAddress.line1}</div>
          {organizationAddress.line2 && <div>{organizationAddress.line2}</div>}
          <div>
            {organizationAddress.city}, {organizationAddress.state}{" "}
            {organizationAddress.zip}
          </div>
          <div>{organizationAddress.country}</div>
          {organizationAddress.taxId && (
            <div className="mt-2">Tax ID: {organizationAddress.taxId}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReceiptHeader;
