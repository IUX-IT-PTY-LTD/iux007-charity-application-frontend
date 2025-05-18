'use client';

import React, { useState, useEffect } from 'react';
import AdminPageHeader from '@/components/admin/header';
import { useRouter } from 'next/navigation';

const AdminWebsiteContent = () => {
  const [logo, setLogo] = useState('');
  const [banner, setBanner] = useState('');
  const [aboutInfo, setAboutInfo] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isAboutSectionVisible, setIsAboutSectionVisible] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const router = useRouter();

  // Fetch website content (mock data or API)
  useEffect(() => {
    // Example mock data for now
    const mockData = {
      logo: 'logo.png',
      banner: 'banner.jpg',
      aboutInfo: 'Welcome to our donation website...',
      contactInfo: 'Email: contact@example.com, Phone: 123-456-7890',
      isBannerVisible: true,
      isAboutSectionVisible: true,
      blogs: [
        {
          id: 1,
          title: 'How Donations Help',
          content: 'Blog content here...',
          createdAt: '2023-10-01',
        },
        { id: 2, title: 'Our Mission', content: 'Blog content here...', createdAt: '2023-11-15' },
      ],
    };

    setLogo(mockData.logo);
    setBanner(mockData.banner);
    setAboutInfo(mockData.aboutInfo);
    setContactInfo(mockData.contactInfo);
    setIsBannerVisible(mockData.isBannerVisible);
    setIsAboutSectionVisible(mockData.isAboutSectionVisible);
    setBlogs(mockData.blogs);
  }, []);

  const handleDeleteBlog = (id) => {
    // Example: Delete blog from state (replace with API request for real deletion)
    setBlogs(blogs.filter((blog) => blog.id !== id));
  };

  const handleUpdateContent = async () => {
    // API call to update website content (logo, banner, about info, etc.)
    const updatedData = {
      logo,
      banner,
      aboutInfo,
      contactInfo,
      isBannerVisible,
      isAboutSectionVisible,
      blogs,
    };

    console.log('Website Content Updated:', updatedData);

    // Redirect to the website content page or show success message
    router.push('/admin/website-content');
  };

  return (
    <div className="h-screen overflow-y-auto">
      <AdminPageHeader title="Website Content Management" />

      <div className="p-4 bg-white shadow rounded-md">
        <h2 className="text-2xl font-semibold mb-4">Website Logo and Banner</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Logo</label>
          <input
            type="file"
            onChange={(e) => setLogo(URL.createObjectURL(e.target.files[0]))}
            className="mt-1 p-2 border border-gray-300 rounded"
          />
          <div className="mt-2">
            <img src={logo} alt="Logo" className="h-16 w-auto" />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Banner</label>
          <input
            type="file"
            onChange={(e) => setBanner(URL.createObjectURL(e.target.files[0]))}
            className="mt-1 p-2 border border-gray-300 rounded"
          />
          <div className="mt-2">
            <img src={banner} alt="Banner" className="h-32 w-auto" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Website Sections</h2>
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">Banner Visibility</label>
          <input
            type="checkbox"
            checked={isBannerVisible}
            onChange={() => setIsBannerVisible(!isBannerVisible)}
            className="mt-1 ml-2"
          />
        </div>
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">About Section Visibility</label>
          <input
            type="checkbox"
            checked={isAboutSectionVisible}
            onChange={() => setIsAboutSectionVisible(!isAboutSectionVisible)}
            className="mt-1 ml-2"
          />
        </div>

        <h2 className="text-2xl font-semibold mb-4">About & Contact Info</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">About Info</label>
          <textarea
            value={aboutInfo}
            onChange={(e) => setAboutInfo(e.target.value)}
            rows="4"
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Contact Info</label>
          <textarea
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            rows="4"
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <h2 className="text-2xl font-semibold mb-4">Blog Management</h2>
        <div className="mb-4">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => router.push('/admin/blogs/create')}
          >
            Add New Blog
          </button>
        </div>

        <div className="overflow-x-auto mb-4">
          <table className="min-w-full table-auto bg-white rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Created At</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id}>
                  <td className="px-4 py-2 border">{blog.title}</td>
                  <td className="px-4 py-2 border">{blog.createdAt}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => router.push(`/admin/blogs/edit/${blog.id}`)}
                      className="text-blue-500"
                    >
                      Edit
                    </button>{' '}
                    |{' '}
                    <button onClick={() => handleDeleteBlog(blog.id)} className="text-red-500">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleUpdateContent}
            className="bg-blue-500 text-white py-2 px-6 rounded"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminWebsiteContent;
