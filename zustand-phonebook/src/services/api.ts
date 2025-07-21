import axios from 'axios';
import { Contact, ContactGroup, CreateContactRequest, UpdateContactRequest, ApiResponse } from '@/types';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const contactsApi = {
  async getContacts(): Promise<ApiResponse<Contact[]>> {
    const response = await api.get('/contacts');
    return response.data;
  },

  async getContact(id: string): Promise<ApiResponse<Contact>> {
    const response = await api.get(`/contacts/${id}`);
    return response.data;
  },

  async createContact(request: CreateContactRequest): Promise<ApiResponse<Contact>> {
    const response = await api.post('/contacts', request);
    return response.data;
  },

  async updateContact(request: UpdateContactRequest): Promise<ApiResponse<Contact>> {
    const response = await api.put(`/contacts/${request.id}`, request.contact);
    return response.data;
  },

  async deleteContact(id: string): Promise<void> {
    await api.delete(`/contacts/${id}`);
  },

  async bulkDelete(ids: string[]): Promise<void> {
    await api.post('/contacts/bulk-delete', { ids });
  },
};

export const groupsApi = {
  async getGroups(): Promise<ApiResponse<ContactGroup[]>> {
    const response = await api.get('/groups');
    return response.data;
  },

  async createGroup(group: Omit<ContactGroup, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ContactGroup>> {
    const response = await api.post('/groups', group);
    return response.data;
  },

  async updateGroup(id: string, updates: Partial<ContactGroup>): Promise<ApiResponse<ContactGroup>> {
    const response = await api.put(`/groups/${id}`, updates);
    return response.data;
  },

  async deleteGroup(id: string): Promise<void> {
    await api.delete(`/groups/${id}`);
  },
};