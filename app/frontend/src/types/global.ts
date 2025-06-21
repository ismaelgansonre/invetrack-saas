import React from 'react';

// ============================================================================
// TYPES DE BASE
// ============================================================================

/**
 * Props de base pour tous les composants React
 */
export interface BaseProps {
  children?: React.ReactNode;
  className?: string;
}

/**
 * Props pour les composants de layout
 */
export interface LayoutProps {
  children: React.ReactNode;
}

// ============================================================================
// TYPES POUR LES FORMULAIRES
// ============================================================================

/**
 * Props de base pour tous les formulaires
 */
export interface FormProps {
  initialData?: any;
  onSubmit: (data: any, setError?: (error: any) => void) => Promise<void>;
  onCancel: () => void;
  isNew?: boolean;
}

/**
 * Props pour les champs de formulaire
 */
export interface FormFieldProps {
  name: string;
  label: string;
  rules?: any;
  type?: string;
  control: any;
  errors: any;
  options?: Array<{ value: string; label: string }>;
}

/**
 * Props pour les sections de formulaire
 */
export interface FormSectionProps {
  section: {
    title: string;
    fields: FormFieldProps[];
  };
  control: any;
  errors: any;
  suppliers?: any[];
  isMobile?: boolean;
}

/**
 * Props pour les actions de formulaire
 */
export interface FormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  isNew: boolean;
}

// ============================================================================
// TYPES POUR LES MODALES
// ============================================================================

/**
 * Props de base pour toutes les modales
 */
export interface ModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

/**
 * Props pour les modales de confirmation de suppression
 */
export interface DeleteConfirmationProps extends ModalProps {
  productName?: string;
  supplierName?: string;
  customMessage?: string;
}

// ============================================================================
// TYPES POUR LES NOTIFICATIONS
// ============================================================================

/**
 * Props pour les notifications
 */
export interface NotificationProps {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

// ============================================================================
// TYPES POUR LES FILTRES
// ============================================================================

/**
 * Props pour les filtres
 */
export interface FilterProps {
  selectedCategory?: string;
  onCategoryChange: (category: string) => void;
}

// ============================================================================
// TYPES POUR LES ORGANISATIONS
// ============================================================================

/**
 * Interface pour les organisations avec rôle utilisateur
 */
export interface OrganizationWithRole {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  userRole?: 'admin' | 'member';
}

// ============================================================================
// TYPES POUR LES ERREURS
// ============================================================================

/**
 * Interface pour les erreurs d'API
 */
export interface ApiError {
  message: string;
  statusCode?: number;
  details?: any;
}

/**
 * Interface pour les erreurs d'authentification
 */
export interface AuthError extends ApiError {
  type: 'auth';
}

// ============================================================================
// TYPES POUR LES DONNÉES
// ============================================================================

/**
 * Interface pour les données de profil utilisateur
 */
export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  organization_id?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Interface pour les données de session
 */
export interface SessionData {
  user: UserProfile;
  access_token: string;
  refresh_token: string;
}

// ============================================================================
// TYPES UTILITAIRES
// ============================================================================

/**
 * Type pour les fonctions de callback
 */
export type Callback<T = void> = (data?: T) => void;

/**
 * Type pour les fonctions asynchrones
 */
export type AsyncCallback<T = void> = (data?: T) => Promise<void>;

/**
 * Type pour les états de chargement
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Type pour les statuts de commande
 */
export type OrderStatus = 'pending' | 'completed' | 'cancelled';

// ============================================================================
// TYPES POUR LES PROPS DE COMPOSANTS SPÉCIFIQUES
// ============================================================================

/**
 * Props pour les cartes d'information
 */
export interface InfoCardProps {
  title: string;
  value: string | number;
  color: string;
}

/**
 * Props pour les cartes de produit
 */
export interface ProductCardProps {
  product: any;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * Props pour les cartes de fournisseur
 */
export interface SupplierCardProps {
  supplier: any;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * Props pour les sélecteurs d'organisation
 */
export interface OrganizationSelectorProps {
  organizations: OrganizationWithRole[];
  selectedOrganization?: string;
  onSelect: (organizationId: string) => void;
  onCreate: () => void;
} 