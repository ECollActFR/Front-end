/**
 * Room service with last 7 days data support
 */

import { CaptureLast7DaysDto } from '@/types/chart';
import { apiClient } from '@/services/middleware/apiClient';
import { ENDPOINTS } from '@/constants/config';

export const roomService = {
  /**
   * Get last 7 days of capture data for a room
   */
  async getLast7DaysData(roomId: number): Promise<CaptureLast7DaysDto> {
    const response = await apiClient.get(ENDPOINTS.ROOM_LAST_7_DAYS(roomId));
    return response as CaptureLast7DaysDto;
  }
};