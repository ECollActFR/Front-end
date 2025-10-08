/**
 * Room type definitions
 */

export type Amenity = 'wifi' | 'monitor' | 'coffee';

// API Response Room (from backend)
export interface ApiRoom {
  '@id': string;
  '@type': string;
  id: number;
  name: string;
  description: string;
}

// Capture Type
export interface CaptureType {
  id: number;
  name: string;
  description: string;
}

// Capture (sensor data)
export interface Capture {
  id: number;
  value: string;
  description: string;
  createdAt: string;
}

// Last Capture by Type
export interface LastCaptureByType {
  type: CaptureType;
  capture: Capture;
}

// Room Detail Response
export interface RoomDetailResponse {
  success: number;
  data: {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    lastCapturesByType: LastCaptureByType[];
  };
}

// UI Room (enhanced with UI-specific fields)
export interface Room {
  id: number;
  name: string;
  available: boolean;
  amenities: Amenity[];
  color: string;
  description?: string;
}

// Room Detail with sensor data
export interface RoomDetail extends Room {
  lastCapturesByType: LastCaptureByType[];
  createdAt?: string;
}

// Hydra Collection Response
export interface HydraCollection<T> {
  '@context': string;
  '@id': string;
  '@type': string;
  totalItems: number;
  member: T[];
  view?: {
    '@id': string;
    '@type': string;
  };
}

export interface ApiError {
  message: string;
  status?: number;
}
