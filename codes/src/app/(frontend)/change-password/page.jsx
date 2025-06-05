'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { authService } from '@/api/services/app/authService';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Loader from '@/components/shared/loader';

export default function ChangePassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);
      const passwordData = {
        current_password: data.currentPassword,
        new_password: data.newPassword,
        password_confirmation: data.confirmPassword,
      };

      console.log(passwordData);
      const response = await authService.changePassword(
        data.currentPassword,
        data.newPassword,
        data.confirmPassword
      );
      console.log(response);

      if (response.status === 'success') {
        toast.success(response.message);
        e.target.reset();
        router.push('/profile');
      } else if (response.status === 'failed' && response.error?.description) {
        console.log(response.error.description);
        toast.error(response.error.description);
      } else {
        toast.error('An error occurred while changing the password');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <ToastContainer />
      {isLoading && <Loader title="Changing Password" />}
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Password</label>
              <div className="relative">
                <input
                  name="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="Enter your current password"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-1 rounded-lg border-2 border-blue focus:border-primary focus:ring focus:ring-primary/20 transition duration-200 text-gray-700 text-base outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <div className="relative">
                <input
                  name="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Enter your new password"
                  required
                  minLength={8}
                  maxLength={20}
                  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$"
                  disabled={isLoading}
                  className="w-full px-4 py-1 rounded-lg border-2 border-blue focus:border-primary focus:ring focus:ring-primary/20 transition duration-200 text-gray-700 text-base outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm New Password</label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  maxLength={20}
                  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$"
                  placeholder="Confirm your new password"
                  disabled={isLoading}
                  className="w-full px-4 py-1 rounded-lg border-2 border-blue focus:border-primary focus:ring focus:ring-primary/20 transition duration-200 text-gray-700 text-base outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
