/**
 * Application configuration constants
 */

export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000/api',
  TIMEOUT: 10000, // 10 seconds
} as const;

export const ENDPOINTS = {
  ROOMS: '/rooms',
  ROOM_DETAIL: (roomId: number) => `/rooms/${roomId}/last`,
} as const;
