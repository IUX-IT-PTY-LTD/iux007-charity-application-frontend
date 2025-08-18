'use client';

import React, { useState, useEffect } from 'react';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { toast } from 'sonner';

// Import services
import { getAllAdmins } from '@/api/services/admin/adminService';

// Import components
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import AdminsHeader from '@/components/admin/org/AdminsHeader';
import AdminsSearchBar from '@/components/admin/org/AdminsSearchBar';
import AdminsTable from '@/components/admin/org/AdminsTable';
import AdminsPagination from '@/components/admin/org/AdminsPagination';
import CreateAdminModal from '@/components/admin/org/CreateAdminModal';
import EditAdminModal from '@/components/admin/org/EditAdminModal';

const AdminsPage = () => {
  const { setPageTitle, setPageSubtitle } = useAdminContext();

  // State management
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setPageTitle('Admin Management');
    setPageSubtitle('Manage admin users and permissions');
  }, [setPageTitle, setPageSubtitle]);

  // Fetch admins from API
  useEffect(() => {
    const fetchAdmins = async () => {
      setIsLoading(true);

      try {
        const response = await getAllAdmins();

        if (response.status === 'success') {
          setAdmins(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch admins');
        }
      } catch (error) {
        console.error('Error fetching admins:', error);
        toast.error('Failed to load admins');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdmins();
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

  // Handle admin creation
  const handleCreateAdmin = (newAdmin) => {
    setAdmins([...admins, newAdmin]);
  };

  // Handle admin update
  const handleUpdateAdmin = (updatedAdmin) => {
    const updatedAdmins = admins.map((admin) =>
      admin.id === updatedAdmin.id ? updatedAdmin : admin
    );
    setAdmins(updatedAdmins);
  };

  // Handle admin deletion
  const handleDeleteAdmin = (id) => {
    const updatedAdmins = admins.filter((admin) => admin.id !== id);
    setAdmins(updatedAdmins);
  };

  // Handle edit button click
  const handleEditClick = (admin) => {
    setSelectedAdmin(admin);
    setEditModalOpen(true);
  };

  // Sort and filter admins
  const filteredAdmins = [...admins].filter((admin) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();

    // Handle special filters
    if (query === 'active') return admin.status === 1;
    if (query === 'inactive') return admin.status === 0;

    // Handle text search
    return admin.name.toLowerCase().includes(query) || admin.email.toLowerCase().includes(query);
  });

  const sortedAndFilteredAdmins = [...filteredAdmins].sort((a, b) => {
    const modifier = sortDirection === 'asc' ? 1 : -1;

    if (sortField === 'name' || sortField === 'email') {
      return a[sortField].localeCompare(b[sortField]) * modifier;
    } else {
      return (a[sortField] - b[sortField]) * modifier;
    }
  });

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAdmins = sortedAndFilteredAdmins.slice(indexOfFirstItem, indexOfLastItem);

  // Count active and inactive admins
  const activeAdmins = admins.filter((admin) => admin.status === 1).length;
  const inactiveAdmins = admins.filter((admin) => admin.status === 0).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <Card>
          <AdminsHeader onCreateClick={() => setCreateModalOpen(true)} />

          <CardContent>
            <AdminsSearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              totalAdmins={sortedAndFilteredAdmins.length}
              activeAdmins={activeAdmins}
              inactiveAdmins={inactiveAdmins}
            />

            <AdminsTable
              admins={currentAdmins}
              isLoading={isLoading}
              sortField={sortField}
              sortDirection={sortDirection}
              handleSort={handleSort}
              handleUpdateAdmin={handleUpdateAdmin}
              handleDeleteAdmin={handleDeleteAdmin}
              handleEditClick={handleEditClick}
            />
          </CardContent>

          <CardFooter>
            <AdminsPagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              totalItems={sortedAndFilteredAdmins.length}
              indexOfFirstItem={indexOfFirstItem}
              indexOfLastItem={indexOfLastItem}
            />
          </CardFooter>
        </Card>
      </div>

      {/* Modals */}
      <CreateAdminModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onAdminCreated={handleCreateAdmin}
      />

      {selectedAdmin && (
        <EditAdminModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedAdmin(null);
          }}
          admin={selectedAdmin}
          onAdminUpdated={handleUpdateAdmin}
        />
      )}
    </div>
  );
};

export default AdminsPage;
