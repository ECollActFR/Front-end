import { useEffect, useState } from 'react';
import { ColorSchemeName } from 'react-native';
import { useSettings } from '@/contexts/SettingsContext';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme(): ColorSchemeName {
  const [hasHydrated, setHasHydrated] = useState(false);
  const { themePreference } = useSettings();

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // For web, we'll use themePreference directly
  // In a real implementation, you might want to use matchMedia for system preference
  const colorScheme: ColorSchemeName = themePreference === 'auto' ? 'light' : themePreference;

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}
