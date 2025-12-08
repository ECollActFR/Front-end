import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

interface ConfigRowProps {
  label: string;
  value: string | number | boolean;
  icon?: string; // IconSymbol name
}

export default function ConfigRow({ label, value, icon }: ConfigRowProps) {
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'icon');
  const borderColor = useThemeColor({}, 'border');

  // Format boolean values
  const formatValue = (val: string | number | boolean): string => {
    if (typeof val === 'boolean') {
      return val ? 'Activé' : 'Désactivé';
    }
    return String(val);
  };

  const displayValue = formatValue(value);

  return (
    <View style={[styles.row, { borderBottomColor: borderColor }]}>
      <View style={styles.labelContainer}>
        {icon && (
          <IconSymbol
            name={icon}
            size={16}
            color={secondaryTextColor}
            style={styles.icon}
          />
        )}
        <Text style={[styles.label, { color: secondaryTextColor }]}>{label}</Text>
      </View>
      <Text style={[styles.value, { color: textColor }]} numberOfLines={1}>
        {displayValue}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    gap: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  icon: {
    flexShrink: 0,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  value: {
    fontSize: 14,
    textAlign: 'right',
    flexShrink: 0,
    maxWidth: '50%',
  },
});
