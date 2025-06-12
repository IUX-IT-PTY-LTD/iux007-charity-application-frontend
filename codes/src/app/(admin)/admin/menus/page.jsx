// src/app/(admin)/admin/menus/page.jsx

'use client';

import React, { useState, useEffect } from 'react';
import { useAdminContext } from '@/components/admin/layout/admin-context';
import { toast } from 'sonner';

// Import services
import { menuService } from '@/api/services/admin/menuService';

// Import components
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import MenusHeader from '@/components/admin/menus/list/MenusHeader';
import MenusSearchBar from '@/components/admin/menus/list/MenusSearchBar';
import MenusTable from '@/components/admin/menus/list/MenusTable';
import MenusPagination from '@/components/admin/menus/list/MenusPagination';

const AdminMenus = () => {
  const { setPageTitle, setPageSubtitle } = useAdminContext();

  // State management
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('ordering');
  const [sortDirection, setSortDirection] = useState('asc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setPageTitle('Menus');
    setPageSubtitle("Manage your website navigation menus");
  }, [setPageTitle, setPageSubtitle]);

  // Fetch menus from API
  useEffect(() => {
    const fetchMenus = async () => {
      setIsLoading(true);

      try {
        const response = await menuService.getMenus();
        
        if (response.status === 'success') {
          setMenus(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch menus');
        }
      } catch (error) {
        console.error('Error fetching menus:', error);
        toast.error('Failed to load menus');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenus();
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

  // Handle status toggle
  const handleStatusChange = (id, currentStatus) => {
    const updatedMenus = menus.map((menu) => {
      if (menu.id === id) {
        return { ...menu, status: currentStatus === 1 ? 0 : 1 };
      }
      return menu;
    });

    setMenus(updatedMenus);
  };

  // Handle menu deletion
  const handleDelete = (id) => {
    const updatedMenus = menus.filter((menu) => menu.id !== id);
    setMenus(updatedMenus);
  };

  // Sort and filter menus
  const filteredMenus = [...menus].filter((menu) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    
    // Handle special filters
    if (query === 'active') return menu.status === 1;
    if (query === 'inactive') return menu.status === 0;
    
    // Handle text search
    return menu.name.toLowerCase().includes(query) || 
           menu.slug.toLowerCase().includes(query);
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
  const activeMenus = menus.filter(menu => menu.status === 1).length;
  const inactiveMenus = menus.filter(menu => menu.status === 0).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <Card>
          <MenusHeader />

          <CardContent>
            <MenusSearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              totalMenus={sortedAndFilteredMenus.length}
              activeMenus={activeMenus}
              inactiveMenus={inactiveMenus}
            />

            <MenusTable
              menus={currentMenus}
              isLoading={isLoading}
              sortField={sortField}
              sortDirection={sortDirection}
              handleSort={handleSort}
              handleStatusChange={handleStatusChange}
              handleDelete={handleDelete}
            />
          </CardContent>

          <CardFooter>
            <MenusPagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              totalItems={sortedAndFilteredMenus.length}
              indexOfFirstItem={indexOfFirstItem}
              indexOfLastItem={indexOfLastItem}
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminMenus;