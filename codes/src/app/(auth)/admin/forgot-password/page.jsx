'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';
import ForgotPasswordCard from '@/components/auth/admin/forgot-password/ForgotPasswordCard';
import '@/components/auth/admin/Style.css';

const AdminForgotPasswordPage = () => {
  return (
    <>
      <Toaster position="top-right" />
      <div className="glassmorphic-container">
        <div className="gradient-bg">
          <div className="gradient-circle circle-1"></div>
          <div className="gradient-circle circle-2"></div>
          <div className="gradient-circle circle-3"></div>
        </div>
        <ForgotPasswordCard />
      </div>
    </>
  );
};

export default AdminForgotPasswordPage;
