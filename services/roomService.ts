/**
 * Room service for API operations
 */

import { apiClient } from './middleware';
import { ENDPOINTS } from '@/constants/config';
import { Room, HydraCollection, ApiRoom, RoomDetail, RoomUpdatePayload, ApiCaptureType, ApiRoomWithCaptureTypes, ApiErrorResponse } from '@/types/room';
import { mapApiRoomsToRooms, mapApiRoomToRoom } from '@/utils/roomMapper';

export const roomService = {
  /**
   * Fetch all rooms from the API
   */
  async getRooms(): Promise<Room[]> {
    try {
      // Fetch the Hydra collection response
      const response = await apiClient.get<HydraCollection<ApiRoom>>(ENDPOINTS.ROOMS);

      // Validate response format
      if (!response || !response.member || !Array.isArray(response.member)) {
        console.log('Invalid response format:', response);
        throw new Error('Invalid API response format');
      }

      // Transform API rooms to UI rooms
      const rooms = mapApiRoomsToRooms(response.member);

      return rooms;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  },

  /**
   * Fetch rooms with pagination support
   */
  async getRoomsPaginated(page: number = 1, limit: number = 20): Promise<HydraCollection<ApiRoom>> {
    try {
      // Fetch the Hydra collection response with pagination
      const response = await apiClient.get<HydraCollection<ApiRoom>>(`${ENDPOINTS.ROOMS}?page=${page}&limit=${limit}`);

      // Validate response format
      if (!response || !response.member || !Array.isArray(response.member)) {
        console.log('Invalid response format:', response);
        throw new Error('Invalid API response format');
      }

      return response;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  },

  /**
   * Fetch room detail with last capture data
   */
  async getRoomDetail(roomId: number): Promise<RoomDetail> {
    try {
      console.log('getRoomDetail called with roomId:', roomId);
      console.log('ENDPOINTS.ROOM_DETAIL(roomId):', ENDPOINTS.ROOM_DETAIL(roomId));
      
      // Fetch room detail with last capture
      const response = await apiClient.get<any>(ENDPOINTS.ROOM_DETAIL(roomId));
      console.log('API response received:', response);

      // Check if response is an error object
      if (response && (response as ApiErrorResponse).type && (response as ApiErrorResponse).status) {
        const errorResponse = response as ApiErrorResponse;
        console.log('API returned error:', errorResponse);
        throw new Error(`API Error: ${errorResponse.title || errorResponse.detail || 'Unknown error'}`);
      }

      // Validate response format - handle both direct data and wrapped data
      let responseData: any;
      if (response && response.data) {
        responseData = response.data;
      } else if (response) {
        responseData = response;
      } else {
        console.log('Invalid response format, response:', response);
        throw new Error('Invalid API response format');
      }

      console.log('Response data extracted:', responseData);

      // Try to fetch the full room data to get equipment and other details
      // Only if the main response doesn't already contain acquisition systems
      let roomData: any;
      if (!responseData.acquisitionSystems || responseData.acquisitionSystems.length === 0) {
        try {
          console.log('Fetching full room data from:', ENDPOINTS.ROOM(roomId));
          roomData = await apiClient.get<any>(ENDPOINTS.ROOM(roomId));
          console.log('Full room data received:', roomData);
          console.log('Full room data acquisition systems:', roomData?.acquisitionSystems);
          
          // Check if room response is also an error
          if (roomData && 'type' in roomData && 'status' in roomData && typeof (roomData as any).status === 'number') {
            console.warn('Could not fetch full room data, using basic room info');
            roomData = null;
          }
        } catch (roomError) {
          console.warn('Could not fetch full room data, using basic room info:', roomError);
          roomData = null;
        }
      } else {
        console.log('Acquisition systems already present in main response, skipping additional request');
      }

      // Create base room
      let baseRoom: Room;
      if (roomData) {
        console.log('Creating base room from roomData');
        // Check if roomData is a collection or a direct room object
        if (roomData.member && Array.isArray(roomData.member) && roomData.member.length > 0) {
          // It's a collection, get the first room
          const actualRoomData = roomData.member[0];
          console.log('Extracted room from collection:', actualRoomData);
          console.log('Room acquisition systems:', actualRoomData.acquisitionSystems);
          baseRoom = mapApiRoomToRoom(actualRoomData, 0);
        } else {
          // It's a direct room object
          console.log('Direct room data acquisition systems:', roomData.acquisitionSystems);
          baseRoom = mapApiRoomToRoom(roomData, 0);
        }
      } else {
        console.log('Creating minimal room object from response data');
        // Create minimal room object from response data
        baseRoom = {
          id: responseData.id || roomId,
          name: responseData.name || `Salle ${roomId}`,
          available: true,
          amenities: ['wifi', 'monitor'], // Add some default amenities for testing
          description: responseData.description || `Description de la salle ${roomId}`,
        };
      }

      console.log('Base room created:', baseRoom);

      // Handle lastCapturesByType - check if it's a collection or direct data
      let lastCapturesByType = [];
      if (responseData.lastCapturesByType) {
        if (responseData.lastCapturesByType.member && Array.isArray(responseData.lastCapturesByType.member)) {
          // It's a collection
          lastCapturesByType = responseData.lastCapturesByType.member;
        } else if (Array.isArray(responseData.lastCapturesByType)) {
          // It's already an array
          lastCapturesByType = responseData.lastCapturesByType;
        }
      }

      // Extract acquisition systems from the main response if available
      let acquisitionSystems = [];
      if (responseData.acquisitionSystems) {
        if (Array.isArray(responseData.acquisitionSystems)) {
          acquisitionSystems = responseData.acquisitionSystems;
        } else if (responseData.acquisitionSystems.member && Array.isArray(responseData.acquisitionSystems.member)) {
          acquisitionSystems = responseData.acquisitionSystems.member;
        }
      }

      // Combine with sensor data
      const roomDetail: RoomDetail = {
        ...baseRoom,
        lastCapturesByType: lastCapturesByType.length > 0 ? lastCapturesByType : [
          // Add mock sensor data for testing
          {
            type: { id: 1, name: 'Température', description: 'Capteur de température' },
            capture: { id: 1, value: '22°C', description: 'Température ambiante', createdAt: new Date().toISOString() }
          },
          {
            type: { id: 2, name: 'Humidité', description: 'Capteur d\'humidité' },
            capture: { id: 2, value: '45%', description: 'Taux d\'humidité', createdAt: new Date().toISOString() }
          }
        ],
        captureTypes: roomData?.captureTypes?.map((ct: any) => ({
          id: ct.id,
          name: ct.name,
          description: ct.description,
        })) || [],
        acquisitionSystems: acquisitionSystems.length > 0 ? acquisitionSystems : baseRoom.acquisitionSystems || [
          // Mock acquisition systems for testing UI
          {
            '@id': `/acquisition_systems/1`,
            '@type': 'AcquisitionSystem',
            id: 1,
            name: "Système d'acquisition principal",
            room: `/rooms/${roomId}`,
            createdAt: new Date().toISOString(),
            deviceType: "Raspberry Pi 4",
            firmwareVersion: "v1.2.3"
          },
          {
            '@id': `/acquisition_systems/2`,
            '@type': 'AcquisitionSystem',
            id: 2,
            name: "Système de secours",
            room: `/rooms/${roomId}`,
            createdAt: new Date().toISOString(),
            deviceType: "Arduino Nano",
            firmwareVersion: "v2.1.0"
          }
        ],
      };

      console.log('Final room detail created:', roomDetail);
      console.log('Final acquisition systems:', roomDetail.acquisitionSystems);
      console.log('Final room detail keys:', Object.keys(roomDetail));
      return roomDetail;
    } catch (error) {
      console.error('Error fetching room detail:', error);
      throw error;
    }
  },

  /**
   * Fetch a single room with its capture types
   */
  async getRoom(roomId: number): Promise<ApiRoomWithCaptureTypes> {
    try {
      const response = await apiClient.get<any>(ENDPOINTS.ROOM(roomId));

      if (!response) {
        throw new Error('Invalid API response format');
      }

      // Handle both direct room objects and collections
      let roomData: any;
      if (response.member && Array.isArray(response.member) && response.member.length > 0) {
        // It's a collection, get the first room
        roomData = response.member[0];
        console.log('getRoom - Extracted room from collection:', roomData);
      } else {
        // It's a direct room object
        roomData = response;
        console.log('getRoom - Direct room object:', roomData);
      }

      // Transform captureTypes from full objects to just IDs for editing
      const captureTypeIds = roomData.captureTypes?.map((ct: { '@id': string }) => ct['@id']) || [];

      return {
        ...roomData,
        captureTypes: captureTypeIds,
      };
    } catch (error) {
      console.error('Error fetching room:', error);
      throw error;
    }
  },

  /**
   * Fetch all capture types from the API
   */
  async getCaptureTypes(): Promise<ApiCaptureType[]> {
    try {
      const response = await apiClient.get<HydraCollection<ApiCaptureType>>(ENDPOINTS.CAPTURE_TYPES);

      if (!response || !response.member || !Array.isArray(response.member)) {
        throw new Error('Invalid API response format');
      }

      return response.member;
    } catch (error) {
      console.error('Error fetching capture types:', error);
      throw error;
    }
  },

  /**
   * Update a room
   */
  async updateRoom(roomId: number, payload: RoomUpdatePayload): Promise<ApiRoom> {
    try {
      const response = await apiClient.put<ApiRoom>(ENDPOINTS.ROOM_UPDATE(roomId), payload);

      if (!response) {
        throw new Error('Invalid API response format');
      }

      return response;
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  },

  /**
   * Delete a room
   */
  async deleteRoom(roomId: number): Promise<void> {
    try {
      await apiClient.delete(ENDPOINTS.ROOM_DELETE(roomId));
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  },

  /**
   * Create a new room
   */
  async createRoom(payload: RoomUpdatePayload): Promise<ApiRoom> {
    try {
      const response = await apiClient.post<ApiRoom>(ENDPOINTS.ROOM_CREATE, payload);

      if (!response) {
        throw new Error('Invalid API response format');
      }

      return response;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  },
};
