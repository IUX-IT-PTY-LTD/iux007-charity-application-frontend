// src/components/admin/profile/AccountSecuritySection.jsx

'use client';

import { useState } from 'react';
import { Key, Shield, Clock, Smartphone, Eye, EyeOff, Lock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';

// Import permission hooks
import { useAdminPermissions } from '@/api/hooks/useModulePermissions';

const AccountSecuritySection = () => {
  const adminPermissions = useAdminPermissions();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(true);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordErrors, setPasswordErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters long';
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = async () => {
    // Check edit permissions before allowing password changes
    if (!adminPermissions.canEdit) {
      toast.error("You don't have permission to change your password");
      return;
    }

    if (!validatePasswordForm()) return;

    setLoading(true);
    try {
      // Simulate API call - in real implementation, use protected service
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordErrors({});
      toast.success('Password changed successfully');
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle2FA = async (enabled) => {
    // Check edit permissions before allowing 2FA changes
    if (!adminPermissions.canEdit) {
      toast.error("You don't have permission to modify security settings");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call - in real implementation, use protected service
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setTwoFactorEnabled(enabled);
      toast.success(`Two-factor authentication ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update two-factor authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSessionTimeout = async (enabled) => {
    // Check edit permissions before allowing session timeout changes
    if (!adminPermissions.canEdit) {
      toast.error("You don't have permission to modify security settings");
      return;
    }

    try {
      // Simulate API call - in real implementation, use protected service
      await new Promise((resolve) => setTimeout(resolve, 500));

      setSessionTimeout(enabled);
      toast.success(`Session timeout ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update session timeout setting');
    }
  };

  // Show access denied if user has no admin permissions
  if (!adminPermissions.hasAccess) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Manage your account security preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <Lock className="h-4 w-4" />
              <AlertTitle>Access Denied</AlertTitle>
              <AlertDescription>
                You don't have access to security settings. Please contact an administrator.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show view permission denied if user can't view
  if (!adminPermissions.canView) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Manage your account security preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <Lock className="h-4 w-4" />
              <AlertTitle>View Permission Required</AlertTitle>
              <AlertDescription>
                You don't have permission to view security settings.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isReadOnly = !adminPermissions.canEdit;

  return (
    <div className="space-y-6">
      {/* Show permission warning for read-only access */}
      {isReadOnly && (
        <Alert>
          <Lock className="h-4 w-4" />
          <AlertTitle>Read-Only Access</AlertTitle>
          <AlertDescription>
            You can view security settings but cannot make changes. Contact an administrator to
            modify security preferences.
          </AlertDescription>
        </Alert>
      )}

      {/* Change Password Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Change Password
            {isReadOnly && <span className="text-orange-600 text-sm">(Read-only)</span>}
          </CardTitle>
          <CardDescription>
            Update your account password regularly for better security
            {isReadOnly && <span className="text-orange-600 ml-1">- View-only access</span>}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative mt-1">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                  placeholder="Enter your current password"
                  className={passwordErrors.currentPassword ? 'border-red-500' : ''}
                  disabled={isReadOnly}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  disabled={isReadOnly}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {passwordErrors.currentPassword && (
                <p className="text-sm text-red-500 mt-1">{passwordErrors.currentPassword}</p>
              )}
            </div>

            <div>
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative mt-1">
                <Input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                  }
                  placeholder="Enter your new password"
                  className={passwordErrors.newPassword ? 'border-red-500' : ''}
                  disabled={isReadOnly}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={isReadOnly}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {passwordErrors.newPassword && (
                <p className="text-sm text-red-500 mt-1">{passwordErrors.newPassword}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative mt-1">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                  placeholder="Confirm your new password"
                  className={passwordErrors.confirmPassword ? 'border-red-500' : ''}
                  disabled={isReadOnly}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isReadOnly}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {passwordErrors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">{passwordErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            {isReadOnly ? (
              <Button
                disabled
                className="opacity-50 cursor-not-allowed"
                title="You don't have permission to change passwords"
              >
                <Lock className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            ) : (
              <Button
                onClick={handleChangePassword}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Changing...' : 'Change Password'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Two-Factor Authentication
            {isReadOnly && <span className="text-orange-600 text-sm">(Read-only)</span>}
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
            {isReadOnly && <span className="text-orange-600 ml-1">- View-only access</span>}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">Enable Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">
                Secure your account with 2FA using an authenticator app
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isReadOnly && <Lock className="h-4 w-4 text-gray-400" />}
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={handleToggle2FA}
                disabled={loading || isReadOnly}
              />
            </div>
          </div>

          {twoFactorEnabled && (
            <Alert className="mt-4">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Two-factor authentication is enabled. You'll need to provide a verification code
                from your authenticator app when signing in.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Security Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Preferences
            {isReadOnly && <span className="text-orange-600 text-sm">(Read-only)</span>}
          </CardTitle>
          <CardDescription>
            Manage additional security settings
            {isReadOnly && <span className="text-orange-600 ml-1">- View-only access</span>}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">Automatic Session Timeout</p>
              <p className="text-sm text-muted-foreground">
                Automatically log out after 30 minutes of inactivity
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isReadOnly && <Lock className="h-4 w-4 text-gray-400" />}
              <Switch
                checked={sessionTimeout}
                onCheckedChange={handleToggleSessionTimeout}
                disabled={isReadOnly}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Security Activity
            </p>
            <div className="space-y-2">
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                <p className="text-sm font-medium">Last login</p>
                <p className="text-sm text-muted-foreground">
                  Today at 2:30 PM from Chrome browser
                </p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                <p className="text-sm font-medium">Password last changed</p>
                <p className="text-sm text-muted-foreground">2 months ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSecuritySection;
