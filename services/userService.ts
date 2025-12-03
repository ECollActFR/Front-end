/**
 * User service for API operations
 */

import { apiService } from './api';
import { ENDPOINTS } from '@/constants/config';
import { Room, HydraCollection, ApiRoom, RoomDetailResponse, RoomDetail, RoomUpdatePayload, ApiCaptureType, ApiRoomWithCaptureTypes } from '@/types/room';
import { ApiValidateToken, ValidateToken, LoginCredentials, LoginResponse, UserInfoResponse, User, UpdateUserPayload, AuthError } from '@/types/user';
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
        const authError: AuthError = {
          message: 'Token validation failed',
          status: 401,
          isAuthError: true
        };
        throw authError;
      }
      const success = response.success;
      return success;
    } catch (error) {
      console.error('Error validating token:', error);
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
  },

  /**
   * Logout user
   */
  async logout(token: string): Promise<boolean> {
    try {
      const response = await apiService.post<{ success: boolean; message: string }>(
        ENDPOINTS.LOGOUT,
        {},
        'application/json',
        token
      );

      return response?.success || false;
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if the API call fails, we want to allow local logout
      return true;
    }
  }
};
