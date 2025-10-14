/**
 * Custom hook for fetching and managing room detail data with sensor info
 */

import { useState, useEffect, useCallback } from 'react';
import { roomService } from '@/services/roomService';
import { RoomDetail, ApiError } from '@/types/room';

interface UseRoomDetailResult {
  roomDetail: RoomDetail | null;
  isLoading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

export function useRoomDetail(roomId: number): UseRoomDetailResult {
  const [roomDetail, setRoomDetail] = useState<RoomDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchRoomDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await roomService.getRoomDetail(roomId);
      setRoomDetail(data);
    } catch (err: any) {
      setError({
        message: err.message || 'Failed to fetch room details',
        status: err.status,
      });
      console.error('Error in useRoomDetail:', err);
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    if (roomId) {
      fetchRoomDetail();
    }
  }, [fetchRoomDetail, roomId]);

  return {
    roomDetail,
    isLoading,
    error,
    refetch: fetchRoomDetail,
  };
}
