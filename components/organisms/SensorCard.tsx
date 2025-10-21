import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LastCaptureByType } from '@/types/room';
import { useThemeColor } from '@/hooks/use-theme-color';

interface SensorCardProps {
  captureData: LastCaptureByType;
}

// Helper to format date
const formatDate = (dateString: string): string => {
  // Remove timezone offset and treat as local time
  // API sends "2025-10-08T14:17:15+02:00" but the time is actually in UTC
  // So we strip the timezone and parse as local
  const dateWithoutTz = dateString.replace(/[+-]\d{2}:\d{2}$/, '');
  const date = new Date(dateWithoutTz);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Date invalide';
  }

  // Get current time in local timezone
  const now = new Date();

  // Calculate difference in milliseconds
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  // Handle negative differences (future dates)
  if (diffMins < 0) return 'Dans le futur';
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

  const cardBackground = useThemeColor({}, 'cardBlue');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');

  // Use dateCaptured if available, fallback to createdAt
  const dateString = capture.dateCaptured || capture.createdAt || '';

  // API sends time in UTC but incorrectly labels it with +02:00
  // Strip the incorrect timezone and add 'Z' to parse as UTC
  const dateWithoutTz = dateString.replace(/[+-]\d{2}:\d{2}$/, '');
  const utcDateString = dateWithoutTz + 'Z';

  const date = new Date(utcDateString);

  // For relative time, pass the UTC string
  const relativeTime = formatDate(utcDateString);

  const actualTime = date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <View style={[styles.card, { backgroundColor: cardBackground }]}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.headerText}>
          <Text style={[styles.description, { color: textColor }]}>{capture.description}</Text>
          <Text style={[styles.timestamp, { color: secondaryTextColor }]}>{actualTime} • {relativeTime}</Text>
        </View>
      </View>
      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color: tintColor }]}>{capture.value}</Text>
        {unit && <Text style={[styles.unit, { color: secondaryTextColor }]}>{unit}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
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
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: -1,
  },
  unit: {
    fontSize: 24,
    fontWeight: '500',
    marginLeft: 4,
  },
});
