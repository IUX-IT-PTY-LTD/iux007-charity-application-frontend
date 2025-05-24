'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';
import LoginCard from '@/components/auth/admin/login/LoginCard';
import '@/components/auth/admin/login/Login.css';

const AdminLoginPage = () => {
  return (
    <>
      <Toaster position="top-right" />
      <div className="glassmorphic-container">
        <div className="gradient-bg">
          <div className="gradient-circle circle-1"></div>
          <div className="gradient-circle circle-2"></div>
          <div className="gradient-circle circle-3"></div>
        </div>
        <LoginCard />
      </div>
    </>
  );
};

export default AdminLoginPage;