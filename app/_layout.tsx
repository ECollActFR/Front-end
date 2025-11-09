import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, Platform, View } from 'react-native';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import useUserStore from '@/store/userStore';

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
  const token = useUserStore((state) => state.token);
  const isLoading = useUserStore((state) => state.isLoading);
  const validateToken = useUserStore((state) => state.validateToken);
  const loadUserInfo = useUserStore((state) => state.loadUserInfo);
  const router = useRouter();
  const segments = useSegments();

  // Valider le token au démarrage
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        const isValid = await validateToken();
        if (isValid) {
          await loadUserInfo();
        }
      }
    };
    initAuth();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    // Routes protégées
    const protectedRoutes = ['(tabs)', 'settings', 'index'];
    const currentRoute = segments.join('/');

    const isProtected = protectedRoutes.some((r) => currentRoute.startsWith(r));

    if (isProtected && !token) {
      router.replace('/sign-in');
    }
  }, [segments, token, isLoading]);

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
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
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
    <AuthGuard>
      <RootLayoutContent />
    </AuthGuard>
  );
}
