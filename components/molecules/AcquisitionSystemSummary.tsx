import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AcquisitionSystem } from '@/types/acquisitionSystem';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTranslation } from '@/hooks/useTranslation';
import StatusBadge from '@/components/atoms/StatusBadge';

interface AcquisitionSystemSummaryProps {
  system: AcquisitionSystem | null;
  onPress: () => void;
  loading?: boolean;
}

export default function AcquisitionSystemSummary({
  system,
  onPress,
  loading = false
}: AcquisitionSystemSummaryProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');

  const { t } = useTranslation();

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor, borderColor: secondaryTextColor }]}>
        <ActivityIndicator size="small" color={tintColor} />
        <Text style={[styles.loadingText, { color: secondaryTextColor }]}>
          Chargement...
        </Text>
      </View>
    );
  }

  if (!system) {
    return (
      <TouchableOpacity
        style={[styles.container, styles.emptyContainer, { backgroundColor, borderWidth: 1, borderColor: secondaryTextColor }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.content}>
          <Text style={[styles.title, { color: secondaryTextColor }]}>
            {t.editRoom?.acquisitionSystemPlaceholder || 'Sélectionner un système d\'acquisition'}
          </Text>
          <Text style={[styles.subtitle, { color: secondaryTextColor }]}>
            Appuyez pour choisir un système
          </Text>
        </View>
        <Text style={[styles.arrow, { color: secondaryTextColor }]}>›</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor, borderWidth: 1, borderColor: secondaryTextColor }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>{system.name}</Text>
          <StatusBadge status={system.systemStatus} size="small" />
        </View>
        <Text style={[styles.subtitle, { color: secondaryTextColor }]}>
          {system.deviceType} • {system.firmwareVersion}
        </Text>
        <View style={styles.stats}>
          <Text style={[styles.statText, { color: secondaryTextColor }]}>
            {system.activeSensorsCount} capteurs actifs
          </Text>
          <Text style={[styles.statText, { color: secondaryTextColor }]}>
            {system.enabledTasksCount} tâches activées
          </Text>
        </View>
      </View>
      <Text style={[styles.arrow, { color: secondaryTextColor }]}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  emptyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
  },
  statText: {
    fontSize: 12,
  },
  arrow: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  loadingText: {
    fontSize: 14,
  },
});