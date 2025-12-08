import { vi } from 'vitest';

// Mock Expo Secure Store
vi.mock('expo-secure-store', () => ({
  getItemAsync: vi.fn(),
  setItemAsync: vi.fn(),
  deleteItemAsync: vi.fn(),
}));

// Mock AsyncStorage
vi.mock('@react-native-async-storage/async-storage', () => ({
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

// Mock React Native modules
vi.mock('react-native-reanimated', () => ({
  default: {
    call: () => {},
  },
  Value: vi.fn(),
  event: vi.fn(),
}));

vi.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock Expo modules
vi.mock('expo-constants', () => ({
  default: {},
}));

vi.mock('expo-font', () => ({
  loadAsync: vi.fn(),
}));

vi.mock('expo-asset', () => ({
  Asset: {
    fromModule: vi.fn(() => ({
      downloadAsync: vi.fn(),
    })),
  },
}));