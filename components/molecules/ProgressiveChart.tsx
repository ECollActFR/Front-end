/**
 * Progressive chart component that handles loading, display, and load more functionality
 */

import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { SimpleScatterPlot } from './SimpleScatterPlot';
import { LoadMoreButton } from './LoadMoreButton';
import { ChartDataPoint } from '@/types/chart';
import { useThemeColor } from '@/hooks/use-theme-color';

interface ProgressiveChartProps {
  roomId: number;
  sensorType: string;
  height?: number;
  pointColor?: string | ((dataPoint: ChartDataPoint) => string);
  pointSize?: number | ((dataPoint: ChartDataPoint) => number);
  showLine?: boolean;
  lineColor?: string;
  daysPerLoad?: number;
  initialDays?: number;
  children?: (chartData: ChartDataPoint[]) => React.ReactNode;
}

interface ProgressiveChartRenderProps {
  chartData: ChartDataPoint[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  loadMore: () => void;
  daysPerLoad: number;
  totalDataPoints: number;
  loadedDays: number;
  isLoading: boolean;
  error: Error | null;
}

export function ProgressiveChart({
  roomId,
  sensorType,
  height = 250,
  pointColor,
  pointSize = 6,
  showLine = false,
  lineColor,
  daysPerLoad = 3,
  initialDays = 7,
  children,
}: ProgressiveChartProps) {
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'backgroundSecondary');

  // Import hook conditionally to avoid SSR issues
  const { useChartDataProgressive } = require('@/hooks/useChartDataProgressive');
  const {
    chartData,
    hasNextPage,
    isFetchingNextPage,
    loadMore,
    totalDataPoints,
    loadedDays,
    isLoading,
    error,
    isInitialLoading,
    hasData,
  } = useChartDataProgressive({
    roomId,
    sensorType,
    initialDays,
    daysPerLoad,
  });

  // Loading state
  if (isInitialLoading) {
    return (
      <View style={[styles.container, { height, backgroundColor }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={[styles.loadingText, { color: textColor }]}>
            Chargement des données...
          </Text>
        </View>
      </View>
    );
  }

  // Error state
  if (error && !hasData) {
    return (
      <View style={[styles.container, { height, backgroundColor }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: textColor }]}>
            Erreur lors du chargement des données
          </Text>
          <Text style={[styles.errorSubtext, { color: textColor, opacity: 0.7 }]}>
            {error.message}
          </Text>
        </View>
      </View>
    );
  }

  // Empty state
  if (!hasData) {
    return (
      <View style={[styles.container, { height, backgroundColor }]}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: textColor }]}>
            Aucune donnée disponible pour ce capteur
          </Text>
        </View>
      </View>
    );
  }

  const renderProps: ProgressiveChartRenderProps = {
    chartData,
    hasNextPage: hasNextPage || false,
    isFetchingNextPage: isFetchingNextPage || false,
    loadMore,
    daysPerLoad,
    totalDataPoints,
    loadedDays,
    isLoading,
    error,
  };

  return (
    <View style={styles.container}>
      {/* Custom render or default scatter plot */}
      {children ? (
        children(chartData)
      ) : (
        <SimpleScatterPlot
          data={chartData}
          height={height}
          pointColor={typeof pointColor === 'function' ? undefined : pointColor}
          lineColor={lineColor}
        />
      )}

      {/* Loading more indicator */}
      {isFetchingNextPage && (
        <View style={styles.fetchingMoreContainer}>
          <ActivityIndicator size="small" />
          <Text style={[styles.fetchingMoreText, { color: textColor }]}>
            Chargement des données supplémentaires...
          </Text>
        </View>
      )}

      {/* Load more button */}
      <LoadMoreButton
        onPress={loadMore}
        isLoading={isFetchingNextPage}
        hasNextPage={hasNextPage}
        daysToLoad={daysPerLoad}
      />

      {/* Data summary */}
      <View style={styles.summaryContainer}>
        <Text style={[styles.summaryText, { color: textColor, opacity: 0.7 }]}>
          Affichage de {totalDataPoints} points sur {loadedDays} jours
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  fetchingMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  fetchingMoreText: {
    fontSize: 14,
    opacity: 0.7,
  },
  summaryContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});