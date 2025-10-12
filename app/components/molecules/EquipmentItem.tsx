import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Equipment } from '@/types/room';
import Icon from '@/components/atoms/Icon';

interface EquipmentItemProps {
  equipment: Equipment;
}

export default function EquipmentItem({ equipment }: EquipmentItemProps) {
  // Map equipment name to icon
  const getIcon = (name: string): string => {
    const lowerName = name.toLowerCase();

    if (lowerName.includes('ordinateur') || lowerName.includes('computer')) return 'laptop';
    if (lowerName.includes('ecran') || lowerName.includes('monitor') || lowerName.includes('écran')) return 'monitor';
    if (lowerName.includes('chaise') || lowerName.includes('chair')) return 'chair';
    if (lowerName.includes('wifi')) return 'wifi';
    if (lowerName.includes('café') || lowerName.includes('coffee') || lowerName.includes('machine')) return 'coffee';
    if (lowerName.includes('eau') || lowerName.includes('water') || lowerName.includes('fontaine')) return 'water-drop';

    return 'square-stack-3d';
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name={getIcon(equipment.name)} size={20} color="#7FB068" />
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{equipment.name}</Text>
        <Text style={styles.capacity}>Capacité: {equipment.capacity}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  capacity: {
    fontSize: 14,
    color: '#6B7280',
  },
});
