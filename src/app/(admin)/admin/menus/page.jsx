'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';

// Import UI components
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Import custom components
import MenusHeader from '@/components/admin/menus/list/MenusHeader';
import MenusSearchBar from '@/components/admin/menus/list/MenusSearchBar';
import MenusTable from '@/components/admin/menus/list/MenusTable';
import MenusPagination from '@/components/admin/menus/list/MenusPagination';

// Import protected services
import { getMenus, updateMenu, deleteMenu } from '@/api/services/admin/protected/menuService';
import { isAuthenticated } from '@/api/services/admin/authService';

// Import permission hooks and context
import { PermissionProvider } from '@/api/contexts/PermissionContext';
import { useMenuPermissions } from '@/api/hooks/useModulePermissions';
import { isPermissionError, getPermissionErrorMessage } from '@/api/utils/permissionErrors';

// Main Menus Page Component
const AdminMenusContent = () => {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();
  const menuPermissions = useMenuPermissions();

  // State management
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('ordering');
  const [sortDirection, setSortDirection] = useState('asc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Set page title
  useEffect(() => {
    setPageTitle('Menus');
    setPageSubtitle('Manage your website navigation menus');
  }, [setPageTitle, setPageSubtitle]);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error('Authentication required. Please log in.');
      router.push('/admin/login');
    }
  }, [router]);

  // Check if user has any menu access
  useEffect(() => {
    if (!menuPermissions.isLoading && !menuPermissions.hasAccess) {
      toast.error("You don't have access to the Menus module.");
      router.push('/admin/dashboard');
    }
  }, [menuPermissions.isLoading, menuPermissions.hasAccess, router]);

  // Fetch menus from API with permission handling
  const fetchMenus = async () => {
    // Don't fetch if user doesn't have view permission
    if (!menuPermissions.isLoading && !menuPermissions.canView) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call protected API
      const response = await getMenus();

      // Process response
      if (response.status === 'success') {
        setMenus(response.data || []);
      } else {
        throw new Error(response.message || 'Failed to fetch menus');
      }
    } catch (error) {
      console.error('Error fetching menus:', error);

      if (isPermissionError(error)) {
        setError(getPermissionErrorMessage(error));
        toast.error(getPermissionErrorMessage(error));
      } else {
        setError(error.message || 'Failed to load menus');
        toast.error(error.message || 'Failed to load menus');
      }

      // Fallback to empty state
      setMenus([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch when permissions are loaded
  useEffect(() => {
    // Only fetch when permissions are loaded
    if (!menuPermissions.isLoading) {
      fetchMenus();
    }
  }, [menuPermissions.isLoading, menuPermissions.canView]);

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle status toggle with permission checking
  const handleStatusChange = async (id, currentStatus) => {
    if (!menuPermissions.canEdit) {
      toast.error("You don't have permission to edit menus");
      return;
    }

    try {
      // Find the menu to get all required data
      const menu = menus.find((m) => m.id === id);
      if (!menu) {
        throw new Error('Menu not found');
      }

      // Create the data object with all required fields
      const menuData = {
        name: menu.name,
        ordering: menu.ordering,
        status: currentStatus === 1 ? 0 : 1,
      };

      const response = await updateMenu(id, menuData);

      if (response.status === 'success') {
        // Update local state to avoid refetching
        const updatedMenus = menus.map((menu) =>
          menu.id === id ? { ...menu, status: menuData.status } : menu
        );

        setMenus(updatedMenus);
        toast.success(`Menu ${currentStatus === 1 ? 'deactivated' : 'activated'} successfully`);
      } else {
        throw new Error(response.message || 'Failed to update menu status');
      }
    } catch (error) {
      console.error('Error updating menu status:', error);

      if (isPermissionError(error)) {
        toast.error(getPermissionErrorMessage(error));
      } else {
        toast.error(error.message || 'Failed to update menu status');
      }
    }
  };

  // Handle menu deletion with permission checking
  const handleDelete = async (id) => {
    if (!menuPermissions.canDelete) {
      toast.error("You don't have permission to delete menus");
      return;
    }

    try {
      const response = await deleteMenu(id);

      if (response.status === 'success') {
        toast.success('Menu deleted successfully');

        // Update local state
        const updatedMenus = menus.filter((menu) => menu.id !== id);
        setMenus(updatedMenus);
      } else {
        throw new Error(response.message || 'Failed to delete menu');
      }
    } catch (error) {
      console.error('Error deleting menu:', error);

      if (isPermissionError(error)) {
        toast.error(getPermissionErrorMessage(error));
      } else {
        toast.error(error.message || 'Failed to delete menu');
      }
    }
  };

  // Sort and filter menus
  const filteredMenus = [...menus].filter((menu) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();

    // Handle special filters
    if (query === 'active') return menu.status === 1;
    if (query === 'inactive') return menu.status === 0;

    // Handle text search
    return menu.name.toLowerCase().includes(query) || menu.slug.toLowerCase().includes(query);
  });

  const sortedAndFilteredMenus = [...filteredMenus].sort((a, b) => {
    const modifier = sortDirection === 'asc' ? 1 : -1;

    if (sortField === 'name' || sortField === 'slug') {
      return a[sortField].localeCompare(b[sortField]) * modifier;
    } else {
      return (a[sortField] - b[sortField]) * modifier;
    }
  });

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMenus = sortedAndFilteredMenus.slice(indexOfFirstItem, indexOfLastItem);

  // Count active and inactive menus
  const activeMenus = menus.filter((menu) => menu.status === 1).length;
  const inactiveMenus = menus.filter((menu) => menu.status === 0).length;

  // Show loading state while permissions are loading
  if (menuPermissions.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading permissions...</p>
        </div>
      </div>
    );
  }

  // Show access denied if user has no menu permissions
  if (!menuPermissions.hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access the Menus module.
          </p>
          <Button onClick={() => router.push('/admin/dashboard')}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <Card>
          {/* Header */}
          <MenusHeader />

          <CardContent>
            {/* Search Bar */}
            <MenusSearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              totalMenus={sortedAndFilteredMenus.length}
              activeMenus={activeMenus}
              inactiveMenus={inactiveMenus}
            />

            {/* Table */}
            <MenusTable
              menus={currentMenus}
              isLoading={isLoading}
              sortField={sortField}
              sortDirection={sortDirection}
              handleSort={handleSort}
              handleStatusChange={handleStatusChange}
              handleDelete={handleDelete}
              menuPermissions={menuPermissions}
            />
          </CardContent>

          <CardFooter>
            {/* Pagination - only show if user can view and has data */}
            {menuPermissions.canView && sortedAndFilteredMenus.length > 0 && (
              <MenusPagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                totalItems={sortedAndFilteredMenus.length}
                indexOfFirstItem={indexOfFirstItem}
                indexOfLastItem={indexOfLastItem}
              />
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

// Wrapper component that provides permission context
const AdminMenus = () => {
  return (
    <PermissionProvider>
      <AdminMenusContent />
    </PermissionProvider>
  );
};

export default AdminMenus;
