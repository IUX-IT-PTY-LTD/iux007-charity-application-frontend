'use client';

import AdminPageHeader from '@/components/admin-page-header';
import Link from 'next/link';
import React from 'react';

const AdminMenus = () => {
  // Sample static menu list — replace with dynamic fetch later
  const menus = [
    { id: 1, name: 'Home', slug: 'home', ordering: 1, status: 1 },
    { id: 2, name: 'Blog', slug: 'blog', ordering: 2, status: 1 },
    { id: 3, name: 'Contact', slug: 'contact', ordering: 3, status: 0 },
  ];

  const handleDelete = (id) => {
    // Confirmation and delete logic here
    if (confirm('Are you sure you want to delete this menu?')) {
      console.log('Deleting menu with id:', id);
      // Add delete API call here
    }
  };

  return (
    <div>
      <AdminPageHeader title="Menus" />

      <div className="p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700">All Menus</h2>
        <Link href="/admin/menus/create">
          <span className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded shadow">
            + Create Menu
          </span>
        </Link>
      </div>

      <div className="px-4 pb-6">
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Slug</th>
                <th className="px-6 py-3">Ordering</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menus.map((menu, index) => (
                <tr key={menu.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{menu.name}</td>
                  <td className="px-6 py-4">{menu.slug}</td>
                  <td className="px-6 py-4">{menu.ordering}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${menu.status === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                    >
                      {menu.status === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link href={`/admin/menus/edit/${menu.id}`}>
                      <button className="text-blue-600 hover:underline">Edit</button>
                    </Link>
                    <button
                      onClick={() => handleDelete(menu.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminMenus;
