'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft, ChevronRight, Upload, CheckCircle, Loader, ArrowLeft, AlertCircle } from 'lucide-react';
import { apiService } from '@/api/services/app/apiService';
import { ENDPOINTS } from '@/api/config';
import { toast, ToastContainer } from 'react-toastify';

const EditFundRequestPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [selectedPhoneCode, setSelectedPhoneCode] = useState('+61');
  const [selectedReferencePhoneCode, setSelectedReferencePhoneCode] = useState('+61');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [fundType, setFundType] = useState('');
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [request, setRequest] = useState(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
    setValue,
    watch
  } = useForm();

  const totalSteps = 4;
  const progressPercentage = (currentStep / totalSteps) * 100;

  useEffect(() => {
    fetchRequestDetails();
    fetchCountries();
    fetchCategories();
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(ENDPOINTS.FUND_RAISING.REQUEST_DETAILS(id));
      if (response && response.status === 'success') {
        const requestData = response.data;
        setRequest(requestData);
        
        // Pre-populate form with existing data
        const formData = {
          name: requestData.name || '',
          phone: requestData.phone || '',
          email: requestData.email || '',
          country: requestData.country || 'Australia',
          address: requestData.address || '',
          title: requestData.title || '',
          description: requestData.description || '',
          currency: requestData.currency || 'USD',
          target_amount: requestData.target_amount || '',
          shortage_amount: requestData.shortage_amount || '',
          reference_name: requestData.reference_name || '',
          reference_phone: requestData.reference_phone || '',
          reference_email: requestData.reference_email || '',
          category: requestData.fundraising_category_id || '',
          fund_type: requestData.fund_type || '',
          organization_name: requestData.fundraising_for || '',
          person_name: requestData.fundraising_for || ''
        };

        // Set form values
        Object.keys(formData).forEach(key => {
          setValue(key, formData[key]);
        });

        // Set other state variables
        setSelectedCategory(requestData.fundraising_category_id || '');
        setFundType(requestData.fund_type || '');
        setAcceptedTerms(true); // Since request was already submitted before
      }
    } catch (err) {
      console.error('Error fetching request details:', err);
      toast.error('Failed to load request details');
      router.push('/profile?tab=fundraising');
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      setLoadingCountries(true);
      const response = await apiService.get(ENDPOINTS.COMMON.COUNTRIES);
      if (response && response.data) {
        setCountries(response.data);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    } finally {
      setLoadingCountries(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await apiService.get(ENDPOINTS.COMMON.FUNDRAISING_CATEGORIES);
      if (response && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const validateCurrentStep = async () => {
    let fieldsToValidate = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['name', 'phone', 'email', 'country', 'address'];
        break;
      case 2:
        fieldsToValidate = ['title', 'description', 'category', 'fund_type'];
        if (fundType === 'organization' || fundType === 'community') {
          fieldsToValidate.push('organization_name');
        } else if (fundType === 'individual') {
          fieldsToValidate.push('person_name');
        }
        break;
      case 3:
        fieldsToValidate = ['currency', 'target_amount', 'shortage_amount'];
        break;
      case 4:
        fieldsToValidate = [];
        break;
      default:
        return true;
    }

    if (currentStep === 4 && !acceptedTerms) {
      alert('Please accept the terms and conditions before proceeding.');
      return false;
    }

    return await trigger(fieldsToValidate);
  };

  const nextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      console.log('Submitting request update for ID:', id);
      console.log('Request data:', data);
      
      // Prepare JSON payload
      const payload = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        country: data.country,
        address: data.address,
        title: data.title,
        description: data.description,
        fundraising_category_id: parseInt(data.category),
        fund_type: data.fund_type,
        currency: data.currency,
        target_amount: parseInt(data.target_amount),
        shortage_amount: parseInt(data.shortage_amount)
      };

      // Add fundraising_for based on fund_type
      if (data.fund_type === 'organization' || data.fund_type === 'community') {
        payload.fundraising_for = data.organization_name;
      } else if (data.fund_type === 'individual') {
        payload.fundraising_for = data.person_name;
      }
      
      // Add reference fields only if provided
      if (data.reference_name) payload.reference_name = data.reference_name;
      if (data.reference_phone) payload.reference_phone = data.reference_phone;
      if (data.reference_email) payload.reference_email = data.reference_email;
      
      // Handle file upload by converting to base64 if file is uploaded
      if (uploadedFile) {
        const fileBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(uploadedFile);
        });
        payload.document = fileBase64;
      }

      console.log('JSON payload:', payload);
      
      // Use PUT method for updating with correct endpoint
      const updateUrl = `${ENDPOINTS.FUND_RAISING.REQUEST}/${id}`;
      
      const response = await apiService.put(updateUrl, payload);
      
      if (response) {
        toast.success('Request updated successfully');
        router.push(`/fund-request/${id}`);
      }
    } catch (error) {
      console.error('Error updating request:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to update request. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepTitles = [
    'Personal Information',
    'Charity Details', 
    'Financial Requirements',
    'Reference Information & Terms'
  ];

  const currencies = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'AUD', label: 'AUD - Australian Dollar' },
    { value: 'CAD', label: 'CAD - Canadian Dollar' }
  ];

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
            <Button onClick={() => router.push('/profile?tab=fundraising')} variant="outline">
              Back to Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <ToastContainer />
      
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.push(`/fund-request/${id}`)}
          className="mb-4 flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Request Details</span>
        </Button>
        
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Fundraising Request</h1>
          <p className="text-gray-600">Request Number: {request.request_number}</p>
        </div>

        {/* Information Needed Alert */}
        {(request.status === 'information_needed' || request.status === 'Information Needed') && (
          <Card className="shadow-lg border-orange-200 bg-orange-50 mb-6">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-orange-800 mb-1">Information Required</h3>
                  <p className="text-orange-700 text-sm mb-3">
                    Please review and update your request based on the admin feedback. 
                    Make the necessary changes and resubmit for review.
                  </p>
                  {request.review_comments && (
                    <div className="bg-white border border-orange-200 rounded p-3">
                      <p className="text-xs text-orange-600 font-medium mb-1">Admin Comments:</p>
                      <p className="text-orange-700 text-sm whitespace-pre-wrap">{request.review_comments}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
              Update Your Fundraising Request
            </CardTitle>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Please update the required information and resubmit your fundraising request for review.
            </p>
          </CardHeader>

          <CardContent>
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-500">
                  Step {currentStep} of {totalSteps}
                </span>
                <span className="text-sm font-medium text-gray-500">
                  {Math.round(progressPercentage)}% Complete
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <div className="mt-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {stepTitles[currentStep - 1]}
                </h3>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        {...register('name', {
                          required: 'Name is required',
                          maxLength: {
                            value: 255,
                            message: 'Name must not exceed 255 characters'
                          }
                        })}
                        className={errors.name ? 'border-red-500' : ''}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex space-x-2">
                        <Select 
                          onValueChange={(value) => setSelectedPhoneCode(value)}
                          defaultValue={selectedPhoneCode}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {loadingCountries ? (
                              <SelectItem value="loading" disabled>
                                Loading...
                              </SelectItem>
                            ) : (
                              countries.map((country) => (
                                <SelectItem key={`phone-${country.id}-${country.code}`} value={country.phone_code}>
                                  <div className="flex items-center space-x-2">
                                    <span>{country.flag}</span>
                                    <span>{country.phone_code}</span>
                                  </div>
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <Input
                          id="phone"
                          placeholder="555 123-4567"
                          {...register('phone', {
                            required: 'Phone number is required',
                            pattern: {
                              value: /^[0-9\s\-\(\)]+$/,
                              message: 'Please enter a valid phone number'
                            }
                          })}
                          className={`flex-1 ${errors.phone ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-sm">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        {...register('email', {
                          required: 'Email is required',
                          maxLength: {
                            value: 255,
                            message: 'Email must not exceed 255 characters'
                          },
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Please enter a valid email address'
                          }
                        })}
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">
                        Country <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        onValueChange={(value) => setValue('country', value)}
                        defaultValue={watch('country')}
                        {...register('country', {
                          required: 'Country is required'
                        })}
                      >
                        <SelectTrigger className={errors.country ? 'border-red-500' : ''}>
                          <SelectValue placeholder={loadingCountries ? "Loading countries..." : "Select your country"} />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingCountries ? (
                            <SelectItem value="loading" disabled>
                              Loading countries...
                            </SelectItem>
                          ) : (
                            countries.map((country) => (
                              <SelectItem key={`country-${country.id}`} value={country.name}>
                                <div className="flex items-center space-x-2">
                                  <span>{country.flag}</span>
                                  <span>{country.name}</span>
                                </div>
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {errors.country && (
                        <p className="text-red-500 text-sm">{errors.country.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">
                      Address <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="address"
                      placeholder="Enter your complete address"
                      rows={3}
                      {...register('address', {
                        required: 'Address is required',
                        maxLength: {
                          value: 500,
                          message: 'Address must not exceed 500 characters'
                        }
                      })}
                      className={errors.address ? 'border-red-500' : ''}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm">{errors.address.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Charity Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      onValueChange={(value) => {
                        setSelectedCategory(value);
                        setValue('category', parseInt(value));
                      }}
                      defaultValue={selectedCategory.toString()}
                      {...register('category', {
                        required: 'Category is required'
                      })}
                    >
                      <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {loadingCategories ? (
                          <SelectItem value="loading" disabled>
                            Loading categories...
                          </SelectItem>
                        ) : (
                          categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-red-500 text-sm">{errors.category.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fund_type">
                      Fund Type <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      onValueChange={(value) => {
                        setFundType(value);
                        setValue('fund_type', value);
                      }}
                      defaultValue={fundType}
                      {...register('fund_type', {
                        required: 'Fund type is required'
                      })}
                    >
                      <SelectTrigger className={errors.fund_type ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select fund type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">
                          Individual
                        </SelectItem>
                        <SelectItem value="organization">
                          Organization
                        </SelectItem>
                        <SelectItem value="community">
                          Community
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.fund_type && (
                      <p className="text-red-500 text-sm">{errors.fund_type.message}</p>
                    )}
                  </div>

                  {(fundType === 'organization' || fundType === 'community') && (
                    <div className="space-y-2">
                      <Label htmlFor="organization_name">
                        {fundType === 'organization' ? 'Organization Name' : 'Community Name'} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="organization_name"
                        placeholder={fundType === 'organization' ? 'Enter organization name' : 'Enter community name'}
                        {...register('organization_name', {
                          required: (fundType === 'organization' || fundType === 'community') ? `${fundType === 'organization' ? 'Organization' : 'Community'} name is required` : false,
                          maxLength: {
                            value: 255,
                            message: `${fundType === 'organization' ? 'Organization' : 'Community'} name must not exceed 255 characters`
                          }
                        })}
                        className={errors.organization_name ? 'border-red-500' : ''}
                      />
                      {errors.organization_name && (
                        <p className="text-red-500 text-sm">{errors.organization_name.message}</p>
                      )}
                    </div>
                  )}

                  {fundType === 'individual' && (
                    <div className="space-y-2">
                      <Label htmlFor="person_name">
                        Person Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="person_name"
                        placeholder="Enter the person's name"
                        {...register('person_name', {
                          required: fundType === 'individual' ? 'Person name is required' : false,
                          maxLength: {
                            value: 255,
                            message: 'Person name must not exceed 255 characters'
                          }
                        })}
                        className={errors.person_name ? 'border-red-500' : ''}
                      />
                      {errors.person_name && (
                        <p className="text-red-500 text-sm">{errors.person_name.message}</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Purpose of Fundraising <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter a clear title for your fundraising cause"
                      {...register('title', {
                        required: 'Title is required',
                        maxLength: {
                          value: 255,
                          message: 'Title must not exceed 255 characters'
                        }
                      })}
                      className={errors.title ? 'border-red-500' : ''}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Detailed Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Please provide a detailed description of your charity needs, including the cause, beneficiaries, timeline, and how the funds will be used..."
                      rows={8}
                      {...register('description', {
                        required: 'Description is required',
                        maxLength: {
                          value: 1000,
                          message: 'Description must not exceed 1000 characters'
                        }
                      })}
                      className={errors.description ? 'border-red-500' : ''}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm">{errors.description.message}</p>
                    )}
                    <p className="text-gray-500 text-sm">
                      Maximum 1000 characters. Be as detailed as possible to help us understand your needs.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Financial Requirements */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="currency">
                      Currency <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      onValueChange={(value) => setValue('currency', value)} 
                      defaultValue={watch('currency')}
                      {...register('currency', {
                        required: 'Currency is required'
                      })}
                    >
                      <SelectTrigger className={errors.currency ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.value} value={currency.value}>
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.currency && (
                      <p className="text-red-500 text-sm">{errors.currency.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="target_amount">
                        Target Amount <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="target_amount"
                        type="number"
                        placeholder="10000"
                        {...register('target_amount', {
                          required: 'Target amount is required',
                          min: {
                            value: 1,
                            message: 'Amount must be greater than 0'
                          }
                        })}
                        className={errors.target_amount ? 'border-red-500' : ''}
                      />
                      {errors.target_amount && (
                        <p className="text-red-500 text-sm">{errors.target_amount.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shortage_amount">
                        Current Shortage Amount <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="shortage_amount"
                        type="number"
                        placeholder="7500"
                        {...register('shortage_amount', {
                          required: 'Shortage amount is required',
                          min: {
                            value: 1,
                            message: 'Amount must be greater than 0'
                          }
                        })}
                        className={errors.shortage_amount ? 'border-red-500' : ''}
                      />
                      {errors.shortage_amount && (
                        <p className="text-red-500 text-sm">{errors.shortage_amount.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="document">
                      Update Document (Optional)
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="text-center">
                        {uploadedFile ? (
                          <div className="flex items-center justify-center space-x-2 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            <span className="text-sm font-medium">{uploadedFile.name}</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 mb-2">
                              Upload new supporting documents (optional)
                            </p>
                          </>
                        )}
                        <input
                          id="document"
                          type="file"
                          accept=".png,.jpg,.jpeg,.docx,.zip,.pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('document').click()}
                        >
                          {uploadedFile ? 'Change File' : 'Choose File'}
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm">
                      Leave empty to keep existing document, or upload a new one to replace it.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Reference Information & Terms */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  {/* Reference Information Section */}
                  <div>
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-2">Reference Information (Optional)</h4>
                      <p className="text-gray-600 text-sm">
                        You may provide a reference who can vouch for your charity request. This is optional but helps us verify the authenticity of your application.
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="reference_name">
                          Reference Name
                        </Label>
                        <Input
                          id="reference_name"
                          placeholder="Enter reference person's full name (optional)"
                          {...register('reference_name', {
                            maxLength: {
                              value: 255,
                              message: 'Reference name must not exceed 255 characters'
                            }
                          })}
                          className={errors.reference_name ? 'border-red-500' : ''}
                        />
                        {errors.reference_name && (
                          <p className="text-red-500 text-sm">{errors.reference_name.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="reference_phone">
                            Reference Phone Number
                          </Label>
                          <div className="flex space-x-2">
                            <Select 
                              onValueChange={(value) => setSelectedReferencePhoneCode(value)}
                              defaultValue={selectedReferencePhoneCode}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {loadingCountries ? (
                                  <SelectItem value="loading" disabled>
                                    Loading...
                                  </SelectItem>
                                ) : (
                                  countries.map((country) => (
                                    <SelectItem key={`ref-phone-${country.id}-${country.code}`} value={country.phone_code}>
                                      <div className="flex items-center space-x-2">
                                        <span>{country.flag}</span>
                                        <span>{country.phone_code}</span>
                                      </div>
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                            <Input
                              id="reference_phone"
                              placeholder="555 123-4567 (optional)"
                              {...register('reference_phone', {
                                pattern: {
                                  value: /^[0-9\s\-\(\)]*$/,
                                  message: 'Please enter a valid phone number'
                                }
                              })}
                              className={`flex-1 ${errors.reference_phone ? 'border-red-500' : ''}`}
                            />
                          </div>
                          {errors.reference_phone && (
                            <p className="text-red-500 text-sm">{errors.reference_phone.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="reference_email">
                            Reference Email Address
                          </Label>
                          <Input
                            id="reference_email"
                            type="email"
                            placeholder="reference@example.com (optional)"
                            {...register('reference_email', {
                              maxLength: {
                                value: 255,
                                message: 'Reference email must not exceed 255 characters'
                              },
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Please enter a valid email address'
                              }
                            })}
                            className={errors.reference_email ? 'border-red-500' : ''}
                          />
                          {errors.reference_email && (
                            <p className="text-red-500 text-sm">{errors.reference_email.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-blue-800 mb-4">Terms and Conditions</h4>
                      <div className="text-sm text-blue-700 space-y-2 mb-4">
                        <p>By updating this charity fundraising request, you confirm that:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>All updated information provided is accurate and truthful</li>
                          <li>You have the legal right to represent the cause or organization</li>
                          <li>Funds raised will be used solely for the stated charitable purpose</li>
                          <li>You will provide regular updates on fund usage and progress</li>
                          <li>You understand that approval is subject to verification and review</li>
                          <li>You agree to comply with all applicable laws and regulations</li>
                        </ul>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms"
                          checked={acceptedTerms}
                          onCheckedChange={setAcceptedTerms}
                          className="border-blue-400"
                        />
                        <Label htmlFor="terms" className="text-sm font-medium text-blue-800 cursor-pointer">
                          I accept the terms and conditions <span className="text-red-500">*</span>
                        </Label>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex items-center space-x-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </Button>
                ) : (
                  <div></div>
                )}

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center space-x-2"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={async () => {
                      const isValid = await validateCurrentStep();
                      if (isValid) {
                        handleSubmit(onSubmit)();
                      }
                    }}
                    disabled={isSubmitting}
                    className="flex items-center space-x-2 bg-primary hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <span>Update Request</span>
                        <CheckCircle className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditFundRequestPage;