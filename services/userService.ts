/**
 * User service for API operations
 */

import { apiService } from './api';
import { ENDPOINTS } from '@/constants/config';
import { Room, HydraCollection, ApiRoom, RoomDetailResponse, RoomDetail, RoomUpdatePayload, ApiCaptureType, ApiRoomWithCaptureTypes } from '@/types/room';
import { ApiValidateToken, ValidateToken, LoginCredentials, LoginResponse, UserInfoResponse, User, UpdateUserPayload } from '@/types/user';
import { mapApiRoomsToRooms, mapApiRoomToRoom } from '@/utils/roomMapper';

export const userService = {
  /**
   * Login user with username and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiService.post<LoginResponse>(
        ENDPOINTS.LOGIN,
        credentials,
        'application/json'
      );

      if (!response?.data?.token) {
        throw new Error('Invalid login response');
      }

      return response;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },

  /**
   * Validate token
   */
  async validateToken(payload: ValidateToken): Promise<boolean> {
    try {
      // Fetch the Hydra collection response
      const response = await apiService.post<ApiValidateToken>(ENDPOINTS.USER_VALIDATE, payload);

      // Validate response format
      if (!response || !response.success) {
        throw new Error('Invalid API response format');
      }
      const success = response.success;
      return success;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  },

  /**
   * Get current user info
   */
  async getUserInfo(token: string): Promise<User> {
    try {
      const response = await apiService.get<UserInfoResponse>(
        ENDPOINTS.USER_INFO,
        'application/json',
        token
      );

      if (!response || !response.success || !response.user) {
        throw new Error('Invalid user info response');
      }

      return response.user;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  },

  /**
   * Update current user info
   */
  async updateUser(token: string, payload: UpdateUserPayload): Promise<User> {
    try {
      const response = await apiService.put<UserInfoResponse>(
        ENDPOINTS.USER_UPDATE,
        payload,
        'application/json',
        token
      );

      if (!response || !response.success || !response.user) {
        throw new Error('Invalid update user response');
      }

      return response.user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
};
