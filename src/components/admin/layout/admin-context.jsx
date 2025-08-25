'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAdminById } from '@/api/services/admin/adminService';
import { getCurrentUserPermissions } from '@/api/utils/permissionWrapper';
import { getCurrentUser, getAuthToken, getUserId } from '@/api/services/admin/authService';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  // UI state
  const [pageTitle, setPageTitle] = useState('Dashboard');
  const [pageSubtitle, setPageSubtitle] = useState('');

  // Admin state
  const [adminState, setAdminState] = useState({
    profile: null,
    permissions: [],
    isLoading: true,
    isInitialized: false,
    error: null,
  });

  /** 🔹 Load full admin profile + permissions */
  const loadAdminProfile = async () => {
    try {
      setAdminState(prev => ({ ...prev, isLoading: true, error: null }));

      // Check token first (like in the first version)
      setIsLoadingProfile(true);
      // Check if token exists before making API call
      const token = getAuthToken();
      if (!token) {
        setAdminState({
          profile: null,
          permissions: [],
          isLoading: false,
          isInitialized: true,
          error: null,
        });
        return;
      }

      // Get user ID
      const userId = getUserId();
      if (!userId) throw new Error('User not logged in');

      // Get admin details
      const userResponse = await getAdminById(userId);
      if (!userResponse || !userResponse.data) {
        throw new Error('Unable to load user profile');
      }

      const userData = userResponse.data;

      // Permissions
      const userPermissions = await getCurrentUserPermissions();

      // Normalized profile
      const profile = {
        ...userData,
        role: userData.role || (userData.role_id ? { id: userData.role_id } : null),
      };

      setAdminState({
        profile,
        permissions: userPermissions,
        isLoading: false,
        isInitialized: true,
        error: null,
      });

      console.log('Admin profile loaded:', {
        user: userData.name,
        userId: userData.id,
        roleId: userData.role_id,
        permissions: userPermissions.length,
      });
    } catch (error) {
      console.error('Error loading admin profile:', error);
      setAdminState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
        profile: null,
        permissions: [],
      }));
    }
  };

  /** 🔹 Refresh profile (re-fetch everything) */
  const refreshProfile = async () => {
    await loadAdminProfile();
  };

  /** 🔹 Clear profile (log out or token expired) */
  const clearProfile = () => {
    setAdminState({
      profile: null,
      permissions: [],
      isLoading: false,
      isInitialized: true,
      error: null,
    });
  };

  // Load on mount
  useEffect(() => {
    loadAdminProfile();
  }, []);

  const contextValue = {
    // UI State
    pageTitle,
    setPageTitle,
    pageSubtitle,
    setPageSubtitle,

    // Admin State
    adminProfile: adminState.profile,
    permissions: adminState.permissions,
    isLoading: adminState.isLoading,
    isInitialized: adminState.isInitialized,
    error: adminState.error,

    // Actions
    refreshProfile,
    clearProfile,
    hasPermission: (perm) => adminState.permissions.includes(perm),
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdminContext must be used within an AdminProvider');
  return context;
};

export { AdminContext };
