/**
 * Room service for API operations
 */

import { apiService } from './api';
import { ENDPOINTS } from '@/constants/config';
import { Room, HydraCollection, ApiRoom, RoomDetailResponse, RoomDetail, RoomUpdatePayload, ApiCaptureType, ApiRoomWithCaptureTypes } from '@/types/room';
import { mapApiRoomsToRooms, mapApiRoomToRoom } from '@/utils/roomMapper';

export const roomService = {
  /**
   * Fetch all rooms from the API
   */
  async getRooms(): Promise<Room[]> {
    try {
      // Fetch the Hydra collection response
      const response = await apiService.get<HydraCollection<ApiRoom>>(ENDPOINTS.ROOMS);

      // Validate response format
      if (!response || !response.member || !Array.isArray(response.member)) {
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
   * Fetch room detail with last capture data
   */
  async getRoomDetail(roomId: number): Promise<RoomDetail> {
    try {
      // Fetch room detail with last capture
      const response = await apiService.get<RoomDetailResponse>(ENDPOINTS.ROOM_DETAIL(roomId));

      // Validate response format
      if (!response || !response.data) {
        throw new Error('Invalid API response format');
      }

      // Fetch the full room data to get equipment and other details
      const roomData = await apiService.get<ApiRoom>(ENDPOINTS.ROOM(roomId));

      // Map the room with equipment
      const baseRoom = mapApiRoomToRoom(roomData, 0);

      // Combine with sensor data
      const roomDetail: RoomDetail = {
        ...baseRoom,
        lastCapturesByType: response.data.lastCapturesByType || [],
        captureTypes: roomData.captureTypes?.map(ct => ({
          id: ct.id,
          name: ct.name,
          description: ct.description,
        })),
        acquisitionSystems: roomData.acquisitionSystems,
      };

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
      const response = await apiService.get<ApiRoom>(ENDPOINTS.ROOM(roomId));

      if (!response) {
        throw new Error('Invalid API response format');
      }

      // Transform captureTypes from full objects to just IDs for editing
      const captureTypeIds = response.captureTypes?.map(ct => ct['@id']) || [];

      return {
        ...response,
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
      const response = await apiService.get<HydraCollection<ApiCaptureType>>(ENDPOINTS.CAPTURE_TYPES);

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
      const response = await apiService.put<ApiRoom>(ENDPOINTS.ROOM_UPDATE(roomId), payload);

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
      await apiService.delete(ENDPOINTS.ROOM_DELETE(roomId));
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
      const response = await apiService.post<ApiRoom>(ENDPOINTS.ROOM_CREATE, payload);

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
