import { useState } from 'react';

/**
 * Custom hook for error management
 * Provides error state and error handling functions
 */
export const useErrors = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setError = (field: string, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  };

  const clearError = (field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  const hasErrors = () => {
    return Object.keys(errors).length > 0;
  };

  return {
    errors,
    setError,
    clearError,
    clearAllErrors,
    hasErrors,
  };
};

/**
 * Custom hook for authentication error management
 * Provides auth error state and error handling functions
 */
export const useAuthError = () => {
  const [authError, setAuthError] = useState<any>(null);

  const handleAuthError = (error: any) => {
    const errorObj = {
      type: 'auth',
      message: error?.message || 'Authentication error occurred',
      statusCode: error?.status || 500,
      details: error,
    };
    setAuthError(errorObj);
    return errorObj;
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  const getUserFriendlyAuthError = () => {
    if (!authError) return '';
    
    // Map common auth errors to user-friendly messages
    const errorMessages: Record<string, string> = {
      'Invalid login credentials': 'Invalid email or password',
      'Email not confirmed': 'Please check your email and confirm your account',
      'Too many requests': 'Too many login attempts. Please try again later',
      'User not found': 'No account found with this email address',
    };

    return errorMessages[authError.message] || authError.message;
  };

  return {
    authError,
    handleAuthError,
    clearAuthError,
    getUserFriendlyAuthError,
  };
}; 