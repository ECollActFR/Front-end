/**
 * Application configuration constants
 */

import { Platform } from 'react-native';

// Get API base URL from environment variables with fallback
const getApiBaseUrl = (): string => {
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  if (envUrl) {
    // If running on Android and URL uses localhost, replace with 10.0.2.2
    if (Platform.OS === 'android' && envUrl.includes('localhost')) {
      return envUrl.replace('localhost', '10.0.2.2');
    }
    return envUrl;
  }

  // Fallback URLs based on platform
  console.warn('EXPO_PUBLIC_API_BASE_URL not set, using default development URL');

  if (Platform.OS === 'android') {
    // Android emulator: 10.0.2.2 points to host machine's localhost
    return 'http://10.0.2.2:8000/api';
  }

  // iOS simulator and web: localhost works fine
  return 'http://localhost:8000/api';
};

// Get API timeout from environment variables with fallback
const getApiTimeout = (): number => {
  const envTimeout = process.env.EXPO_PUBLIC_API_TIMEOUT;
  return envTimeout ? parseInt(envTimeout, 10) : 10000;
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: getApiTimeout(),
} as const;

export const ENDPOINTS = {
  ROOMS: '/rooms',
  ROOM_CREATE: '/rooms',
  ROOM_DETAIL: (roomId: number) => `/rooms/${roomId}/last`,
  ROOM: (roomId: number) => `/rooms/${roomId}`,
  ROOM_UPDATE: (roomId: number) => `/rooms/${roomId}`,
  ROOM_DELETE: (roomId: number) => `/rooms/${roomId}`,
  CAPTURE_TYPES: '/capture_types',
} as const;
