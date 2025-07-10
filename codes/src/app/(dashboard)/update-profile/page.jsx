// import LeftSidebar from '@/components/dashboard-components/sidebar';
import React from 'react';

const ChangePassword = () => {
  return (
    <div className="change-profile">
      <form className="space-y-4">
        <div className="mb-8">
          <h3 className="text-gray-800 text-3xl font-extrabold">Update Profile</h3>
          <p className="text-gray-500 text-sm mt-4 leading-relaxed">
            Update your profile to keep your account secure.
          </p>
        </div>

        {/* profile image */}
        <div>
          <label className="text-gray-800 text-sm mb-2 block">Profile Image</label>
          <div className="relative flex items-center">
            <input
              name="profile-image"
              type="file"
              required
              className="w-full bg-white text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
            />
          </div>
        </div>

        {/* name */}
        <div>
          <label className="text-gray-800 text-sm mb-2 block">Name</label>
          <div className="relative flex items-center">
            <input
              name="name"
              type="text"
              required
              className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
              placeholder="Enter your name"
            />
          </div>
        </div>

        {/* address */}
        <div>
          <label className="text-gray-800 text-sm mb-2 block">Address</label>
          <div className="relative flex items-center">
            <input
              name="address"
              type="text"
              required
              className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
              placeholder="Enter your address"
            />
          </div>
        </div>

        {/* card info */}
        <div>
          <label className="text-gray-800 text-sm mb-2 block">Card Info</label>
          {/* card number, expire date, cvv */}
          <div className="relative flex gap-4 items-center">
            <input
              name="card-number"
              type="number"
              required
              className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
              placeholder="Enter your card number"
            />

            <input
              name="current-password"
              type="date"
              required
              className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
              placeholder="Enter expire date"
            />

            <input
              name="cvv"
              type="number"
              required
              className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
              placeholder="Enter cvv"
            />
          </div>
        </div>

        <div>
          <button type="submit" className="bg-primary text-white px-5 py-2 rounded-md">
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
