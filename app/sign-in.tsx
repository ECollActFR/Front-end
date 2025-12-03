import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/userService';
import { Colors } from '@/constants/theme';

export default function SignInScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { login, isLoginPending } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleSignIn = async () => {
    // Validation
    if (!username.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    try {
      // Call login with TanStack Query
      await login({
        username: username.trim(),
        password: password.trim(),
      });

      // Navigate to home
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Login error:', error);

      // Show error message
      const errorMessage = error?.message?.includes('401') || error?.status === 401
        ? 'Identifiants incorrects'
        : 'Erreur de connexion. Veuillez réessayer.';

      Alert.alert('Erreur de connexion', errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.formWrapper}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              Neutria
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Confort au travail et performance énergétique
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Nom d&apos;utilisateur
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.backgroundSecondary,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="Entrez votre nom d&apos;utilisateur"
                placeholderTextColor={colors.textSecondary + '80'}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoginPending}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Mot de passe
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.backgroundSecondary,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="Entrez votre mot de passe"
                placeholderTextColor={colors.textSecondary + '80'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoginPending}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: colors.tint },
                isLoginPending && styles.buttonDisabled,
              ]}
              onPress={handleSignIn}
              disabled={isLoginPending}
            >
              {isLoginPending ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Se connecter</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Version 1.0.0
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  formWrapper: {
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 440 : undefined,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 48,
  },
  footerText: {
    fontSize: 12,
  },
});
