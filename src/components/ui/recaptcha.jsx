'use client';

import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { cn } from '@/lib/utils';

const Recaptcha = forwardRef(({ 
  className, 
  onVerify, 
  onExpire, 
  onError,
  theme = 'light',
  size = 'normal',
  sitekey,
  ...props 
}, ref) => {
  const recaptchaRef = useRef(null);

  // Get site key from environment or prop
  const siteKey = sitekey || process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    },
    getValue: () => {
      if (recaptchaRef.current) {
        return recaptchaRef.current.getValue();
      }
      return null;
    },
    getWidgetId: () => {
      if (recaptchaRef.current) {
        return recaptchaRef.current.getWidgetId();
      }
      return null;
    },
    execute: () => {
      if (recaptchaRef.current) {
        return recaptchaRef.current.execute();
      }
      return null;
    }
  }));

  const handleChange = useCallback((token) => {
    if (onVerify) {
      onVerify(token);
    }
  }, [onVerify]);

  const handleExpired = useCallback(() => {
    if (onExpire) {
      onExpire();
    }
  }, [onExpire]);

  const handleError = useCallback(() => {
    if (onError) {
      onError();
    }
  }, [onError]);

  if (!siteKey) {
    console.warn('reCAPTCHA site key is not provided. Please set NEXT_PUBLIC_RECAPTCHA_SITE_KEY in your environment variables.');
    return (
      <div className={cn(
        'p-4 border border-yellow-300 bg-yellow-50 text-yellow-800 rounded-md text-sm',
        className
      )}>
        reCAPTCHA is not configured. Please contact the administrator.
      </div>
    );
  }

  return (
    <div className={cn('flex justify-center', className)} {...props}>
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={siteKey}
        onChange={handleChange}
        onExpired={handleExpired}
        onError={handleError}
        theme={theme}
        size={size}
      />
    </div>
  );
});

Recaptcha.displayName = 'Recaptcha';

export { Recaptcha };