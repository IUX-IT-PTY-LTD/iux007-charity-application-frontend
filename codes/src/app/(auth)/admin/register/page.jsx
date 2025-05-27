'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';
import RegisterCard from '@/components/auth/admin/register/RegisterCard';
import '@/components/auth/admin/Style.css';

const AdminRegisterPage = () => {
  return (
    <>
      <Toaster position="top-right" />
      <div className="glassmorphic-container">
        <div className="gradient-bg">
          <div className="gradient-circle circle-1"></div>
          <div className="gradient-circle circle-2"></div>
          <div className="gradient-circle circle-3"></div>
        </div>
        <RegisterCard />
      </div>
    </>
  );
};

export default AdminRegisterPage;
