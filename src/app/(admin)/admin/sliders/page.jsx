'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

// Import components
import SlidersHeader from '@/components/admin/sliders/list/SlidersHeader';
import SlidersFilters from '@/components/admin/sliders/list/SlidersFilters';
import SlidersTable from '@/components/admin/sliders/list/SlidersTable';
import SlidersPagination from '@/components/admin/sliders/list/SlidersPagination';

// Import API services
import {
  getAllSliders,
  deleteSlider,
  updateSliderStatus,
} from '@/api/services/admin/sliderService';
import { isAuthenticated } from '@/api/services/admin/authService';

const AdminSlidersList = () => {
  const router = useRouter();
  const { setPageTitle, setPageSubtitle } = useAdminContext();

  // State management
  const [sliders, setSliders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  // Fetch sliders from API
  useEffect(() => {
    const fetchSliders = async () => {
      setIsLoading(true);

      try {
        const response = await getAllSliders();

        if (response.status === 'success' && response.data) {
          setSliders(response.data);
        } else {
          toast.error('Failed to load sliders');
        }
      } catch (error) {
        console.error('Error fetching sliders:', error);
        toast.error(error.message || 'Failed to load sliders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSliders();
  }, []);

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort sliders
  const filteredAndSortedSliders = [...sliders]
    .filter((slider) => {
      if (!searchQuery) return true;

      const query = searchQuery.toLowerCase();

      if (query === 'active') return slider.status === '1' || slider.status === 1;
      if (query === 'inactive') return slider.status === '0' || slider.status === 0;

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

  // Handle slider deletion
  const handleDelete = async (id) => {
    try {
      setIsDeleting(true);
      setSelectedSliderId(id);

      const response = await deleteSlider(id);

      if (response.status === 'success') {
        // Update state after successful deletion
        const updatedSliders = sliders.filter((slider) => slider.id !== id);
        setSliders(updatedSliders);

        toast.success( 'Slider deleted successfully');
      } else {
        toast.error(response.message || 'Failed to delete slider');
      }
    } catch (error) {
      console.error('Error deleting slider:', error);
      toast.error(error.message || 'Failed to delete slider');
    } finally {
      setIsDeleting(false);
      setSelectedSliderId(null);
    }
  };

  // Handle status toggle
  const handleStatusChange = async (id, currentStatus) => {
    try {
      setIsStatusUpdating(true);
      setSelectedSliderId(id);

      // Convert status to number if it's a string
      const currentStatusNum =
        typeof currentStatus === 'string' ? parseInt(currentStatus, 10) : currentStatus;

      // Toggle status (0 to 1 or 1 to 0)
      const newStatus = currentStatusNum === 1 ? 0 : 1;

      // Call the API to update status
      const response = await updateSliderStatus(id, newStatus);

      if (response.status === 'success') {
        // Update state after successful update
        const updatedSliders = sliders.map((slider) => {
          if (slider.id === id) {
            return {
              ...slider,
              status: newStatus,
            };
          }
          return slider;
        });

        setSliders(updatedSliders);

        toast.success(
          `Slider ${currentStatusNum === 1 ? 'deactivated' : 'activated'} successfully`
        );
      } else {
        toast.error(response.message || 'Failed to update slider status');
      }
    } catch (error) {
      console.error('Error updating slider status:', error);
      toast.error(error.message || 'Failed to update slider status');
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

  // Calculate counts for filter badges
  const activeCount = sliders.filter((slider) => getStatusValue(slider.status) === 1).length;
  const inactiveCount = sliders.filter((slider) => getStatusValue(slider.status) === 0).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <Card>
          <SlidersHeader router={router} />

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
            />
          </CardContent>

          <CardFooter>
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
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminSlidersList;
