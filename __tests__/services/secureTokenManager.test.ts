/**
 * Tests for SecureTokenManager
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  secureTokenManager, 
  TokenStorageError, 
  TokenExpiredError, 
  TokenInvalidError 
} from '@/services/secureTokenManager';

// Mock modules
vi.mock('expo-secure-store');
vi.mock('@react-native-async-storage/async-storage');

const mockSecureStore = vi.mocked(SecureStore);
const mockAsyncStorage = vi.mocked(AsyncStorage);

describe('SecureTokenManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('setToken', () => {
    it('should store valid token in SecureStore', async () => {
      const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.invalid';
      
      mockSecureStore.setItemAsync.mockResolvedValue(undefined);
      
      await secureTokenManager.setToken(validToken);
      
      expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith(
        'auth_token',
        validToken,
        { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY }
      );
    });

    it('should throw TokenExpiredError for expired token', async () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.invalid';
      
      await expect(secureTokenManager.setToken(expiredToken)).rejects.toThrow(TokenExpiredError);
    });

    it('should clear token when null is provided', async () => {
      mockSecureStore.deleteItemAsync.mockResolvedValue(undefined);
      
      await secureTokenManager.setToken(null);
      
      expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith(
        'auth_token',
        { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY }
      );
    });
  });

  describe('getToken', () => {
    it('should return valid token from SecureStore', async () => {
      const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.invalid';
      
      mockSecureStore.getItemAsync.mockResolvedValue(validToken);
      
      const result = await secureTokenManager.getToken();
      
      expect(result).toBe(validToken);
    });

    it('should return null when no token exists', async () => {
      mockSecureStore.getItemAsync.mockResolvedValue(null);
      
      const result = await secureTokenManager.getToken();
      
      expect(result).toBeNull();
    });

    it('should clear and throw TokenExpiredError for expired token', async () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.invalid';
      
      mockSecureStore.getItemAsync.mockResolvedValue(expiredToken);
      mockSecureStore.deleteItemAsync.mockResolvedValue(undefined);
      
      await expect(secureTokenManager.getToken()).rejects.toThrow(TokenExpiredError);
      expect(mockSecureStore.deleteItemAsync).toHaveBeenCalled();
    });
  });

  describe('clearToken', () => {
    it('should remove token from SecureStore', async () => {
      mockSecureStore.deleteItemAsync.mockResolvedValue(undefined);
      
      await secureTokenManager.clearToken();
      
      expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith(
        'auth_token',
        { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY }
      );
    });
  });

  describe('isTokenValid', () => {
    it('should return true for valid token', async () => {
      const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.invalid';
      
      mockSecureStore.getItemAsync.mockResolvedValue(validToken);
      
      const result = await secureTokenManager.isTokenValid();
      
      expect(result).toBe(true);
    });

    it('should return false for expired token', async () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.invalid';
      
      mockSecureStore.getItemAsync.mockResolvedValue(expiredToken);
      mockSecureStore.deleteItemAsync.mockResolvedValue(undefined);
      
      const result = await secureTokenManager.isTokenValid();
      
      expect(result).toBe(false);
    });

    it('should return false when no token exists', async () => {
      mockSecureStore.getItemAsync.mockResolvedValue(null);
      
      const result = await secureTokenManager.isTokenValid();
      
      expect(result).toBe(false);
    });
  });
});