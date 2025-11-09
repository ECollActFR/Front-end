/**
 * React Query hooks for user-related data
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import { User, UpdateUserPayload } from '@/types/user';

/**
 * Query keys for user-related queries
 */
export const userKeys = {
  all: ['user'] as const,
  info: (token: string) => [...userKeys.all, 'info', token] as const,
};

/**
 * Hook to fetch current user info
 */
export function useUserInfoQuery(token: string | null, enabled = true) {
  return useQuery({
    queryKey: userKeys.info(token || ''),
    queryFn: () => {
      if (!token) throw new Error('No token provided');
      return userService.getUserInfo(token);
    },
    enabled: enabled && !!token,
    staleTime: 10 * 60 * 1000, // User info is fresh for 10 minutes
    gcTime: 30 * 60 * 1000, // Cache for 30 minutes
  });
}

/**
 * Hook to update user info
 */
export function useUpdateUserMutation(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => {
      if (!token) throw new Error('No token provided');
      return userService.updateUser(token, payload);
    },
    onSuccess: (updatedUser) => {
      // Update the cache with the new user data
      if (token) {
        queryClient.setQueryData<User>(userKeys.info(token), updatedUser);
      }
    },
  });
}
