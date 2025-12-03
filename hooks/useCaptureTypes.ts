/**
 * Hook for managing capture types
 */

import { useState, useEffect } from 'react';
import { acquisitionSystemService } from '@/services/acquisitionSystemService';
import { CaptureType } from '@/types/acquisitionSystem';

export const useCaptureTypes = () => {
  const [captureTypes, setCaptureTypes] = useState<CaptureType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadCaptureTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const types = await acquisitionSystemService.getCaptureTypes();
      setCaptureTypes(types);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load capture types');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCaptureTypes();
  }, []);

  const getCaptureTypeName = (id: number): string => {
    const captureType = captureTypes.find(type => type.id === id);
    return captureType ? captureType.name : `Unknown (${id})`;
  };

  const getCaptureTypeDescription = (id: number): string => {
    const captureType = captureTypes.find(type => type.id === id);
    return captureType ? captureType.description : '';
  };

  return {
    captureTypes,
    loading,
    error,
    refreshCaptureTypes: loadCaptureTypes,
    getCaptureTypeName,
    getCaptureTypeDescription,
  };
};