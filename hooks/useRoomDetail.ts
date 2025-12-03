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
  isAuthError: boolean;
  refetch: () => Promise<void>;
}

export function useRoomDetail(roomId: number): UseRoomDetailResult {
  const [roomDetail, setRoomDetail] = useState<RoomDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [isAuthError, setIsAuthError] = useState<boolean>(false);

  const fetchRoomDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setIsAuthError(false);
      console.log('Fetching room detail for roomId:', roomId);
      const data = await roomService.getRoomDetail(roomId);
      console.log('Room detail data received:', data);
      setRoomDetail(data);
    } catch (err: any) {
      const isAuth = err.status === 401 || err.status === 403;
      setIsAuthError(isAuth);
      
      // Ne pas afficher d'erreur locale pour les erreurs 401/403
      // Laisser AuthContext gérer globalement
      if (!isAuth) {
        setError({
          message: err.message || 'Failed to fetch room details',
          status: err.status,
        });
      }
      
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
    isAuthError,
    refetch: fetchRoomDetail,
  };
}
