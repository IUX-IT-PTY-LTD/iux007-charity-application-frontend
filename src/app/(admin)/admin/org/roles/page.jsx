'use client';

import React, { useState, useEffect } from 'react';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { toast } from 'sonner';

// Import services
import {
  getAllRoles,
  getAllPermissions,
  getRolePermissions,
} from '@/api/services/admin/roleService';

// Import components
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import RolesHeader from '@/components/admin/org/roles/RolesHeader';
import RolesSearchBar from '@/components/admin/org/roles/RolesSearchBar';
import RolesTable from '@/components/admin/org/roles/RolesTable';
import RolesPagination from '@/components/admin/org/roles/RolesPagination';
import CreateRoleModal from '@/components/admin/org/roles/modals/CreateRoleModal';
import EditRoleModal from '@/components/admin/org/roles/modals/EditRoleModal';
import ViewPermissionsModal from '@/components/admin/org/roles/modals/ViewPermissionsModal';

const RolesPage = () => {
  const { setPageTitle, setPageSubtitle } = useAdminContext();

  // State management
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewPermissionsModalOpen, setViewPermissionsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setPageTitle('Role Management');
    setPageSubtitle('Manage roles and permissions');
  }, [setPageTitle, setPageSubtitle]);

  // Fetch roles and permissions from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        // Fetch roles and permissions in parallel
        const [rolesResponse, permissionsResponse] = await Promise.all([
          getAllRoles(),
          getAllPermissions(),
        ]);

        if (rolesResponse.status === 'success') {
          setRoles(rolesResponse.data);

          // Fetch permissions for each role
          await fetchAllRolePermissions(rolesResponse.data);
        } else {
          throw new Error(rolesResponse.message || 'Failed to fetch roles');
        }

        if (permissionsResponse.status === 'success') {
          setPermissions(permissionsResponse.data);
        } else {
          throw new Error(permissionsResponse.message || 'Failed to fetch permissions');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load roles and permissions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch permissions for all roles
  const fetchAllRolePermissions = async (rolesList) => {
    const rolePermissionsMap = {};

    try {
      const permissionPromises = rolesList.map(async (role) => {
        try {
          const response = await getRolePermissions(role.id);
          if (response.status === 'success' && response.data && response.data.length > 0) {
            rolePermissionsMap[role.id] = response.data[0].permissions || [];
          } else {
            rolePermissionsMap[role.id] = [];
          }
        } catch (error) {
          console.error(`Error fetching permissions for role ${role.id}:`, error);
          rolePermissionsMap[role.id] = [];
        }
      });

      await Promise.all(permissionPromises);
      setRolePermissions(rolePermissionsMap);
    } catch (error) {
      console.error('Error fetching role permissions:', error);
    }
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle role creation
  const handleCreateRole = (newRoleData) => {
    // Add the new role to the list
    if (newRoleData.role) {
      setRoles([...roles, newRoleData.role]);

      // Add the permissions for the new role
      if (newRoleData.permissions && newRoleData.permissions.length > 0) {
        setRolePermissions((prev) => ({
          ...prev,
          [newRoleData.role.id]: newRoleData.permissions[0].permissions || [],
        }));
      }
    }
  };

  // Handle role update
  const handleUpdateRole = (updatedRoleData) => {
    // Update the role in the list
    let updatedRole;
    if (updatedRoleData.role) {
      updatedRole = updatedRoleData.role;
    } else {
      updatedRole = updatedRoleData; // Direct role object for status updates
    }

    const updatedRoles = roles.map((role) => (role.id === updatedRole.id ? updatedRole : role));
    setRoles(updatedRoles);

    // Update permissions if provided
    if (updatedRoleData.permissions && updatedRoleData.permissions.length > 0) {
      setRolePermissions((prev) => ({
        ...prev,
        [updatedRole.id]: updatedRoleData.permissions[0].permissions || [],
      }));
    }
  };

  // Handle role deletion
  const handleDeleteRole = (id) => {
    const updatedRoles = roles.filter((role) => role.id !== id);
    setRoles(updatedRoles);

    // Remove permissions for deleted role
    setRolePermissions((prev) => {
      const newPermissions = { ...prev };
      delete newPermissions[id];
      return newPermissions;
    });
  };

  // Handle edit button click
  const handleEditClick = (role) => {
    setSelectedRole(role);
    setEditModalOpen(true);
  };

  // Handle view permissions button click
  const handleViewPermissions = (role) => {
    setSelectedRole(role);
    setViewPermissionsModalOpen(true);
  };

  // Sort and filter roles
  const filteredRoles = [...roles].filter((role) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();

    // Handle special filters
    if (query === 'active') return role.status === 1;
    if (query === 'inactive') return role.status === 0;

    // Handle text search
    return role.name.toLowerCase().includes(query);
  });

  const sortedAndFilteredRoles = [...filteredRoles].sort((a, b) => {
    const modifier = sortDirection === 'asc' ? 1 : -1;

    if (sortField === 'name') {
      return a[sortField].localeCompare(b[sortField]) * modifier;
    } else {
      return (a[sortField] - b[sortField]) * modifier;
    }
  });

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRoles = sortedAndFilteredRoles.slice(indexOfFirstItem, indexOfLastItem);

  // Count active and inactive roles
  const activeRoles = roles.filter((role) => role.status === 1).length;
  const inactiveRoles = roles.filter((role) => role.status === 0).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <Card>
          <RolesHeader onCreateClick={() => setCreateModalOpen(true)} />

          <CardContent>
            <RolesSearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              totalRoles={sortedAndFilteredRoles.length}
              activeRoles={activeRoles}
              inactiveRoles={inactiveRoles}
            />

            <RolesTable
              roles={currentRoles}
              isLoading={isLoading}
              sortField={sortField}
              sortDirection={sortDirection}
              handleSort={handleSort}
              handleUpdateRole={handleUpdateRole}
              handleDeleteRole={handleDeleteRole}
              handleEditClick={handleEditClick}
              handleViewPermissions={handleViewPermissions}
              rolePermissions={rolePermissions}
            />
          </CardContent>

          <CardFooter>
            <RolesPagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              totalItems={sortedAndFilteredRoles.length}
              indexOfFirstItem={indexOfFirstItem}
              indexOfLastItem={indexOfLastItem}
            />
          </CardFooter>
        </Card>
      </div>

      {/* Modals */}
      <CreateRoleModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onRoleCreated={handleCreateRole}
        permissions={permissions}
      />

      {selectedRole && (
        <>
          <EditRoleModal
            isOpen={editModalOpen}
            onClose={() => {
              setEditModalOpen(false);
              setSelectedRole(null);
            }}
            role={selectedRole}
            onRoleUpdated={handleUpdateRole}
            permissions={permissions}
          />

          <ViewPermissionsModal
            isOpen={viewPermissionsModalOpen}
            onClose={() => {
              setViewPermissionsModalOpen(false);
              setSelectedRole(null);
            }}
            role={selectedRole}
          />
        </>
      )}
    </div>
  );
};

export default RolesPage;
