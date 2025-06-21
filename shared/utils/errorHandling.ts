import type { PostgrestError } from '@supabase/supabase-js';

/**
 * Utility functions for handling Supabase errors
 */

export interface SupabaseErrorDetails {
  code: string;
  message: string;
  details?: string;
  hint?: string;
}

/**
 * Formats a Supabase error for logging
 */
export const formatSupabaseError = (error: PostgrestError | Error | any): string => {
  if (error?.message) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'Unknown error occurred';
};

/**
 * Logs a Supabase error with detailed information
 */
export const logSupabaseError = (context: string, error: PostgrestError | Error | any): void => {
  const errorMessage = formatSupabaseError(error);
  console.error(`${context}:`, errorMessage);
  
  // Log additional details if available
  if (error && typeof error === 'object') {
    console.error(`${context} details:`, {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
      stack: error.stack
    });
  }
};

/**
 * Handles common Supabase error codes
 */
export const handleSupabaseError = (error: PostgrestError | Error | any): string => {
  if (!error) return 'Unknown error occurred';
  
  // Handle specific error codes
  switch (error.code) {
    case 'PGRST116':
      return 'No data found';
    case '23505':
      if (error.message?.includes('organizations_slug_key')) {
        return 'Un organisation avec cet identifiant existe déjà. Veuillez choisir un autre nom.';
      }
      return 'Une contrainte unique a été violée. Veuillez vérifier vos données.';
    case '23503':
      return 'Référence invalide. Veuillez vérifier vos données.';
    case '23514':
      return 'Contrainte de validation violée. Veuillez vérifier vos données.';
    case '42P01':
      return 'Table non trouvée. Erreur de configuration.';
    case '42501':
      return 'Permission refusée. Vous n\'avez pas les droits nécessaires.';
    default:
      return error.message || 'Une erreur inattendue s\'est produite';
  }
};

/**
 * Creates a user-friendly error message
 */
export const createUserFriendlyError = (context: string, error: PostgrestError | Error | any): string => {
  const baseMessage = handleSupabaseError(error);
  return `${context}: ${baseMessage}`;
};

export const handleApiError = (error: any, setErrorMsg: (msg: string | null) => void) => {
  console.error('API Error:', error);
  
  let message = 'An unexpected error occurred';
  
  if (error?.message) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  } else if (error?.error_description) {
    message = error.error_description;
  }
  
  setErrorMsg(message);
};

export const getUserFriendlyErrorMessage = (error: any): string => {
  if (error?.message) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.error_description) {
    return error.error_description;
  }
  
  return 'An unexpected error occurred';
}; 