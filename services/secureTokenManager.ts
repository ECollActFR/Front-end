/**
 * Secure Token Manager with migration from AsyncStorage
 * Provides encrypted token storage using Expo SecureStore
 */

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Storage keys
const TOKEN_KEY = 'auth_token';
const MIGRATION_KEY = 'token_migrated_to_secure';

// Web fallback for SecureStore
const isWeb = Platform.OS === 'web';

// Check if localStorage is available (for SSR compatibility)
const isLocalStorageAvailable = (): boolean => {
  return isWeb && typeof window !== 'undefined' && 'localStorage' in window;
};

const secureStorage = {
  setItemAsync: async (key: string, value: string): Promise<void> => {
    if (isLocalStorageAvailable()) {
      try {
        window.localStorage.setItem(key, value);
      } catch (error) {
        throw new TokenStorageError('Failed to store item in localStorage', error as Error);
      }
      return;
    }
    return SecureStore.setItemAsync(key, value);
  },
  getItemAsync: async (key: string): Promise<string | null> => {
    if (isLocalStorageAvailable()) {
      try {
        return window.localStorage.getItem(key);
      } catch (error) {
        throw new TokenStorageError('Failed to retrieve item from localStorage', error as Error);
      }
    }
    return SecureStore.getItemAsync(key);
  },
  deleteItemAsync: async (key: string): Promise<void> => {
    if (isLocalStorageAvailable()) {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        throw new TokenStorageError('Failed to remove item from localStorage', error as Error);
      }
      return;
    }
    return SecureStore.deleteItemAsync(key);
  }
};

// JWT utilities
interface JWTPayload {
  exp: number;
  iat: number;
  sub?: string;
  [key: string]: any;
}

/**
 * Custom error types for token management
 */
export class TokenStorageError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'TokenStorageError';
  }
}

export class TokenExpiredError extends Error {
  constructor(message: string = 'Token has expired') {
    super(message);
    this.name = 'TokenExpiredError';
  }
}

export class TokenInvalidError extends Error {
  constructor(message: string = 'Token is invalid') {
    super(message);
    this.name = 'TokenInvalidError';
  }
}

/**
 * Parse JWT token without verification (for expiration check only)
 */
function parseJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const payload = JSON.parse(atob(parts[1] || ''));
    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Check if JWT token is expired
 */
function isTokenExpired(token: string): boolean {
  const payload = parseJWT(token);
  if (!payload || !payload.exp) {
    return true; // Invalid token structure
  }
  
  const currentTime = Math.floor(Date.now() / 1000);
  const expirationTime = payload.exp;
  
  // Add 30 seconds buffer to account for clock skew
  return currentTime >= (expirationTime - 30);
}

/**
 * Check if token will expire within the next 5 minutes
 */
function isTokenExpiringSoon(token: string): boolean {
  const payload = parseJWT(token);
  if (!payload || !payload.exp) {
    return true;
  }
  
  const currentTime = Math.floor(Date.now() / 1000);
  const expirationTime = payload.exp;
  const fiveMinutes = 5 * 60;
  
  return currentTime >= (expirationTime - fiveMinutes);
}

/**
 * Migrate token from AsyncStorage to SecureStore
 */
async function migrateFromAsyncStorage(): Promise<void> {
  try {
    // Skip migration on web - use AsyncStorage directly
    if (isWeb) {
      return;
    }

    // Check if migration already done
    const alreadyMigrated = await secureStorage.getItemAsync(MIGRATION_KEY);
    if (alreadyMigrated === 'true') {
      return;
    }
    
    // Get token from AsyncStorage
    const oldToken = await AsyncStorage.getItem('auth-token');
    
    if (oldToken) {
      // Validate token before migration
      if (!isTokenExpired(oldToken)) {
        // Store in secure storage
        await secureStorage.setItemAsync(TOKEN_KEY, oldToken);
      }
      
      // Remove from AsyncStorage
      await AsyncStorage.removeItem('auth-token');
    }
    
    // Mark migration as complete
    await secureStorage.setItemAsync(MIGRATION_KEY, 'true');
    
  } catch (error) {
    throw new TokenStorageError('Failed to migrate token from AsyncStorage', error as Error);
  }
}

/**
 * Secure Token Manager
 */
export const secureTokenManager = {
  /**
   * Initialize the token manager and perform migration if needed
   */
  initialize: async (): Promise<void> => {
    try {
      await migrateFromAsyncStorage();
    } catch (error) {
      // Log error but don't fail initialization
      console.warn('Token migration failed:', error);
    }
  },

  /**
   * Store token securely
   */
  setToken: async (token: string | null): Promise<void> => {
    try {
      if (token) {
        // Validate token before storing
        if (isTokenExpired(token)) {
          throw new TokenExpiredError('Cannot store expired token');
        }
        
        await secureStorage.setItemAsync(TOKEN_KEY, token);
      } else {
        await secureStorage.deleteItemAsync(TOKEN_KEY);
      }
    } catch (error) {
      if (error instanceof TokenExpiredError || error instanceof TokenInvalidError) {
        throw error;
      }
      throw new TokenStorageError('Failed to store token securely', error as Error);
    }
  },

  /**
   * Retrieve token from secure storage
   */
  getToken: async (): Promise<string | null> => {
    try {
        const token = await secureStorage.getItemAsync(TOKEN_KEY);
      
      if (token) {
        // Validate token on retrieval
        if (isTokenExpired(token)) {
          // Clear expired token
          await secureTokenManager.clearToken();
          throw new TokenExpiredError('Stored token has expired');
        }
        
        return token;
      }
      
      return null;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw error;
      }
      throw new TokenStorageError('Failed to retrieve token from secure storage', error as Error);
    }
  },

  /**
   * Clear token from secure storage
   */
  clearToken: async (): Promise<void> => {
    try {
      await secureStorage.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      throw new TokenStorageError('Failed to clear token from secure storage', error as Error);
    }
  },

  /**
   * Check if token is valid and not expired
   */
  isTokenValid: async (): Promise<boolean> => {
    try {
      const token = await secureTokenManager.getToken();
      return token !== null && !isTokenExpired(token);
    } catch (error) {
      return false;
    }
  },

  /**
   * Check if token will expire soon (within 5 minutes)
   */
  isTokenExpiringSoon: async (): Promise<boolean> => {
    try {
      const token = await secureTokenManager.getToken();
      if (!token) {
        return false;
      }
      return isTokenExpiringSoon(token);
    } catch (error) {
      return false;
    }
  },

  /**
   * Get token expiration time
   */
  getTokenExpiration: async (): Promise<Date | null> => {
    try {
      const token = await secureTokenManager.getToken();
      if (!token) {
        return null;
      }
      
      const payload = parseJWT(token);
      if (!payload || !payload.exp) {
        return null;
      }
      
      return new Date(payload.exp * 1000);
    } catch (error) {
      return null;
    }
  },
};

// Export singleton instance for backward compatibility
export const tokenManager = secureTokenManager;