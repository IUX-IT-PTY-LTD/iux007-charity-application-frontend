'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/features/userSlice';
import { apiService } from '@/api/services/app/apiService';
import { ENDPOINTS } from '@/api/config';
import { toast } from 'react-toastify';
import Loader from '@/components/shared/loader';

export default function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        toast.error('Google login was cancelled or failed');
        router.push('/login');
        return;
      }

      if (!code) {
        toast.error('Authorization code not received');
        router.push('/login');
        return;
      }

      try {
        // First, exchange the code for an access token
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '142668446381-04pf87heqodbs2um3fi98aue4187r38r.apps.googleusercontent.com',
            client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || '', // Note: In production, this should be handled server-side
            code,
            grant_type: 'authorization_code',
            redirect_uri: window.location.origin + '/auth/google/callback'
          })
        });

        const tokenData = await tokenResponse.json();
        
        if (!tokenData.access_token) {
          throw new Error('Failed to get access token');
        }

        // Fetch user profile from Google
        const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`
          }
        });

        const profileData = await profileResponse.json();

        // Send the user data to your backend
        const response = await apiService.post(ENDPOINTS.AUTH.SOCIAL_LOGIN || '/auth/social-login', {
          code,
          provider_id: profileData.id,
          provider: 'google',
          name: profileData.name,
          email: profileData.email,
          picture: profileData.picture,
          redirect_uri: window.location.origin + '/auth/google/callback'
        });

        if (response.data && response.status === 'success') {
          dispatch(setUser(response.data));
          toast.success('Google login successful');
          
          // Check for redirect URL in state parameter
          const state = searchParams.get('state');
          let redirectUrl = '/';
          
          if (state) {
            try {
              const stateData = JSON.parse(atob(state));
              redirectUrl = stateData.redirect || '/';
            } catch (error) {
              console.error('Failed to parse state parameter:', error);
            }
          }
          
          router.push(redirectUrl);
        } else {
          throw new Error(response.message || 'Google login failed');
        }
      } catch (error) {
        console.error('Google callback error:', error);
        toast.error('Failed to complete Google login');
        router.push('/login');
      }
    };

    handleGoogleCallback();
  }, [searchParams, router, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader title="Completing Google login..." />
    </div>
  );
}