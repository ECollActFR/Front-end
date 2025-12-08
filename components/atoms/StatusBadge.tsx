import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTranslation } from '@/hooks/useTranslation';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'error';
  size?: 'small' | 'medium';
}

export default function StatusBadge({ status, size = 'medium' }: StatusBadgeProps) {
  const tintColor = useThemeColor({}, 'tint');
  const accentOrange = useThemeColor({}, 'accentOrange');
  const secondaryTextColor = useThemeColor({}, 'icon');
  const { t } = useTranslation();

  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return tintColor; // Green #7E9F78
      case 'inactive':
        return secondaryTextColor; // Gray
      case 'error':
        return accentOrange; // Orange #ef7b45
      default:
        return secondaryTextColor;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'active':
        return t.acquisitionSystems?.statusActive || 'Actif';
      case 'inactive':
        return t.acquisitionSystems?.statusInactive || 'Inactif';
      case 'error':
        return t.acquisitionSystems?.statusError || 'Erreur';
      default:
        return status;
    }
  };

  const statusColor = getStatusColor();
  const statusText = getStatusText();
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: statusColor + '20', borderColor: statusColor },
        isSmall && styles.badgeSmall,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: statusColor }]} />
      <Text style={[styles.text, { color: statusColor }, isSmall && styles.textSmall]}>
        {statusText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  badgeSmall: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  textSmall: {
    fontSize: 10,
  },
});
