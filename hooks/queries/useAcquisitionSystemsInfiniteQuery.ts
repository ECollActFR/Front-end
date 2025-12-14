/**
 * Example of how to use reusable pagination system for Acquisition Systems
 * This demonstrates how to migrate existing components to use the new system
 */

import { useInfiniteList, useCreateMutation, useUpdateMutation, useDeleteMutation } from '@/hooks/useInfiniteList';
import { acquisitionSystemService } from '@/services/acquisitionSystemService';
import { AcquisitionSystem, ApiAcquisitionSystemConfig } from '@/types/acquisitionSystem';

// Query keys for acquisition systems
export const acquisitionSystemKeys = {
  all: ['acquisitionSystems'],
  lists: () => [...acquisitionSystemKeys.all, 'list'],
  list: () => [...acquisitionSystemKeys.lists()],
  detail: (id: number) => [...acquisitionSystemKeys.all, 'detail', id.toString()],
};

/**
 * Hook for infinite list of acquisition systems using reusable system
 */
export function useAcquisitionSystemsInfiniteQuery() {
  return useInfiniteList<AcquisitionSystem>({
    queryKey: acquisitionSystemKeys.list(),
    fetchFunction: async (page: number, limit: number) => {
      const systems = await acquisitionSystemService.getAcquisitionSystems();
      // Convert to HydraCollection format for compatibility
      return {
        '@context': '/contexts/AcquisitionSystem',
        '@id': '/acquisition_systems',
        '@type': 'Collection',
        totalItems: systems.length,
        member: systems.slice((page - 1) * limit, page * limit),
        view: {
          '@id': '/acquisition_systems',
          '@type': 'PartialCollectionView',
          next: systems.length > page * limit ? `/acquisition_systems?page=${page + 1}` : undefined,
        },
      };
    },
    limit: 20,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to update an acquisition system using reusable system
 */
export function useUpdateAcquisitionSystemMutation() {
  return useUpdateMutation<AcquisitionSystem, { id: number; config: ApiAcquisitionSystemConfig }>({
    mutationFn: ({ id, config }) => acquisitionSystemService.updateAcquisitionSystem(id, config),
    invalidateQueries: [acquisitionSystemKeys.list()],
    updateQueries: [
      {
        queryKey: acquisitionSystemKeys.detail(0), // Will be replaced with actual id
        data: {} as AcquisitionSystem, // Will be replaced with actual data
      },
    ],
    context: 'useUpdateAcquisitionSystemMutation',
  });
}