'use client';

import React from 'react';
import Link from 'next/link';
import AdminPageHeader from '@/components/admin-page-header';

const AdminEvents = () => {
  // Sample event data
  const events = [
    {
      id: 1,
      title: 'Winter Clothes Distribution',
      description: 'Providing warm clothes to the needy.',
      start_date: '2025-01-01',
      end_date: '2025-01-15',
      price: 100,
      target_amount: 50000,
      is_fixed_donation: true,
      location: 'Dhaka',
      status: 1,
      is_featured: true,
      featured_image: '/images/events/winter-clothes.jpg',
    },
    {
      id: 2,
      title: 'Flood Relief Fund',
      description: 'Supporting flood victims in Sylhet.',
      start_date: '2025-03-01',
      end_date: '2025-03-31',
      price: 0,
      target_amount: 100000,
      is_fixed_donation: false,
      location: 'Sylhet',
      status: 0,
      is_featured: false,
      featured_image: '/images/events/flood-relief.jpg',
    },
  ];

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this event?')) {
      console.log('Deleting event with id:', id);
      // Add delete API call here
    }
  };

  return (
    <div>
      <AdminPageHeader title="Events" />

      <div className="p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700">All Events</h2>
        <Link href="/admin/events/create">
          <span className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded shadow">
            + Add Event
          </span>
        </Link>
      </div>

      <div className="px-4 pb-6">
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Start - End</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Target</th>
                <th className="px-4 py-3">Fixed</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr key={event.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{event.title}</td>
                  <td className="px-4 py-3">
                    {event.start_date} → {event.end_date}
                  </td>
                  <td className="px-4 py-3">{event.price || 'N/A'}</td>
                  <td className="px-4 py-3">{event.target_amount}</td>
                  <td className="px-4 py-3">{event.is_fixed_donation ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3">{event.location}</td>
                  <td className="px-4 py-3">
                    {event.is_featured ? (
                      <span className="text-green-600 font-medium">Yes</span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${event.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}
                    >
                      {event.status ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <img
                      src={event.featured_image}
                      alt="Featured"
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Link href={`/admin/events/edit/${event.id}`}>
                      <button className="text-blue-600 hover:underline">Edit</button>
                    </Link>
                    <button
                      onClick={() => handleDelete(event.id)}
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

export default AdminEvents;
