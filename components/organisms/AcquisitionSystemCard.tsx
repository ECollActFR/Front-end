import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import StatusBadge from '@/components/atoms/StatusBadge';
import { AcquisitionSystem } from '@/types/acquisitionSystem';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTranslation } from '@/hooks/useTranslation';

interface AcquisitionSystemCardProps {
  system: AcquisitionSystem;
  onPress: () => void;
  index: number;
  selectionMode?: boolean;
  isSelected?: boolean;
}

export default function AcquisitionSystemCard({
  system,
  onPress,
  index,
  selectionMode = false,
  isSelected = false,
}: AcquisitionSystemCardProps) {
  const cardGreen = useThemeColor({}, 'cardGreen');
  const cardBlue = useThemeColor({}, 'cardBlue');
  const cardBackground = index % 2 === 0 ? cardBlue : cardGreen;
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      style={[
        styles.card, 
        { backgroundColor: cardBackground },
        selectionMode && isSelected && styles.selectedCard,
        selectionMode && { borderColor: tintColor, borderWidth: 2 }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {/* Header row: name + firmware version */}
        <View style={styles.headerRow}>
          <View style={styles.nameContainer}>
            <Text style={[styles.name, { color: textColor }]}>{system.name}</Text>
            <Text style={[styles.firmware, { color: secondaryTextColor }]}>
              v{system.firmwareVersion}
            </Text>
          </View>
          {selectionMode ? (
            <View style={[styles.radio, { borderColor: tintColor }]}>
              {isSelected && (
                <View style={[styles.radioSelected, { backgroundColor: tintColor }]} />
              )}
            </View>
          ) : (
            <IconSymbol name="chevron.right" size={20} color={secondaryTextColor} />
          )}
        </View>

        {/* Device type + Status badge */}
        <View style={styles.row}>
          <Text style={[styles.deviceType, { color: secondaryTextColor }]}>
            {system.deviceType}
          </Text>
          <StatusBadge status={system.systemStatus} size="small" />
        </View>

        {/* Room info (if available) */}
        {system.roomName && (
          <View style={styles.infoRow}>
            <IconSymbol name="house.fill" size={14} color={secondaryTextColor} />
            <Text style={[styles.infoText, { color: secondaryTextColor }]}>
              {system.roomName}
            </Text>
          </View>
        )}

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <IconSymbol name="sensor.fill" size={14} color={secondaryTextColor} />
            <Text style={[styles.statText, { color: secondaryTextColor }]}>
              {system.activeSensorsCount} {t.acquisitionSystems?.activeSensors || 'capteurs actifs'}
            </Text>
          </View>
          <View style={styles.stat}>
            <IconSymbol name="list.bullet" size={14} color={secondaryTextColor} />
            <Text style={[styles.statText, { color: secondaryTextColor }]}>
              {system.enabledTasksCount} {t.acquisitionSystems?.enabledTasks || 'tâches actives'}
            </Text>
          </View>
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
    marginBottom: 8,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  firmware: {
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deviceType: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 4,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
  },
  selectedCard: {
    shadowOpacity: 0.3,
    elevation: 6,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
