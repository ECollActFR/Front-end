import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from '../atoms/Icon';
import { useThemeColor } from '@/hooks/use-theme-color';

type Amenity = 'wifi' | 'monitor' | 'coffee';

interface AmenityListProps {
  amenities: Amenity[];
}

export default function AmenityList({ amenities }: AmenityListProps) {
  const amenityIcons: Record<Amenity, 'wifi' | 'monitor' | 'coffee'> = {
    wifi: 'wifi',
    monitor: 'monitor',
    coffee: 'coffee',
  };

  const secondaryTextColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');

  return (
    <View style={styles.container}>
      {amenities.map((amenity, index) => (
        <View key={`${amenity}-${index}`} style={[styles.amenityIcon, { backgroundColor: secondaryTextColor + '20', borderColor: secondaryTextColor + '40' }]}>
          <Icon name={amenityIcons[amenity]} size={16} color={tintColor} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 6,
  },
  amenityIcon: {
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
});
