/**
 * User service for API operations
 */

import { apiClient } from './middleware';
import { ENDPOINTS } from '@/constants/config';
import { ApiValidateToken, ValidateToken, LoginCredentials, LoginResponse, UserInfoResponse, User, UpdateUserPayload, AuthError } from '@/types/user';

export const userService = {
  /**
   * Login user with username and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        ENDPOINTS.LOGIN,
        credentials,
        { 'Content-Type': 'application/json', 'Accept': 'application/json' }
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
      const response = await apiClient.post<ApiValidateToken>(ENDPOINTS.USER_VALIDATE, payload);

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
  async getUserInfo(): Promise<User> {
    try {
      const response = await apiClient.get<UserInfoResponse>(
        ENDPOINTS.USER_INFO,
        { 'Accept': 'application/json' }
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
  async updateUser(payload: UpdateUserPayload): Promise<User> {
    try {
      const response = await apiClient.put<UserInfoResponse>(
        ENDPOINTS.USER_UPDATE,
        payload,
        { 'Content-Type': 'application/json', 'Accept': 'application/json' }
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
  async logout(): Promise<boolean> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>(
        ENDPOINTS.LOGOUT,
        {},
        { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      );

      return response?.success || false;
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if the API call fails, we want to allow local logout
      return true;
    }
  }
};
