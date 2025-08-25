import jsPDF from 'jspdf';

export const generateInvoicePDF = async (donation, userInfo, organizationSettings = {}) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 20;
  
  // Organization/Company Details (default values)
  const orgDetails = {
    name: organizationSettings.company_name || 'CharityFund Organization',
    address: organizationSettings.company_address || '123 Charity Street, Hope City, HC 12345',
    phone: organizationSettings.company_phone || '+1 (555) 123-4567',
    email: organizationSettings.company_email || 'info@charityfund.org',
    logo: organizationSettings.company_logo || null
  };

  let currentY = margin;

  // Header Section
  pdf.setFillColor(41, 128, 185); // Professional blue
  pdf.rect(0, 0, pageWidth, 40, 'F');
  
  // Company Logo and Name
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text(orgDetails.name, margin, 25);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('DONATION INVOICE', pageWidth - margin, 25, { align: 'right' });
  
  currentY = 50;

  // Invoice Title
  pdf.setTextColor(41, 128, 185);
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text('INVOICE', margin, currentY);
  
  currentY += 15;

  // Invoice Details Box
  pdf.setDrawColor(200, 200, 200);
  pdf.setFillColor(248, 249, 250);
  pdf.rect(margin, currentY, pageWidth - (2 * margin), 35, 'FD');
  
  // Invoice Info - Left Side
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Invoice Number:', margin + 5, currentY + 10);
  pdf.text('Invoice Date:', margin + 5, currentY + 20);
  pdf.text('Payment Status:', margin + 5, currentY + 30);
  
  pdf.setFont('helvetica', 'normal');
  pdf.text(donation.invoice.invoice_no || 'N/A', margin + 35, currentY + 10);
  pdf.text(new Date(donation.invoice.invoice_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }), margin + 35, currentY + 20);
  
  // Status with color
  const status = donation.status || 'Pending';
  const statusColor = status.toLowerCase() === 'completed' ? [34, 197, 94] : 
                     status.toLowerCase() === 'pending' ? [239, 68, 68] : [107, 114, 128];
  pdf.setTextColor(...statusColor);
  pdf.text(status.toUpperCase(), margin + 35, currentY + 30);
  
  // Organization Info - Right Side
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Organization Details:', pageWidth - 80, currentY + 10);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  
  const orgLines = [
    orgDetails.address,
    `Phone: ${orgDetails.phone}`,
    `Email: ${orgDetails.email}`
  ];
  
  orgLines.forEach((line, index) => {
    pdf.text(line, pageWidth - 80, currentY + 20 + (index * 5));
  });
  
  currentY += 50;

  // Donor Information
  pdf.setFillColor(41, 128, 185);
  pdf.setTextColor(255, 255, 255);
  pdf.rect(margin, currentY, pageWidth - (2 * margin), 8, 'F');
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DONOR INFORMATION', margin + 5, currentY + 6);
  
  currentY += 15;
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Name:', margin + 5, currentY);
  pdf.text('Email:', margin + 5, currentY + 10);
  pdf.text('Phone:', margin + 5, currentY + 20);
  pdf.text('Address:', margin + 5, currentY + 30);
  
  pdf.setFont('helvetica', 'normal');
  pdf.text(userInfo.name || 'N/A', margin + 25, currentY);
  pdf.text(userInfo.email || 'N/A', margin + 25, currentY + 10);
  pdf.text(userInfo.phone || 'N/A', margin + 25, currentY + 20);
  pdf.text(userInfo.address || 'N/A', margin + 25, currentY + 30);
  
  currentY += 50;

  // Donation Details Table Header
  pdf.setFillColor(41, 128, 185);
  pdf.setTextColor(255, 255, 255);
  pdf.rect(margin, currentY, pageWidth - (2 * margin), 12, 'F');
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DONATION DETAILS', margin + 5, currentY + 8);
  
  currentY += 20;

  // Table Headers
  pdf.setFillColor(248, 249, 250);
  pdf.setTextColor(0, 0, 0);
  pdf.rect(margin, currentY, pageWidth - (2 * margin), 10, 'FD');
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Event/Campaign', margin + 5, currentY + 7);
  pdf.text('Qty', margin + 80, currentY + 7);
  pdf.text('Unit Price', margin + 100, currentY + 7);
  pdf.text('Amount', pageWidth - margin - 20, currentY + 7, { align: 'right' });
  
  currentY += 15;

  // Table Rows
  let subtotal = 0;
  pdf.setFont('helvetica', 'normal');
  
  donation.donation_details.forEach((item, index) => {
    const rowHeight = 12;
    const itemTotal = Number(item.quantity || 0) * Number(item.per_unit_price || 0);
    subtotal += itemTotal;
    
    // Alternate row background
    if (index % 2 === 0) {
      pdf.setFillColor(255, 255, 255);
    } else {
      pdf.setFillColor(250, 250, 250);
    }
    pdf.rect(margin, currentY, pageWidth - (2 * margin), rowHeight, 'F');
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(9);
    
    // Event title (wrap text if too long)
    const eventTitle = item.event?.title || 'Donation Item';
    const maxWidth = 70;
    const titleLines = pdf.splitTextToSize(eventTitle, maxWidth);
    pdf.text(titleLines[0], margin + 5, currentY + 8);
    
    pdf.text(String(item.quantity || 1), margin + 80, currentY + 8);
    pdf.text(`$${Number(item.per_unit_price || 0).toFixed(2)}`, margin + 100, currentY + 8);
    pdf.text(`$${itemTotal.toFixed(2)}`, pageWidth - margin - 5, currentY + 8, { align: 'right' });
    
    // Add note if exists
    if (item.notes) {
      currentY += 8;
      pdf.setFontSize(8);
      pdf.setTextColor(107, 114, 128);
      pdf.text(`Note: ${item.notes}`, margin + 5, currentY + 8);
    }
    
    currentY += rowHeight + 2;
  });

  // Summary Section
  currentY += 10;
  const summaryStartY = currentY;
  
  // Subtotal
  pdf.setDrawColor(200, 200, 200);
  pdf.line(pageWidth - 80, currentY, pageWidth - margin, currentY);
  currentY += 8;
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Subtotal:', pageWidth - 60, currentY);
  pdf.text(`$${subtotal.toFixed(2)}`, pageWidth - margin - 5, currentY, { align: 'right' });
  currentY += 10;
  
  // Admin Contribution
  const adminContribution = Number(donation.admin_contribution_amount || 0);
  pdf.text('Admin Contribution:', pageWidth - 60, currentY);
  pdf.text(`$${adminContribution.toFixed(2)}`, pageWidth - margin - 5, currentY, { align: 'right' });
  currentY += 15;
  
  // Total
  pdf.setDrawColor(41, 128, 185);
  pdf.setLineWidth(1);
  pdf.line(pageWidth - 80, currentY - 5, pageWidth - margin, currentY - 5);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TOTAL AMOUNT:', pageWidth - 60, currentY);
  pdf.setTextColor(41, 128, 185);
  pdf.text(`$${Number(donation.total_price || 0).toFixed(2)}`, pageWidth - margin - 5, currentY, { align: 'right' });
  
  currentY += 25;

  // Thank You Message
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Thank you for your generous donation!', margin, currentY);
  
  currentY += 10;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  const thankYouMessage = 'Your contribution makes a significant difference in our mission to help those in need. This donation is tax-deductible to the extent allowed by law. Please keep this invoice for your records.';
  const messageLines = pdf.splitTextToSize(thankYouMessage, pageWidth - (2 * margin));
  pdf.text(messageLines, margin, currentY);

  // Footer
  const footerY = pageHeight - 30;
  pdf.setFillColor(248, 249, 250);
  pdf.rect(0, footerY, pageWidth, 30, 'F');
  
  pdf.setTextColor(107, 114, 128);
  pdf.setFontSize(8);
  pdf.text('This is an electronically generated invoice.', pageWidth / 2, footerY + 10, { align: 'center' });
  pdf.text(`Generated on ${new Date().toLocaleString()}`, pageWidth / 2, footerY + 18, { align: 'center' });
  
  // Generate filename
  const filename = `Invoice_${donation.invoice.invoice_no}_${new Date().toISOString().split('T')[0]}.pdf`;
  
  // Save the PDF
  pdf.save(filename);
};