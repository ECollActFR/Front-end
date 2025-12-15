/**
 * Main RoomAnalytics component for displaying historical sensor data
 */

import { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { chartService } from '@/services/chartService';
import { NativeLineChart } from '@/components/molecules/NativeLineChart';
import { useRoomLast7DaysData } from '@/hooks/useRoomLast7DaysData';

interface RoomAnalyticsProps {
  roomId: number;
  sensorTypes: string[];
  isDesktop?: boolean;
}

export function RoomAnalytics({ 
  roomId, 
  sensorTypes, 
  isDesktop = false 
}: RoomAnalyticsProps) {
  const [selectedSensor, setSelectedSensor] = useState<string>(sensorTypes[0] || 'Température');
  
  const textColor = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const borderColor = useThemeColor({}, 'border');
  const tintColor = useThemeColor({}, 'tint');

  // Get color configuration for sensors
  const sensorColors = chartService.getSensorColors();
  
  // Get color for selected sensor
  const getSensorColor = (sensorType: string) => {
    return sensorColors[sensorType] || sensorColors.default;
  };

  // Fetch last 7 days data using new API
  const { data: chartDataByType, isLoading, error } = useRoomLast7DaysData({ roomId });

  // Get data for selected sensor
  const selectedSensorData = chartDataByType?.find(
    data => data.type.name === selectedSensor
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={tintColor} />
        <Text style={[styles.loadingText, { color: textColor }]}>
          Chargement des données...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={[styles.errorText, { color: textColor }]}>
          Erreur lors du chargement des données
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>
          📊 Analyse des Capteurs
        </Text>
        <Text style={[styles.subtitle, { color: textSecondary }]}>
          Données des 7 derniers jours
        </Text>
      </View>

      {/* Sensor Type Selector */}
      {sensorTypes.length > 1 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.sensorSelector}
          contentContainerStyle={styles.sensorSelectorContent}
        >
          {sensorTypes.map((sensorType) => (
            <TouchableOpacity
              key={sensorType}
              style={[
                styles.sensorButton,
                selectedSensor === sensorType && {
                  backgroundColor: tintColor,
                  borderColor: tintColor,
                },
                { borderColor }
              ]}
              onPress={() => setSelectedSensor(sensorType)}
            >
              <Text style={[
                styles.sensorButtonText,
                { color: selectedSensor === sensorType ? '#fff' : textColor }
              ]}>
                {getSensorIcon(sensorType)} {sensorType}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Chart */}
      <View style={styles.chartContainer}>
        <NativeLineChart
          data={selectedSensorData?.data || []}
          height={300}
          pointColor={getSensorColor(selectedSensor)}
          lineColor={getSensorColor(selectedSensor)}
        />
      </View>

      {/* Statistics Summary */}
      {selectedSensorData && (
        <View style={styles.statsContainer}>
          <Text style={[styles.statsTitle, { color: textColor }]}>
            Statistiques pour {selectedSensor}
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: getSensorColor(selectedSensor) }]}>
                {selectedSensorData.stats.min}
              </Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>
                Minimum
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: getSensorColor(selectedSensor) }]}>
                {selectedSensorData.stats.max}
              </Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>
                Maximum
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: getSensorColor(selectedSensor) }]}>
                {selectedSensorData.stats.avg.toFixed(1)}
              </Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>
                Moyenne
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: getSensorColor(selectedSensor) }]}>
                {selectedSensorData.stats.count}
              </Text>
              <Text style={[styles.statLabel, { color: textSecondary }]}>
                Points
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

// Helper function to get sensor icon
function getSensorIcon(sensorType: string): string {
  const icons: Record<string, string> = {
    'Température': '🌡️',
    'Humidité': '💧',
    'CO2': '🌬️',
    'Lumière': '💡',
    'Pression': '🌊',
  };
  return icons[sensorType] || '📊';
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 20,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  header: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  sensorSelector: {
    marginBottom: 20,
  },
  sensorSelectorContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  sensorButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  sensorButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  chartContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  statsContainer: {
    paddingHorizontal: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});