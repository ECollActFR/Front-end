/**
 * Simple API Client with integrated token management
 */

import { API_CONFIG } from '@/constants/config';
import { tokenManager, TokenExpiredError, TokenStorageError } from '@/services/tokenManager';

interface RequestConfig {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
  timeout?: number;
}

export class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string = API_CONFIG.BASE_URL, timeout: number = API_CONFIG.TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  /**
   * Add authentication token to request headers
   */
  private async addAuthHeader(config: RequestConfig): Promise<RequestConfig> {
    // Skip auth for login endpoint
    if (config.url.includes('/api/login_check')) {
      return config;
    }

    try {
      const token = await tokenManager.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // Handle token errors gracefully
      if (error instanceof TokenExpiredError) {
        // Token expired, will be handled by the calling code
        console.warn('Token expired during request setup');
      } else if (error instanceof TokenStorageError) {
        // Storage error, continue without token
        console.warn('Token storage error:', error.message);
      }
    }

    return config;
  }

  /**
   * Make HTTP request with automatic token injection
   */
  async request(config: RequestConfig): Promise<Response> {
    // Add auth header
    const authConfig = await this.addAuthHeader({ ...config });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), authConfig.timeout || this.timeout);

    try {
      const response = await fetch(authConfig.url, {
        method: authConfig.method,
        headers: authConfig.headers,
        body: authConfig.body,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = {
          message: `HTTP error! status: ${response.status}`,
          status: response.status,
          config: authConfig,
        };
        
        // Handle 401 errors - clear token and let calling code handle redirect
        if (response.status === 401) {
          // Clear token on 401 errors
          try {
            await tokenManager.clearToken();
          } catch (clearError) {
            // Log but don't fail the request error handling
            console.warn('Failed to clear token after 401:', clearError);
          }
        }
        
        throw error;
      }

      return response;
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw {
          message: 'Request timeout',
          status: 408,
          config: authConfig,
        };
      }

      throw {
        message: error.message || 'Network error',
        status: error.status || 0,
        config: authConfig,
      };
    }
  }

  /**
   * Convenience methods
   */
  async get<T>(endpoint: string, headers: Record<string, string> = {}): Promise<T> {
    const config: RequestConfig = {
      url: `${this.baseURL}${endpoint}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/ld+json',
        'Accept': 'application/ld+json',
        ...headers,
      },
    };

    const response = await this.request(config);
    return response.json();
  }

  async post<T>(endpoint: string, data: any, headers: Record<string, string> = {}): Promise<T> {
    const config: RequestConfig = {
      url: `${this.baseURL}${endpoint}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/ld+json',
        'Accept': 'application/ld+json',
        ...headers,
      },
      body: JSON.stringify(data),
    };

    const response = await this.request(config);
    return response.json();
  }

  async put<T>(endpoint: string, data: any, headers: Record<string, string> = {}): Promise<T> {
    const config: RequestConfig = {
      url: `${this.baseURL}${endpoint}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/ld+json',
        'Accept': 'application/ld+json',
        ...headers,
      },
      body: JSON.stringify(data),
    };

    const response = await this.request(config);
    return response.json();
  }

  async delete<T>(endpoint: string, headers: Record<string, string> = {}): Promise<T> {
    const config: RequestConfig = {
      url: `${this.baseURL}${endpoint}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/ld+json',
        'Accept': 'application/ld+json',
        ...headers,
      },
    };

    const response = await this.request(config);
    
    // DELETE might return empty response
    const text = await response.text();
    return text ? JSON.parse(text) : ({} as T);
  }
}

// Create singleton instance
export const apiClient = new ApiClient();