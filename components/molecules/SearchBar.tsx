import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon, Input } from '../atoms';
import { useThemeColor } from '@/hooks/use-theme-color';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Rechercher...',
}: SearchBarProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'icon');

  return (
    <View style={[styles.container, { backgroundColor, borderColor }]}>
      <Icon name="search" size={20} style={styles.icon} />
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  icon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  input: {
    flex: 1,
  },
});
