/**
 * Custom hook for fetching and managing rooms data
 */

import { useState, useEffect, useCallback } from 'react';
import { roomService } from '@/services/roomService';
import { Room, ApiError } from '@/types/room';

interface UseRoomsResult {
  rooms: Room[];
  isLoading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

export function useRooms(): UseRoomsResult {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchRooms = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await roomService.getRooms();
      setRooms(data);
    } catch (err: any) {
      setError({
        message: err.message || 'Failed to fetch rooms',
        status: err.status,
      });
      console.error('Error in useRooms:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return {
    rooms,
    isLoading,
    error,
    refetch: fetchRooms,
  };
}
