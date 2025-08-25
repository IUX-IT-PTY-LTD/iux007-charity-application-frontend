// components/admin/org/roles/RolesPage.jsx

"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle, Shield } from 'lucide-react';
import { toast } from 'sonner';

// Import role management service instead of direct services
import {
  getRolesForRoleManagement,
  getPermissionsForRoleManagement,
  validateRoleManagementAccess,
  updateRoleStatusWithHierarchy,
  getRolePermissionsForManagement,
} from '@/api/services/admin/roleManagementService';

// Import components
import { useAdminContext } from '@/components/admin/layout/admin-context';
import RolesHeader from '@/components/admin/org/roles/RolesHeader';
import RolesSearchBar from '@/components/admin/org/roles/RolesSearchBar';
import RolesTable from '@/components/admin/org/roles/RolesTable';
import RolesPagination from '@/components/admin/org/roles/RolesPagination';
import CreateRoleModal from '@/components/admin/org/roles/modals/CreateRoleModal';
import EditRoleModal from '@/components/admin/org/roles/modals/EditRoleModal';
import ViewPermissionsModal from '@/components/admin/org/roles/modals/ViewPermissionsModal';

const RolesPage = () => {
  const { adminProfile, isLoading: contextLoading, isInitialized } = useAdminContext();
  const { setPageTitle, setPageSubtitle } = useAdminContext();

  const [pageState, setPageState] = useState({
    roles: [],
    permissions: [],
    rolePermissions: {},
    isLoading: true,
    error: null,
    hasAccess: false,
  });

  const [modalState, setModalState] = useState({
    createModal: { isOpen: false },
    editModal: { isOpen: false, role: null },
    viewModal: { isOpen: false, role: null },
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
      setPageTitle('Role Management');
      setPageSubtitle('Manage user roles and permissions');
    }, [setPageTitle, setPageSubtitle]);

  // Initialize page when context is ready
  useEffect(() => {
    if (isInitialized && !contextLoading) {
      initializePage();
    }
  }, [isInitialized, contextLoading]);

  const initializePage = async () => {
    try {
      setPageState((prev) => ({ ...prev, isLoading: true, error: null }));

      // First validate access using hierarchy service
      const accessValidation = await validateRoleManagementAccess();
      if (!accessValidation.valid) {
        setPageState((prev) => ({
          ...prev,
          isLoading: false,
          hasAccess: false,
          error: accessValidation.message,
        }));
        return;
      }

      // Load roles and permissions using hierarchy services
      const [rolesResult, permissionsResult] = await Promise.all([
        getRolesForRoleManagement(),
        getPermissionsForRoleManagement(),
      ]);

      // Fetch role permissions
      const rolePermissionsMap = {};
      if (rolesResult && rolesResult.length > 0) {
        await Promise.all(
          rolesResult.map(async (role) => {
            try {
              const response = await getRolePermissionsForManagement(role.id);
              if (response.status === 'success' && response.data && response.data.length > 0) {
                rolePermissionsMap[role.id] = response.data[0].permissions || [];
              } else {
                rolePermissionsMap[role.id] = [];
              }
            } catch (error) {
              console.error(`Error fetching permissions for role ${role.id}:`, error);
              rolePermissionsMap[role.id] = [];
            }
          })
        );
      }

      setPageState({
        roles: rolesResult || [],
        permissions: permissionsResult || [],
        rolePermissions: rolePermissionsMap,
        isLoading: false,
        error: null,
        hasAccess: true,
      });

      console.log('Roles page initialized successfully:', {
        rolesCount: rolesResult?.length || 0,
        permissionsCount: permissionsResult?.length || 0,
      });
    } catch (error) {
      console.error('Error initializing roles page:', error);
      setPageState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to load role management data',
      }));
    }
  };

  // Modal handlers
  const handleCreateRole = () => {
    setModalState((prev) => ({
      ...prev,
      createModal: { isOpen: true },
    }));
  };

  const handleEditRole = (role) => {
    setModalState((prev) => ({
      ...prev,
      editModal: { isOpen: true, role },
    }));
  };

  const handleViewPermissions = (role) => {
    setModalState((prev) => ({
      ...prev,
      viewModal: { isOpen: true, role },
    }));
  };

  const closeModal = (modalType) => {
    setModalState((prev) => ({
      ...prev,
      [modalType]: { isOpen: false, role: null },
    }));
  };

  // CRUD handlers
  const handleRoleCreated = async (newRole) => {
    try {
      // Refresh the entire list to ensure hierarchy filtering is applied
      const updatedRoles = await getRolesForRoleManagement();

      // Fetch permissions for the new role
      const rolePermissionsMap = { ...pageState.rolePermissions };
      if (newRole.role) {
        try {
          const response = await getRolePermissionsForManagement(newRole.role.id);
          if (response.status === 'success' && response.data && response.data.length > 0) {
            rolePermissionsMap[newRole.role.id] = response.data[0].permissions || [];
          }
        } catch (error) {
          console.error(`Error fetching permissions for new role:`, error);
          rolePermissionsMap[newRole.role.id] = [];
        }
      }

      setPageState((prev) => ({
        ...prev,
        roles: updatedRoles || [],
        rolePermissions: rolePermissionsMap,
      }));
    } catch (error) {
      console.error('Error refreshing roles after creation:', error);
    }
  };

  const handleRoleUpdated = async (updatedRole) => {
    try {
      // Refresh the entire list to ensure hierarchy filtering is applied
      const updatedRoles = await getRolesForRoleManagement();

      // Update role permissions
      const rolePermissionsMap = { ...pageState.rolePermissions };
      const roleId = updatedRole.role?.id || updatedRole.id;

      if (roleId) {
        try {
          const response = await getRolePermissionsForManagement(roleId);
          if (response.status === 'success' && response.data && response.data.length > 0) {
            rolePermissionsMap[roleId] = response.data[0].permissions || [];
          }
        } catch (error) {
          console.error(`Error fetching updated permissions:`, error);
        }
      }

      setPageState((prev) => ({
        ...prev,
        roles: updatedRoles || [],
        rolePermissions: rolePermissionsMap,
      }));
    } catch (error) {
      console.error('Error refreshing roles after update:', error);
    }
  };

  const handleRoleStatusChange = async (role) => {
    try {
      // Use hierarchy service for status updates
      const updatedStatus = role.status === 1 ? 0 : 1;
      await updateRoleStatusWithHierarchy(role.id, role.name, updatedStatus);

      // Update local state
      setPageState((prev) => ({
        ...prev,
        roles: prev.roles.map((r) => (r.id === role.id ? { ...r, status: updatedStatus } : r)),
      }));

      toast.success(`Role ${updatedStatus === 1 ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error updating role status:', error);
      toast.error(error.message || 'Failed to update role status');
    }
  };

  // Sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort roles
  const filteredRoles = [...pageState.roles].filter((role) => {
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

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRoles = sortedAndFilteredRoles.slice(indexOfFirstItem, indexOfLastItem);

  // Count active and inactive roles
  const activeRoles = pageState.roles.filter((role) => role.status === 1).length;
  const inactiveRoles = pageState.roles.filter((role) => role.status === 0).length;

  // Loading state
  if (contextLoading || !isInitialized) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading role management...</p>
        </div>
      </div>
    );
  }

  // Access denied
  if (!pageState.hasAccess) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <Shield className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <div className="space-y-2">
            <p>
              <strong>Access Denied:</strong> {pageState.error}
            </p>
            <p className="text-sm">Contact your administrator for access to role management.</p>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // Page error
  if (pageState.error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Error:</strong> {pageState.error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <RolesHeader onCreateClick={handleCreateRole} />

        <CardContent className="space-y-6">
          <RolesSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            totalRoles={sortedAndFilteredRoles.length}
            activeRoles={activeRoles}
            inactiveRoles={inactiveRoles}
          />

          {pageState.isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                <p className="text-gray-600">Loading roles...</p>
              </div>
            </div>
          ) : (
            <RolesTable
              roles={currentRoles}
              isLoading={false}
              sortField={sortField}
              sortDirection={sortDirection}
              handleSort={handleSort}
              handleUpdateRole={handleRoleStatusChange}
              handleEditClick={handleEditRole}
              handleViewPermissions={handleViewPermissions}
              rolePermissions={pageState.rolePermissions}
            />
          )}
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

      {/* Modals */}
      <CreateRoleModal
        isOpen={modalState.createModal.isOpen}
        onClose={() => closeModal('createModal')}
        onRoleCreated={handleRoleCreated}
        permissions={pageState.permissions}
      />

      <EditRoleModal
        isOpen={modalState.editModal.isOpen}
        onClose={() => closeModal('editModal')}
        role={modalState.editModal.role}
        onRoleUpdated={handleRoleUpdated}
        permissions={pageState.permissions}
      />

      <ViewPermissionsModal
        isOpen={modalState.viewModal.isOpen}
        onClose={() => closeModal('viewModal')}
        role={modalState.viewModal.role}
      />
    </div>
  );
};

export default RolesPage;
