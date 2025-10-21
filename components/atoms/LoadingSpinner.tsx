import React from 'react';
import { View, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
}

export default function LoadingSpinner({
  size = 'large',
  color,
  style,
}: LoadingSpinnerProps) {
  const defaultColor = useThemeColor({}, 'tint');

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color || defaultColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
