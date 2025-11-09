import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorSchemeName, useColorScheme as useSystemColorScheme } from 'react-native';

export type Language = 'fr' | 'en';
export type ThemePreference = 'auto' | 'light' | 'dark';

interface SettingsState {
    // État
    language: Language;
    themePreference: ThemePreference;

    // Actions
    setLanguage: (language: Language) => void;
    setThemePreference: (preference: ThemePreference) => void;
    toggleColorScheme: (currentColorScheme: ColorSchemeName) => void;
}

const useSettingsStore = create<SettingsState>()(
    persist(
        (set, get) => ({
            // État initial
            language: 'fr',
            themePreference: 'auto',

            // Actions
            setLanguage: (language: Language) => {
                set({ language });
            },

            setThemePreference: (preference: ThemePreference) => {
                set({ themePreference: preference });
            },

            toggleColorScheme: (currentColorScheme: ColorSchemeName) => {
                const newScheme = currentColorScheme === 'dark' ? 'light' : 'dark';
                set({ themePreference: newScheme });
            },
        }),
        {
            name: 'settings-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

// Hook personnalisé pour obtenir le colorScheme effectif
export const useColorScheme = () => {
    const systemColorScheme = useSystemColorScheme();
    const themePreference = useSettingsStore((state) => state.themePreference);

    const colorScheme: ColorSchemeName =
        themePreference === 'auto'
            ? systemColorScheme ?? 'light'
            : themePreference;

    return colorScheme;
};

export default useSettingsStore;
