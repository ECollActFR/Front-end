import { useColorScheme as useColorSchemeFromStore } from '@/store/settingsStore';

export function useColorScheme() {
  return useColorSchemeFromStore();
}
