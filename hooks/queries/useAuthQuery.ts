/**
 * TanStack Query hooks for authentication
 * Manages auth state, token, and user data with persistence
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import { tokenManager } from '@/services/tokenManager';
import { User, LoginCredentials } from '@/types/user';

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
 * Load auth state from storage
 */
async function loadAuthFromStorage(): Promise<AuthState> {
  try {
    const token = await tokenManager.getToken();
    if (token) {
      // Try to get user info with the token
      try {
        const user = await userService.getUserInfo();
        return {
          token,
          user,
          isAuthenticated: true,
        };
      } catch (error) {
        // Token exists but is invalid, clear it
        await tokenManager.clearToken();
        console.log('Token invalid, cleared from storage');
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
 * Save auth state to storage
 */
async function saveAuthToStorage(token: string, user: User): Promise<void> {
  await tokenManager.setToken(token);
}

/**
 * Clear auth from storage
 */
async function clearAuthFromStorage(): Promise<void> {
  await tokenManager.clearToken();
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
      // Set token in tokenManager for getUserInfo to use
      await tokenManager.setToken(token);
      // Get user info with the token
      const user = await userService.getUserInfo();

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
      console.log('Logout mutation: clearing auth from storage');
      await clearAuthFromStorage();
      console.log('Logout mutation: storage cleared');
    },
    onSuccess: () => {
      console.log('Logout mutation: onSuccess called');
      // Clear auth state
      queryClient.setQueryData<AuthState>(authKeys.state, {
        token: null,
        user: null,
        isAuthenticated: false,
      });
      console.log('Logout mutation: auth state cleared');

      // Clear all queries (fresh start)
      queryClient.clear();
      console.log('Logout mutation: all queries cleared');
    },
    onError: (error) => {
      console.error('Logout mutation: error occurred', error);
    },
  });
}

/**
 * Hook to load user info (refreshes user data)
 */
export function useLoadUserInfoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return userService.getUserInfo();
    },
    onSuccess: async (user) => {
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
        queryClient.setQueryData(['auth', 'user', currentAuth.token], user);
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
    mutationFn: async (payload: any) => {
      return userService.updateUser(payload);
    },
    onSuccess: async (updatedUser) => {
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
        queryClient.setQueryData(['auth', 'user', currentAuth.token], updatedUser);
      }
    },
  });
}
