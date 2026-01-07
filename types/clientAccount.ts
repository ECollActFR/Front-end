/**
 * Client Account types for admin functionality
 * Based on the API schema provided
 */

export interface ClientAccount {
  "@id": string;
  "@type": string;
  id: number;
  companyName: string;
  siret?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  contactEmail?: string;
  createdAt: string;
  users: string[]; // Array of user URLs
  active: boolean;
}

export interface ClientAccountCreatePayload {
  companyName: string;
  siret?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  contactEmail?: string;
}

export interface ClientAccountUpdatePayload {
  companyName?: string;
  siret?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  contactEmail?: string;
  active?: boolean;
}

export interface HydraCollectionClientAccount {
  "@context": string;
  "@id": string;
  "@type": "Collection";
  totalItems: number;
  member: ClientAccount[];
  view: {
    "@id": string;
    "@type": "PartialCollectionView";
    first?: string;
    last?: string;
    next?: string;
    previous?: string;
  };
}

// User management for client accounts
export interface CreateUserPayload {
  username: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  clientAccount: string; // URL du client account
  roles: string[]; // ["ROLE_USER"]
}

// New API payload format for localhost:8000/users
export interface CreateUserApiPayload {
  email: string;
  firstname: string;
  lastname: string;
  phone?: string;
  profilePictureUrl?: string;
  roles: string[]; // ["ROLE_USER"] par défaut
  clientAccountId: number;
}

export interface UpdateUserPayload {
  username?: string;
  email?: string;
  password?: string;
  firstname?: string;
  lastname?: string;
  roles?: string[];
}

// Extended User interface with client account info
export interface UserWithClientAccount {
  id: number;
  username: string;
  email: string;
  roles: string[];
  createdAt?: string;
  isEmailVerified: boolean;
  firstname: string;
  lastname: string;
  clientAccount?: {
    "@id": string;
    "@type": string;
    id: number;
    companyName: string;
  };
}