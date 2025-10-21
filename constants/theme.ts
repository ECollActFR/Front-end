/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#7E9F78';
const tintColorDark = '#7E9F78';

export const Colors = {
  light: {
    text: '#7692ff', // Textes principaux (bleu)
    textSecondary: '#1E2E3D', // Textes secondaires (bleu nuit)
    background: '#F3F4F6', // Couleur d'arrière plan (gris moderne)
    backgroundSecondary: '#FFFFFF', // Arrière plan secondaire (blanc)
    cardGreen: '#F5F7F3', // Fond carte vert olive subtil
    cardBlue: '#F6F8FC', // Fond carte bleu subtil
    cardNeutral: '#FAFAFA', // Fond carte neutre
    tint: tintColorLight, // Boutons (vert olive)
    icon: '#7E9F78', // Icônes
    tabIconDefault: '#7E9F78',
    tabIconSelected: tintColorLight,
    accentOrange: '#ef7b45', // Liens (orange)
    border: '#7E9F78', // Bordures
  },
  dark: {
    text: '#EAECEB', // Textes principaux (gris clair pour contraste)
    textSecondary: '#7692ff', // Textes secondaires (bleu)
    background: '#1E2E3D', // Couleur d'arrière plan (bleu nuit)
    backgroundSecondary: '#2A3F54', // Arrière plan secondaire (bleu nuit plus clair)
    cardGreen: '#2A3F48', // Fond carte vert olive subtil (mode sombre)
    cardBlue: '#2A3850', // Fond carte bleu subtil (mode sombre)
    cardNeutral: '#2A3F54', // Fond carte neutre (mode sombre)
    tint: tintColorDark, // Boutons (vert olive)
    icon: '#7E9F78', // Icônes
    tabIconDefault: '#7E9F78',
    tabIconSelected: tintColorDark,
    accentOrange: '#ef7b45', // Liens (orange)
    border: '#7E9F78', // Bordures
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
