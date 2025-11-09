/**
 * React Query hooks for room-related data
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roomService } from '@/services/roomService';
import { RoomUpdatePayload, ApiRoom, Room } from '@/types/room';

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
    onSuccess: () => {
      // Invalidate rooms list to refetch
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
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
      // Update the specific room in cache
      queryClient.setQueryData<ApiRoom>(roomKeys.detail(roomId), updatedRoom);

      // Invalidate rooms list to refetch
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
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
      // Remove the room from cache
      queryClient.removeQueries({ queryKey: roomKeys.detail(roomId) });

      // Invalidate rooms list to refetch
      queryClient.invalidateQueries({ queryKey: roomKeys.lists() });
    },
  });
}
