'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { apiService } from '@/api/services/app/apiService';
import { ENDPOINTS } from '@/api/config';
import { generateInvoicePDF } from '@/utils/invoiceGenerator';
import { toast, ToastContainer } from 'react-toastify';
import Loader from '@/components/shared/loader';
import Image from 'next/image';

const InvoicePage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [donation, setDonation] = useState(null);
  const [organizationSettings, setOrganizationSettings] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const userInfo = useSelector((state) => state.user.user);

  const fetchDonation = async () => {
    try {
      const response = await apiService.get(ENDPOINTS.USER.DONATION_HISTORY);
      if (response && response.status === 'success') {
        const foundDonation = response.data.find(d => d.uuid === id);
        if (foundDonation) {
          setDonation(foundDonation);
        } else {
          toast.error('Donation not found');
          router.push('/profile');
        }
      }
    } catch (err) {
      console.error('Donation Fetch Error:', err);
      toast.error('Failed to load donation details');
    }
  };

  const fetchOrganizationSettings = async () => {
    try {
      const response = await apiService.get(ENDPOINTS.COMMON.SETTINGS);
      if (response && response.status === 'success') {
        const settingsObj = {};
        response.data.forEach(setting => {
          settingsObj[setting.key] = setting.value;
        });
        setOrganizationSettings(settingsObj);
      }
    } catch (err) {
      console.error('Organization Settings Fetch Error:', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchDonation(), fetchOrganizationSettings()]);
      setIsLoading(false);
    };
    
    if (id) {
      loadData();
    }
  }, [id]);

  const handleDownloadPDF = async () => {
    if (!donation) return;
    
    try {
      setIsDownloading(true);
      await generateInvoicePDF(donation, userInfo, organizationSettings);
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return <Loader title="Loading Invoice..." />;
  }

  if (!donation) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Invoice Not Found</h1>
        <button
          onClick={() => router.push('/profile')}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Back to Profile
        </button>
      </div>
    );
  }

  // Organization Details
  const orgDetails = {
    name: organizationSettings.company_name || 'CharityFund Organization',
    address: organizationSettings.company_address || '123 Charity Street, Hope City, HC 12345',
    phone: organizationSettings.company_phone || '+1 (555) 123-4567',
    email: organizationSettings.company_email || 'info@charityfund.org',
    logo: organizationSettings.company_logo || '/assets/img/logo.svg'
  };

  const subtotal = donation.donation_details.reduce((sum, item) => 
    sum + (Number(item.quantity || 0) * Number(item.per_unit_price || 0)), 0
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ToastContainer />
      {isDownloading && <Loader title="Generating PDF..." />}
      
      <div className="container mx-auto px-4">
        {/* Action Buttons - Only visible on screen, hidden when printing */}
        <div className="mb-8 flex justify-between items-center print:hidden">
          <button
            onClick={() => router.push('/profile')}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Profile
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
            
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {isDownloading ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
        </div>

        {/* Invoice Container */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden max-w-4xl mx-auto" id="invoice-content">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <Image
                  src={orgDetails.logo}
                  alt="Organization Logo"
                  width={60}
                  height={60}
                  className="w-15 h-15 rounded-lg bg-white p-2"
                />
                <div>
                  <h1 className="text-3xl font-bold">{orgDetails.name}</h1>
                  <p className="text-blue-100 text-sm mt-1">DONATION INVOICE</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-4xl font-bold">INVOICE</h2>
                <p className="text-blue-100 mt-2">#{donation.invoice.invoice_no}</p>
              </div>
            </div>
          </div>

          {/* Invoice Details Section */}
          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {/* Invoice Info */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Invoice Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Invoice Number:</span>
                    <span className="font-medium">{donation.invoice.invoice_no}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Invoice Date:</span>
                    <span className="font-medium">
                      {new Date(donation.invoice.invoice_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      donation.status.toLowerCase() === 'completed' 
                        ? 'bg-green-100 text-green-700'
                        : donation.status.toLowerCase() === 'pending'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {donation.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Organization Info */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Organization Details</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700">{orgDetails.address}</p>
                  <p className="text-gray-700">Phone: {orgDetails.phone}</p>
                  <p className="text-gray-700">Email: {orgDetails.email}</p>
                </div>
              </div>

              {/* Donor Info */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Donor Information</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700"><span className="font-medium">Name:</span> {userInfo.name || 'N/A'}</p>
                  <p className="text-gray-700"><span className="font-medium">Email:</span> {userInfo.email || 'N/A'}</p>
                  <p className="text-gray-700"><span className="font-medium">Phone:</span> {userInfo.phone || 'N/A'}</p>
                  <p className="text-gray-700"><span className="font-medium">Address:</span> {userInfo.address || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Donation Details Table */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-blue-600">
                Donation Details
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="text-left p-4 font-semibold text-gray-700 border-b">Event/Campaign</th>
                      <th className="text-center p-4 font-semibold text-gray-700 border-b">Qty</th>
                      <th className="text-center p-4 font-semibold text-gray-700 border-b">Unit Price</th>
                      <th className="text-right p-4 font-semibold text-gray-700 border-b">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donation.donation_details.map((item, index) => {
                      const itemTotal = Number(item.quantity || 0) * Number(item.per_unit_price || 0);
                      return (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="p-4 border-b">
                            <div>
                              <div className="font-medium text-gray-900">{item.event?.title || 'Donation Item'}</div>
                              {item.notes && (
                                <div className="text-sm text-gray-500 mt-1">Note: {item.notes}</div>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-center border-b text-gray-700">{item.quantity || 1}</td>
                          <td className="p-4 text-center border-b text-gray-700">${Number(item.per_unit_price || 0).toFixed(2)}</td>
                          <td className="p-4 text-right border-b font-medium text-gray-900">${itemTotal.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Section */}
            <div className="border-t-2 border-gray-200 pt-6">
              <div className="flex justify-end">
                <div className="w-80">
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal (Donations):</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Admin Contribution:</span>
                      <span className="font-medium">${Number(donation.admin_contribution_amount || 0).toFixed(2)}</span>
                    </div>
                    <hr className="border-gray-300" />
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>TOTAL AMOUNT:</span>
                      <span className="text-blue-600">${Number(donation.total_price || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Thank You Message */}
            <div className="mt-8 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-600">
              <h4 className="text-lg font-semibold text-blue-800 mb-2">Thank you for your generous donation!</h4>
              <p className="text-blue-700 text-sm">
                Your contribution makes a significant difference in our mission to help those in need. 
                This donation is tax-deductible to the extent allowed by law. Please keep this invoice for your records.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 px-8 py-4 text-center text-sm text-gray-600 border-t">
            <p>This is an electronically generated invoice.</p>
            <p className="mt-1">Generated on {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
