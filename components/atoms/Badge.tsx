import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

type BadgeVariant = 'occupied' | 'selected';

interface BadgeProps {
  variant: BadgeVariant;
  text: string;
  style?: ViewStyle;
}

export default function Badge({ variant, text, style }: BadgeProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const accentOrange = useThemeColor({}, 'accentOrange');

  const variantStyles = {
    occupied: {
      backgroundColor,
      textColor: accentOrange,
    },
    selected: {
      backgroundColor,
      textColor: tintColor,
    },
  };

  const { textColor } = variantStyles[variant];

  return (
    <View style={[styles.badge, { backgroundColor }, style]}>
      {variant === 'selected' && <Text style={[styles.text, { color: textColor }]}>✓ </Text>}
      <Text style={[styles.text, { color: textColor }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
