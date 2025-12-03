import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../atoms';
import Icon from '../atoms/Icon';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTranslation } from '@/hooks/useTranslation';
import { useNotification } from '@/contexts/NotificationContext';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  isAuthError?: boolean;
}

export default function ErrorMessage({ message, onRetry, isAuthError }: ErrorMessageProps) {
  const router = useRouter();
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'icon');
  const accentOrange = useThemeColor({}, 'accentOrange');
  const { showNotification } = useNotification();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name={isAuthError ? "wifi" : "wifi"} size={48} color={accentOrange} />
      </View>
      <Text style={[styles.title, { color: textColor }]}>
        {isAuthError ? 'Session expirée' : 'Oups !'}
      </Text>
      <Text style={[styles.message, { color: secondaryTextColor }]}>
        {isAuthError 
          ? 'Votre session a expiré. Veuillez vous reconnecter.' 
          : message
        }
      </Text>
      {onRetry && !isAuthError && (
        <View style={styles.buttonContainer}>
          <Button title={t.home.retry} onPress={onRetry} />
        </View>
      )}
      {isAuthError && (
        <View style={styles.buttonContainer}>
          <Button title="Se reconnecter" onPress={() => {
            showNotification({
              type: 'info',
              title: 'Redirection',
              message: 'Redirection vers la page de connexion...',
              duration: 1000,
            });
            // Redirection immédiate vers la page de connexion
            setTimeout(() => {
              router.replace('/sign-in');
            }, 500);
          }} />
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
