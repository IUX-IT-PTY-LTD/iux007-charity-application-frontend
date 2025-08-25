// hooks/useCurrentUserRoleLevel.js

import { useState, useEffect } from 'react';
import {
  getCurrentUserRoleName,
  getCurrentUserRoleLevel,
  ROLE_LEVELS,
} from '@/api/utils/roleHierarchy';

/**
 * Custom hook to get current user's role level
 * @returns {Object} Role level information
 */
export const useCurrentUserRoleLevel = () => {
  const [roleLevel, setRoleLevel] = useState(ROLE_LEVELS.OTHER);
  const [roleName, setRoleName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserRole = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [fetchedRoleName, fetchedRoleLevel] = await Promise.all([
        getCurrentUserRoleName(),
        getCurrentUserRoleLevel(),
      ]);

      setRoleName(fetchedRoleName);
      setRoleLevel(fetchedRoleLevel);
    } catch (error) {
      console.error('Error fetching user role:', error);
      setError(error.message);
      setRoleLevel(ROLE_LEVELS.OTHER);
      setRoleName('');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, []);

  return {
    roleLevel,
    roleName,
    isLoading,
    error,
    refetch: fetchUserRole,

    // Convenience properties
    isSuperAdmin: roleLevel === ROLE_LEVELS.SUPER_ADMIN,
    isAdmin: roleLevel === ROLE_LEVELS.ADMIN,
    isOther: roleLevel === ROLE_LEVELS.OTHER,
  };
};
