/**
 * TanStack Query hooks for acquisition systems management
 * Replaces custom useAcquisitionSystems hook with standardized query patterns
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { acquisitionSystemService } from '@/services/acquisitionSystemService';
import { AcquisitionSystem, AcquisitionSystemConfig, ApiAcquisitionSystemConfig } from '@/types/acquisitionSystem';
import { logger } from '@/utils/logger';

// Query keys for acquisition systems
export const acquisitionSystemsKeys = {
  all: ['acquisitionSystems'] as const,
  lists: () => [...acquisitionSystemsKeys.all, 'list'] as const,
  list: (filters?: { excludeRoomId?: number }) => [...acquisitionSystemsKeys.lists(), { filters }] as const,
  details: () => [...acquisitionSystemsKeys.all, 'detail'] as const,
  detail: (id: number) => [...acquisitionSystemsKeys.details(), id] as const,
  configs: () => [...acquisitionSystemsKeys.all, 'config'] as const,
  config: (id: number) => [...acquisitionSystemsKeys.configs(), id] as const,
};

/**
 * Hook to fetch all acquisition systems
 */
export function useAcquisitionSystemsQuery() {
  return useQuery({
    queryKey: acquisitionSystemsKeys.list(),
    queryFn: () => acquisitionSystemService.getAcquisitionSystems(),
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      if (error?.status >= 400 && error?.status < 500 && error?.status !== 408 && error?.status !== 429) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

/**
 * Hook to fetch available acquisition systems (not assigned to specific room)
 */
export function useAvailableAcquisitionSystemsQuery(excludeRoomId?: number) {
  return useQuery({
    queryKey: acquisitionSystemsKeys.list({ excludeRoomId }),
    queryFn: () => acquisitionSystemService.getAvailableAcquisitionSystems(excludeRoomId),
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      if (error?.status >= 400 && error?.status < 500 && error?.status !== 408 && error?.status !== 429) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

/**
 * Hook to fetch acquisition system configuration
 */
export function useAcquisitionSystemConfigQuery(systemId: number, enabled = true) {
  return useQuery({
    queryKey: acquisitionSystemsKeys.config(systemId),
    queryFn: () => acquisitionSystemService.getAcquisitionSystemConfig(systemId),
    enabled: enabled && !!systemId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      if (error?.status >= 400 && error?.status < 500 && error?.status !== 408 && error?.status !== 429) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

/**
 * Hook to update acquisition system configuration
 */
export function useUpdateAcquisitionSystemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ systemId, config }: { systemId: number; config: ApiAcquisitionSystemConfig }) =>
      acquisitionSystemService.updateAcquisitionSystem(systemId, config),
    onSuccess: (updatedConfig, { systemId }) => {
      logger.info('Acquisition system updated successfully', { systemId, context: 'useUpdateAcquisitionSystemMutation' });
      
      // Update config in cache
      queryClient.setQueryData(acquisitionSystemsKeys.config(systemId), updatedConfig);
      
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: acquisitionSystemsKeys.lists() });
    },
    onError: (error: any, { systemId }) => {
      logger.error('Failed to update acquisition system', error, { systemId, context: 'useUpdateAcquisitionSystemMutation' });
    },
  });
}

/**
 * Hook to update acquisition system configuration
 */
export function useUpdateAcquisitionSystemConfigMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ systemId, config }: { systemId: number; config: Partial<AcquisitionSystemConfig> }) =>
      acquisitionSystemService.updateAcquisitionSystem(systemId, config),
    onSuccess: (updatedConfig, { systemId }) => {
      logger.info('Acquisition system config updated successfully', { systemId, context: 'useUpdateAcquisitionSystemConfigMutation' });
      
      // Update config in cache
      queryClient.setQueryData(acquisitionSystemsKeys.config(systemId), updatedConfig);
      
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: acquisitionSystemsKeys.lists() });
    },
    onError: (error: any, { systemId }) => {
      logger.error('Failed to update acquisition system config', error, { systemId, context: 'useUpdateAcquisitionSystemConfigMutation' });
    },
  });
}

/**
 * Hook to refetch all acquisition systems
 */
export function useRefetchAcquisitionSystems() {
  const queryClient = useQueryClient();

  return () => {
    logger.info('Refetching acquisition systems', { context: 'useRefetchAcquisitionSystems' });
    queryClient.invalidateQueries({ queryKey: acquisitionSystemsKeys.lists() });
  };
}

/**
 * Hook to prefetch acquisition systems for better UX
 */
export function usePrefetchAcquisitionSystems() {
  const queryClient = useQueryClient();

  return (excludeRoomId?: number) => {
    queryClient.prefetchQuery({
      queryKey: acquisitionSystemsKeys.list({ excludeRoomId }),
      queryFn: () => acquisitionSystemService.getAvailableAcquisitionSystems(excludeRoomId),
      staleTime: 3 * 60 * 1000, // 3 minutes
    });
  };
}