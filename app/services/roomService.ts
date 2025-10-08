/**
 * Room service for API operations
 */

import { apiService } from './api';
import { ENDPOINTS } from '@/constants/config';
import { Room, HydraCollection, ApiRoom, RoomDetailResponse, RoomDetail } from '@/types/room';
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

      // Get base room info (we need to find it in the rooms list first to get UI enhancements)
      // For now, we'll map it with a default index
      const baseRoom = mapApiRoomToRoom(
        {
          '@id': `/api/rooms/${response.data.id}`,
          '@type': 'Room',
          id: response.data.id,
          name: response.data.name,
          description: response.data.description,
        },
        0
      );

      // Combine with sensor data
      const roomDetail: RoomDetail = {
        ...baseRoom,
        lastCapturesByType: response.data.lastCapturesByType || [],
        createdAt: response.data.createdAt,
      };

      return roomDetail;
    } catch (error) {
      console.error('Error fetching room detail:', error);
      throw error;
    }
  },
};
