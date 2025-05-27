'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/navigation'
import { useSelector, useDispatch } from'react-redux';
import  { apiService } from '@/api/services/app/apiService';
import { ENDPOINTS } from '@/api/config';
import { updateUser } from '@/store/features/userSlice'
import { toast, ToastContainer } from 'react-toastify';

export default function ProfilePage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState('profile')
  const [userInfo, setUserInfo] = useState(useSelector((state) => state.user.user))
  const [donations, setDonations] = useState([])

  const fetchDonations = async () => {
    try {
      const response = await apiService.get(ENDPOINTS.USER.DONATION_HISTORY);
      if (response && response.status === 'success') {
        setDonations(response.data);
      }
    } catch (err) {
      console.error('Donations Fetch Error:', err);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []); 
  const handleInfoUpdate = async (e) => {
    e.preventDefault()
    try {
      console.log(userInfo.image);
      const response = await apiService.put(ENDPOINTS.USER.UPDATE_PROFILE, {
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        address: userInfo.address,
        image: userInfo.image && userInfo.image.startsWith('data:image') ? userInfo.image : null
      });

      if (response && response.status === 'success') {
        dispatch(updateUser(response.data));
        toast.success('Profile updated successfully');

      } else {
        toast.error('Profile update failed');
      }
    } catch (err) {
      console.error('Profile Update Error:', err);
      toast.error(err.message || 'Update Profile failed');
    }

    // Handle profile update logic here
  }

  const handleDownloadInvoice = (invoiceId) => {
    // Handle invoice download logic here
    console.log(`Downloading invoice: ${invoiceId}`)
  }

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.qty * item.amount), 0)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-8">
      <ToastContainer />
        {/* Navigation Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div 
              className={`px-6 py-4 cursor-pointer transition-colors ${
                activeTab === 'profile' 
                  ? 'bg-blue-50 border-l-4 border-blue-500' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-medium text-gray-700">Profile</span>
              </div>
            </div>
            <div 
              className={`px-6 py-4 cursor-pointer transition-colors ${
                activeTab === 'donations' 
                  ? 'bg-blue-50 border-l-4 border-blue-500' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('donations')}
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-gray-700">Donations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <Card className="shadow-lg">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-xl text-gray-800">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleInfoUpdate} className="space-y-6">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
                        {userInfo.image ? (
                          <img 
                            src={userInfo.image} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <Input
                        type="file"
                        id="profilePicture"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            // Check if file size is less than 2MB
                            if (file.size > 2 * 1024 * 1024) {
                              toast.error('Image size should be less than 2MB');
                              e.target.value = '';
                              return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setUserInfo({...userInfo, image: reader.result});
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        className="absolute bottom-0 right-0 rounded-full bg-blue-600 p-2 hover:bg-blue-700"
                        onClick={() => document.getElementById('profilePicture').click()}
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                      <Input
                        id="name"
                        value={userInfo.name}
                        onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        readOnly
                        disabled
                        data-testid="email"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                      <Input
                        id="phone"
                        value={userInfo.phone}
                        onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium text-gray-700">Address</Label>
                      <Input
                        id="address"
                        value={userInfo.address}
                        onChange={(e) => setUserInfo({...userInfo, address: e.target.value})}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'donations' && (
            <Card className="shadow-lg">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-xl text-gray-800">Donation History</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {donations.length === 0 ? (
                  <div className="text-center py-12">
                    <svg 
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No donations yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Start making a difference by donating today.</p>
                    <button 
                      onClick={() => router.push('/events')}
                      className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors mt-4"
                    >
                      Donate Now
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {donations.map(donation => (
                      <div key={donation.uuid} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800">{donation.invoice.invoice_no}</h3>
                            <p className="text-sm text-gray-500">{new Date(donation.invoice.invoice_date).toLocaleDateString('en-US', { 
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}</p>
                          </div>
                          <button
                            onClick={() => handleDownloadInvoice(donation.invoice_no)}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span className="text-sm">Download Invoice</span>
                          </button>
                        </div>
                        
                        <div className="border-t border-gray-100 pt-4">
                          <div className="space-y-3">
                            {donation.donation_details.map((item, index) => (
                              <div key={index} className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">{item.event.title} (x{item.quantity})</span>
                                <span className="font-medium">${item.quantity * item.per_unit_price}</span>
                              </div>
                            ))}
                            <div className="flex justify-between items-center text-sm text-blue-600">
                              <span>Admin Contribution</span>
                              <span className="font-medium">+${donation.admin_contribution_amount}</span>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
                            <span className="font-semibold text-gray-800">Total Amount</span>
                            <span className="text-lg font-bold text-green-600">
                              ${donation.total_price}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            donation.status.toLowerCase() === 'pending' 
                              ? 'bg-red-100 text-red-800'
                              : donation.status.toLowerCase() === 'processing'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {donation.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
