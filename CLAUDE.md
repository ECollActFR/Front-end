# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Expo React Native application using Expo Router for file-based navigation. The app supports iOS, Android, and web platforms with React 19.1.0 and React Native 0.81.4.

## Commands

### Development
- `npm start` or `npx expo start` - Start the Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser

### Code Quality
- `npm run lint` - Run ESLint on the codebase

### Project Reset
- `npm run reset-project` - Move starter code to app-example and create blank app directory

## Architecture

### Routing
Uses Expo Router with file-based routing. Files in the `app/` directory automatically become routes:
- `app/_layout.tsx` - Root layout with Stack navigator and theme provider
- `app/(tabs)/_layout.tsx` - Tab bar layout with bottom tabs
- `app/(tabs)/index.tsx` - Home screen (default route)
- `app/(tabs)/explore.tsx` - Explore screen

The root layout sets `unstable_settings.anchor = '(tabs)'` to anchor navigation to the tabs group.

### Theming
- Theme defined in `constants/theme.ts` with light/dark mode color palettes
- Uses `@react-navigation/native` theme provider in root layout
- Platform-specific font definitions (iOS system fonts, web fonts)
- `use-color-scheme` hook provides color scheme detection (platform-specific for web)
- `use-theme-color` hook for accessing theme colors in components

### Components Structure
- `components/` - Shared components (themed text/view, parallax scroll, external link, haptic tab)
- `components/ui/` - UI primitives (icon-symbol with iOS-specific variant, collapsible)
- Components use `@/` path alias for imports (configured in tsconfig.json)
- Platform-specific files use `.ios.tsx` or `.web.tsx` extensions

### Key Dependencies
- **Expo Router** (~6.0.10) - File-based routing
- **React Navigation** (v7) - Bottom tabs, elements
- **react-native-reanimated** (~4.1.1) - Animations
- **react-native-gesture-handler** (~2.28.0) - Gestures
- **expo-symbols** (~1.0.7) - SF Symbols on iOS

## Important Notes

### React Native Compatibility
- **Do not use web-only libraries** like Radix UI, Headless UI, or any browser-specific packages
- For modals/dialogs, use React Native's built-in `Modal` component or React Native-specific libraries
- Always verify that packages support React Native before installing

### Path Aliases
The project uses `@/*` as an alias for the root directory (configured in tsconfig.json). Use this for all imports:
```typescript
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
```
