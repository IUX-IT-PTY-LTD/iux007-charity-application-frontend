// components/donations/receipt/ReceiptContent.jsx
'use client';

import React from 'react';
import { format, parseISO } from 'date-fns';
import { CheckCircle2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const ReceiptContent = ({
  donation,
  eventName,
  isFixedDonation,
  taxDeductible = true, // Most charity donations are tax deductible
}) => {
  // Format donation amount
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(donation.amount);

  // Format date more formally for receipt
  const formattedDate = donation.date ? format(parseISO(donation.date), 'MMMM d, yyyy') : 'N/A';

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Donation to</h3>
            <p className="font-semibold text-lg">{eventName}</p>
            <p className="text-sm">{isFixedDonation ? 'Fixed Donation' : 'Variable Donation'}</p>
          </div>
          <div className="text-right">
            <h3 className="text-sm font-medium text-muted-foreground">Amount</h3>
            <p className="font-bold text-2xl">{formattedAmount}</p>
            {donation.is_recurring && <p className="text-sm">Recurring donation</p>}
          </div>
        </div>

        {donation.status === 'completed' && (
          <div className="mt-4 bg-green-50 dark:bg-green-900/20 rounded p-3 flex items-center text-green-700 dark:text-green-400">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            <span>Payment completed on {formattedDate}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-base font-semibold mb-2">Donor Information</h3>
          <div className="space-y-2">
            <div>
              <p className="font-medium">{donation.donor_name}</p>
              <p className="text-sm">{donation.email}</p>
              {donation.phone && <p className="text-sm">{donation.phone}</p>}
            </div>

            {donation.address && (
              <div className="text-sm pt-2">
                <p>{donation.address.street}</p>
                <p>
                  {donation.address.city}, {donation.address.state} {donation.address.zip}
                </p>
                <p>{donation.address.country}</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold mb-2">Payment Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span className="font-medium">{donation.payment_method}</span>
            </div>
            <div className="flex justify-between">
              <span>Transaction ID:</span>
              <span className="font-medium">{donation.transaction_id || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span className="font-medium">{formattedDate}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-medium capitalize">{donation.status}</span>
            </div>
          </div>
        </div>
      </div>

      {donation.notes && (
        <div>
          <h3 className="text-base font-semibold mb-2">Additional Notes</h3>
          <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded">{donation.notes}</p>
        </div>
      )}

      {donation.tribute_info && (
        <div>
          <h3 className="text-base font-semibold mb-2">Tribute Information</h3>
          <p className="text-sm">
            This donation was made in {donation.tribute_info.type} of {donation.tribute_info.name}.
            {donation.tribute_info.message && (
              <span className="block mt-1 italic">"{donation.tribute_info.message}"</span>
            )}
          </p>
        </div>
      )}

      <Separator />

      {taxDeductible && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded text-sm">
          <p className="font-medium mb-1">Tax Information</p>
          <p>
            This donation {donation.status === 'completed' ? 'may be' : 'would be'} tax deductible
            to the extent allowed by law. Please keep this receipt for your tax records.
          </p>
          <p className="mt-2">
            No goods or services were provided in exchange for this contribution.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReceiptContent;
