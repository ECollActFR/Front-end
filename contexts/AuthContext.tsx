/**
 * Auth Context - Simple wrapper around TanStack Query auth hooks
 * Provides a clean API for authentication throughout the app
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { User, LoginCredentials } from '@/types/user';
import {
  useAuthState,
  useLoginMutation,
  useLogoutMutation,
  useLoadUserInfoMutation,
  useUpdateUserMutation,
  useValidateToken,
} from '@/hooks/queries/useAuthQuery';

interface AuthContextType {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  loadUserInfo: () => Promise<void>;
  updateUser: (payload: any) => Promise<void>;

  // Mutation states
  isLoginPending: boolean;
  isLogoutPending: boolean;
  isLoadingUserInfo: boolean;
  isUpdatingUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Get auth state from TanStack Query
  const { data: authState, isLoading: isLoadingAuth } = useAuthState();

  // Validate token on startup
  const { isLoading: isValidating } = useValidateToken(
    authState?.token || null,
    !!authState?.token
  );

  // Mutations
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();
  const loadUserInfoMutation = useLoadUserInfoMutation();
  const updateUserMutation = useUpdateUserMutation();

  // Actions
  const login = async (credentials: LoginCredentials) => {
    await loginMutation.mutateAsync(credentials);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const loadUserInfo = async () => {
    if (authState?.token) {
      await loadUserInfoMutation.mutateAsync(authState.token);
    }
  };

  const updateUser = async (payload: any) => {
    if (authState?.token) {
      await updateUserMutation.mutateAsync({ token: authState.token, payload });
    }
  };

  const value: AuthContextType = {
    // State
    user: authState?.user || null,
    token: authState?.token || null,
    isAuthenticated: authState?.isAuthenticated || false,
    isLoading: isLoadingAuth || isValidating,

    // Actions
    login,
    logout,
    loadUserInfo,
    updateUser,

    // Mutation states
    isLoginPending: loginMutation.isPending,
    isLogoutPending: logoutMutation.isPending,
    isLoadingUserInfo: loadUserInfoMutation.isPending,
    isUpdatingUser: updateUserMutation.isPending,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
