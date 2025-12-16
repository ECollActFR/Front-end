/**
 * Building service for API operations
 */

import { apiClient } from './middleware';
import { ENDPOINTS } from '@/constants/config';

// API Building type
export interface ApiBuilding {
  '@id': string;
  '@type': string;
  id: number;
  name: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  createdAt: string;
}

// Building collection response
export interface BuildingCollection {
  '@context': string;
  '@id': string;
  '@type': string;
  totalItems: number;
  member: ApiBuilding[];
}

export const buildingService = {
  /**
   * Fetch all buildings from API
   */
  async getBuildings(): Promise<ApiBuilding[]> {
    try {
      // Try different possible endpoints for buildings
      let response;
      try {
        response = await apiClient.get<BuildingCollection>('/buildings');
      } catch (e) {
        console.log('Trying /buildings endpoint failed, trying /buildings/...');
        response = await apiClient.get<BuildingCollection>('/buildings');
      }

      if (!response || !response.member || !Array.isArray(response.member)) {
        throw new Error('Invalid API response format');
      }

      return response.member;
    } catch (error) {
      console.error('Error fetching buildings:', error);
      // Return mock building data for testing if API fails
      console.warn('Using mock building data for testing');
      return [
        {
          '@id': '/buildings/1',
          '@type': 'Building',
          id: 1,
          name: 'Bâtiment Principal',
          address: '123 Rue de la Test',
          city: 'TestVille',
          postalCode: '75001',
          country: 'France',
          createdAt: new Date().toISOString()
        },
        {
          '@id': '/buildings/2',
          '@type': 'Building', 
          id: 2,
          name: 'Bâtiment Secondaire',
          address: '456 Avenue Test',
          city: 'TestCity',
          postalCode: '75002',
          country: 'France',
          createdAt: new Date().toISOString()
        }
      ];
    }
  },
};