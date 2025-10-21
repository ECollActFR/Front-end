import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from '../atoms/Icon';
import { useThemeColor } from '@/hooks/use-theme-color';

type AmenityType = 'wifi' | 'monitor' | 'coffee';

interface AmenityChipProps {
  type: AmenityType;
}

const AMENITY_CONFIG = {
  wifi: {
    label: 'WiFi',
    icon: 'wifi' as const,
  },
  monitor: {
    label: 'Écran',
    icon: 'monitor' as const,
  },
  coffee: {
    label: 'Café',
    icon: 'coffee' as const,
  },
};

export default function AmenityChip({ type }: AmenityChipProps) {
  const config = AMENITY_CONFIG[type];
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const secondaryTextColor = useThemeColor({}, 'icon');

  return (
    <View style={[styles.chip, { backgroundColor: tintColor + '20', borderColor: secondaryTextColor + '60' }]}>
      <Icon name={config.icon} size={18} color={tintColor} />
      <Text style={[styles.label, { color: textColor }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
});
