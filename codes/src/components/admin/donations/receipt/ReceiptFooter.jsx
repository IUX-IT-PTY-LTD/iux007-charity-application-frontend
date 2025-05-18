// components/donations/receipt/ReceiptFooter.jsx
'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const ReceiptFooter = ({
  organizationName = 'Charity Organization',
  organizationWebsite = 'www.charityorg.org',
  organizationEmail = 'donations@charityorg.org',
  organizationPhone = '+1 (123) 456-7890',
}) => {
  const year = new Date().getFullYear();

  return (
    <div className="mt-8">
      <Separator className="mb-6" />

      <div className="flex flex-col items-center text-center">
        <div className="flex items-center mb-2">
          <Heart className="h-5 w-5 text-primary mr-2" />
          <span className="font-semibold">{organizationName}</span>
        </div>

        <p className="text-sm text-muted-foreground mb-2">
          Thank you for your generosity and support!
        </p>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>Website: {organizationWebsite}</p>
          <p>Email: {organizationEmail}</p>
          <p>Phone: {organizationPhone}</p>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          &copy; {year} {organizationName}. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ReceiptFooter;
