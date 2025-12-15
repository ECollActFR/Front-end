import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorSchemeName, useColorScheme as useSystemColorScheme } from 'react-native';

export type Language = 'fr' | 'en';
export type ThemePreference = 'auto' | 'light' | 'dark';

interface SettingsState {
    language: Language;
    themePreference: ThemePreference;
}

interface SettingsContextType extends SettingsState {
    setLanguage: (language: Language) => void;
    setThemePreference: (preference: ThemePreference) => void;
    toggleColorScheme: (currentColorScheme: ColorSchemeName) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEY = 'settings-storage';

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('fr');
    const [themePreference, setThemePreferenceState] = useState<ThemePreference>('auto');

    // Hydrate from AsyncStorage on mount
    useEffect(() => {
        const hydrate = async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const settings = JSON.parse(stored);
                    setLanguageState(settings.language || 'fr');
                    setThemePreferenceState(settings.themePreference || 'auto');
                }
            } catch (error) {
                console.error('Error hydrating settings store:', error);
            }
        };

        hydrate();
    }, []);

    // Persist to AsyncStorage whenever settings change
    const persistSettings = async (newSettings: Partial<SettingsState>) => {
        try {
            const current = { language, themePreference, ...newSettings };
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(current));
        } catch (error) {
            console.error('Error persisting settings:', error);
        }
    };

    const setLanguage = (newLanguage: Language) => {
        setLanguageState(newLanguage);
        persistSettings({ language: newLanguage, themePreference });
    };

    const setThemePreference = (preference: ThemePreference) => {
        setThemePreferenceState(preference);
        persistSettings({ language, themePreference: preference });
    };

    const toggleColorScheme = (currentColorScheme: ColorSchemeName) => {
        const newScheme = currentColorScheme === 'dark' ? 'light' : 'dark';
        setThemePreference(newScheme);
    };

    const value: SettingsContextType = {
        language,
        themePreference,
        setLanguage,
        setThemePreference,
        toggleColorScheme,
    };

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}

// Note: useColorScheme hook is moved to a separate file to avoid circular dependency
