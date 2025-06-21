import { useAuthStore } from '@/stores/authStore';
import { hasPermission, getUserPermissions, canManageUsers, canManageOrganization, canDeleteItems, UserRole, PERMISSIONS } from '@/lib/permissions';

export const usePermissions = () => {
  const { profile } = useAuthStore();
  const userRole = profile?.role as UserRole;

  return {
    // Check specific permissions
    hasPermission: (permission: string) => hasPermission(userRole, permission),
    
    // Get all user permissions
    getUserPermissions: () => getUserPermissions(userRole),
    
    // Convenience methods
    canManageUsers: () => canManageUsers(userRole),
    canManageOrganization: () => canManageOrganization(userRole),
    canDeleteItems: () => canDeleteItems(userRole),
    
    // Specific permission checks
    canCreateProducts: () => hasPermission(userRole, PERMISSIONS.PRODUCT_CREATE),
    canUpdateProducts: () => hasPermission(userRole, PERMISSIONS.PRODUCT_UPDATE),
    canDeleteProducts: () => hasPermission(userRole, PERMISSIONS.PRODUCT_DELETE),
    
    canCreateSuppliers: () => hasPermission(userRole, PERMISSIONS.SUPPLIER_CREATE),
    canUpdateSuppliers: () => hasPermission(userRole, PERMISSIONS.SUPPLIER_UPDATE),
    canDeleteSuppliers: () => hasPermission(userRole, PERMISSIONS.SUPPLIER_DELETE),
    
    canCreateOrders: () => hasPermission(userRole, PERMISSIONS.ORDER_CREATE),
    canUpdateOrders: () => hasPermission(userRole, PERMISSIONS.ORDER_UPDATE),
    canDeleteOrders: () => hasPermission(userRole, PERMISSIONS.ORDER_DELETE),
    canApproveOrders: () => hasPermission(userRole, PERMISSIONS.ORDER_APPROVE),
    
    canViewReports: () => hasPermission(userRole, PERMISSIONS.REPORTS_VIEW),
    canExportReports: () => hasPermission(userRole, PERMISSIONS.REPORTS_EXPORT),
    
    // Current user role
    userRole,
  };
}; 