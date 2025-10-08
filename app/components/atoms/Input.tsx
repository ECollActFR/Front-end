import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function Input({ value, onChangeText, style, ...props }: InputProps) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      style={[styles.input, style]}
      placeholderTextColor="#9CA3AF"
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
    color: '#111827',
  },
});
