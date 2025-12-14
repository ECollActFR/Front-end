import React from 'react';
import { View, ActivityIndicator, FlatList, StyleSheet, Text } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';


interface InfiniteListProps<T> {
  data: T[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  renderItem: ({ item, index }: { item: T; index: number }) => React.ReactElement;
  error?: Error | null;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  emptyMessage?: string;
  errorMessage?: string;
  loadingMoreText?: string;
  onEndReachedThreshold?: number;
  contentContainerStyle?: any;
  style?: any;
  showsVerticalScrollIndicator?: boolean;
  keyExtractor?: (item: T, index: number) => string;
  estimatedItemSize?: number;
}

export default function InfiniteList<T>({
  data,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  renderItem,
  error,
  onRefresh,
  isRefreshing = false,
  emptyMessage,
  errorMessage,
  loadingMoreText,
  onEndReachedThreshold = 0.5,
  contentContainerStyle,
  style,
  showsVerticalScrollIndicator = false,
  keyExtractor,
  estimatedItemSize,
}: InfiniteListProps<T>) {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'icon');


  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" />
        {loadingMoreText && (
          <Text style={[styles.loadingMoreText, { color: secondaryTextColor }]}>
            {loadingMoreText}
          </Text>
        )}
      </View>
    );
  };

  const renderEmptyComponent = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: secondaryTextColor }]}>
          {emptyMessage || 'Aucune donnée trouvée'}
        </Text>
      </View>
    );
  };

  const renderErrorComponent = () => {
    if (!error) return null;
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, { color: textColor }]}>
          {errorMessage || error.message || 'Une erreur est survenue'}
        </Text>
      </View>
    );
  };

  // Loading state
  if (isLoading && data.length === 0) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Error state
  if (error && data.length === 0) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor }]}>
        {renderErrorComponent()}
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor || ((item: any, index: number) => item.id?.toString() || index.toString())}
      onEndReached={loadMore}
      onEndReachedThreshold={onEndReachedThreshold}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmptyComponent}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      contentContainerStyle={[styles.listContent, contentContainerStyle]}
      style={[styles.container, { backgroundColor }, style]}
      refreshing={isRefreshing}
      onRefresh={onRefresh}
      // Performance optimizations
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={10}
      windowSize={10}
      getItemLayout={estimatedItemSize ? (data: any, index: number) => ({
        length: estimatedItemSize,
        offset: estimatedItemSize * index,
        index,
      }) : undefined}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  footerLoader: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  loadingMoreText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
});