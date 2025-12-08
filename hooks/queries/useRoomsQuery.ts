/**
 * TanStack Query hooks for room-related data
 * Enhanced with structured logging and error handling
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roomService } from '@/services/roomService';
import { RoomUpdatePayload, ApiRoom, Room } from '@/types/room';
import { logger } from '@/utils/logger';

/**
 * Query keys for room-related queries
 */
export const roomKeys = {
  all: ['rooms'] as const,
  lists: () => [...roomKeys.all, 'list'] as const,
  list: () => [...roomKeys.lists()] as const,
  details: () => [...roomKeys.all, 'detail'] as const,
  detail: (id: number) => [...roomKeys.details(), id] as const,
  captureTypes: ['captureTypes'] as const,
};

/**
 * Hook to fetch all rooms
 */
export function useRoomsQuery() {
  return useQuery({
    queryKey: roomKeys.list(),
    queryFn: () => roomService.getRooms(),
    staleTime: 2 * 60 * 1000, // Rooms list is fresh for 2 minutes
    gcTime: 10 * 60 * 1000, // Cache for 10 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors except 408, 429
      if (error?.status >= 400 && error?.status < 500 && error?.status !== 408 && error?.status !== 429) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

/**
 * Hook to fetch a single room detail with sensor data
 */
export function useRoomDetailQuery(roomId: number, enabled = true) {
  return useQuery({
    queryKey: roomKeys.detail(roomId),
    queryFn: () => roomService.getRoomDetail(roomId),
    enabled: enabled && !!roomId,
    staleTime: 1 * 60 * 1000, // Room detail is fresh for 1 minute (sensor data changes frequently)
    gcTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

/**
 * Hook to fetch a single room (for editing)
 */
export function useRoomQuery(roomId: number, enabled = true) {
  return useQuery({
    queryKey: [...roomKeys.detail(roomId), 'edit'],
    queryFn: () => roomService.getRoom(roomId),
    enabled: enabled && !!roomId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch all capture types
 */
export function useCaptureTypesQuery() {
  return useQuery({
    queryKey: roomKeys.captureTypes,
    queryFn: () => roomService.getCaptureTypes(),
    staleTime: 30 * 60 * 1000, // Capture types rarely change, fresh for 30 minutes
    gcTime: 60 * 60 * 1000, // Cache for 1 hour
  });
}

/**
 * Hook to create a new room
 */
export function useCreateRoomMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RoomUpdatePayload) => roomService.createRoom(payload),
    onSuccess: (newRoom) => {
      logger.info('Room created successfully', { roomId: newRoom.id, context: 'useCreateRoomMutation' });
      
      // Invalidate rooms list to refetch
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
      
      // Add new room to cache optimistically
      queryClient.setQueryData(roomKeys.detail(newRoom.id), newRoom);
    },
    onError: (error: any) => {
      logger.error('Failed to create room', error, { context: 'useCreateRoomMutation' });
    },
  });
}

/**
 * Hook to update a room
 */
export function useUpdateRoomMutation(roomId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RoomUpdatePayload) => roomService.updateRoom(roomId, payload),
    onSuccess: (updatedRoom) => {
      logger.info('Room updated successfully', { roomId, context: 'useUpdateRoomMutation' });
      
      // Update specific room in cache
      queryClient.setQueryData<ApiRoom>(roomKeys.detail(roomId), updatedRoom);

      // Invalidate rooms list to refetch
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
    },
    onError: (error: any) => {
      logger.error('Failed to update room', error, { roomId, context: 'useUpdateRoomMutation' });
    },
  });
}

/**
 * Hook to delete a room
 */
export function useDeleteRoomMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomId: number) => roomService.deleteRoom(roomId),
    onSuccess: (_, roomId) => {
      logger.info('Room deleted successfully', { roomId, context: 'useDeleteRoomMutation' });
      
      // Remove room from cache
      queryClient.removeQueries({ queryKey: roomKeys.detail(roomId) });

      // Invalidate rooms list to refetch
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
    },
    onError: (error: any, roomId) => {
      logger.error('Failed to delete room', error, { roomId, context: 'useDeleteRoomMutation' });
    },
  });
}
