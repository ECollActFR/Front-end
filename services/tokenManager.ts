/**
 * Token Manager - Centralized token management
 * This module provides a way to get the current token without React Context
 */

let currentToken: string | null = null;

export const tokenManager = {
  setToken: (token: string | null) => {
    currentToken = token;
  },

  getToken: (): string | null => {
    return currentToken;
  },

  clearToken: () => {
    currentToken = null;
  },
};
