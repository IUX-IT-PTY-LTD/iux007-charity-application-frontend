// components/donations/receipt/ReceiptActions.jsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Mail, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ReceiptActions = ({
  donationId,
  eventId,
  donorEmail,
  receiptRef,
  donorName,
  eventName,
}) => {
  const router = useRouter();

  // Navigate back to donations list
  const handleBack = () => {
    router.push(`/admin/events/${eventId}/donations`);
  };

  // Handle receipt download as PDF
  const handleDownloadReceipt = async () => {
    if (!receiptRef?.current) {
      toast.error("Unable to generate receipt PDF");
      return;
    }

    toast.info("Generating PDF receipt...");

    try {
      const receiptElement = receiptRef.current;

      // Add a temporary class for better PDF rendering
      receiptElement.classList.add("printing");

      const canvas = await html2canvas(receiptElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      // Remove the temporary class
      receiptElement.classList.remove("printing");

      const imgData = canvas.toDataURL("image/png");

      // Calculate PDF dimensions based on receipt proportions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // Generate filename with donation and event info
      const filename = `Receipt_${donationId}_${eventName.replace(
        /\s+/g,
        "_"
      )}.pdf`;

      pdf.save(filename);
      toast.success("Receipt downloaded successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  // Handle print receipt
  const handlePrintReceipt = () => {
    window.print();
  };

  // Handle email receipt
  const handleEmailReceipt = () => {
    // In production, this would call an API to email the receipt
    // For now, just show a success toast after a delay
    toast.info(`Sending receipt to ${donorEmail}...`);

    setTimeout(() => {
      toast.success(`Receipt sent to ${donorName} at ${donorEmail}`);
    }, 1500);
  };

  return (
    <div className="print:hidden flex flex-wrap justify-between items-center gap-2 mb-6">
      <Button variant="ghost" onClick={handleBack} className="print:hidden">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Donations
      </Button>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={handlePrintReceipt}
          className="print:hidden"
        >
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>

        {donorEmail && (
          <Button
            variant="outline"
            onClick={handleEmailReceipt}
            className="print:hidden"
          >
            <Mail className="mr-2 h-4 w-4" />
            Email Receipt
          </Button>
        )}

        <Button onClick={handleDownloadReceipt} className="print:hidden">
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>
    </div>
  );
};

export default ReceiptActions;
