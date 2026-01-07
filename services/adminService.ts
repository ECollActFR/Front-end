/**
 * Admin service for API operations
 * Handles client accounts and user management for super admins
 */

import { apiClient } from './middleware';
import { ENDPOINTS } from '@/constants/config';
import { 
  ClientAccount, 
  ClientAccountCreatePayload, 
  ClientAccountUpdatePayload, 
  HydraCollectionClientAccount,
  CreateUserPayload,
  CreateUserApiPayload,
  UpdateUserPayload,
  UserWithClientAccount
} from '@/types/clientAccount';

export const adminService = {
  // Client Accounts
  async getClientAccounts(page: number = 1, limit: number = 20): Promise<HydraCollectionClientAccount> {
    return apiClient.get(`${ENDPOINTS.CLIENT_ACCOUNTS}?page=${page}&limit=${limit}`);
  },

  async getClientAccount(id: number): Promise<ClientAccount> {
    return apiClient.get(ENDPOINTS.CLIENT_ACCOUNT(id));
  },

  async createClientAccount(payload: ClientAccountCreatePayload): Promise<ClientAccount> {
    return apiClient.post(ENDPOINTS.CLIENT_ACCOUNTS, payload);
  },

  async updateClientAccount(id: number, payload: ClientAccountUpdatePayload): Promise<ClientAccount> {
    return apiClient.put(ENDPOINTS.CLIENT_ACCOUNT(id), payload);
  },

  async deleteClientAccount(id: number): Promise<void> {
    return apiClient.delete(ENDPOINTS.CLIENT_ACCOUNT(id));
  },

  // Users Management
  async getUsersByClientAccount(clientAccountId: number): Promise<UserWithClientAccount[]> {
    const response: any = await apiClient.get(`${ENDPOINTS.USERS}?clientAccount=${clientAccountId}`);
    return response.member || [];
  },

  async createUser(payload: CreateUserPayload): Promise<UserWithClientAccount> {
    return apiClient.post(ENDPOINTS.USERS, payload);
  },

  async createUserApi(payload: CreateUserApiPayload): Promise<UserWithClientAccount> {
    return apiClient.post(ENDPOINTS.USERS, payload);
  },

  async updateUser(id: number, payload: UpdateUserPayload): Promise<UserWithClientAccount> {
    return apiClient.put(ENDPOINTS.USER(id), payload);
  },

  async deleteUser(id: number): Promise<void> {
    return apiClient.delete(ENDPOINTS.USER(id));
  },
};