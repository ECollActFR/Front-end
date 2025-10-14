import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from '../atoms';
import { RoomHeader, AmenityList } from '../molecules';
import { Room } from '@/types/room';

interface RoomCardProps {
  room: Room;
  onPress: () => void;
}

export default function RoomCard({ room, onPress }: RoomCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, !room.available && styles.unavailableCard]}
      onPress={onPress}
      disabled={!room.available}
      activeOpacity={0.7}
    >
      <RoomHeader color={room.color} available={room.available} />

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{room.name}</Text>
            {room.description && (
              <Text style={styles.description} numberOfLines={1}>
                {room.description}
              </Text>
            )}
          </View>
          {room.available && <Icon name="chevron-right" size={20} color="#9D8D62" />}
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    width: '100%',
  },
  unavailableCard: {
    opacity: 0.6,
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
    color: '#111827',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#6B7280',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
