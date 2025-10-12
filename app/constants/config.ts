/**
 * Application configuration constants
 */

export const API_CONFIG = {
  BASE_URL: 'https://api.climesense.fr/api',
  TIMEOUT: 10000, // 10 seconds
} as const;

export const ENDPOINTS = {
  ROOMS: '/rooms',
  ROOM_DETAIL: (roomId: number) => `/rooms/${roomId}/last`,
  ROOM: (roomId: number) => `/rooms/${roomId}`,
  ROOM_UPDATE: (roomId: number) => `/rooms/${roomId}`,
  ROOM_DELETE: (roomId: number) => `/rooms/${roomId}`,
  CAPTURE_TYPES: '/capture_types',
} as const;
