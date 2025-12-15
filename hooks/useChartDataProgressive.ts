/**
 * Hook for progressive loading of chart data with React Query infinite queries
 */

import { useMemo, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { chartService } from '@/services/chartService';
import { ChartDataPoint, ChartDataResponse, UseChartDataProgressiveOptions } from '@/types/chart';

// Query keys for chart data
export const chartQueryKeys = {
  all: ['chartData'] as const,
  room: (roomId: number) => [...chartQueryKeys.all, 'room', roomId] as const,
  sensor: (roomId: number, sensorType: string) => 
    [...chartQueryKeys.room(roomId), 'sensor', sensorType] as const,
  historical: (roomId: number, sensorType: string, days: number) => 
    [...chartQueryKeys.sensor(roomId, sensorType), 'historical', days] as const,
};

/**
 * Hook for progressive loading of chart data
 * Loads initial days then allows loading more days progressively
 */
export function useChartDataProgressive({
  roomId,
  sensorType,
  initialDays = 7,
  daysPerLoad = 3
}: UseChartDataProgressiveOptions) {
  const queryResult = useInfiniteQuery({
    queryKey: chartQueryKeys.sensor(roomId, sensorType),
    queryFn: ({ pageParam = 0 }) => {
      const offsetDays = pageParam === 0 ? 0 : initialDays + (pageParam - 1) * daysPerLoad;
      const daysToLoad = pageParam === 0 ? initialDays : daysPerLoad;
      
      return chartService.getRoomHistoricalData(roomId, sensorType, daysToLoad, offsetDays);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: any, allPages: any) => {
      if (lastPage.hasMoreDays) {
        return allPages.length;
      }
      return undefined;
    },
    staleTime: 2 * 60 * 1000,    // 2 minutes for chart data
    gcTime: 15 * 60 * 1000,     // 15 minutes cache
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 2,
    enabled: !!roomId && !!sensorType,
  });

  // Flatten and process chart data from all pages
  const processedData = useMemo(() => {
    if (!queryResult.data?.pages) {
      return {
        chartData: [],
        dateRange: { start: null, end: null },
        totalDataPoints: 0,
        loadedDays: 0,
      };
    }

    // Flatten all data points from all pages
    const allDataPoints: ChartDataPoint[] = [];
    let earliestDate: Date | null = null;
    let latestDate: Date | null = null;
    let totalPoints = 0;

    queryResult.data.pages.forEach(page => {
      allDataPoints.push(...page.dataPoints);
      totalPoints += page.totalCount;

      // Track date range
      if (page.dateRange.start) {
        const startDate = new Date(page.dateRange.start);
        if (!earliestDate || startDate < earliestDate) {
          earliestDate = startDate;
        }
      }
      
      if (page.dateRange.end) {
        const endDate = new Date(page.dateRange.end);
        if (!latestDate || endDate > latestDate) {
          latestDate = endDate;
        }
      }
    });

    // Sort all data points by timestamp
    const sortedData = allDataPoints.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    return {
      chartData: sortedData,
      dateRange: { start: earliestDate, end: latestDate },
      totalDataPoints: totalPoints,
      loadedDays: queryResult.data.pages.length * daysPerLoad,
    };
  }, [queryResult.data, daysPerLoad]);

  // Calculate statistics from the data
  const statistics = useMemo(() => {
    if (processedData.chartData.length === 0) {
      return {
        min: null,
        max: null,
        average: null,
        count: 0,
      };
    }

    const values = processedData.chartData.map((point: any) => point.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const average = values.reduce((sum: any, val: any) => sum + val, 0) / values.length;

    return {
      min: Math.round(min * 100) / 100,
      max: Math.round(max * 100) / 100,
      average: Math.round(average * 100) / 100,
      count: processedData.chartData.length,
    };
  }, [processedData.chartData]);

  // Load more data function
  const loadMore = useCallback(() => {
    if (queryResult.hasNextPage && !queryResult.isFetchingNextPage) {
      queryResult.fetchNextPage();
    }
  }, [queryResult]);

  // Refetch function
  const refetch = useCallback(() => {
    queryResult.refetch();
  }, [queryResult]);

  return {
    // Data
    chartData: processedData.chartData,
    dateRange: processedData.dateRange,
    statistics,
    
    // Loading states
    isLoading: queryResult.isLoading,
    isFetchingNextPage: queryResult.isFetchingNextPage,
    hasNextPage: queryResult.hasNextPage,
    
    // Actions
    loadMore,
    refetch,
    
    // Meta information
    totalDataPoints: processedData.totalDataPoints,
    loadedDays: processedData.loadedDays,
    error: queryResult.error,
    
    // Query state
    isInitialLoading: queryResult.isLoading && processedData.chartData.length === 0,
    hasData: processedData.chartData.length > 0,
  };
}

/**
 * Hook for loading chart data with aggregation
 * Useful for showing hourly/daily aggregated data
 */
export function useAggregatedChartData({
  roomId,
  sensorType,
  aggregationOptions = { interval: 'hour', aggregationType: 'average' },
  ...options
}: UseChartDataProgressiveOptions & { aggregationOptions?: { interval: 'hour' | 'day'; aggregationType: 'average' | 'min' | 'max' } }) {
  const baseResult = useChartDataProgressive({ roomId, sensorType, ...options });

  // Aggregate the data
  const aggregatedData = useMemo(() => {
    if (baseResult.chartData.length === 0) {
      return [];
    }

    // Import aggregation function only when needed
    const { aggregateChartData } = require('@/services/chartService');
    return aggregateChartData(baseResult.chartData, aggregationOptions);
  }, [baseResult.chartData, aggregationOptions]);

  // Calculate statistics for aggregated data
  const aggregatedStatistics = useMemo(() => {
    if (aggregatedData.length === 0) {
      return {
        min: null,
        max: null,
        average: null,
        count: 0,
      };
    }

    const values = aggregatedData.map((point: any) => point.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const average = values.reduce((sum: any, val: any) => sum + val, 0) / values.length;

    return {
      min: Math.round(min * 100) / 100,
      max: Math.round(max * 100) / 100,
      average: Math.round(average * 100) / 100,
      count: aggregatedData.length,
    };
  }, [aggregatedData]);

  return {
    ...baseResult,
    aggregatedData,
    aggregatedStatistics,
  };
}

/**
 * Hook for managing multiple sensor types
 * Useful for comparing different sensors in the same room
 */
export function useMultiSensorChartData({
  roomId,
  sensorTypes,
  options = {}
}: {
  roomId: number;
  sensorTypes: string[];
  options?: Partial<UseChartDataProgressiveOptions>;
}) {
  const results = sensorTypes.map(sensorType => 
    useChartDataProgressive({ 
      roomId, 
      sensorType, 
      ...options 
    })
  );

  const combinedData = useMemo(() => {
    const combined = new Map<string, ChartDataPoint[]>();
    
    results.forEach((result, index) => {
      const sensorType = sensorTypes[index];
      combined.set(String(sensorType), result.chartData);
    });
    
    return combined;
  }, [results, sensorTypes]);

  const isAnyLoading = results.some(result => result.isLoading);
  const allErrors = results.filter(result => result.error).map(result => result.error);
  const totalDataPoints = results.reduce((sum, result) => sum + result.totalDataPoints, 0);

  return {
    dataBySensor: combinedData,
    results,
    isAnyLoading,
    errors: allErrors,
    totalDataPoints,
    hasAnyData: results.some(result => result.hasData),
    loadAllMore: () => results.forEach(result => result.loadMore()),
    refetchAll: () => results.forEach(result => result.refetch()),
  };
}