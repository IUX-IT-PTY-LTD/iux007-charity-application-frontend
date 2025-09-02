'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiService } from '@/api/services/app/apiService';
import { ENDPOINTS } from '@/api/config';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/store/features/userSlice';
import Loader from '@/components/shared/loader';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.user);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [socialLoading, setSocialLoading] = useState({ google: false, apple: false });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    let errorMessage = '';

    try {
      const response = await apiService.post(ENDPOINTS.AUTH.LOGIN, {
        email: formData.email,
        password: formData.password,
      });

      if (response.data && response.status === 'success') {
        dispatch(setUser(response.data));
        toast.success('Login successful');
        
        // Check for redirect parameter and redirect there, otherwise go to home
        const redirectUrl = searchParams.get('redirect');
        router.replace(redirectUrl || '/');
      } else {
        errorMessage = response.data?.error?.description || 'User name or password wrong';
        toast.error(errorMessage);
        console.error('Login failed:', response);
      }
    } catch (error) {
      console.error('Login error:', error);

      // Check if it's an axios error response
      if (error.response) {
        const status = error.response.status;
        if (status === 403) {
          errorMessage =
            error.response.data?.message || 'Access forbidden. Please check your credentials.';
        } else {
          errorMessage = error.response.data?.message || 'Login failed. Please try again.';
        }
      } else {
        errorMessage = 'Network error occurred. Please try again.';
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setSocialLoading(prev => ({ ...prev, google: true }));
    try {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '142668446381-04pf87heqodbs2um3fi98aue4187r38r.apps.googleusercontent.com';
      const redirectUri = window.location.origin + '/auth/google/callback';
      
      // Get redirect parameter to pass it through the OAuth flow
      const redirectUrl = searchParams.get('redirect');
      const stateParam = redirectUrl ? btoa(JSON.stringify({ redirect: redirectUrl })) : '';
      
      // Use the correct Google OAuth endpoint
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=code&` +
        `scope=openid email profile&` +
        `access_type=offline&` +
        `prompt=select_account` +
        (stateParam ? `&state=${encodeURIComponent(stateParam)}` : '');
      
      console.log('Redirecting to:', googleAuthUrl);
      window.location.href = googleAuthUrl;
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Failed to initiate Google login');
      setSocialLoading(prev => ({ ...prev, google: false }));
    }
  };

  const handleAppleLogin = async () => {
    setSocialLoading(prev => ({ ...prev, apple: true }));
    try {
      // Redirect to Apple OAuth
      const appleAuthUrl = `https://appleid.apple.com/auth/authorize?` +
        `client_id=${process.env.NEXT_PUBLIC_APPLE_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(window.location.origin + '/auth/apple/callback')}&` +
        `response_type=code&` +
        `scope=name email&` +
        `response_mode=form_post`;
      
      window.location.href = appleAuthUrl;
    } catch (error) {
      console.error('Apple login error:', error);
      toast.error('Failed to initiate Apple login');
      setSocialLoading(prev => ({ ...prev, apple: false }));
    }
  };

  return (
    <div className="w-full">
      <ToastContainer />
      {loading && <Loader title="Authnticating..." />}
      <div className="flex items-center justify-center px-4 min-h-screen">
        <div className="w-full max-w-md">
          <div className="rounded-lg p-6 md:p-8 w-full shadow-xl bg-light">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="mb-4 md:mb-8">
                <h3 className="text-gray-800 text-2xl md:text-3xl font-extrabold">Sign in</h3>
                <p className="text-gray-500 text-sm mt-2 md:mt-4 leading-relaxed">
                  Welcome back! Please sign in to your account.
                </p>
              </div>

              <div>
                <label className="text-gray-800 text-sm mb-2 block">Email</label>
                <div className="relative flex items-center">
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
                    placeholder="Enter Email"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="w-[18px] h-[18px] absolute right-4"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                    <path
                      d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                      data-original="#000000"
                    ></path>
                  </svg>
                </div>
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-2 block">Password</label>
                <div className="relative flex items-center">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
                    placeholder="Enter password"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="w-4 h-4 absolute right-4 cursor-pointer"
                    viewBox="0 0 128 128"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <path
                      d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                      data-original="#000000"
                    ></path>
                  </svg>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 shrink-0 text-primary focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-800">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className="text-primary hover:underline font-semibold"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div className="!mt-6 md:!mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-primary hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing in...' : 'Log in'}
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center justify-center space-x-4 !mt-6">
                <div className="h-px bg-gray-300 flex-1"></div>
                <span className="text-gray-500 text-sm">or continue with</span>
                <div className="h-px bg-gray-300 flex-1"></div>
              </div>

              {/* Social Login Buttons */}
              <div className="!mt-6 space-y-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={socialLoading.google || loading}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {socialLoading.google ? (
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-3"></div>
                  ) : (
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {socialLoading.google ? 'Connecting to Google...' : 'Continue with Google'}
                  </span>
                </button>

                {/* <button
                  type="button"
                  onClick={handleAppleLogin}
                  disabled={socialLoading.apple || loading}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {socialLoading.apple ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  ) : (
                    <svg className="w-5 h-5 mr-3" fill="white" viewBox="0 0 24 24">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                  )}
                  <span className="text-sm font-medium text-white">
                    {socialLoading.apple ? 'Connecting to Apple...' : 'Continue with Apple'}
                  </span>
                </button> */}
              </div>

              <p className="text-sm !mt-6 md:!mt-8 text-center text-gray-800">
                Don&apos;t have an account{' '}
                <Link
                  href="./register"
                  className="text-primary font-semibold hover:underline ml-1 whitespace-nowrap"
                >
                  Register here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
