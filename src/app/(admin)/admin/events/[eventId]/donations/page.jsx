// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAdminContext } from '@/components/admin/layout/admin-context';
// import { ArrowLeft, Loader2, FileDown } from 'lucide-react';
// import { format, parseISO, isSameDay } from 'date-fns';

// // Import custom components
// import DonationFilters from '@/components/admin/donations/DonationFilters';
// import DonationRow from '@/components/admin/donations/DonationRow';
// import DonationStats from '@/components/admin/donations/DonationStats';

// // Import shadcn components
// import { Button } from '@/components/ui/button';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from '@/components/ui/pagination';
// import { Separator } from '@/components/ui/separator';
// import { toast } from 'sonner';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';

// const EventDonationsPage = ({ params }) => {
//   const router = useRouter();
//   const { setPageTitle, setPageSubtitle } = useAdminContext();

//   // State for event and donations
//   const [event, setEvent] = useState(null);
//   const [donations, setDonations] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // Filter states
//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [dateFilter, setDateFilter] = useState(null);
//   const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
//   const [amountFilter, setAmountFilter] = useState('all');
//   const [sortBy, setSortBy] = useState('newest');

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);

//   // Set page title based on event
//   useEffect(() => {
//     if (event) {
//       setPageTitle(`Donations - ${event.title}`);
//       setPageSubtitle(`Manage and track donations for this event`);
//     } else {
//       setPageTitle('Event Donations');
//       setPageSubtitle('Loading donation data...');
//     }
//   }, [event, setPageTitle, setPageSubtitle]);

//   // Load event and donation data
//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);

//       try {
//         // Fetch event data
//         const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
//         const foundEvent = storedEvents.find((e) => e.id === params.eventId);

//         if (!foundEvent) {
//           toast.error('Event not found');
//           router.push('/admin/events');
//           return;
//         }

//         setEvent(foundEvent);

//         // Generate sample donations for testing if none exist
//         const storedDonations = localStorage.getItem(`donations_${params.eventId}`);
//         let donationData = [];

//         if (storedDonations) {
//           donationData = JSON.parse(storedDonations);
//         } else {
//           // Create sample donations
//           donationData = generateSampleDonations(params.eventId, foundEvent);
//           localStorage.setItem(`donations_${params.eventId}`, JSON.stringify(donationData));
//         }

//         setDonations(donationData);

//         /* API Implementation (Commented out for future use)
//         // Fetch event data
//         const eventResponse = await fetch(`/api/events/${params.eventId}`);
//         if (!eventResponse.ok) {
//           throw new Error('Failed to fetch event data');
//         }
//         const eventData = await eventResponse.json();
//         setEvent(eventData);
        
//         // Fetch donation data
//         const donationsResponse = await fetch(`/api/events/${params.eventId}/donations`);
//         if (!donationsResponse.ok) {
//           throw new Error('Failed to fetch donations');
//         }
//         const donationsData = await donationsResponse.json();
//         setDonations(donationsData);
//         */
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         toast.error('Failed to load event and donation data');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (params.eventId) {
//       fetchData();
//     }
//   }, [params.eventId, router]);

//   // Helper function to generate sample donations for testing
//   function generateSampleDonations(eventId, event) {
//     const sampleDonations = [];
//     const statuses = ['completed', 'pending', 'failed', 'refunded'];
//     const paymentMethods = ['Credit Card', 'PayPal', 'Bank Transfer', 'Cash', 'Check'];
//     const firstNames = [
//       'John',
//       'Jane',
//       'Michael',
//       'Emma',
//       'David',
//       'Sarah',
//       'Robert',
//       'Emily',
//       'William',
//       'Olivia',
//     ];
//     const lastNames = [
//       'Smith',
//       'Johnson',
//       'Williams',
//       'Brown',
//       'Jones',
//       'Garcia',
//       'Miller',
//       'Davis',
//       'Rodriguez',
//       'Martinez',
//     ];
//     const now = new Date();
//     const eventStartDate = event.start_date
//       ? new Date(event.start_date)
//       : new Date(now - 7 * 24 * 60 * 60 * 1000);

//     // Generate between 25-50 sample donations
//     const donationCount = Math.floor(Math.random() * 25) + 25;

//     for (let i = 1; i <= donationCount; i++) {
//       const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
//       const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
//       const donorName = `${firstName} ${lastName}`;
//       const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;

//       // Random donation date between event start and now
//       const donationDate = new Date(
//         eventStartDate.getTime() + Math.random() * (now.getTime() - eventStartDate.getTime())
//       );

//       // Random donation amount between $5 and $1000
//       const amount = Math.round(Math.random() * 995) + 5;

//       // Randomly select status with weighted probability
//       // 70% completed, 15% pending, 10% failed, 5% refunded
//       let status;
//       const rand = Math.random();
//       if (rand < 0.7) {
//         status = 'completed';
//       } else if (rand < 0.85) {
//         status = 'pending';
//       } else if (rand < 0.95) {
//         status = 'failed';
//       } else {
//         status = 'refunded';
//       }

//       // Random payment method
//       const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

//       // Generate a transaction ID for completed donations
//       const transactionId =
//         status === 'completed' ? `TXN-${Math.floor(Math.random() * 1000000)}` : null;

//       // 30% chance of having additional notes
//       const hasNotes = Math.random() < 0.3;
//       const notes = hasNotes ? `Note from donor: Thank you for organizing this event!` : null;

//       // 20% chance of having address info
//       const hasAddress = Math.random() < 0.2;
//       const address = hasAddress
//         ? {
//             street: `${Math.floor(Math.random() * 9999) + 1} Main St`,
//             city: 'Springfield',
//             state: 'IL',
//             zip: `${Math.floor(Math.random() * 90000) + 10000}`,
//             country: 'USA',
//           }
//         : null;

//       // 10% chance of being anonymous
//       const anonymous = Math.random() < 0.1;

//       // 15% chance of being a tribute donation
//       const hasTribute = Math.random() < 0.15;
//       const tributeTypes = ['memory', 'honor'];
//       const tributeInfo = hasTribute
//         ? {
//             type: tributeTypes[Math.floor(Math.random() * tributeTypes.length)],
//             name: `${
//               firstNames[Math.floor(Math.random() * firstNames.length)]
//             } ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
//             message: Math.random() < 0.5 ? 'Thinking of you always.' : null,
//           }
//         : null;

//       // 20% chance of recurring donation
//       const isRecurring = Math.random() < 0.2;

//       // Generate the donation object
//       const donation = {
//         id: `DON-${eventId}-${i}`,
//         event_id: eventId,
//         donor_name: anonymous ? 'Anonymous Donor' : donorName,
//         email: email,
//         phone:
//           Math.random() < 0.5
//             ? `(${Math.floor(Math.random() * 900) + 100}) ${
//                 Math.floor(Math.random() * 900) + 100
//               }-${Math.floor(Math.random() * 9000) + 1000}`
//             : null,
//         amount: amount,
//         date: donationDate.toISOString(),
//         status: status,
//         payment_method: paymentMethod,
//         transaction_id: transactionId,
//         donor_id: `D-${Math.floor(Math.random() * 10000)}`,
//         notes: notes,
//         address: address,
//         anonymous: anonymous,
//         tribute_info: tributeInfo,
//         is_recurring: isRecurring,
//         campaign: Math.random() < 0.3 ? 'Summer Fundraiser' : null,
//       };

//       sampleDonations.push(donation);
//     }

//     return sampleDonations;
//   }

//   // Filter and sort donations
//   const filterAndSortDonations = () => {
//     let filteredDonations = [...donations];

//     // Apply search filter
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       filteredDonations = filteredDonations.filter(
//         (donation) =>
//           donation.donor_name.toLowerCase().includes(query) ||
//           donation.email.toLowerCase().includes(query) ||
//           (donation.transaction_id && donation.transaction_id.toLowerCase().includes(query))
//       );
//     }

//     // Apply status filter
//     if (statusFilter !== 'all') {
//       filteredDonations = filteredDonations.filter((donation) => donation.status === statusFilter);
//     }

//     // Apply date filter
//     if (dateFilter) {
//       filteredDonations = filteredDonations.filter((donation) => {
//         const donationDate = parseISO(donation.date);
//         return isSameDay(donationDate, dateFilter);
//       });
//     }

//     // Apply payment method filter
//     if (paymentMethodFilter !== 'all') {
//       filteredDonations = filteredDonations.filter(
//         (donation) => donation.payment_method === paymentMethodFilter
//       );
//     }

//     // Apply amount filter
//     if (amountFilter !== 'all') {
//       switch (amountFilter) {
//         case 'under-50':
//           filteredDonations = filteredDonations.filter((donation) => donation.amount < 50);
//           break;
//         case '50-100':
//           filteredDonations = filteredDonations.filter(
//             (donation) => donation.amount >= 50 && donation.amount <= 100
//           );
//           break;
//         case '100-500':
//           filteredDonations = filteredDonations.filter(
//             (donation) => donation.amount > 100 && donation.amount <= 500
//           );
//           break;
//         case '500-1000':
//           filteredDonations = filteredDonations.filter(
//             (donation) => donation.amount > 500 && donation.amount <= 1000
//           );
//           break;
//         case 'over-1000':
//           filteredDonations = filteredDonations.filter((donation) => donation.amount > 1000);
//           break;
//       }
//     }

//     // Apply sorting
//     switch (sortBy) {
//       case 'newest':
//         filteredDonations.sort((a, b) => new Date(b.date) - new Date(a.date));
//         break;
//       case 'oldest':
//         filteredDonations.sort((a, b) => new Date(a.date) - new Date(b.date));
//         break;
//       case 'amount-high':
//         filteredDonations.sort((a, b) => b.amount - a.amount);
//         break;
//       case 'amount-low':
//         filteredDonations.sort((a, b) => a.amount - b.amount);
//         break;
//       case 'name-a-z':
//         filteredDonations.sort((a, b) => a.donor_name.localeCompare(b.donor_name));
//         break;
//       case 'name-z-a':
//         filteredDonations.sort((a, b) => b.donor_name.localeCompare(a.donor_name));
//         break;
//     }

//     return filteredDonations;
//   };

//   // Calculate stats for donation summary
//   const calculateStats = () => {
//     if (!donations.length) {
//       return {
//         totalDonations: 0,
//         totalAmount: 0,
//         donorCount: 0,
//         averageDonation: 0,
//       };
//     }

//     // Count only completed donations for most stats
//     const completedDonations = donations.filter((d) => d.status === 'completed');

//     // Total amount of completed donations
//     const totalAmount = completedDonations.reduce((sum, donation) => sum + donation.amount, 0);

//     // Get unique donors
//     const uniqueDonors = new Set();
//     completedDonations.forEach((donation) => {
//       if (donation.donor_id) {
//         uniqueDonors.add(donation.donor_id);
//       } else {
//         uniqueDonors.add(donation.email);
//       }
//     });

//     // Calculate average donation
//     const averageDonation = completedDonations.length ? totalAmount / completedDonations.length : 0;

//     return {
//       totalDonations: completedDonations.length,
//       totalAmount,
//       donorCount: uniqueDonors.size,
//       averageDonation,
//     };
//   };

//   // Get unique payment methods for filtering
//   const getUniquePaymentMethods = () => {
//     const methods = new Set();
//     donations.forEach((donation) => {
//       if (donation.payment_method) {
//         methods.add(donation.payment_method);
//       }
//     });
//     return Array.from(methods);
//   };

//   // Handle export donations
//   const handleExportDonations = () => {
//     toast.info('Exporting donations...');
//     // In production, this would generate a CSV/Excel file
//     // For now, we'll just show a toast message
//     setTimeout(() => {
//       toast.success('Donations exported successfully!');
//     }, 1500);
//   };

//   // Apply filters and calculate stats
//   const filteredDonations = filterAndSortDonations();
//   const stats = calculateStats();
//   const paymentMethods = getUniquePaymentMethods();

//   // Calculate status counts for filter buttons
//   const statusCounts = {
//     all: donations.length,
//     completed: donations.filter((d) => d.status === 'completed').length,
//     pending: donations.filter((d) => d.status === 'pending').length,
//     failed: donations.filter((d) => d.status === 'failed').length,
//     refunded: donations.filter((d) => d.status === 'refunded').length,
//   };

//   // Calculate pagination
//   const totalDonations = filteredDonations.length;
//   const totalPages = Math.ceil(totalDonations / itemsPerPage);
//   const paginatedDonations = filteredDonations.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   // Show loading state
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
//         <div className="flex flex-col items-center">
//           <Loader2 className="h-8 w-8 animate-spin text-gray-500 mb-2" />
//           <p className="text-muted-foreground">Loading donation data...</p>
//         </div>
//       </div>
//     );
//   }

//   // Render empty state if no donations
//   const renderEmptyState = () => (
//     <div className="flex flex-col items-center justify-center py-12">
//       <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-4">
//         <FileDown className="h-12 w-12 text-gray-400" />
//       </div>
//       <h3 className="text-xl font-semibold mb-2">No donations found</h3>
//       <p className="text-muted-foreground text-center max-w-md mb-6">
//         {donations.length === 0
//           ? "This event doesn't have any donations yet."
//           : 'No donations match your current filters. Try adjusting your search or filter criteria.'}
//       </p>
//       {donations.length > 0 && (
//         <Button
//           variant="outline"
//           onClick={() => {
//             setSearchQuery('');
//             setStatusFilter('all');
//             setDateFilter(null);
//             setPaymentMethodFilter('all');
//             setAmountFilter('all');
//           }}
//         >
//           Clear All Filters
//         </Button>
//       )}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       <div className="container px-4 py-6 mx-auto max-w-7xl">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => router.push('/admin/events')}
//             className="mb-2 sm:mb-0"
//           >
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to Events
//           </Button>

//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
//             <p className="text-sm text-muted-foreground mt-1">Donations and contributions</p>
//           </div>
//         </div>

//         {/* Donation Statistics */}
//         <DonationStats
//           totalDonations={stats.totalDonations}
//           totalAmount={stats.totalAmount}
//           donorCount={stats.donorCount}
//           averageDonation={stats.averageDonation}
//           eventStartDate={event.start_date}
//           eventEndDate={event.end_date}
//         />

//         <Card>
//           <CardHeader className="p-4 pb-0">
//             <DonationFilters
//               searchQuery={searchQuery}
//               setSearchQuery={setSearchQuery}
//               statusFilter={statusFilter}
//               setStatusFilter={setStatusFilter}
//               dateFilter={dateFilter}
//               setDateFilter={setDateFilter}
//               paymentMethodFilter={paymentMethodFilter}
//               setPaymentMethodFilter={setPaymentMethodFilter}
//               amountFilter={amountFilter}
//               setAmountFilter={setAmountFilter}
//               sortBy={sortBy}
//               setSortBy={setSortBy}
//               statusCounts={statusCounts}
//               paymentMethods={paymentMethods}
//               exportDonations={handleExportDonations}
//             />
//           </CardHeader>

//           <CardContent className="p-4">
//             {totalDonations === 0 ? (
//               renderEmptyState()
//             ) : (
//               <div className="space-y-1">
//                 {paginatedDonations.map((donation) => (
//                   <DonationRow key={donation.id} donation={donation} eventName={event.title} />
//                 ))}
//               </div>
//             )}
//           </CardContent>

//           {totalDonations > 0 && (
//             <CardFooter className="flex flex-col sm:flex-row justify-between items-center p-4 gap-4">
//               <div className="text-sm text-muted-foreground">
//                 Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
//                 {Math.min(currentPage * itemsPerPage, totalDonations)} of {totalDonations} donations
//               </div>

//               <Pagination>
//                 <PaginationContent>
//                   <PaginationItem>
//                     <PaginationPrevious
//                       onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
//                       disabled={currentPage === 1}
//                     />
//                   </PaginationItem>

//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     // Show 5 pages around current page
//                     const startPage = Math.max(1, currentPage - 2);
//                     const endPage = Math.min(totalPages, startPage + 4);
//                     const adjustedStartPage = Math.max(1, endPage - 4);
//                     const pageNumber = adjustedStartPage + i;

//                     if (pageNumber <= totalPages) {
//                       return (
//                         <PaginationItem key={pageNumber}>
//                           <PaginationLink
//                             onClick={() => setCurrentPage(pageNumber)}
//                             isActive={pageNumber === currentPage}
//                           >
//                             {pageNumber}
//                           </PaginationLink>
//                         </PaginationItem>
//                       );
//                     }
//                     return null;
//                   })}

//                   <PaginationItem>
//                     <PaginationNext
//                       onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
//                       disabled={currentPage === totalPages}
//                     />
//                   </PaginationItem>
//                 </PaginationContent>
//               </Pagination>

//               <div className="flex items-center gap-2">
//                 <span className="text-sm text-muted-foreground">Items per page:</span>
//                 <Select
//                   value={itemsPerPage.toString()}
//                   onValueChange={(value) => {
//                     setItemsPerPage(Number(value));
//                     setCurrentPage(1); // Reset to first page
//                   }}
//                 >
//                   <SelectTrigger className="w-16 h-8">
//                     <SelectValue placeholder={itemsPerPage} />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="5">5</SelectItem>
//                     <SelectItem value="10">10</SelectItem>
//                     <SelectItem value="25">25</SelectItem>
//                     <SelectItem value="50">50</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </CardFooter>
//           )}
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default EventDonationsPage;
