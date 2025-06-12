'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '@/api/services/admin/authService';

// Create context
const AdminContext = createContext({
  pageTitle: 'Dashboard',
  setPageTitle: () => {},
  pageSubtitle: '',
  setPageSubtitle: () => {},
  adminProfile: null,
  refreshProfile: () => {},
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
      const response = await getCurrentUser();
      if (response.status === 'success' && response.data) {
        setAdminProfile(response.data);
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error);
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

  const value = {
    pageTitle,
    setPageTitle,
    pageSubtitle,
    setPageSubtitle,
    adminProfile,
    refreshProfile,
    isLoadingProfile,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
