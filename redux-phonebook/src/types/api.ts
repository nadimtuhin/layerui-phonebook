import { Contact, ContactGroup } from './contact';

export interface CreateContactRequest {
  contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>;
}

export interface UpdateContactRequest {
  id: string;
  contact: Partial<Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>>;
}

export interface ImportContactsRequest {
  format: 'csv' | 'json';
  data: string;
  mergeStrategy: 'skip' | 'overwrite' | 'merge';
}

export interface ExportContactsRequest {
  format: 'csv' | 'json';
  contactIds?: string[];
  includeGroups?: boolean;
}

export interface SearchContactsRequest {
  query: string;
  filters?: {
    groups?: string[];
    favorites?: boolean;
  };
  limit?: number;
  offset?: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp: Date;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}