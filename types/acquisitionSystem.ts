/**
 * Acquisition System type definitions
 */

import { HydraCollection, ApiError } from './room';

// Capture Type
export interface CaptureType {
  '@type': string;
  '@id': string;
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

// Capture Type Collection
export interface CaptureTypeCollection extends HydraCollection<CaptureType> {}

// API Network Configuration
export interface ApiNetworkConfig {
  id: number;
  wifiSsid: string;
  ntpServer: string;
  timezone: string;
  gmtOffsetSec: number;
  daylightOffsetSec: number;
}

// API Sensor Configuration
export interface ApiSensor {
  id: number;
  captureType: number; // Numeric ID from capture_types endpoint
  sensorType: string;
  enabled: boolean;
  readIntervalMs: number;
  // Optional pins (depending on sensor type)
  i2cSdaPin?: number;
  i2cSclPin?: number;
  adcPin?: number;
  warmupDurationSec?: number;
}

// API Task Configuration
export interface ApiTask {
  id: number;
  taskName: string;
  enabled: boolean;
  intervalMs: number;
  priority: number;
  taskConfig?: Record<string, any>;
}

// API System Configuration
export interface ApiSystemConfig {
  id: number;
  debug: boolean;
  bufferSize: number;
  deepSleepEnabled: boolean;
  webServerEnabled: boolean;
  webServerPort: number;
}

// API Acquisition System (basic info for list)
export interface ApiAcquisitionSystem {
  '@id': string;
  '@type': string;
  id: number;
  name: string;
  room: string; // IRI like "/rooms/20"
  createdAt: string;
  deviceType: string;
  firmwareVersion: string;
}

// API Acquisition System with full configuration
export interface ApiAcquisitionSystemConfig extends ApiAcquisitionSystem {
  networkConfig: ApiNetworkConfig;
  sensors: ApiSensor[];
  tasks: ApiTask[];
  systemConfig: ApiSystemConfig;
}

// UI Acquisition System (simplified for list view)
export interface AcquisitionSystem {
  id: number;
  name: string;
  roomId: number | null;
  roomName?: string;
  createdAt: string;
  deviceType: string;
  firmwareVersion: string;
  activeSensorsCount: number;
  enabledTasksCount: number;
  systemStatus: 'active' | 'inactive' | 'error';
}

// UI Acquisition System with full configuration (for detail view)
export interface AcquisitionSystemConfig extends AcquisitionSystem {
  networkConfig: ApiNetworkConfig;
  sensors: ApiSensor[];
  tasks: ApiTask[];
  systemConfig: ApiSystemConfig;
}

// Re-export Hydra collection and error types
export type { HydraCollection, ApiError };
