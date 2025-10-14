import React from 'react';
import { View, StyleSheet } from 'react-native';
import Badge from '../atoms/Badge';

interface RoomHeaderProps {
  color: string;
  available: boolean;
}

export default function RoomHeader({ color, available }: RoomHeaderProps) {
  return (
    <View style={[styles.header, { backgroundColor: color }]}>
      {!available && (
        <View style={styles.badgeContainer}>
          <Badge variant="occupied" text="Occupée" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 96,
    width: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
});
