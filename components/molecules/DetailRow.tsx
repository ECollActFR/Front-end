import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from '../atoms/Icon';
import { useThemeColor } from '@/hooks/use-theme-color';

type IconName = 'users' | 'map-pin' | 'wifi' | 'monitor' | 'coffee' | 'check';

interface DetailRowProps {
  icon: IconName;
  label: string;
  value: string;
}

export default function DetailRow({ icon, label, value }: DetailRowProps) {
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');

  return (
    <View style={[styles.container, { borderBottomColor: secondaryTextColor + '40' }]}>
      <View style={[styles.iconContainer, { backgroundColor: tintColor + '20' }]}>
        <Icon name={icon} size={20} color={tintColor} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.label, { color: secondaryTextColor }]}>{label}</Text>
        <Text style={[styles.value, { color: textColor }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
});
