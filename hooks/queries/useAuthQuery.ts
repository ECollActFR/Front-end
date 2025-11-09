/**
 * TanStack Query hooks for authentication
 * Manages auth state, token, and user data with persistence
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService } from '@/services/userService';
import { tokenManager } from '@/services/tokenManager';
import { User, LoginCredentials } from '@/types/user';

const AUTH_STORAGE_KEY = 'auth-storage';

/**
 * Auth state interface
 */
export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

/**
 * Query keys for auth
 */
export const authKeys = {
  state: ['auth', 'state'] as const,
  user: (token: string) => ['auth', 'user', token] as const,
};

/**
 * Load auth state from AsyncStorage
 */
async function loadAuthFromStorage(): Promise<AuthState> {
  try {
    const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const { token, user } = JSON.parse(stored);
      if (token) {
        tokenManager.setToken(token);
        return {
          token,
          user,
          isAuthenticated: true,
        };
      }
    }
  } catch (error) {
    console.error('Error loading auth from storage:', error);
  }

  return {
    token: null,
    user: null,
    isAuthenticated: false,
  };
}

/**
 * Save auth state to AsyncStorage
 */
async function saveAuthToStorage(token: string, user: User): Promise<void> {
  try {
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token, user }));
    tokenManager.setToken(token);
  } catch (error) {
    console.error('Error saving auth to storage:', error);
  }
}

/**
 * Clear auth from AsyncStorage
 */
async function clearAuthFromStorage(): Promise<void> {
  try {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    tokenManager.clearToken();
  } catch (error) {
    console.error('Error clearing auth from storage:', error);
  }
}

/**
 * Hook to get auth state (token, user, isAuthenticated)
 * This loads from AsyncStorage on mount and keeps it in Query cache
 */
export function useAuthState() {
  return useQuery({
    queryKey: authKeys.state,
    queryFn: loadAuthFromStorage,
    staleTime: Infinity, // Auth state never goes stale
    gcTime: Infinity, // Keep in cache forever
  });
}

/**
 * Hook to validate token on app startup
 */
export function useValidateToken(token: string | null, enabled = true) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['auth', 'validate', token],
    queryFn: async () => {
      if (!token) return false;

      try {
        const isValid = await userService.validateToken({ token });

        if (!isValid) {
          // Token invalid, clear auth
          await clearAuthFromStorage();
          queryClient.setQueryData<AuthState>(authKeys.state, {
            token: null,
            user: null,
            isAuthenticated: false,
          });
        }

        return isValid;
      } catch (error) {
        // Validation failed, clear auth
        await clearAuthFromStorage();
        queryClient.setQueryData<AuthState>(authKeys.state, {
          token: null,
          user: null,
          isAuthenticated: false,
        });
        return false;
      }
    },
    enabled: enabled && !!token,
    staleTime: 5 * 60 * 1000, // Revalidate every 5 minutes
    retry: false,
  });
}

/**
 * Hook to login
 */
export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      // Login and get token
      const response = await userService.login(credentials);

      // Extract token from response.data.token
      const token = response.data.token;

      // Get user info with the token
      const user = await userService.getUserInfo(token);

      return { token, user };
    },
    onSuccess: async ({ token, user }) => {
      // Save to AsyncStorage
      await saveAuthToStorage(token, user);

      // Update auth state in cache
      queryClient.setQueryData<AuthState>(authKeys.state, {
        token,
        user,
        isAuthenticated: true,
      });

      // Cache user data
      queryClient.setQueryData(['auth', 'user', token], user);
    },
  });
}

/**
 * Hook to logout
 */
export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await clearAuthFromStorage();
    },
    onSuccess: () => {
      // Clear auth state
      queryClient.setQueryData<AuthState>(authKeys.state, {
        token: null,
        user: null,
        isAuthenticated: false,
      });

      // Clear all queries (fresh start)
      queryClient.clear();
    },
  });
}

/**
 * Hook to load user info (refreshes user data)
 */
export function useLoadUserInfoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (token: string) => {
      if (!token) throw new Error('No token provided');
      return userService.getUserInfo(token);
    },
    onSuccess: async (user, token) => {
      // Get current auth state
      const currentAuth = queryClient.getQueryData<AuthState>(authKeys.state);

      if (currentAuth && currentAuth.token) {
        // Update user in auth state
        const newAuthState: AuthState = {
          ...currentAuth,
          user,
        };

        queryClient.setQueryData<AuthState>(authKeys.state, newAuthState);

        // Save to AsyncStorage
        await saveAuthToStorage(currentAuth.token, user);

        // Update user cache
        queryClient.setQueryData(['auth', 'user', token], user);
      }
    },
  });
}

/**
 * Hook to update user info
 */
export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ token, payload }: { token: string; payload: any }) => {
      return userService.updateUser(token, payload);
    },
    onSuccess: async (updatedUser, { token }) => {
      // Get current auth state
      const currentAuth = queryClient.getQueryData<AuthState>(authKeys.state);

      if (currentAuth && currentAuth.token) {
        // Update user in auth state
        const newAuthState: AuthState = {
          ...currentAuth,
          user: updatedUser,
        };

        queryClient.setQueryData<AuthState>(authKeys.state, newAuthState);

        // Save to AsyncStorage
        await saveAuthToStorage(currentAuth.token, updatedUser);

        // Update user cache
        queryClient.setQueryData(['auth', 'user', token], updatedUser);
      }
    },
  });
}
