import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../atoms';
import Icon from '../atoms/Icon';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTranslation } from '@/hooks/useTranslation';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'icon');
  const accentOrange = useThemeColor({}, 'accentOrange');
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="wifi" size={48} color={accentOrange} />
      </View>
      <Text style={[styles.title, { color: textColor }]}>Oups !</Text>
      <Text style={[styles.message, { color: secondaryTextColor }]}>{message}</Text>
      {onRetry && (
        <View style={styles.buttonContainer}>
          <Button title={t.home.retry} onPress={onRetry} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
});
