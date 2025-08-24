'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, getAuthToken } from '@/api/services/admin/authService';

// Create context
const AdminContext = createContext({
  pageTitle: 'Dashboard',
  setPageTitle: () => {},
  pageSubtitle: '',
  setPageSubtitle: () => {},
  adminProfile: null,
  refreshProfile: () => {},
  clearProfile: () => {},
  isLoadingProfile: false,
});

// Hook to use the admin context
export const useAdminContext = () => useContext(AdminContext);

// Provider component
export const AdminProvider = ({ children }) => {
  const [pageTitle, setPageTitle] = useState('Dashboard');
  const [pageSubtitle, setPageSubtitle] = useState('');
  const [adminProfile, setAdminProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const fetchAdminProfile = async () => {
    try {
      setIsLoadingProfile(true);
      // Check if token exists before making API call
      const token = getAuthToken();
      if (!token) {
        setAdminProfile(null);
        setIsLoadingProfile(false);
        return;
      }
      
      const response = await getCurrentUser();
      if (response.status === 'success' && response.data) {
        setAdminProfile(response.data);
      } else {
        setAdminProfile(null);
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      setAdminProfile(null);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Load admin profile on initial mount
  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const refreshProfile = () => {
    fetchAdminProfile();
  };

  const clearProfile = () => {
    setAdminProfile(null);
    setIsLoadingProfile(false);
  };

  const value = {
    pageTitle,
    setPageTitle,
    pageSubtitle,
    setPageSubtitle,
    adminProfile,
    refreshProfile,
    clearProfile,
    isLoadingProfile,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
