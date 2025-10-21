/**
 * Application configuration constants
 */

// Get API base URL from environment variables with fallback
const getApiBaseUrl = (): string => {
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (!envUrl) {
    console.warn('EXPO_PUBLIC_API_BASE_URL not set, using default development URL');
    return 'http://localhost:8000/api';
  }
  return envUrl;
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
