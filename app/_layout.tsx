import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, Platform, View } from 'react-native';
import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useAuth, AuthProvider } from '@/contexts/AuthContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { queryClient } from '@/config/queryClient';
import { tokenManager } from '@/services/tokenManager';

// Initialize token manager
tokenManager.initialize();

// Only import react-native-reanimated on native platforms
if (Platform.OS !== 'web') {
  require('react-native-reanimated');
}

export const unstable_settings = {
  anchor: '(tabs)',
};

// ---- Thèmes custom ----
const LightNavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.light.tint,
    background: Colors.light.background,
    card: Colors.light.background,
    text: Colors.light.text,
    border: Colors.light.border,
    notification: Colors.light.accentOrange,
  },
};

const DarkNavigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.dark.tint,
    background: Colors.dark.background,
    card: Colors.dark.background,
    text: Colors.dark.text,
    border: Colors.dark.border,
    notification: Colors.dark.accentOrange,
  },
};

// ---- AuthGuard ----
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { token, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    console.log('AuthGuard: token:', token, 'isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);
    if (isLoading) return;

    // Routes protégées
    const protectedRoutes = ['(tabs)', 'settings', 'index'];
    const currentRoute = segments.join('/');

    const isProtected = protectedRoutes.some((r) => currentRoute.startsWith(r));

    console.log('AuthGuard: isProtected:', isProtected, 'currentRoute:', currentRoute);

    if (isProtected && !token) {
      console.log('AuthGuard: redirecting to sign-in');
      router.replace('/sign-in');
    }
  }, [segments, token, isLoading, isAuthenticated]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}

// ---- Layout principal ----
function RootLayoutContent() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkNavigationTheme : LightNavigationTheme}>
        <Stack>
          {/* Routes */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="room/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

// ---- Composition globale ----
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <AuthProvider>
          <AuthGuard>
            <RootLayoutContent />
          </AuthGuard>
        </AuthProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}
