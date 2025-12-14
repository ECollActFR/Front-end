/**
 * Infinite query hooks for rooms using reusable pagination system
 */

import { useInfiniteList, useCreateMutation, useUpdateMutation, useDeleteMutation } from '@/hooks/useInfiniteList';
import { roomService } from '@/services/roomService';
import { Room, RoomUpdatePayload, HydraCollection } from '@/types/room';

// Query keys for rooms
export const roomKeys = {
  all: ['rooms'],
  lists: () => [...roomKeys.all, 'list'],
  list: () => [...roomKeys.lists()],
  detail: (id: number) => [...roomKeys.all, 'detail', id.toString()],
};

/**
 * Hook for infinite list of rooms using reusable system
 */
export function useRoomsInfiniteQuery() {
  return useInfiniteList<Room>({
    queryKey: roomKeys.list(),
    fetchFunction: roomService.getRoomsPaginated,
    limit: 20,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to create a new room using reusable system
 */
export function useCreateRoomMutation() {
  return useCreateMutation<Room, RoomUpdatePayload>({
    mutationFn: roomService.createRoom,
    invalidateQueries: [roomKeys.list()],
    context: 'useCreateRoomMutation',
  });
}

/**
 * Hook to update a room using reusable system
 */
export function useUpdateRoomMutation() {
  return useUpdateMutation<Room, { id: number; payload: RoomUpdatePayload }>({
    mutationFn: ({ id, payload }) => roomService.updateRoom(id, payload),
    invalidateQueries: [roomKeys.list()],
    updateQueries: [
      {
        queryKey: roomKeys.detail(0), // Will be replaced with actual id
        data: {} as Room, // Will be replaced with actual data
      },
    ],
    context: 'useUpdateRoomMutation',
  });
}

/**
 * Hook to delete a room using reusable system
 */
export function useDeleteRoomMutation() {
  return useDeleteMutation<number>({
    mutationFn: roomService.deleteRoom,
    invalidateQueries: [roomKeys.list()],
    removeQueries: [roomKeys.detail(0)], // Will be replaced with actual id
    context: 'useDeleteRoomMutation',
  });
}