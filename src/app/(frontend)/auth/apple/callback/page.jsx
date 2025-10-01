'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/features/userSlice';
import { apiService } from '@/api/services/app/apiService';
import { ENDPOINTS } from '@/api/config';
import { toast } from 'react-toastify';
import Loader from '@/components/shared/loader';

export default function AppleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleAppleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        toast.error('Apple login was cancelled or failed');
        router.push('/login');
        return;
      }

      if (!code) {
        toast.error('Authorization code not received');
        router.push('/login');
        return;
      }

      try {
        // For Apple, we need to handle the identity token which contains user info
        const user = searchParams.get('user'); // Apple sends user data in the 'user' parameter
        let userData = {};
        
        if (user) {
          try {
            userData = JSON.parse(user);
          } catch (e) {
            console.error('Failed to parse Apple user data:', e);
          }
        }

        // Send the authorization code and user data to your backend
        const response = await apiService.post(ENDPOINTS.AUTH.SOCIAL_LOGIN || '/auth/social-login', {
          code,
          provider_id: code, // Apple doesn't provide a separate user ID in the callback
          provider_name: 'apple',
          name: userData.name ? `${userData.name.firstName || ''} ${userData.name.lastName || ''}`.trim() : '',
          email: userData.email || '',
          redirect_uri: window.location.origin + '/auth/apple/callback'
        });

        if (response.data && response.status === 'success') {
          dispatch(setUser(response.data));
          toast.success('Apple login successful');
          router.push('/');
        } else {
          throw new Error(response.message || 'Apple login failed');
        }
      } catch (error) {
        console.error('Apple callback error:', error);
        toast.error('Failed to complete Apple login');
        router.push('/login');
      }
    };

    handleAppleCallback();
  }, [searchParams, router, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader title="Completing Apple login..." />
    </div>
  );
}