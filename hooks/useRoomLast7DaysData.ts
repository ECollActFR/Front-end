/**
 * Hook for fetching room last 7 days data
 */

import { useQuery } from '@tanstack/react-query';
import { roomService } from '@/services/roomLast7DaysService';
import { chartService } from '@/services/chartService';
import { ChartDataByType } from '@/types/chart';

interface UseRoomLast7DaysDataOptions {
  roomId: number;
  enabled?: boolean;
}

export function useRoomLast7DaysData({ 
  roomId, 
  enabled = true 
}: UseRoomLast7DaysDataOptions) {
  return useQuery({
    queryKey: ['room', roomId, 'last7days'],
    queryFn: async (): Promise<ChartDataByType[]> => {
      const rawData = await roomService.getLast7DaysData(roomId);
      return chartService.transformLast7DaysData(rawData);
    },
    enabled: enabled && !!roomId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}