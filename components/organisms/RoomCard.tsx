import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from '../atoms';
import { AmenityList } from '../molecules';
import { Room } from '@/types/room';
import { useThemeColor } from '@/hooks/use-theme-color';

interface RoomCardProps {
  room: Room;
  onPress: () => void;
  index?: number;
}

export default function RoomCard({ room, onPress, index = 0 }: RoomCardProps) {
  // Alternate between blue and green cards
  const cardGreen = useThemeColor({}, 'cardGreen');
  const cardBlue = useThemeColor({}, 'cardBlue');
  const cardBackground = index % 2 === 0 ? cardBlue : cardGreen;
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'icon');

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: cardBackground }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.nameContainer}>
            <Text style={[styles.name, { color: textColor }]}>{room.name}</Text>
            {room.description && (
              <Text style={[styles.description, { color: secondaryTextColor }]} numberOfLines={1}>
                {room.description}
              </Text>
            )}
          </View>
          <Icon name="chevron-right" size={20} />
        </View>

        <View style={styles.footer}>
          <AmenityList amenities={room.amenities} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    width: '100%',
  },
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
