export type UserRole = 'admin' | 'manager' | 'member';

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface RolePermissions {
  role: UserRole;
  permissions: string[];
}

// Define all available permissions
export const PERMISSIONS = {
  // Product management
  PRODUCT_CREATE: 'product:create',
  PRODUCT_READ: 'product:read',
  PRODUCT_UPDATE: 'product:update',
  PRODUCT_DELETE: 'product:delete',
  
  // Supplier management
  SUPPLIER_CREATE: 'supplier:create',
  SUPPLIER_READ: 'supplier:read',
  SUPPLIER_UPDATE: 'supplier:update',
  SUPPLIER_DELETE: 'supplier:delete',
  
  // Order management
  ORDER_CREATE: 'order:create',
  ORDER_READ: 'order:read',
  ORDER_UPDATE: 'order:update',
  ORDER_DELETE: 'order:delete',
  ORDER_APPROVE: 'order:approve',
  
  // User management
  USER_INVITE: 'user:invite',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_ROLE_UPDATE: 'user:role:update',
  
  // Organization management
  ORG_SETTINGS_UPDATE: 'org:settings:update',
  ORG_DELETE: 'org:delete',
  
  // Reports
  REPORTS_VIEW: 'reports:view',
  REPORTS_EXPORT: 'reports:export',
} as const;

// Define role-based permissions
export const ROLE_PERMISSIONS: RolePermissions[] = [
  {
    role: 'admin',
    permissions: [
      // Full access to everything
      PERMISSIONS.PRODUCT_CREATE,
      PERMISSIONS.PRODUCT_READ,
      PERMISSIONS.PRODUCT_UPDATE,
      PERMISSIONS.PRODUCT_DELETE,
      PERMISSIONS.SUPPLIER_CREATE,
      PERMISSIONS.SUPPLIER_READ,
      PERMISSIONS.SUPPLIER_UPDATE,
      PERMISSIONS.SUPPLIER_DELETE,
      PERMISSIONS.ORDER_CREATE,
      PERMISSIONS.ORDER_READ,
      PERMISSIONS.ORDER_UPDATE,
      PERMISSIONS.ORDER_DELETE,
      PERMISSIONS.ORDER_APPROVE,
      PERMISSIONS.USER_INVITE,
      PERMISSIONS.USER_READ,
      PERMISSIONS.USER_UPDATE,
      PERMISSIONS.USER_DELETE,
      PERMISSIONS.USER_ROLE_UPDATE,
      PERMISSIONS.ORG_SETTINGS_UPDATE,
      PERMISSIONS.ORG_DELETE,
      PERMISSIONS.REPORTS_VIEW,
      PERMISSIONS.REPORTS_EXPORT,
    ],
  },
  {
    role: 'manager',
    permissions: [
      // Can manage products, suppliers, orders, and view reports
      PERMISSIONS.PRODUCT_CREATE,
      PERMISSIONS.PRODUCT_READ,
      PERMISSIONS.PRODUCT_UPDATE,
      PERMISSIONS.SUPPLIER_CREATE,
      PERMISSIONS.SUPPLIER_READ,
      PERMISSIONS.SUPPLIER_UPDATE,
      PERMISSIONS.ORDER_CREATE,
      PERMISSIONS.ORDER_READ,
      PERMISSIONS.ORDER_UPDATE,
      PERMISSIONS.ORDER_APPROVE,
      PERMISSIONS.USER_READ,
      PERMISSIONS.REPORTS_VIEW,
      PERMISSIONS.REPORTS_EXPORT,
    ],
  },
  {
    role: 'member',
    permissions: [
      // Can view and create, but limited update/delete permissions
      PERMISSIONS.PRODUCT_READ,
      PERMISSIONS.SUPPLIER_READ,
      PERMISSIONS.ORDER_READ,
      PERMISSIONS.USER_READ,
      PERMISSIONS.REPORTS_VIEW,
    ],
  },
];

// Helper functions
export const hasPermission = (userRole: UserRole, permission: string): boolean => {
  const rolePermissions = ROLE_PERMISSIONS.find(rp => rp.role === userRole);
  return rolePermissions?.permissions.includes(permission) || false;
};

export const getUserPermissions = (userRole: UserRole): string[] => {
  const rolePermissions = ROLE_PERMISSIONS.find(rp => rp.role === userRole);
  return rolePermissions?.permissions || [];
};

export const canManageUsers = (userRole: UserRole): boolean => {
  return hasPermission(userRole, PERMISSIONS.USER_INVITE);
};

export const canManageOrganization = (userRole: UserRole): boolean => {
  return hasPermission(userRole, PERMISSIONS.ORG_SETTINGS_UPDATE);
};

export const canDeleteItems = (userRole: UserRole): boolean => {
  return hasPermission(userRole, PERMISSIONS.PRODUCT_DELETE) ||
         hasPermission(userRole, PERMISSIONS.SUPPLIER_DELETE) ||
         hasPermission(userRole, PERMISSIONS.ORDER_DELETE);
}; 