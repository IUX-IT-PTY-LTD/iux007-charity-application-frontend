'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Import receipt components
import ReceiptHeader from '@/components/admin/donations/receipt/ReceiptHeader';
import ReceiptContent from '@/components/admin/donations/receipt/ReceiptContent';
import ReceiptFooter from '@/components/admin/donations/receipt/ReceiptFooter';
import ReceiptActions from '@/components/admin/donations/receipt/ReceiptActions';

// Import shadcn components
import { Card, CardContent } from '@/components/ui/card';

const ReceiptPage = ({ params }) => {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();
  const receiptRef = useRef(null);

  // State for donation and event data
  const [donation, setDonation] = useState(null);
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Organization information (in production, this would come from a config or API)
  const organizationInfo = {
    name: 'Hope Charity Foundation',
    website: 'www.hopecharityfoundation.org',
    email: 'donations@hopecharityfoundation.org',
    phone: '+1 (555) 123-4567',
    address: {
      line1: '123 Charity Lane',
      line2: 'Suite 101',
      city: 'Springfield',
      state: 'IL',
      zip: '62701',
      country: 'United States',
      taxId: 'EIN: 12-3456789',
    },
  };

  // Set page title
  useEffect(() => {
    if (donation && event) {
      setPageTitle(`Donation Receipt - ${donation.donor_name}`);
      setPageSubtitle(`Receipt for donation to ${event.title}`);
    } else {
      setPageTitle('Donation Receipt');
      setPageSubtitle('Loading receipt...');
    }
  }, [donation, event, setPageTitle, setPageSubtitle]);

  // Load donation and event data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        if (!params.eventId || !params.donationId) {
          toast.error('Missing event or donation ID');
          router.push('/admin/events');
          return;
        }

        // Fetch event data from localStorage
        const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
        const foundEvent = storedEvents.find((e) => e.id === params.eventId);

        if (!foundEvent) {
          toast.error('Event not found');
          router.push('/admin/events');
          return;
        }

        setEvent(foundEvent);

        // Fetch donation data from localStorage
        const storedDonations = localStorage.getItem(`donations_${params.eventId}`);

        if (!storedDonations) {
          toast.error('No donations found for this event');
          router.push(`/admin/events/${params.eventId}/donations`);
          return;
        }

        const donationData = JSON.parse(storedDonations);
        const foundDonation = donationData.find((d) => d.id === params.donationId);

        if (!foundDonation) {
          toast.error('Donation not found');
          router.push(`/admin/events/${params.eventId}/donations`);
          return;
        }

        setDonation(foundDonation);

        /* API Implementation (Commented out for future use)
        // Fetch event data
        const eventResponse = await fetch(`/api/events/${params.eventId}`);
        if (!eventResponse.ok) {
          throw new Error('Failed to fetch event data');
        }
        const eventData = await eventResponse.json();
        setEvent(eventData);
        
        // Fetch donation data
        const donationResponse = await fetch(`/api/events/${params.eventId}/donations/${params.donationId}`);
        if (!donationResponse.ok) {
          throw new Error('Failed to fetch donation data');
        }
        const donationData = await donationResponse.json();
        setDonation(donationData);
        */
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load receipt data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.eventId, params.donationId, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500 mb-2" />
          <p className="text-muted-foreground">Loading receipt data...</p>
        </div>
      </div>
    );
  }

  // Show error state if data is missing
  if (!donation || !event) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Receipt Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The donation receipt you're looking for could not be found.
          </p>
          <button
            onClick={() => router.push(`/admin/events/${params.eventId}/donations`)}
            className="text-primary hover:underline"
          >
            Return to donations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 py-6 mx-auto max-w-4xl">
        <ReceiptActions
          donationId={donation.id}
          eventId={event.id}
          donorEmail={donation.email}
          receiptRef={receiptRef}
          donorName={donation.donor_name}
          eventName={event.title}
        />

        <Card className="bg-white dark:bg-gray-800 shadow-sm border-gray-200 print:shadow-none print:border-none">
          <CardContent className="p-6 md:p-8" ref={receiptRef}>
            <ReceiptHeader
              donationId={donation.id}
              donationDate={donation.date}
              organizationName={organizationInfo.name}
              organizationAddress={organizationInfo.address}
              organizationContact={organizationInfo.phone}
            />

            <ReceiptContent
              donation={donation}
              eventName={event.title}
              isFixedDonation={false}
              taxDeductible={true}
            />

            <ReceiptFooter
              organizationName={organizationInfo.name}
              organizationWebsite={organizationInfo.website}
              organizationEmail={organizationInfo.email}
              organizationPhone={organizationInfo.phone}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReceiptPage;
