import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from '../atoms/Icon';

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

  return (
    <View style={styles.chip}>
      <Icon name={config.icon} size={18} color="#7FB068" />
      <Text style={styles.label}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
});
