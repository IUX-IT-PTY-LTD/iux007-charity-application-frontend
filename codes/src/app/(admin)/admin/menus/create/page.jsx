'use client';

import AdminPageHeader from '@/components/admin-page-header';
import React, { useState } from 'react';

const AdminMenus = () => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    ordering: 1,
    status: 1,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted data:', formData);
    // Send to backend API here
  };

  return (
    <div>
      <AdminPageHeader title="Create Menu" />

      <div className="p-6 w-2/3 mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
              Menu Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Blog"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="slug">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              id="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. blog"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="ordering">
              Ordering
            </label>
            <input
              type="number"
              name="ordering"
              id="ordering"
              value={formData.ordering}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={1}
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="status"
              id="status"
              checked={formData.status === 1}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="status" className="text-sm text-gray-700">
              Active
            </label>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded shadow"
          >
            Save Menu
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminMenus;
