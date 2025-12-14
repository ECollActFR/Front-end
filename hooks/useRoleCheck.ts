/**
 * Role checking hooks for admin functionality
 */

import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to check if current user has a specific role
 */
export function useHasRole(requiredRole: string): boolean {
  const { user } = useAuth();
  return user?.roles?.includes(requiredRole) || false;
}

/**
 * Hook to check if current user is a super admin
 */
export function useIsSuperAdmin(): boolean {
  return useHasRole('ROLE_SUPER_ADMIN');
}

/**
 * Hook to check if current user is an admin (any admin role)
 */
export function useIsAdmin(): boolean {
  const { user } = useAuth();
  if (!user?.roles) return false;
  
  return user.roles.some(role => 
    role === 'ROLE_SUPER_ADMIN' || 
    role === 'ROLE_ADMIN' || 
    role.startsWith('ROLE_')
  );
}

/**
 * Hook to get all user roles
 */
export function useUserRoles(): string[] {
  const { user } = useAuth();
  return user?.roles || [];
}