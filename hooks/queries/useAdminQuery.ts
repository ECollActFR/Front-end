/**
 * TanStack Query hooks for admin operations
 * Enhanced with infinite scroll for client accounts
 */

import { useInfiniteQuery, useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import { logger } from '@/utils/logger';
import { 
  ClientAccountCreatePayload, 
  ClientAccountUpdatePayload,
  CreateUserPayload,
  UpdateUserPayload
} from '@/types/clientAccount';

/**
 * Query keys for admin-related queries
 */
export const adminKeys = {
  all: ['admin'] as const,
  clientAccounts: () => [...adminKeys.all, 'clientAccounts'] as const,
  clientAccountsList: () => [...adminKeys.clientAccounts(), 'list'] as const,
  clientAccount: (id: number) => [...adminKeys.clientAccounts(), id] as const,
  users: (clientAccountId: number) => [...adminKeys.all, 'users', clientAccountId] as const,
  user: (id: number) => [...adminKeys.all, 'users', id] as const,
};

/**
 * Infinite Query for client accounts with pagination
 */
export function useClientAccountsInfiniteQuery() {
  return useInfiniteQuery({
    queryKey: adminKeys.clientAccountsList(),
    queryFn: ({ pageParam = 1 }) => adminService.getClientAccounts(pageParam, 20),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Check if there are more pages based on Hydra collection
      if (lastPage.view?.next) {
        return allPages.length + 1;
      }
      return undefined;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors except 408, 429
      if (error?.status >= 400 && error?.status < 500 && error?.status !== 408 && error?.status !== 429) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

/**
 * Hook to fetch a single client account
 */
export function useClientAccountQuery(id: number, enabled = true) {
  return useQuery({
    queryKey: adminKeys.clientAccount(id),
    queryFn: () => adminService.getClientAccount(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch users for a specific client account
 */
export function useUsersByClientAccountQuery(clientAccountId: number, enabled = true) {
  return useQuery({
    queryKey: adminKeys.users(clientAccountId),
    queryFn: () => adminService.getUsersByClientAccount(clientAccountId),
    enabled: enabled && !!clientAccountId,
    staleTime: 1 * 60 * 1000, // 1 minute for user data
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to create a new client account
 */
export function useCreateClientAccountMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ClientAccountCreatePayload) => adminService.createClientAccount(payload),
    onSuccess: (newClientAccount) => {
      logger.info('Client account created successfully', { 
        clientId: newClientAccount.id, 
        context: 'useCreateClientAccountMutation' 
      });
      
      // Invalidate client accounts list to refetch
      queryClient.invalidateQueries({ queryKey: adminKeys.clientAccountsList() });
      
      // Add new client account to cache optimistically
      queryClient.setQueryData(adminKeys.clientAccount(newClientAccount.id), newClientAccount);
    },
    onError: (error: any) => {
      logger.error('Failed to create client account', error, { context: 'useCreateClientAccountMutation' });
    },
  });
}

/**
 * Hook to update a client account
 */
export function useUpdateClientAccountMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ClientAccountUpdatePayload }) =>
      adminService.updateClientAccount(id, payload),
    onSuccess: (updatedClientAccount, { id }) => {
      logger.info('Client account updated successfully', { 
        clientId: id, 
        context: 'useUpdateClientAccountMutation' 
      });
      
      // Update specific client account in cache
      queryClient.setQueryData(adminKeys.clientAccount(id), updatedClientAccount);

      // Invalidate client accounts list to refetch
      queryClient.invalidateQueries({ queryKey: adminKeys.clientAccountsList() });
    },
    onError: (error: any, { id }) => {
      logger.error('Failed to update client account', error, { 
        clientId: id, 
        context: 'useUpdateClientAccountMutation' 
      });
    },
  });
}

/**
 * Hook to delete a client account
 */
export function useDeleteClientAccountMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminService.deleteClientAccount(id),
    onSuccess: (_, clientId) => {
      logger.info('Client account deleted successfully', { 
        clientId, 
        context: 'useDeleteClientAccountMutation' 
      });
      
      // Remove client account from cache
      queryClient.removeQueries({ queryKey: adminKeys.clientAccount(clientId) });

      // Invalidate client accounts list to refetch
      queryClient.invalidateQueries({ queryKey: adminKeys.clientAccountsList() });
    },
    onError: (error: any, clientId) => {
      logger.error('Failed to delete client account', error, { 
        clientId, 
        context: 'useDeleteClientAccountMutation' 
      });
    },
  });
}

/**
 * Hook to create a new user
 */
export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => adminService.createUser(payload),
    onSuccess: (newUser, payload) => {
      logger.info('User created successfully', { 
        userId: newUser.id, 
        clientAccountId: payload.clientAccount,
        context: 'useCreateUserMutation' 
      });
      
      // Extract client account ID from the payload URL
      const clientAccountIdMatch = payload.clientAccount.match(/\/client_accounts\/(\d+)/);
      if (clientAccountIdMatch && clientAccountIdMatch[1]) {
        const clientAccountId = parseInt(clientAccountIdMatch[1], 10);
        // Invalidate users list for this client account
        queryClient.invalidateQueries({ queryKey: adminKeys.users(clientAccountId) });
      }
    },
    onError: (error: any) => {
      logger.error('Failed to create user', error, { context: 'useCreateUserMutation' });
    },
  });
}

/**
 * Hook to update a user
 */
export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateUserPayload }) =>
      adminService.updateUser(id, payload),
    onSuccess: (updatedUser, { id }) => {
      logger.info('User updated successfully', { 
        userId: id, 
        context: 'useUpdateUserMutation' 
      });
      
      // Update specific user in cache
      queryClient.setQueryData(adminKeys.user(id), updatedUser);

      // If user has a client account, invalidate that client's users list
      if (updatedUser.clientAccount && updatedUser.clientAccount['@id']) {
        const clientAccountIdMatch = updatedUser.clientAccount['@id'].match(/\/client_accounts\/(\d+)/);
        if (clientAccountIdMatch && clientAccountIdMatch[1]) {
          const clientAccountId = parseInt(clientAccountIdMatch[1], 10);
          queryClient.invalidateQueries({ queryKey: adminKeys.users(clientAccountId) });
        }
      }
    },
    onError: (error: any, { id }) => {
      logger.error('Failed to update user', error, { 
        userId: id, 
        context: 'useUpdateUserMutation' 
      });
    },
  });
}

/**
 * Hook to delete a user
 */
export function useDeleteUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminService.deleteUser(id),
    onSuccess: (_, userId) => {
      logger.info('User deleted successfully', { 
        userId, 
        context: 'useDeleteUserMutation' 
      });
      
      // Remove user from cache
      queryClient.removeQueries({ queryKey: adminKeys.user(userId) });

      // Note: We can't easily invalidate the client account's users list 
      // without knowing which client account the user belonged to
      // This could be improved by passing the clientAccountId as a parameter
    },
    onError: (error: any, userId) => {
      logger.error('Failed to delete user', error, { 
        userId, 
        context: 'useDeleteUserMutation' 
      });
    },
  });
}