'use client';

import React, { useState, useEffect } from 'react';
import AdminPageHeader from '@/components/admin-page-header';
import Link from 'next/link';

const AdminSlidersList = () => {
  const [sliders, setSliders] = useState([]);

  // Fetch sliders from the API or mock data
  useEffect(() => {
    // Replace this mock data with your API call
    const fetchSliders = async () => {
      // Mock data for now
      const mockSliders = [
        {
          id: 1,
          title: 'Slider 1',
          description: 'Description for slider 1',
          ordering: 1,
          status: 1,
          image: 'data:image/png;base64,...', // Mock Base64 image data
        },
        {
          id: 2,
          title: 'Slider 2',
          description: 'Description for slider 2',
          ordering: 2,
          status: 1,
          image: 'data:image/png;base64,...', // Mock Base64 image data
        },
      ];
      setSliders(mockSliders);
    };

    fetchSliders();
  }, []);

  const handleDelete = (id) => {
    // Add API call for deleting the slider
    // After successful deletion, remove it from the list
    setSliders(sliders.filter((slider) => slider.id !== id));
    console.log('Slider deleted:', id);
  };

  return (
    <div>
      <AdminPageHeader title="Sliders" />
      <div className="p-4">
        <Link href="/admin/slider/create">
          <span className="bg-blue-500 text-white py-2 px-4 rounded">Create New Slider</span>
        </Link>
      </div>

      <div className="overflow-x-auto p-4">
        <table className="min-w-full table-auto bg-white rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sliders.map((slider) => (
              <tr key={slider.id}>
                <td className="px-4 py-2 border">{slider.title}</td>
                <td className="px-4 py-2 border">{slider.description}</td>
                <td className="px-4 py-2 border">{slider.status === 1 ? 'Active' : 'Inactive'}</td>
                <td className="px-4 py-2 border">
                  <Link href={`/admin/sliders/edit/${slider.id}`} className="text-blue-500">
                    Edit
                  </Link>{' '}
                  |{' '}
                  <button onClick={() => handleDelete(slider.id)} className="text-red-500">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSlidersList;
