/**
 * Load more button component for progressive data loading
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

interface LoadMoreButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  daysToLoad?: number;
  hasNextPage?: boolean;
}

export function LoadMoreButton({
  onPress,
  isLoading = false,
  disabled = false,
  daysToLoad = 3,
  hasNextPage = true,
}: LoadMoreButtonProps) {
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');
  const backgroundColor = useThemeColor({}, 'background');

  if (!hasNextPage) {
    return (
      <View style={[styles.container, styles.noMoreContainer]}>
        <Text style={[styles.noMoreText, { color: textColor }]}>
          Toutes les données historiques ont été chargées
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor,
            borderColor,
            opacity: disabled || isLoading ? 0.6 : 1,
          },
        ]}
        onPress={onPress}
        disabled={disabled || isLoading}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={tintColor} />
            <Text style={[styles.buttonText, { color: tintColor }]}>
              Chargement en cours...
            </Text>
          </View>
        ) : (
          <Text style={[styles.buttonText, { color: tintColor }]}>
            Charger {daysToLoad} jours supplémentaires
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  noMoreContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  noMoreText: {
    fontSize: 14,
    opacity: 0.6,
    fontStyle: 'italic',
  },
});