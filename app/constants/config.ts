/**
 * Application configuration constants
 */

export const API_CONFIG = {
  BASE_URL: 'http://192.168.1.90:8000/api',
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
