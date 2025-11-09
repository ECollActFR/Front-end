import { useEffect, useState } from 'react';
import { useColorScheme as useColorSchemeFromContext } from '@/contexts/SettingsContext';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useColorSchemeFromContext();

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}
