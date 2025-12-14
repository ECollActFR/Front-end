/**
 * Reusable infinite pagination hook for Hydra API collections
 * Works with any API that follows Hydra collection format
 */

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { logger } from '@/utils/logger';

// Generic Hydra Collection interface
export interface HydraCollection<T> {
  '@context': string;
  '@id': string;
  '@type': string;
  totalItems: number;
  member: T[];
  view: {
    '@id': string;
    '@type': 'PartialCollectionView';
    first?: string;
    last?: string;
    next?: string;
    previous?: string;
  };
}

// Configuration options for the infinite list hook
export interface UseInfiniteListOptions<T> {
  queryKey: string[];
  fetchFunction: (page: number, limit: number) => Promise<HydraCollection<T>>;
  limit?: number;
  staleTime?: number;
  gcTime?: number;
  retryCount?: number;
  enabled?: boolean;
}

// Return type for the infinite list hook
export interface UseInfiniteListReturn<T> {
  data: T[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  refetch: () => void;
  error: Error | null;
  isRefreshing: boolean;
  totalItems: number;
}

/**
 * Reusable hook for infinite pagination with Hydra collections
 */
export function useInfiniteList<T>({
  queryKey,
  fetchFunction,
  limit = 20,
  staleTime = 2 * 60 * 1000, // 2 minutes
  gcTime = 10 * 60 * 1000, // 10 minutes
  retryCount = 3,
  enabled = true,
}: UseInfiniteListOptions<T>): UseInfiniteListReturn<T> {
  const queryResult = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) => fetchFunction(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Check if there are more pages based on Hydra collection
      if (lastPage.view?.next) {
        return allPages.length + 1;
      }
      return undefined;
    },
    staleTime,
    gcTime,
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors except 408, 429
      if (error?.status >= 400 && error?.status < 500 && error?.status !== 408 && error?.status !== 429) {
        return false;
      }
      return failureCount < retryCount;
    },
    enabled,
  });

  // Flatten all pages into a single array
  const data = queryResult.data?.pages.flatMap(page => page.member) || [];

  // Get total items from first page
  const totalItems = queryResult.data?.pages[0]?.totalItems || 0;

  const fetchNextPage = () => {
    if (queryResult.hasNextPage && !queryResult.isFetchingNextPage) {
      queryResult.fetchNextPage();
    }
  };

  const refetch = () => {
    queryResult.refetch();
  };

  return {
    data,
    isLoading: queryResult.isLoading,
    isFetchingNextPage: queryResult.isFetchingNextPage,
    hasNextPage: queryResult.hasNextPage || false,
    fetchNextPage,
    refetch,
    error: queryResult.error || null,
    isRefreshing: queryResult.isFetching && !queryResult.isLoading,
    totalItems,
  };
}

/**
 * Hook for creating a mutation with standard error handling and cache invalidation
 */
export function useCreateMutation<T, Variables = any>({
  mutationFn,
  invalidateQueries,
  onSuccess,
  onError,
  context = 'useCreateMutation',
}: {
  mutationFn: (variables: Variables) => Promise<T>;
  invalidateQueries?: string[][];
  onSuccess?: (data: T, variables: Variables) => void;
  onError?: (error: any, variables: Variables) => void;
  context?: string;
}) {
  const queryClient = useQueryClient();

  return useMutation<T, Variables, Variables>({
    mutationFn,
    onSuccess: (data: T, variables: Variables) => {
      logger.info('Item created successfully', { data, context });
      
      // Invalidate specified queries
      if (invalidateQueries) {
        invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      
      // Call custom success handler
      if (onSuccess) {
        onSuccess(data, variables);
      }
    },
    onError: (error: any, variables: Variables) => {
      logger.error('Failed to create item', error, { variables, context });
      
      // Call custom error handler
      if (onError) {
        onError(error, variables);
      }
    },
  });
}

/**
 * Hook for updating an item with standard error handling and cache invalidation
 */
export function useUpdateMutation<T, Variables = any>({
  mutationFn,
  invalidateQueries,
  updateQueries,
  onSuccess,
  onError,
  context = 'useUpdateMutation',
}: {
  mutationFn: (variables: Variables) => Promise<T>;
  invalidateQueries?: string[][];
  updateQueries?: Array<{ queryKey: string[]; data: T }>;
  onSuccess?: (data: T, variables: Variables) => void;
  onError?: (error: any, variables: Variables) => void;
  context?: string;
}) {
  const queryClient = useQueryClient();

  return useMutation<T, Variables, Variables>({
    mutationFn,
    onSuccess: (data: T, variables: Variables) => {
      logger.info('Item updated successfully', { data, context });
      
      // Update specific queries in cache
      if (updateQueries) {
        updateQueries.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      
      // Invalidate specified queries
      if (invalidateQueries) {
        invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      
      // Call custom success handler
      if (onSuccess) {
        onSuccess(data, variables);
      }
    },
    onError: (error: any, variables: Variables) => {
      logger.error('Failed to update item', error, { variables, context });
      
      // Call custom error handler
      if (onError) {
        onError(error, variables);
      }
    },
  });
}

/**
 * Hook for deleting an item with standard error handling and cache invalidation
 */
export function useDeleteMutation<Variables = any>({
  mutationFn,
  invalidateQueries,
  removeQueries,
  onSuccess,
  onError,
  context = 'useDeleteMutation',
}: {
  mutationFn: (variables: Variables) => Promise<void>;
  invalidateQueries?: string[][];
  removeQueries?: string[][];
  onSuccess?: (variables: Variables) => void;
  onError?: (error: any, variables: Variables) => void;
  context?: string;
}) {
  const queryClient = useQueryClient();

  return useMutation<void, Variables, Variables>({
    mutationFn,
    onSuccess: (_: void, variables: Variables) => {
      logger.info('Item deleted successfully', { variables, context });
      
      // Remove specified queries from cache
      if (removeQueries) {
        removeQueries.forEach(queryKey => {
          queryClient.removeQueries({ queryKey });
        });
      }
      
      // Invalidate specified queries
      if (invalidateQueries) {
        invalidateQueries.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      
      // Call custom success handler
      if (onSuccess) {
        onSuccess(variables);
      }
    },
    onError: (error: any, variables: Variables) => {
      logger.error('Failed to delete item', error, { variables, context });
      
      // Call custom error handler
      if (onError) {
        onError(error, variables);
      }
    },
  });
}