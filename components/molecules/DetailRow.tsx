import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from '../atoms/Icon';

type IconName = 'users' | 'map-pin' | 'wifi' | 'monitor' | 'coffee' | 'check';

interface DetailRowProps {
  icon: IconName;
  label: string;
  value: string;
}

export default function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name={icon} size={20} color="#7FB068" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
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
    borderBottomColor: '#F3F4F6',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
});
