import { Tabs , useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useIsSuperAdmin } from '@/hooks/useRoleCheck';
import { useAuth } from '@/contexts/AuthContext';
// ---- Tabs AuthGuard ----
function TabsAuthGuard({ children }: { children: React.ReactNode }) {
  const { token, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    console.log('TabsAuthGuard: token:', token, 'isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);
    if (isLoading) return;

    // Routes protégées dans les tabs
    const protectedTabsRoutes = ['index', 'settings', 'acquisition-systems', 'admin', 'user'];
    const currentSegment = segments[segments.length - 1]; // Get last segment

    const isProtected = currentSegment ? protectedTabsRoutes.includes(currentSegment) : false;

    console.log('TabsAuthGuard: isProtected:', isProtected, 'currentSegment:', currentSegment);

    // Use isAuthenticated instead of just token for better security
    if (isProtected && !isAuthenticated && currentSegment !== 'sign-in') {
      console.log('TabsAuthGuard: redirecting to sign-in (not authenticated)');
      router.replace('/sign-in');
    }
  }, [segments, token, isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const isSuperAdmin = useIsSuperAdmin();

  return (
    <TabsAuthGuard>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
        }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t.nav.home,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t.nav.settings,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: t.nav.user,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person" color={color} />,
        }}
      />
      <Tabs.Screen
        name="acquisition-systems"
        options={{
          title: t.nav.acquisitionSystems || 'Systèmes',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="cpu.fill" color={color} />,
        }}
      />
      {isSuperAdmin && (
        <Tabs.Screen
          name="admin"
          options={{
            title: t.nav.admin,
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="shield.fill" color={color} />,
          }}
        />
      )}
      </Tabs>
    </TabsAuthGuard>
  );
}
