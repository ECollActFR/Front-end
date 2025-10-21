import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

interface InputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function Input({ value, onChangeText, style, ...props }: InputProps) {
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'icon');

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      style={[styles.input, { color: textColor }, style]}
      placeholderTextColor={placeholderColor}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    paddingLeft: 40,
    paddingRight: 16,
    paddingVertical: 10,
    fontSize: 14,
  },
});
