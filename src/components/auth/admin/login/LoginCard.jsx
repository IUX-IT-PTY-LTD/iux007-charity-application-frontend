import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

// Import auth service
import { login } from '@/api/services/admin/authService';

// Import settings service
import { getAllSettings, getSettingByKey } from '@/api/services/admin/settingsService';

const LoginCard = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Settings state
  const [companyLogo, setCompanyLogo] = useState('/assets/img/logo.svg');
  const [companyName, setCompanyName] = useState('Admin Panel');
  const [settingsLoading, setSettingsLoading] = useState(true);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Fetch company settings
  const fetchCompanySettings = async () => {
    try {
      const response = await getAllSettings();
      
      if (response.status === 'success' && response.data) {
        // Get company logo
        const logoSetting = getSettingByKey(response.data, 'company_logo');
        if (logoSetting && logoSetting.value) {
          setCompanyLogo(logoSetting.value);
        }

        // Get company name
        const nameSetting = getSettingByKey(response.data, 'company_name');
        if (nameSetting && nameSetting.value) {
          setCompanyName(nameSetting.value);
        }
      }
    } catch (error) {
      console.warn('Failed to load company settings:', error);
      // Keep default values if settings fail to load
    } finally {
      setSettingsLoading(false);
    }
  };

  // Load settings on component mount
  useEffect(() => {
    fetchCompanySettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await login(email, password);

      // Handle successful login
      if (data.status === 'success') {
        // Show success toast
        toast.success('Login successful!');

        // Redirect to dashboard
        router.push('/admin/dashboard');
      } else {
        // This should not happen with the updated service, but just in case
        setError(data.message || 'Invalid credentials');
        toast.error(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again later.');
      toast.error(err.message || 'An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
      <div className="card-content">
        <div className="logo-container">
          <div className="logo-circle">
            {settingsLoading ? (
              <div className="animate-pulse bg-gray-200 rounded-full w-8 h-8"></div>
            ) : (
              <Image 
                src={companyLogo} 
                alt={`${companyName} Logo`} 
                width={32} 
                height={32} 
                className="logo"
                onError={(e) => {
                  e.target.src = '/assets/img/logo.svg';
                }}
              />
            )}
          </div>
        </div>

        <h1 className="title">
          {settingsLoading ? (
            <div className="animate-pulse bg-gray-200 rounded h-8 w-48 mx-auto"></div>
          ) : (
            `Welcome to ${companyName}`
          )}
        </h1>
        <p className="subtitle">Please enter your details to sign in to your admin account.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input-field"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="input-field pr-10"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                tabIndex="-1"
              >
                {showPassword ? (
                  <EyeOff className="password-icon" size={18} />
                ) : (
                  <Eye className="password-icon" size={18} />
                )}
              </button>
            </div>
          </div>

          <div className="remember-me">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <span className="checkmark"></span>
              <span>Remember me</span>
            </label>
            <Link href="/admin/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? (
              'Signing in...'
            ) : (
              <>
                Sign in
                <ArrowRight className="arrow-icon" size={18} />
              </>
            )}
          </button>
        </form>

        {/* <div className="divider">
          <span>OR</span>
        </div> */}

        {/* <div className="social-logins">
          <button className="social-button google-button">
            <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18">
              <path
                fill="currentColor"
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              />
            </svg>
            Continue with Google
          </button>
        </div> */}

        {/* <div className="create-account">
          <p>
            Don't have an account?{' '}
            <Link href="/admin/register" className="create-link">
              Create Account
            </Link>
          </p>
        </div> */}

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default LoginCard;
