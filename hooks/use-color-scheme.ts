import { useColorScheme as useColorSchemeFromContext } from '@/contexts/SettingsContext';

export function useColorScheme() {
  return useColorSchemeFromContext();
}
