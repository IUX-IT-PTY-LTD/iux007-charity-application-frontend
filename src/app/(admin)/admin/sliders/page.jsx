'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

// Import components
import SlidersHeader from '@/components/admin/sliders/list/SlidersHeader';
import SlidersFilters from '@/components/admin/sliders/list/SlidersFilters';
import SlidersTable from '@/components/admin/sliders/list/SlidersTable';
import SlidersPagination from '@/components/admin/sliders/list/SlidersPagination';

// Import PROTECTED services
import {
  getAllSliders,
  deleteSlider,
  updateSliderStatus,
} from '@/api/services/admin/protected/sliderService';
import { isAuthenticated } from '@/api/services/admin/authService';

// Import permission hooks and context
import { PermissionProvider } from '@/api/contexts/PermissionContext';
import { useSliderPermissions } from '@/api/hooks/useModulePermissions';
import { isPermissionError, getPermissionErrorMessage } from '@/api/utils/permissionErrors';

// Main Sliders Page Component
const AdminSlidersContent = () => {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();
  const sliderPermissions = useSliderPermissions();

  // State management
  const [sliders, setSliders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('ordering');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [selectedSliderId, setSelectedSliderId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Set page title and subtitle
  useEffect(() => {
    setPageTitle('Sliders');
    setPageSubtitle('Manage homepage carousel sliders');
  }, [setPageTitle, setPageSubtitle]);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error('Authentication required. Please log in.');
      router.push('/admin/login');
    }
  }, [router]);

  // Check if user has any slider access
  useEffect(() => {
    if (!sliderPermissions.isLoading && !sliderPermissions.hasAccess) {
      toast.error("You don't have access to the Sliders module.");
      router.push('/admin/dashboard');
    }
  }, [sliderPermissions.isLoading, sliderPermissions.hasAccess, router]);

  // Fetch sliders from API with permission handling
  const fetchSliders = async () => {
    // Don't fetch if user doesn't have view permission
    if (!sliderPermissions.isLoading && !sliderPermissions.canView) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call protected API
      const response = await getAllSliders();

      // Process response
      if (response.status === 'success') {
        setSliders(response.data || []);
      } else {
        throw new Error(response.message || 'Failed to fetch sliders');
      }
    } catch (error) {
      console.error('Error fetching sliders:', error);

      if (isPermissionError(error)) {
        setError(getPermissionErrorMessage(error));
        toast.error(getPermissionErrorMessage(error));
      } else {
        setError(error.message || 'Failed to load sliders');
        toast.error(error.message || 'Failed to load sliders');
      }

      // Fallback to empty state
      setSliders([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch when permissions are loaded
  useEffect(() => {
    // Only fetch when permissions are loaded
    if (!sliderPermissions.isLoading) {
      fetchSliders();
    }
  }, [sliderPermissions.isLoading, sliderPermissions.canView]);

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle slider deletion with permission checking
  const handleDelete = async (id) => {
    if (!sliderPermissions.canDelete) {
      toast.error("You don't have permission to delete sliders");
      return;
    }

    try {
      setIsDeleting(true);
      setSelectedSliderId(id);

      const response = await deleteSlider(id);

      if (response.status === 'success') {
        // Update local state
        const updatedSliders = sliders.filter((slider) => slider.id !== id);
        setSliders(updatedSliders);
        toast.success('Slider deleted successfully');
      } else {
        throw new Error(response.message || 'Failed to delete slider');
      }
    } catch (error) {
      console.error('Error deleting slider:', error);

      if (isPermissionError(error)) {
        toast.error(getPermissionErrorMessage(error));
      } else {
        toast.error(error.message || 'Failed to delete slider');
      }
    } finally {
      setIsDeleting(false);
      setSelectedSliderId(null);
    }
  };

  // Handle status toggle with permission checking
  const handleStatusChange = async (id, currentStatus) => {
    if (!sliderPermissions.canEdit) {
      toast.error("You don't have permission to edit sliders");
      return;
    }

    try {
      setIsStatusUpdating(true);
      setSelectedSliderId(id);

      // Convert status to number if it's a string
      const currentStatusNum =
        typeof currentStatus === 'string' ? parseInt(currentStatus, 10) : currentStatus;

      // Toggle status (0 to 1 or 1 to 0)
      const newStatus = currentStatusNum === 1 ? 0 : 1;

      // Call the protected API to update status
      const response = await updateSliderStatus(id, newStatus);

      if (response.status === 'success') {
        // Update local state
        const updatedSliders = sliders.map((slider) => {
          if (slider.id === id) {
            return { ...slider, status: newStatus };
          }
          return slider;
        });

        setSliders(updatedSliders);
        toast.success(
          `Slider ${currentStatusNum === 1 ? 'deactivated' : 'activated'} successfully`
        );
      } else {
        throw new Error(response.message || 'Failed to update slider status');
      }
    } catch (error) {
      console.error('Error updating slider status:', error);

      if (isPermissionError(error)) {
        toast.error(getPermissionErrorMessage(error));
      } else {
        toast.error(error.message || 'Failed to update slider status');
      }
    } finally {
      setIsStatusUpdating(false);
      setSelectedSliderId(null);
    }
  };

  // Format status value to make sure it's consistent
  const getStatusValue = (status) => {
    if (status === '1' || status === 1) return 1;
    return 0;
  };

  // Filter and sort sliders
  const filteredAndSortedSliders = [...sliders]
    .filter((slider) => {
      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();

      if (query === 'active') return getStatusValue(slider.status) === 1;
      if (query === 'inactive') return getStatusValue(slider.status) === 0;

      return (
        slider.title.toLowerCase().includes(query) ||
        slider.description.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      const modifier = sortDirection === 'asc' ? 1 : -1;

      if (sortField === 'title' || sortField === 'description') {
        return a[sortField].localeCompare(b[sortField]) * modifier;
      } else {
        return (Number(a[sortField]) - Number(b[sortField])) * modifier;
      }
    });

  // Calculate pagination
  const totalSliders = filteredAndSortedSliders.length;
  const totalPages = Math.ceil(totalSliders / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSliders = filteredAndSortedSliders.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate counts for filter badges
  const activeCount = sliders.filter((slider) => getStatusValue(slider.status) === 1).length;
  const inactiveCount = sliders.filter((slider) => getStatusValue(slider.status) === 0).length;

  // Show loading state while permissions are loading
  if (sliderPermissions.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading permissions...</p>
        </div>
      </div>
    );
  }

  // Show access denied if user has no slider permissions
  if (!sliderPermissions.hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access the Sliders module.
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
          <SlidersHeader />

          <CardContent>
            <SlidersFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              totalCount={sliders.length}
              activeCount={activeCount}
              inactiveCount={inactiveCount}
              filteredCount={filteredAndSortedSliders.length}
            />

            <SlidersTable
              sliders={currentSliders}
              isLoading={isLoading}
              handleSort={handleSort}
              sortField={sortField}
              sortDirection={sortDirection}
              handleStatusChange={handleStatusChange}
              handleDelete={handleDelete}
              isStatusUpdating={isStatusUpdating}
              isDeleting={isDeleting}
              selectedSliderId={selectedSliderId}
              getStatusValue={getStatusValue}
              router={router}
              sliderPermissions={sliderPermissions}
            />
          </CardContent>

          <CardFooter>
            {/* Pagination - only show if user can view and has data */}
            {sliderPermissions.canView && filteredAndSortedSliders.length > 0 && (
              <SlidersPagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                totalItems={totalSliders}
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
const AdminSlidersList = () => {
  return (
    <PermissionProvider>
      <AdminSlidersContent />
    </PermissionProvider>
  );
};

export default AdminSlidersList;
