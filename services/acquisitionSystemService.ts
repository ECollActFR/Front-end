/**
 * Acquisition System service for API operations
 */

import { apiService } from './api';
import { ENDPOINTS } from '@/constants/config';
import {
  ApiAcquisitionSystem,
  ApiAcquisitionSystemConfig,
  AcquisitionSystem,
  AcquisitionSystemConfig,
  HydraCollection,
  CaptureType,
  CaptureTypeCollection,
} from '@/types/acquisitionSystem';

/**
 * Extract room ID from IRI
 * @param roomIri - Room IRI like "/rooms/20"
 * @returns Room ID or null if invalid
 */
function extractRoomId(roomIri: string): number | null {
  if (!roomIri) return null;
  const match = roomIri.match(/\/rooms\/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Determine system status based on configuration
 * @param sensors - Array of sensors
 * @param systemConfig - System configuration
 * @returns System status
 */
function determineSystemStatus(
  sensors: any[],
  systemConfig?: { debug: boolean }
): 'active' | 'inactive' | 'error' {
  if (!sensors || sensors.length === 0) {
    return 'error';
  }

  const hasActiveSensors = sensors.some(s => s.enabled);

  if (!hasActiveSensors) {
    return 'inactive';
  }

  // Active if has enabled sensors and not in debug mode
  if (systemConfig && systemConfig.debug === false && hasActiveSensors) {
    return 'active';
  }

  return hasActiveSensors ? 'active' : 'inactive';
}

/**
 * Transform API acquisition system to UI model
 * @param apiSystem - API acquisition system
 * @param apiConfig - Optional full configuration (for stats)
 * @returns UI acquisition system
 */
function transformApiSystem(
  apiSystem: ApiAcquisitionSystem,
  apiConfig?: ApiAcquisitionSystemConfig
): AcquisitionSystem {
  const roomId = extractRoomId(apiSystem.room);

  // If we have full config, calculate stats from it
  const activeSensorsCount = apiConfig
    ? apiConfig.sensors.filter(s => s.enabled).length
    : 0;

  const enabledTasksCount = apiConfig
    ? apiConfig.tasks.filter(t => t.enabled).length
    : 0;

  const systemStatus = apiConfig
    ? determineSystemStatus(apiConfig.sensors, apiConfig.systemConfig)
    : 'inactive';

  return {
    id: apiSystem.id,
    name: apiSystem.name,
    roomId,
    createdAt: apiSystem.createdAt,
    deviceType: apiSystem.deviceType,
    firmwareVersion: apiSystem.firmwareVersion,
    activeSensorsCount,
    enabledTasksCount,
    systemStatus,
  };
}

export const acquisitionSystemService = {
  /**
   * Fetch all acquisition systems from the API
   */
  async getAcquisitionSystems(): Promise<AcquisitionSystem[]> {
    try {
      // Fetch the Hydra collection response
      const response = await apiService.get<HydraCollection<ApiAcquisitionSystemConfig>>(
        ENDPOINTS.ACQUISITION_SYSTEMS,
        undefined,
        'application/ld+json'
      );

      // Validate response format
      if (!response || !response.member || !Array.isArray(response.member)) {
        throw new Error('Invalid API response format');
      }

      // Transform API systems to UI systems
      const systems = response.member.map(apiSystem =>
        transformApiSystem(apiSystem, apiSystem)
      );

      return systems;
    } catch (error) {
      console.error('Error fetching acquisition systems:', error);
      throw error;
    }
  },

  /**
   * Fetch available acquisition systems (not assigned to any room or assigned to specific room)
   */
  async getAvailableAcquisitionSystems(excludeRoomId?: number): Promise<AcquisitionSystem[]> {
    try {
      // Fetch Hydra collection response
      const response = await apiService.get<HydraCollection<ApiAcquisitionSystemConfig>>(
        ENDPOINTS.ACQUISITION_SYSTEMS,
        undefined,
        'application/ld+json'
      );

      // Validate response format
      if (!response || !response.member || !Array.isArray(response.member)) {
        throw new Error('Invalid API response format');
      }

      // Filter systems: unassigned or assigned to the specified room
      const availableSystems = response.member.filter(apiSystem => {
        const roomId = extractRoomId(apiSystem.room);
        // Include if unassigned (roomId is null) or assigned to the specified room
        return roomId === null || roomId === excludeRoomId;
      });

      // Transform API systems to UI systems
      const systems = availableSystems.map(apiSystem =>
        transformApiSystem(apiSystem, apiSystem)
      );

      return systems;
    } catch (error) {
      console.error('Error fetching available acquisition systems:', error);
      throw error;
    }
  },

  /**
   * Fetch acquisition system configuration
   */
  async getAcquisitionSystemConfig(id: number): Promise<AcquisitionSystemConfig> {
    try {
      // Fetch configuration endpoint
      const response = await apiService.get<ApiAcquisitionSystemConfig>(
        ENDPOINTS.ACQUISITION_SYSTEM_CONFIG(id),
        undefined,
        'application/ld+json'
      );

      // Validate response format
      if (!response) {
        throw new Error('Invalid API response format');
      }

      // Transform to UI model
      const baseSystem = transformApiSystem(response, response);

      const config: AcquisitionSystemConfig = {
        ...baseSystem,
        networkConfig: response.networkConfig,
        sensors: response.sensors,
        tasks: response.tasks,
        systemConfig: response.systemConfig,
      };

      return config;
    } catch (error) {
      console.error('Error fetching acquisition system config:', error);
      throw error;
    }
  },

  /**
   * Update acquisition system configuration
   */
  async updateAcquisitionSystem(id: number, data: Partial<AcquisitionSystemConfig>): Promise<AcquisitionSystemConfig> {
    try {
      // Send update request to API
      const response = await apiService.put<ApiAcquisitionSystemConfig>(
        ENDPOINTS.ACQUISITION_SYSTEM_UPDATE(id),
        data,
        'application/ld+json',
        'application/ld+json'
      );

      // Validate response format
      if (!response) {
        throw new Error('Invalid API response format');
      }

      // Transform to UI model
      const baseSystem = transformApiSystem(response, response);

      const config: AcquisitionSystemConfig = {
        ...baseSystem,
        networkConfig: response.networkConfig,
        sensors: response.sensors,
        tasks: response.tasks,
        systemConfig: response.systemConfig,
      };

      return config;
    } catch (error) {
      console.error('Error updating acquisition system:', error);
      throw error;
    }
  },

  /**
   * Fetch all capture types from the API
   */
  async getCaptureTypes(): Promise<CaptureType[]> {
    try {
      const response = await apiService.get<CaptureTypeCollection>(
        ENDPOINTS.CAPTURE_TYPES,
        undefined,
        'application/ld+json'
      );

      if (!response || !response.member || !Array.isArray(response.member)) {
        throw new Error('Invalid API response format');
      }

      return response.member;
    } catch (error) {
      console.error('Error fetching capture types:', error);
      throw error;
    }
  },
};
