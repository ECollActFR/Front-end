/**
 * Token Manager - Backward compatibility layer for SecureTokenManager
 * @deprecated Use secureTokenManager directly for new code
 */

import { 
  secureTokenManager, 
  TokenStorageError, 
  TokenExpiredError, 
  TokenInvalidError 
} from './secureTokenManager';

// Re-export for backward compatibility
export const tokenManager = secureTokenManager;

// Export error types
export { 
  TokenStorageError, 
  TokenExpiredError, 
  TokenInvalidError 
};
