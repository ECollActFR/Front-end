import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorSchemeName, useColorScheme as useSystemColorScheme } from 'react-native';

// Theme preference: 'auto' means follow system, 'light' or 'dark' means fixed theme
export type ThemePreference = 'auto' | 'light' | 'dark';

type ThemeContextType = {
  // The actual color scheme being used (light or dark)
  colorScheme: ColorSchemeName;
  // The user's preference (auto, light, or dark)
  themePreference: ThemePreference;
  // Set the user's preference
  setThemePreference: (preference: ThemePreference) => void;
  // Toggle between light and dark (sets preference to that specific theme)
  toggleColorScheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@app_theme_preference';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useSystemColorScheme();
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('auto');
  const [isLoading, setIsLoading] = useState(true);

  // Calculate the actual color scheme based on preference and system theme
  const colorScheme: ColorSchemeName =
    themePreference === 'auto'
      ? systemColorScheme ?? 'light'
      : themePreference;

  // Load saved theme preference on mount
  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const savedPreference = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedPreference === 'auto' || savedPreference === 'dark' || savedPreference === 'light') {
        setThemePreferenceState(savedPreference);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setThemePreference = async (preference: ThemePreference) => {
    try {
      setThemePreferenceState(preference);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, preference);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const toggleColorScheme = () => {
    const newScheme = colorScheme === 'dark' ? 'light' : 'dark';
    setThemePreference(newScheme);
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <ThemeContext.Provider value={{ colorScheme, themePreference, setThemePreference, toggleColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
