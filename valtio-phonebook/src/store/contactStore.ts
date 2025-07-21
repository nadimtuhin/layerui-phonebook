import { proxy } from 'valtio';
import { derive } from 'valtio/utils';
import { Contact, ContactGroup } from '@/types';
import { contactsApi, groupsApi } from '@/services/api';

export interface ContactState {
  contacts: Record<string, Contact>;
  groups: Record<string, ContactGroup>;
  favorites: string[];
  loading: boolean;
  error: string | null;
}

// Main state
export const contactState = proxy<ContactState>({
  contacts: {},
  groups: {},
  favorites: [],
  loading: false,
  error: null,
});

// Derived state
export const derivedContactState = derive({
  contactList: (get) => Object.values(get(contactState).contacts),
  groupList: (get) => Object.values(get(contactState).groups),
  favoriteContacts: (get) => {
    const state = get(contactState);
    return state.favorites.map(id => state.contacts[id]).filter(Boolean);
  },
  contactCount: (get) => Object.keys(get(contactState).contacts).length,
});

// Actions
export const contactActions = {
  setContacts(contacts: Contact[]) {
    contactState.contacts = {};
    contactState.favorites = [];
    
    contacts.forEach(contact => {
      contactState.contacts[contact.id] = contact;
      if (contact.isFavorite) {
        contactState.favorites.push(contact.id);
      }
    });
  },

  addContact(contact: Contact) {
    contactState.contacts[contact.id] = contact;
    if (contact.isFavorite && !contactState.favorites.includes(contact.id)) {
      contactState.favorites.push(contact.id);
    }
  },

  updateContact(id: string, updates: Partial<Contact>) {
    if (contactState.contacts[id]) {
      Object.assign(contactState.contacts[id], updates);
      
      // Update favorites
      const contact = contactState.contacts[id];
      const inFavorites = contactState.favorites.includes(id);
      
      if (contact.isFavorite && !inFavorites) {
        contactState.favorites.push(id);
      } else if (!contact.isFavorite && inFavorites) {
        contactState.favorites = contactState.favorites.filter(fId => fId !== id);
      }
    }
  },

  deleteContact(id: string) {
    delete contactState.contacts[id];
    contactState.favorites = contactState.favorites.filter(fId => fId !== id);
  },

  toggleFavorite(id: string) {
    const contact = contactState.contacts[id];
    if (contact) {
      contact.isFavorite = !contact.isFavorite;
      
      if (contact.isFavorite) {
        if (!contactState.favorites.includes(id)) {
          contactState.favorites.push(id);
        }
      } else {
        contactState.favorites = contactState.favorites.filter(fId => fId !== id);
      }
    }
  },

  setGroups(groups: ContactGroup[]) {
    contactState.groups = {};
    groups.forEach(group => {
      contactState.groups[group.id] = group;
    });
  },

  addGroup(group: ContactGroup) {
    contactState.groups[group.id] = group;
  },

  updateGroup(id: string, updates: Partial<ContactGroup>) {
    if (contactState.groups[id]) {
      Object.assign(contactState.groups[id], updates);
    }
  },

  deleteGroup(id: string) {
    delete contactState.groups[id];
    // Remove group from all contacts
    Object.values(contactState.contacts).forEach(contact => {
      contact.groups = contact.groups.filter(groupId => groupId !== id);
    });
  },

  setLoading(loading: boolean) {
    contactState.loading = loading;
  },

  setError(error: string | null) {
    contactState.error = error;
  },

  clearError() {
    contactState.error = null;
  },

  reset() {
    contactState.contacts = {};
    contactState.groups = {};
    contactState.favorites = [];
    contactState.loading = false;
    contactState.error = null;
  },

  // Async actions
  async fetchContacts() {
    contactState.loading = true;
    contactState.error = null;

    try {
      const response = await contactsApi.getContacts();
      this.setContacts(response.data);
    } catch (error) {
      contactState.error = error instanceof Error ? error.message : 'Failed to fetch contacts';
    } finally {
      contactState.loading = false;
    }
  },

  async createContact(contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const contact: Contact = {
        ...contactData,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const response = await contactsApi.createContact({ contact });
      this.addContact(response.data);
    } catch (error) {
      contactState.error = error instanceof Error ? error.message : 'Failed to create contact';
      throw error;
    }
  },

  async saveContact(contact: Contact) {
    try {
      const response = await contactsApi.updateContact({
        id: contact.id,
        contact: { ...contact, updatedAt: new Date() }
      });
      this.updateContact(contact.id, response.data);
    } catch (error) {
      contactState.error = error instanceof Error ? error.message : 'Failed to save contact';
      throw error;
    }
  },

  async removeContact(id: string) {
    try {
      await contactsApi.deleteContact(id);
      this.deleteContact(id);
    } catch (error) {
      contactState.error = error instanceof Error ? error.message : 'Failed to delete contact';
      throw error;
    }
  },

  async fetchGroups() {
    try {
      const response = await groupsApi.getGroups();
      this.setGroups(response.data);
    } catch (error) {
      contactState.error = error instanceof Error ? error.message : 'Failed to fetch groups';
    }
  },

  // Utility functions
  getContactById(id: string): Contact | undefined {
    return contactState.contacts[id];
  },

  getContactsByGroup(groupId: string): Contact[] {
    return Object.values(contactState.contacts).filter(contact => 
      contact.groups.includes(groupId)
    );
  },
};