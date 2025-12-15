import { ColorSchemeName, useColorScheme as useSystemColorScheme } from 'react-native';
import { useSettings } from '@/contexts/SettingsContext';

export function useColorScheme(): ColorSchemeName {
    const systemColorScheme = useSystemColorScheme();
    const { themePreference } = useSettings();

    const colorScheme: ColorSchemeName =
        themePreference === 'auto'
            ? systemColorScheme ?? 'light'
            : themePreference;

    return colorScheme;
}
