'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { apiService } from '@/api/services/app/apiService';
import { ENDPOINTS } from '@/api/config';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';

const Register = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [resendTimer, setResendTimer] = useState(90);
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    name: '',
    password: '',
    phone: '',
    address: '',
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let timer;
    if (step === 2) {
      timer = setInterval(() => {
        setResendTimer((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEmailVerification = async (e) => {
    e.preventDefault();
    setError(null);

    const loadingToast = toast.loading('Verifying email...');

    try {
      const response = await apiService.post(ENDPOINTS.AUTH.EMAIL_VERIFICATION, {
        email: formData.email,
      });

      toast.dismiss(loadingToast);

      if (response && response.status === 'success') {
        toast.success(response.message);
        setStep(2);
        setResendTimer(90); // Reset timer when moving to step 2
      } else {
        setError(response.errors);
        toast.error('Email verification failed. Please try again.');
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error('Email verification error:', err);
      toast.error(err.message || 'Email verification failed');
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.post(ENDPOINTS.AUTH.CODE_VERIFICATION, {
        email: formData.email,
        code: formData.otp,
      });

      if (response && response.status === 'success') {
        toast.success(response.message);
        setStep(3);
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      toast.error(err.message || 'OTP verification failed');
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await apiService.post(ENDPOINTS.AUTH.EMAIL_VERIFICATION, {
        email: formData.email,
      });
      if (response && response.status === 'success') {
        toast.success('OTP resent successfully');
        setResendTimer(90);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to resend OTP');
    }
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    if (!formData.acceptTerms) {
      toast.error('Please accept the Terms and Conditions');
      return;
    }

    try {
      const response = await apiService.post(ENDPOINTS.AUTH.REGISTER, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        phone: formData.phone,
        address: formData.address,
      });

      if (response && response.status === 'success') {
        toast.success('Registration successful! Please login to continue.');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(response.errors);
        toast.error('Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      toast.error(err.message || 'Registration failed');
    }
  };

  return (
    <div className="w-full">
      <ToastContainer />
      <div className="flex py-20 flex-col items-center justify-center px-4">
        <div className="grid md:grid-cols-2 items-center gap-4 max-w-6xl w-full">
          <div className="lg:h-[400px] md:h-[300px] max-md:mt-8">
            <Image
              width={500}
              height={500}
              src="/assets/img/register.svg"
              className="w-full h-full max-md:w-4/5 mx-auto block object-contain"
              alt="Login"
            />
          </div>
          <div className="rounded-lg p-10 w-full shadow-xl bg-light max-md:mx-auto">
            {step === 1 && (
              <form onSubmit={handleEmailVerification} className="w-full py-6 px-6 sm:px-6">
                <div className="mb-6">
                  <h3 className="text-gray-800 text-2xl font-bold">Create an account</h3>
                  <p className="text-gray-600 text-sm mt-2">Step 1 of 3: Email Verification</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-gray-800 text-sm mb-2 block">Email</label>
                    <input
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`text-gray-800 bg-white border ${error?.email ? 'border-red-500' : 'border-gray-300'} w-full text-sm px-4 py-2.5 rounded-md outline-blue-500`}
                      placeholder="Enter email"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 py-3 px-4 text-white bg-primary hover:bg-primary/90 rounded-md transition duration-200"
                >
                  Send Verification Code
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleOTPVerification} className="w-full py-6 px-6 sm:px-6">
                <div className="mb-6">
                  <h3 className="text-gray-800 text-2xl font-bold">Verify Email</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-gray-800 text-sm mb-2 block">Enter OTP</label>
                    <div className="flex gap-2 mb-2">
                      {[...Array(4)].map((_, index) => (
                        <input
                          key={index}
                          name="otp"
                          type="text"
                          maxLength="1"
                          required
                          value={formData.otp[index] || ''}
                          onChange={(e) => {
                            const newOtp = formData.otp.split('');
                            newOtp[index] = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              otp: newOtp.join(''),
                            }));

                            if (e.target.value && index < 5) {
                              e.target.nextElementSibling?.focus();
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
                              e.target.previousElementSibling?.focus();
                            }
                          }}
                          className="w-12 h-12 text-center text-xl font-semibold text-gray-800 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        />
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-gray-500 text-sm">
                        Please enter the 6-digit code sent to your email
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {resendTimer > 0 &&
                            `${Math.floor(resendTimer / 60)}:${(resendTimer % 60).toString().padStart(2, '0')}`}
                        </span>
                        <button
                          type="button"
                          onClick={handleResendOTP}
                          disabled={resendTimer > 0}
                          className={`text-sm ${
                            resendTimer > 0
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-blue-600 hover:underline'
                          }`}
                        >
                          Resend OTP
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 py-3 px-4 text-white bg-primary hover:bg-primary/90 rounded-md transition duration-200"
                >
                  Verify Code
                </button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleRegistration} className="w-full py-6 px-6 sm:px-6">
                <div className="mb-6">
                  <h3 className="text-gray-800 text-2xl font-bold">Complete Registration</h3>
                  <p className="text-gray-600 text-sm mt-2">Step 3 of 3: Personal Information</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-gray-800 text-sm mb-2 block">Name</label>
                    <input
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-blue-500"
                      placeholder="Enter name"
                    />
                  </div>

                  <div>
                    <label className="text-gray-800 text-sm mb-2 block">Password</label>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-blue-500"
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-800 text-sm mb-2 block">Confirm Password</label>
                    <div className="relative">
                      <input
                        name="confirm_password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-blue-500"
                        placeholder="Confirm password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-800 text-sm mb-2 block">Phone</label>
                    <input
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-blue-500"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="text-gray-800 text-sm mb-2 block">Address</label>
                    <textarea
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-blue-500"
                      placeholder="Enter address"
                      rows="3"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      id="acceptTerms"
                      name="acceptTerms"
                      type="checkbox"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-800">
                      I accept the{' '}
                      <Link href="" className="text-blue-600 hover:underline">
                        Terms and Conditions
                      </Link>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 py-3 px-4 text-white bg-primary hover:bg-primary/90 rounded-md transition duration-200"
                >
                  Complete Registration
                </button>
              </form>
            )}

            <p className="text-gray-800 text-sm mt-6 text-center">
              Already have an account?{' '}
              <Link href="./login" className="text-blue-600 hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
