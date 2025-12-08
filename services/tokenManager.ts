/**
 * Token Manager - Centralized token management with persistence
 */

let currentToken: string | null = null;

export const tokenManager = {
  setToken: async (token: string | null) => {
    currentToken = token;
    
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      if (token) {
        await AsyncStorage.setItem('auth-token', token);
      } else {
        await AsyncStorage.removeItem('auth-token');
      }
    } catch (error) {
      console.error('Failed to persist token:', error);
    }
  },

  getToken: async (): Promise<string | null> => {
    if (currentToken) {
      return currentToken;
    }

    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const storedToken = await AsyncStorage.getItem('auth-token');
      if (storedToken) {
        currentToken = storedToken;
        return storedToken;
      }
    } catch (error) {
      console.error('Failed to retrieve token:', error);
    }

    return null;
  },

  clearToken: async () => {
    currentToken = null;
    
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.removeItem('auth-token');
    } catch (error) {
      console.error('Failed to clear token:', error);
    }
  },

  /**
   * Initialize token manager by loading token from storage
   */
  initialize: async () => {
    await tokenManager.getToken();
  },
};
