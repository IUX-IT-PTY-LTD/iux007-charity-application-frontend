'use client';
import React from 'react';
import { commonService } from '@/api/services/app/commonService';
import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Loader from '@/components/shared/loader';
import { Recaptcha } from '@/components/ui/recaptcha';
import { useRecaptcha } from '@/hooks/useRecaptcha';

const ContactUs = () => {
  const [contactData, setContactData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    recaptchaRef,
    token,
    isVerified,
    error: recaptchaError,
    handleVerify,
    handleExpire,
    handleError,
    reset,
    validateRecaptcha,
    setError: setRecaptchaError
  } = useRecaptcha();
  const fetchContactData = async () => {
    const response = await commonService.getContactData();
    if (response.status === 'success') {
      setContactData(response.data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate reCAPTCHA first
    if (!validateRecaptcha()) {
      toast.error(recaptchaError || 'Please complete the reCAPTCHA verification.');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);

      const contactData = {
        name: data.firstName + ' ' + data.lastName,
        email: data.email,
        phone: data.phone,
        message: data.message,
        recaptcha_token: token, // Include reCAPTCHA token
      };

      const response = await commonService.storeCustomerEnquiry(contactData);

      if (response.status === 'success') {
        toast.success('Enquiry submitted successfully!');
        e.target.reset();
        reset(); // Reset reCAPTCHA
      } else {
        toast.error('Failed to submit enquiry. Please try again later.');
        reset(); // Reset reCAPTCHA on error
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An unexpected error occurred');
      reset(); // Reset reCAPTCHA on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContactData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16">
      <ToastContainer />
      {isLoading && <Loader title="Sending Enquiry" />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Get in Touch</h1>
          <p className="mt-4 text-xl text-gray-600">
            We'd love to hear from you. Please fill out this form or reach us using the contact
            details below.
          </p>
        </div>

        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="grid lg:grid-cols-3 gap-0">
            <div className="order-2 lg:order-1 bg-primary p-8 lg:p-12">
              <div className="grid gap-8">
                {contactData.map((contact, index) => {
                  const icons = [
                    // Location icon
                    <svg
                      key="location"
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>,
                    // Phone icon
                    <svg
                      key="phone"
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>,
                    // Email icon
                    <svg
                      key="email"
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>,
                    <svg
                      key="fax"
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M3 3a2 2 0 00-2 2v.5H1v-1a3 3 0 013-3h12a3 3 0 013 3v1h-.5V5a2 2 0 00-2-2H3z" />
                      <path d="M3 6a1 1 0 00-1 1v7a1 1 0 001 1h14a1 1 0 001-1V7a1 1 0 00-1-1H3zm14 2a1 1 0 11-2 0 1 1 0 012 0zM4 9.5a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm0 2a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5z" />
                    </svg>,
                  ];

                  return (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="flex-shrink-0 bg-white/10 p-4 rounded-full">
                        {icons[index]}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white">{contact.name}</h3>
                        <p className="mt-1 text-white/80">{contact.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-2 p-8 lg:p-12">
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                  <div className="relative">
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      placeholder="John"
                      className="w-full px-4 py-3 rounded-lg border-2 border-blue focus:border-primary focus:ring focus:ring-primary/20 transition duration-200 text-gray-700 text-base outline-none"
                    />
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      placeholder="Doe"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring focus:ring-primary/20 transition duration-200 text-gray-700 text-base outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2 relative">
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="john.doe@example.com"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring focus:ring-primary/20 transition duration-200 text-gray-700 text-base outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2 relative">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring focus:ring-primary/20 transition duration-200 text-gray-700 text-base outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2 relative">
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="6"
                      placeholder="Write your message here..."
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring focus:ring-primary/20 transition duration-200 text-gray-700 text-base outline-none resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* reCAPTCHA Section */}
                <div className="sm:col-span-2 flex flex-col items-center space-y-4">
                  <Recaptcha
                    ref={recaptchaRef}
                    onVerify={handleVerify}
                    onExpire={handleExpire}
                    onError={handleError}
                    theme="light"
                    size="normal"
                  />
                  {recaptchaError && (
                    <p className="text-sm text-red-600 font-medium">{recaptchaError}</p>
                  )}
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    disabled={!isVerified || isLoading}
                    className="px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
