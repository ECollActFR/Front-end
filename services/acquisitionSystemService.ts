/**
 * Acquisition System service for API operations
 */

import { apiClient } from './middleware';
import { ENDPOINTS } from '@/constants/config';
import {
  ApiAcquisitionSystem,
  ApiAcquisitionSystemConfig,
  ApiNetworkConfig,
  ApiSensor,
  ApiSystemConfig,
  ApiTask,
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
  const match = roomIri && roomIri.match(/\/rooms\/(\d+)/);
  return match && match[1] ? parseInt(match[1], 10) : null;
}

/**
 * Determine system status based on configuration
 * @param sensors - Array of sensors
 * @param systemConfig - System configuration
 * @returns System status
 */
function determineSystemStatus(
  sensors: ApiSensor[],
  systemConfig?: ApiSystemConfig
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
  const activeSensorsCount = apiConfig?.sensors?.filter(s => s.enabled).length ?? 0;

  const enabledTasksCount = apiConfig?.tasks?.filter(t => t.enabled).length ?? 0;

  const systemStatus = apiConfig
    ? determineSystemStatus(apiConfig.sensors || [], apiConfig.systemConfig)
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
      const response = await apiClient.get<HydraCollection<ApiAcquisitionSystemConfig>>(
        ENDPOINTS.ACQUISITION_SYSTEMS
      );

      // Validate response format
      if (!response || !response.member || !Array.isArray(response.member)) {
        throw new Error('Invalid API response format');
      }

      // Transform API systems to UI systems
      const systems = response.member.map((apiSystem: ApiAcquisitionSystem) => transformApiSystem(apiSystem, undefined));

      return systems;
    } catch (error) {
      console.error('Error fetching acquisition systems:', error);
      throw error;
    }
  },

  /**
   * Fetch acquisition systems with pagination support
   */
  async getAcquisitionSystemsPaginated(page: number = 1, limit: number = 20): Promise<HydraCollection<ApiAcquisitionSystemConfig>> {
    try {
      // Fetch the Hydra collection response with pagination
      const response = await apiClient.get<HydraCollection<ApiAcquisitionSystemConfig>>(
        `${ENDPOINTS.ACQUISITION_SYSTEMS}?page=${page}&limit=${limit}`
      );

      // Validate response format
      if (!response || !response.member || !Array.isArray(response.member)) {
        throw new Error('Invalid API response format');
      }

      return response;
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
      const response = await apiClient.get<HydraCollection<ApiAcquisitionSystemConfig>>(
        ENDPOINTS.ACQUISITION_SYSTEMS
      );

      // Validate response format
      if (!response || !response.member || !Array.isArray(response.member)) {
        throw new Error('Invalid API response format');
      }

      // Filter systems: unassigned or assigned to the specified room
      const availableSystems = response.member.filter(apiSystem => {
  const roomId = extractRoomId(apiSystem.room || '');
        // Include if unassigned (roomId is null) or assigned to the specified room
        return roomId === null || roomId === excludeRoomId;
      });

      // Transform API systems to UI systems
      const systems = availableSystems.map((apiSystem: ApiAcquisitionSystem) =>
        transformApiSystem(apiSystem)
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
      const response = await apiClient.get<ApiAcquisitionSystemConfig>(
        ENDPOINTS.ACQUISITION_SYSTEM_CONFIG(id)
      );

      // Validate response format
      if (!response) {
        throw new Error('Invalid API response format');
      }

      // Transform to UI model
      const baseSystem = transformApiSystem(response, response);

      const config: AcquisitionSystemConfig = {
        ...baseSystem,
        networkConfig: response.networkConfig || {
          id: 0,
          wifiSsid: 'Non configuré',
          ntpServer: 'Non configuré',
          timezone: 'Non configuré',
          gmtOffsetSec: 0,
          daylightOffsetSec: 0,
        },
        sensors: response.sensors || [],
        tasks: response.tasks || [],
        systemConfig: response.systemConfig || {
          id: 0,
          debug: false,
          bufferSize: 0,
          deepSleepEnabled: false,
          webServerEnabled: false,
          webServerPort: 0,
        },
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
      const response = await apiClient.put<ApiAcquisitionSystemConfig>(
        ENDPOINTS.ACQUISITION_SYSTEM_UPDATE(id),
        data
      );

      // Validate response format
      if (!response) {
        throw new Error('Invalid API response format');
      }

      // Transform to UI model
      const baseSystem = transformApiSystem(response, response);

      const config: AcquisitionSystemConfig = {
        ...baseSystem,
        networkConfig: response.networkConfig || {
          id: 0,
          wifiSsid: 'Non configuré',
          ntpServer: 'Non configuré',
          timezone: 'Non configuré',
          gmtOffsetSec: 0,
          daylightOffsetSec: 0,
        },
        sensors: response.sensors || [],
        tasks: response.tasks || [],
        systemConfig: response.systemConfig || {
          id: 0,
          debug: false,
          bufferSize: 0,
          deepSleepEnabled: false,
          webServerEnabled: false,
          webServerPort: 0,
        },
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
      const response = await apiClient.get<CaptureTypeCollection>(
        ENDPOINTS.CAPTURE_TYPES
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
