'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'

const InvoicePage = () => {
  const { id } = useParams()
  const router = useRouter()
  const [invoice, setInvoice] = useState({
    donorName: '',
    donations: [],
    totalAmount: 0,
    date: new Date(),
    invoiceNumber: '',
    adminContribution: 0,
    currency: 'AUD',
    status: 'pending',
  })

  // Get invoice data from router state
  const invoiceData = router.state?.invoiceData

  // Fetch invoice data
  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchInvoice = async () => {
      try {
        console.log(invoiceData);
        // Mock data for demonstration
        const data = {
            donorName: 'John Doe',
            donations: invoiceData.donation_details,
            totalAmount: invoiceData.total_price,
            date: invoiceData.invoice_date || new Date(), // Add date property to invoiceData if not already present,
            invoiceNumber: invoiceData.invoice_no,
            adminContribution: invoiceData.admin_contribution || 0,
            currency: invoiceData.currency ? invoiceData.currency.code : 'AUD',
            status: invoiceData.status,
        }
        setInvoice(data)
      } catch (error) {
        console.error('Error fetching invoice:', error)
      }
    }
    fetchInvoice()
  }, [id])

  const handleDownloadPDF = () => {
    // Create a blob from the invoice content
    const invoiceContent = document.querySelector('.invoice-content')
    const style = `
      <style>
        body { font-family: Arial, sans-serif; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 8px; text-align: left; }
        th { border-bottom: 2px solid #ddd; }
        td { border-bottom: 1px solid #ddd; }
      </style>
    `
    const html = `
      <html>
        <head>${style}</head>
        <body>${invoiceContent.innerHTML}</body>
      </html>
    `
    const blob = new Blob([html], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `invoice-${invoice.invoiceNumber}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg invoice-content">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Donation Invoice</h1>
          <p className="text-sm text-gray-500 mt-1">{invoice.donorName}</p>
        </div>
        <div className="text-right">
          <h3 className="text-xl font-semibold text-gray-800">#{invoice.invoiceNumber}</h3>
          <p className="text-sm text-gray-500">
            {format(invoice.date, 'MMMM dd, yyyy')}
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="space-y-4">
          {invoice.donations.map((donation, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <div>
                <span className="text-gray-800 font-medium">{donation.event.title}</span>
                <p className="text-gray-500 text-xs">{format(new Date(donation.donated_at), 'MMM dd, yyyy')}</p>
              </div>
              <span className="font-medium">${donation.total_price.toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between items-center text-sm text-blue-600 pt-4 border-t border-gray-100">
            <span className="font-semibold">Admin Contribution</span>
            <span className="font-medium">{invoice.adminContribution}</span>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
          <span className="font-semibold text-gray-800">Total Amount</span>
          <span className="text-lg font-bold text-green-600">${invoice.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4">
        <p className="text-sm text-blue-800 font-medium mb-1">Thank you for your generous donation!</p>
        <p className="text-sm text-blue-600">This invoice serves as your official receipt for tax purposes.</p>
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <button 
          onClick={handleDownloadPDF}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Download PDF</span>
        </button>
        <button 
          onClick={() => window.print()}
          className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <span>Print</span>
        </button>
        <button 
          onClick={() => window.history.back()}
          className="text-gray-500 hover:text-gray-700"
        >
          Back
        </button>
      </div>
    </div>
  )
}

export default InvoicePage
