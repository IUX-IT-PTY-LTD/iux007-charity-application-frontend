'use client';

import { useState, useCallback, useRef } from 'react';

export const useRecaptcha = () => {
  const [token, setToken] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState(null);
  const recaptchaRef = useRef(null);

  const handleVerify = useCallback((recaptchaToken) => {
    if (recaptchaToken) {
      setToken(recaptchaToken);
      setIsVerified(true);
      setError(null);
    }
  }, []);

  const handleExpire = useCallback(() => {
    setToken(null);
    setIsVerified(false);
    setError('reCAPTCHA expired. Please verify again.');
  }, []);

  const handleError = useCallback(() => {
    setToken(null);
    setIsVerified(false);
    setError('reCAPTCHA verification failed. Please try again.');
  }, []);

  const reset = useCallback(() => {
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
    setToken(null);
    setIsVerified(false);
    setError(null);
  }, []);

  const validateRecaptcha = useCallback(() => {
    if (!isVerified || !token) {
      setError('Please complete the reCAPTCHA verification.');
      return false;
    }
    return true;
  }, [isVerified, token]);

  return {
    recaptchaRef,
    token,
    isVerified,
    error,
    handleVerify,
    handleExpire,
    handleError,
    reset,
    validateRecaptcha,
    setError
  };
};