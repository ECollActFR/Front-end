import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from '../atoms/Icon';

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

  return (
    <View style={styles.container}>
      {amenities.map((amenity, index) => (
        <View key={`${amenity}-${index}`} style={styles.amenityIcon}>
          <Icon name={amenityIcons[amenity]} size={16} color="#8B7355" />
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
    backgroundColor: '#F3F4F6',
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
});
