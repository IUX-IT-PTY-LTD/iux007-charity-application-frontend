'use client';
import Link from 'next/link';
import React from 'react';
import { FaHistory } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { GrUpdate } from 'react-icons/gr';
import { TbPasswordUser } from 'react-icons/tb';
import { LiaSignOutAltSolid } from 'react-icons/lia';

const LeftSidebar = () => {
  // hightlight active link
  const [currentLink, setCurrentLink] = React.useState('');
  React.useEffect(() => {
    setCurrentLink(window.location.pathname);
  }, []);
  return (
    <div>
      {/* dashboard, update password, donation history, update profile, logout */}
      <div className="bg-white rounded-lg p-5 shadow-lg h-screen">
        {/* profile details */}
        <div className="flex items-center space-x-4">
          <img src="/assets/img/avatar.jpg" alt="" className="w-12 h-12 rounded-full" />
          <div>
            <h4 className="text-lg font-semibold text-secondary">John Doe</h4>
            <p className="text-base text-body-color dark:text-dark-6">CEO</p>
          </div>
        </div>

        <hr className="my-4" />
        <ul className="space-y-4 flex flex-col justify-between items-start h-[calc(100%-5.5rem)]">
          <div className="top space-y-4 flex flex-col justify-between items-start w-full">
            <li className="w-full">
              <Link
                href="/dashboard"
                onClick={() => {
                  setCurrentLink('/dashboard');
                }}
                className={`text-gray-600 w-full flex justify-start items-center gap-2 hover:text-primary ${currentLink === '/dashboard' ? 'text-primary font-bold' : ''}`}
              >
                <MdDashboard className="inline text-2xl" /> Dashboard
              </Link>
            </li>
            <hr />

            <li className="w-full">
              <Link
                href="/donation-history"
                onClick={() => {
                  setCurrentLink('/donation-history');
                }}
                className={`text-gray-600 w-full flex justify-start items-center gap-2 hover:text-primary ${currentLink === '/donation-history' ? 'text-primary font-bold' : ''}`}
              >
                <FaHistory className="inline text-2xl" /> Donation History
              </Link>
            </li>
            <hr />
            <li className="w-full">
              <Link
                href="/update-profile"
                onClick={() => {
                  setCurrentLink('/update-profile');
                }}
                className={`text-gray-600 w-full flex justify-start items-center gap-2 hover:text-primary ${currentLink === '/update-profile' ? 'text-primary font-bold' : ''}`}
              >
                <GrUpdate className="inline text-2xl" /> Update Profile
              </Link>
            </li>
            <hr />
            <li className="w-full">
              <Link
                href="/change-password"
                onClick={() => {
                  setCurrentLink('/change-password');
                }}
                className={`text-gray-600 w-full flex justify-start items-center gap-2 hover:text-primary ${currentLink === '/change-password' ? 'text-primary font-bold' : ''}`}
              >
                <TbPasswordUser className="inline text-2xl" /> Update Password
              </Link>
            </li>
          </div>
          <li>
            <Link href="/login" className="text-gray-600 hover:text-primary">
              <LiaSignOutAltSolid className="inline text-2xl" /> Logout
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LeftSidebar;
