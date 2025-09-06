'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, MessageCircle, Upload, CheckCircle, FileText, User, Calendar, DollarSign } from 'lucide-react';
import { apiService } from '@/api/services/app/apiService';
import { ENDPOINTS } from '@/api/config';
import { toast, ToastContainer } from 'react-toastify';

export default function FundRequestDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [request, setRequest] = useState(null);
  const [adminMessages, setAdminMessages] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequestDetails();
    fetchAdminMessages();
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(ENDPOINTS.FUND_RAISING.REQUEST_DETAILS(id));
      if (response && response.status === 'success') {
        setRequest(response.data);
      }
    } catch (err) {
      console.error('Request Details Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminMessages = async () => {
    try {
      const response = await apiService.get(`${ENDPOINTS.FUND_RAISING.MESSAGES}/${id}`);
      if (response && response.status === 'success') {
        setAdminMessages(response.data);
      }
    } catch (err) {
      console.error('Admin Messages Fetch Error:', err);
      // Dummy admin messages
      setAdminMessages([
        {
          id: 1,
          message: "Thank you for your fundraising request. We have received your application and are currently reviewing the documentation. Please provide additional medical certificates to support your case.",
          created_at: "2024-01-20T14:30:00Z",
          admin_name: "Admin Team"
        },
        {
          id: 2,
          message: "We have reviewed your updated documents. Your request looks promising and we are moving forward with the verification process. Expected completion by end of this month.",
          created_at: "2024-02-05T09:15:00Z",
          admin_name: "Review Manager"
        }
      ]);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('comment', newComment);
      if (uploadedFile) {
        formData.append('document', uploadedFile);
      }

      const response = await apiService.postForm(`${ENDPOINTS.FUND_RAISING.COMMENTS}/${id}`, formData);
      if (response && response.status === 'success') {
        toast.success('Comment submitted successfully');
        setNewComment('');
        setUploadedFile(null);
        // fetchAdminMessages(); // Refresh messages
      }
    } catch (err) {
      console.error('Comment Submit Error:', err);
      toast.error('Failed to submit comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
      case 'Pending Review':
        return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'approved':
      case 'Approved':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'rejected':
      case 'Rejected':
        return 'bg-red-100 text-red-600 border-red-200';
      case 'under_review':
      case 'Under Review':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const formatStatus = (status) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading request details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="shadow-lg">
          <CardContent className="text-center py-12">
            <p className="text-gray-600 mb-4">Request not found</p>
            <Button onClick={() => router.push('/profile')} variant="outline">
              Back to Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progressPercentage = ((request.raised_amount || 0) / request.target_amount) * 100;

  return (
    <div className="container mx-auto py-8 px-4">
      <ToastContainer />
      
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.push('/profile?tab=fundraising')}
          className="mb-4 flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Profile</span>
        </Button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{request.title}</h1>
            <p className="text-gray-600">Request Number: {request.request_number}</p>
          </div>
          <div className={`px-4 py-2 rounded-full border font-medium ${getStatusColor(request.status)}`}>
            {formatStatus(request.status)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Overview */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Request Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Request Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {request.category && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Category</p>
                    <p className="font-medium text-gray-800">{request.category}</p>
                  </div>
                )}
                {request.fund_type && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Fund Type</p>
                    <p className="font-medium text-gray-800 capitalize">{request.fund_type}</p>
                  </div>
                )}
                {request.fundraising_for && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Fundraising For</p>
                    <p className="font-medium text-gray-800">{request.fundraising_for}</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{request.description}</p>
              </div>
              
              {/* Financial Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4 text-center">
                    <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-green-600">Target Amount</p>
                    <p className="text-lg font-bold text-green-700">
                      {request.currency} {parseInt(request.target_amount).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4 text-center">
                    <DollarSign className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-blue-600">Raised Amount</p>
                    <p className="text-lg font-bold text-blue-700">
                      {request.currency} {parseInt(request.raised_amount || 0).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4 text-center">
                    <DollarSign className="h-6 w-6 text-red-600 mx-auto mb-2" />
                    <p className="text-sm text-red-600">Shortage Amount</p>
                    <p className="text-lg font-bold text-red-700">
                      {request.currency} {parseInt(request.shortage_amount).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Progress Bar */}
              {/* <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Fundraising Progress</span>
                  <span className="text-sm font-medium text-gray-600">{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div> */}
            </CardContent>
          </Card>

          {/* Admin Messages */}
          {/* <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Admin Messages</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {adminMessages.length === 0 ? (
                <p className="text-gray-500 text-center py-6">No messages from admin yet.</p>
              ) : (
                <div className="space-y-4">
                  {adminMessages.map((message) => (
                    <div key={message.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-blue-800">{message.admin_name}</span>
                        <span className="text-sm text-blue-600">
                          {new Date(message.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-blue-700">{message.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card> */}

          {/* Comment Section */}
          {/* <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Submit Comment or Additional Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="comment">Your Comment</Label>
                  <Textarea
                    id="comment"
                    placeholder="Add a comment or provide additional information..."
                    rows={4}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="document">Upload Additional Document (Optional)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="text-center">
                      {uploadedFile ? (
                        <div className="flex items-center justify-center space-x-2 text-green-600">
                          <CheckCircle className="h-5 w-5" />
                          <span className="text-sm font-medium">{uploadedFile.name}</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            Upload additional supporting documents
                          </p>
                        </>
                      )}
                      <input
                        id="document"
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('document').click()}
                        className="mt-2"
                      >
                        {uploadedFile ? 'Change File' : 'Choose File'}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !newComment.trim()}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Comment'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card> */}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Contact Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{request.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{request.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{request.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{request.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Country</p>
                <p className="font-medium">{request.country}</p>
              </div>
            </CardContent>
          </Card>

          {/* Reference Information */}
          {request.reference_name && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Reference Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{request.reference_name}</p>
                </div>
                {request.reference_phone && (
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{request.reference_phone}</p>
                  </div>
                )}
                {request.reference_email && (
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{request.reference_email}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Submitted</p>
                <p className="font-medium">
                  {new Date(request.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium">
                  {new Date(request.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          {request.documents && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Submitted Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium">{request.documents}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/documents/${request.documents}`, '_blank')}
                  >
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}