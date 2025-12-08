/**
 * Custom hook for fetching and managing acquisition systems data
 */

import { useState, useEffect, useCallback } from 'react';
import { acquisitionSystemService } from '@/services/acquisitionSystemService';
import { AcquisitionSystem, ApiError } from '@/types/acquisitionSystem';

interface UseAcquisitionSystemsResult {
  systems: AcquisitionSystem[];
  isLoading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

export function useAcquisitionSystems(): UseAcquisitionSystemsResult {
  const [systems, setSystems] = useState<AcquisitionSystem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchSystems = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await acquisitionSystemService.getAcquisitionSystems();
      setSystems(data);
    } catch (err: any) {
      setError({
        message: err.message || 'Failed to fetch acquisition systems',
        status: err.status,
      });
      console.error('Error in useAcquisitionSystems:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSystems();
  }, [fetchSystems]);

  return {
    systems,
    isLoading,
    error,
    refetch: fetchSystems,
  };
}
