/**
 * Room type definitions
 */

export type Amenity = 'wifi' | 'monitor' | 'coffee';

// API Equipment
export interface ApiEquipment {
  '@id': string;
  '@type': string;
  id: number;
  name: string;
  capacity: number;
}

// API Acquisition System
export interface ApiAcquisitionSystem {
  '@id': string;
  '@type': string;
  id: number;
  name: string;
}

// API Capture Type
export interface ApiCaptureType {
  '@id': string;
  '@type': string;
  id: number;
  name: string;
  description: string;
}

// API Response Room (from backend)
export interface ApiRoom {
  '@id': string;
  '@type': string;
  id: number;
  name: string;
  description: string;
  captureTypes: ApiCaptureType[];
  createdAt: string;
  acquisitionSystems: ApiAcquisitionSystem[];
  equipment: ApiEquipment[];
}

// Capture Type (UI simplified version)
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
  createdAt?: string;
  dateCaptured?: string;
}

// Last Capture by Type
export interface LastCaptureByType {
  type: CaptureType;
  capture: Capture;
}

// API Error Response
export interface ApiErrorResponse {
  type: string;
  title: string;
  status: number;
  detail: string;
  class?: string;
  trace?: any[];
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

// Equipment (UI simplified version)
export interface Equipment {
  id: number;
  name: string;
  capacity: number;
}

// UI Room (enhanced with UI-specific fields)
export interface Room {
  id: number;
  name: string;
  available: boolean;
  amenities: Amenity[];
  description?: string;
  equipment?: Equipment[];
  createdAt?: string;
  acquisitionSystems?: ApiAcquisitionSystem[];
}

// Room Detail with sensor data
export interface RoomDetail extends Room {
  lastCapturesByType: LastCaptureByType[];
  captureTypes?: CaptureType[];
  acquisitionSystems?: ApiAcquisitionSystem[];
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

// Room Update Payload
export interface RoomUpdatePayload {
  name: string;
  description: string;
  captureTypes: string[];
  acquisitionSystem?: string; // IRI of acquisition system or null/undefined
  buildingId?: number; // ID of building (e.g. 1, not /buildings/1)
}

// Room from API (includes building IRI)
export interface ApiRoomWithBuilding extends ApiRoom {
  building?: string; // IRI of building (e.g. /buildings/1)
}

// Utility functions for building IRI/ID conversion
export const buildingUtils = {
  // Extract numeric ID from building IRI
  extractId: (buildingIri?: string): number | undefined => {
    if (!buildingIri) return undefined;
    const match = buildingIri.match(/\/buildings\/(\d+)/);
    return match ? parseInt(match[1]) : undefined;
  },
  
  // Create IRI from numeric ID
  createIri: (buildingId?: number): string | undefined => {
    if (!buildingId) return undefined;
    return `/buildings/${buildingId}`;
  }
};

// API Room with Capture Types (for editing)
export interface ApiRoomWithCaptureTypes {
  '@id': string;
  '@type': string;
  id: number;
  name: string;
  description: string;
  captureTypes: string[] | ApiCaptureType[];
  createdAt?: string;
  equipment?: ApiEquipment[];
  acquisitionSystems?: ApiAcquisitionSystem[];
}
