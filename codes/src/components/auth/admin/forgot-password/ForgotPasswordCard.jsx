import React, { useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const ForgotPasswordCard = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const version = process.env.NEXT_PUBLIC_API_VERSION;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`${baseUrl}/admin/${version}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.status === 'success') {
        setSuccess(true);
        toast.success(data.message || 'Password reset instructions sent to your email');
      } else {
        setError(data.message || 'Failed to process request');
        toast.error(data.message || 'Failed to process request');
      }
    } catch (err) {
      setLoading(false);
      setError('An error occurred. Please try again later.');
      toast.error('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="glass-card">
      <div className="card-content">
        <div className="logo-container">
          <div className="logo-circle">
            <Image 
              src="/assets/img/logo.svg" 
              alt="Logo" 
              width={32} 
              height={32}
              className="logo"
            />
          </div>
        </div>

        <h1 className="title">Reset Password</h1>
        <p className="subtitle">
          {success 
            ? "Check your email for reset instructions" 
            : "Enter your email and we'll send you instructions"}
        </p>

        {!success ? (
          <form onSubmit={handleSubmit} className="w-full">
            <div className="input-group">
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                type="email"
                className="input-field"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Sending...' : (
                <>
                  Reset Password
                  <ArrowRight className="arrow-icon" size={18} />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="success-message">
            <div className="success-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#42e695" fillOpacity="0.2" />
                <path d="M16.5 8.5L10.5 14.5L7.5 11.5" stroke="#42e695" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="success-text">We've sent password reset instructions to your email.</p>
            <p className="success-subtitle">Please check your inbox (and spam folder) for further instructions.</p>
            <button
              onClick={() => setSuccess(false)}
              className="secondary-button"
            >
              <ArrowLeft className="arrow-icon" size={18} />
              Try another email
            </button>
          </div>
        )}

        <div className="back-to-login">
          <Link href="/admin/login" className="back-link">
            <ArrowLeft size={14} className="mr-2" />
            Back to login
          </Link>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordCard;