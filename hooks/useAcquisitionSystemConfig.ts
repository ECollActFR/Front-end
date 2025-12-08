/**
 * Custom hook for fetching acquisition system configuration
 */

import { useState, useEffect, useCallback } from 'react';
import { acquisitionSystemService } from '@/services/acquisitionSystemService';
import { AcquisitionSystemConfig, ApiError } from '@/types/acquisitionSystem';

interface UseAcquisitionSystemConfigResult {
  config: AcquisitionSystemConfig | null;
  isLoading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

export function useAcquisitionSystemConfig(
  systemId: number
): UseAcquisitionSystemConfigResult {
  const [config, setConfig] = useState<AcquisitionSystemConfig | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchConfig = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await acquisitionSystemService.getAcquisitionSystemConfig(systemId);
      setConfig(data);
    } catch (err: any) {
      setError({
        message: err.message || 'Failed to fetch acquisition system configuration',
        status: err.status,
      });
      console.error('Error in useAcquisitionSystemConfig:', err);
    } finally {
      setIsLoading(false);
    }
  }, [systemId]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return {
    config,
    isLoading,
    error,
    refetch: fetchConfig,
  };
}
