'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const donationData = [
  { month: 'Jan', donations: 4000 },
  { month: 'Feb', donations: 3000 },
  { month: 'Mar', donations: 5000 },
  { month: 'Apr', donations: 4000 },
  { month: 'May', donations: 6000 },
  { month: 'Jun', donations: 7000 },
];

const eventData = [
  { event: 'Blood Camp', participants: 150 },
  { event: 'Charity Run', participants: 200 },
  { event: 'Food Drive', participants: 180 },
];

const AdminDashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('admin_token');
    console.log(token);

    if (!token) {
      router.push('/admin');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Updated Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Admin Dashboard</h1>

        {/* Stats Summary */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700">Total Donations</h3>
            <p className="text-3xl text-blue-600 font-bold mt-2">$34,200</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700">Total Events</h3>
            <p className="text-3xl text-green-600 font-bold mt-2">12</p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700">Total Donors</h3>
            <p className="text-3xl text-purple-600 font-bold mt-2">528</p>
          </div>
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Monthly Donation Trend</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={donationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="donations" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Event Participation</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={eventData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="event" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="participants" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
