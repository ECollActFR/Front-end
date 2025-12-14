/**
 * Specific hooks for client accounts using reusable infinite list system
 */

import { useInfiniteList, useCreateMutation, useUpdateMutation, useDeleteMutation } from '@/hooks/useInfiniteList';
import { adminService } from '@/services/adminService';
import { 
  ClientAccount, 
  ClientAccountCreatePayload, 
  ClientAccountUpdatePayload
} from '@/types/clientAccount';

// Query keys for client accounts
export const clientAccountKeys = {
  all: ['clientAccounts'],
  lists: () => [...clientAccountKeys.all, 'list'],
  list: () => [...clientAccountKeys.lists()],
  detail: (id: number) => [...clientAccountKeys.all, 'detail', id.toString()],
};

/**
 * Hook for infinite list of client accounts
 */
export function useClientAccountsInfiniteQuery() {
  return useInfiniteList<ClientAccount>({
    queryKey: clientAccountKeys.list(),
    fetchFunction: adminService.getClientAccounts,
    limit: 20,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch a single client account
 */
export function useClientAccountQuery(id: number, enabled = true) {
  return useInfiniteList<ClientAccount>({
    queryKey: clientAccountKeys.detail(id),
    fetchFunction: async () => {
      const account = await adminService.getClientAccount(id);
      // Convert single account to HydraCollection format for compatibility
      return {
        '@context': '/contexts/ClientAccount',
        '@id': `/client_accounts/${id}`,
        '@type': 'Collection',
        totalItems: 1,
        member: [account],
        view: {
          '@id': `/client_accounts/${id}`,
          '@type': 'PartialCollectionView',
        },
      };
    },
    limit: 1,
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to create a new client account
 */
export function useCreateClientAccountMutation() {
  return useCreateMutation<ClientAccount, ClientAccountCreatePayload>({
    mutationFn: adminService.createClientAccount,
    invalidateQueries: [clientAccountKeys.list()],
    context: 'useCreateClientAccountMutation',
  });
}

/**
 * Hook to update a client account
 */
export function useUpdateClientAccountMutation() {
  return useUpdateMutation<ClientAccount, { id: number; payload: ClientAccountUpdatePayload }>({
    mutationFn: ({ id, payload }) => adminService.updateClientAccount(id, payload),
    invalidateQueries: [clientAccountKeys.list()],
    updateQueries: [
      {
        queryKey: clientAccountKeys.detail(0), // Will be replaced with actual id
        data: {} as ClientAccount, // Will be replaced with actual data
      },
    ],
    context: 'useUpdateClientAccountMutation',
  });
}

/**
 * Hook to delete a client account
 */
export function useDeleteClientAccountMutation() {
  return useDeleteMutation<number>({
    mutationFn: adminService.deleteClientAccount,
    invalidateQueries: [clientAccountKeys.list()],
    removeQueries: [clientAccountKeys.detail(0)], // Will be replaced with actual id
    context: 'useDeleteClientAccountMutation',
  });
}