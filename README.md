# Neutria - Front-end

A cross-platform mobile and web application built with Expo and React Native, featuring room management functionality with create, edit, and delete capabilities.

## Features

- Cross-platform support (iOS, Android, Web)
- File-based routing with Expo Router
- Room management (create, edit, delete)
- Dark mode / Light mode theming
- Modern UI with React Navigation 7
- Smooth animations with Reanimated

## Tech Stack

- **Framework**: React Native 0.81.4 with React 19.1.0
- **Platform**: Expo SDK ~54.0.12
- **Routing**: Expo Router ~6.0.10 (file-based routing)
- **Navigation**: React Navigation 7 (bottom tabs, native stack)
- **Animations**: React Native Reanimated ~4.1.1
- **Gestures**: React Native Gesture Handler ~2.28.0
- **Language**: TypeScript 5.9.2

## Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- For iOS development: macOS with Xcode
- For Android development: Android Studio with Android SDK

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Front-end
```

2. Navigate to the app directory:
```bash
cd app
```

3. Install dependencies:
```bash
npm install
```

### Running the Application

Start the Expo development server:
```bash
npm start
# or
npx expo start
```

This will open the Expo DevTools in your browser. From there, you can:

#### Run on Web
```bash
npm run web
```
Access the web app at `http://localhost:8081`

#### Run on iOS Simulator
```bash
npm run ios
```
Requires macOS and Xcode installed.

#### Run on Android Emulator
```bash
npm run android
```
Requires Android Studio and an Android emulator configured.

#### Run on Physical Device
Scan the QR code shown in the terminal with:
- **iOS**: Camera app or Expo Go app
- **Android**: Expo Go app

## Project Structure

```
app/
├── app/                      # Application routes (file-based routing)
│   ├── (tabs)/              # Tab-based navigation group
│   │   ├── _layout.tsx      # Tab bar layout
│   │   ├── index.tsx        # Home screen
│   │   └── explore.tsx      # Explore screen
│   ├── _layout.tsx          # Root layout
│   └── modal.tsx            # Modal screen
├── components/              # Reusable components
│   ├── ui/                  # UI primitives
│   │   ├── collapsible.tsx
│   │   └── icon-symbol.ios.tsx
│   ├── external-link.tsx
│   ├── haptic-tab.tsx
│   ├── parallax-scroll-view.tsx
│   ├── themed-text.tsx
│   └── themed-view.tsx
├── constants/               # App constants and theme
│   └── theme.ts
├── hooks/                   # Custom React hooks
│   ├── use-color-scheme.ts
│   └── use-theme-color.ts
└── scripts/                 # Build and utility scripts
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the Expo development server |
| `npm run web` | Run the app in web browser |
| `npm run ios` | Run the app on iOS simulator |
| `npm run android` | Run the app on Android emulator |
| `npm run lint` | Run ESLint to check code quality |
| `npm run reset-project` | Reset project structure (move starter code to app-example) |

## Architecture

### Routing
The app uses Expo Router for file-based routing. Routes are automatically generated based on the file structure in the `app/` directory:
- Files become routes
- Folders with parentheses like `(tabs)` are layout groups
- `_layout.tsx` files define layout wrappers

### Theming
- Supports light and dark modes
- Theme defined in `constants/theme.ts`
- Uses `@react-navigation/native` theme provider
- Custom hooks (`use-color-scheme`, `use-theme-color`) for theme access

### Path Aliases
The project uses `@/*` as an import alias for cleaner imports:
```typescript
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
```

### Platform-Specific Code
Use file extensions for platform-specific implementations:
- `.ios.tsx` - iOS-specific
- `.android.tsx` - Android-specific
- `.web.tsx` - Web-specific
- `.tsx` - Default for all platforms

## Development Guidelines

### React Native Compatibility
- Do not use web-only libraries (Radix UI, Headless UI, etc.)
- Use React Native's built-in `Modal` component for dialogs
- Always verify package compatibility with React Native before installing

### Code Style
- Run `npm run lint` before committing
- Follow TypeScript best practices
- Use the `@/` path alias for imports

## Recent Updates

- Fixed notification bar on room detail screen for delete and modify buttons
- Added edit and delete room functionality
- Initial web app view implementation

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run `npm run lint` to check code quality
4. Commit with descriptive messages
5. Push and create a pull request

## Troubleshooting

### Metro bundler issues
```bash
# Clear Metro bundler cache
npx expo start -c
```

### iOS build issues
```bash
cd ios
pod install
cd ..
```

### Android build issues
```bash
cd android
./gradlew clean
cd ..
```

## License

[Add your license here]

## Contact

[Add contact information or links here]