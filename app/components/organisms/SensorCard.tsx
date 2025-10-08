import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LastCaptureByType } from '@/types/room';

interface SensorCardProps {
  captureData: LastCaptureByType;
}

// Helper to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'À l\'instant';
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffMins < 1440) return `Il y a ${Math.floor(diffMins / 60)} h`;
  return `Il y a ${Math.floor(diffMins / 1440)} j`;
};

// Helper to get unit from type description
const getUnit = (typeDescription: string): string => {
  const lower = typeDescription.toLowerCase();
  if (lower.includes('°c')) return '°C';
  if (lower.includes('%')) return '%';
  if (lower.includes('ppm')) return 'ppm';
  if (lower.includes('lux')) return 'lux';
  return '';
};

// Helper to get icon emoji from type name
const getIcon = (typeName: string): string => {
  const lower = typeName.toLowerCase();
  if (lower.includes('temp')) return '🌡️';
  if (lower.includes('humid')) return '💧';
  if (lower.includes('co2')) return '🌫️';
  if (lower.includes('lumi')) return '💡';
  return '📊';
};

export default function SensorCard({ captureData }: SensorCardProps) {
  const { type, capture } = captureData;
  const unit = getUnit(type.description);
  const icon = getIcon(type.name);
  const timestamp = formatDate(capture.createdAt);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.headerText}>
          <Text style={styles.description}>{capture.description}</Text>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>
      </View>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{capture.value}</Text>
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F9FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 32,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 48,
    fontWeight: '700',
    color: '#7FB068',
    letterSpacing: -1,
  },
  unit: {
    fontSize: 24,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 4,
  },
});
