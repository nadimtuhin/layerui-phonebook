import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { Contact, ContactGroup } from '@/types';
import { contactsApi, groupsApi } from '@/services/api';

interface ContactState {
  // State
  contacts: Record<string, Contact>;
  groups: Record<string, ContactGroup>;
  favorites: string[];
  loading: boolean;
  error: string | null;
  
  // Actions
  setContacts: (contacts: Contact[]) => void;
  addContact: (contact: Contact) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  toggleFavorite: (id: string) => void;
  
  // Async actions
  fetchContacts: () => Promise<void>;
  createContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  saveContact: (contact: Contact) => Promise<void>;
  removeContact: (id: string) => Promise<void>;
  
  // Groups
  setGroups: (groups: ContactGroup[]) => void;
  addGroup: (group: ContactGroup) => void;
  updateGroup: (id: string, updates: Partial<ContactGroup>) => void;
  deleteGroup: (id: string) => void;
  fetchGroups: () => Promise<void>;
  
  // Utilities
  clearError: () => void;
  reset: () => void;
}

export const useContactStore = create<ContactState>()(
  persist(
    immer((set, get) => ({
      // Initial state
      contacts: {},
      groups: {},
      favorites: [],
      loading: false,
      error: null,

      // Sync actions
      setContacts: (contacts) => {
        set((state) => {
          state.contacts = {};
          state.favorites = [];
          contacts.forEach((contact) => {
            state.contacts[contact.id] = contact;
            if (contact.isFavorite) {
              state.favorites.push(contact.id);
            }
          });
        });
      },

      addContact: (contact) => {
        set((state) => {
          state.contacts[contact.id] = contact;
          if (contact.isFavorite && !state.favorites.includes(contact.id)) {
            state.favorites.push(contact.id);
          }
        });
      },

      updateContact: (id, updates) => {
        set((state) => {
          if (state.contacts[id]) {
            Object.assign(state.contacts[id], updates);
            
            // Update favorites
            const isFavorite = state.contacts[id].isFavorite;
            const inFavorites = state.favorites.includes(id);
            
            if (isFavorite && !inFavorites) {
              state.favorites.push(id);
            } else if (!isFavorite && inFavorites) {
              state.favorites = state.favorites.filter(fId => fId !== id);
            }
          }
        });
      },

      deleteContact: (id) => {
        set((state) => {
          delete state.contacts[id];
          state.favorites = state.favorites.filter(fId => fId !== id);
        });
      },

      toggleFavorite: (id) => {
        set((state) => {
          if (state.contacts[id]) {
            const contact = state.contacts[id];
            contact.isFavorite = !contact.isFavorite;
            
            if (contact.isFavorite) {
              if (!state.favorites.includes(id)) {
                state.favorites.push(id);
              }
            } else {
              state.favorites = state.favorites.filter(fId => fId !== id);
            }
          }
        });
      },

      // Async actions
      fetchContacts: async () => {
        set((state) => {
          state.loading = true;
          state.error = null;
        });

        try {
          const response = await contactsApi.getContacts();
          get().setContacts(response.data);
        } catch (error) {
          set((state) => {
            state.error = error instanceof Error ? error.message : 'Failed to fetch contacts';
          });
        } finally {
          set((state) => {
            state.loading = false;
          });
        }
      },

      createContact: async (contactData) => {
        try {
          const contact: Contact = {
            ...contactData,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          const response = await contactsApi.createContact({ contact });
          get().addContact(response.data);
        } catch (error) {
          set((state) => {
            state.error = error instanceof Error ? error.message : 'Failed to create contact';
          });
          throw error;
        }
      },

      saveContact: async (contact) => {
        try {
          const response = await contactsApi.updateContact({
            id: contact.id,
            contact: { ...contact, updatedAt: new Date() }
          });
          get().updateContact(contact.id, response.data);
        } catch (error) {
          set((state) => {
            state.error = error instanceof Error ? error.message : 'Failed to save contact';
          });
          throw error;
        }
      },

      removeContact: async (id) => {
        try {
          await contactsApi.deleteContact(id);
          get().deleteContact(id);
        } catch (error) {
          set((state) => {
            state.error = error instanceof Error ? error.message : 'Failed to delete contact';
          });
          throw error;
        }
      },

      // Groups
      setGroups: (groups) => {
        set((state) => {
          state.groups = {};
          groups.forEach((group) => {
            state.groups[group.id] = group;
          });
        });
      },

      addGroup: (group) => {
        set((state) => {
          state.groups[group.id] = group;
        });
      },

      updateGroup: (id, updates) => {
        set((state) => {
          if (state.groups[id]) {
            Object.assign(state.groups[id], updates);
          }
        });
      },

      deleteGroup: (id) => {
        set((state) => {
          delete state.groups[id];
          // Remove group from all contacts
          Object.values(state.contacts).forEach((contact) => {
            contact.groups = contact.groups.filter(groupId => groupId !== id);
          });
        });
      },

      fetchGroups: async () => {
        try {
          const response = await groupsApi.getGroups();
          get().setGroups(response.data);
        } catch (error) {
          set((state) => {
            state.error = error instanceof Error ? error.message : 'Failed to fetch groups';
          });
        }
      },

      // Utilities
      clearError: () => {
        set((state) => {
          state.error = null;
        });
      },

      reset: () => {
        set(() => ({
          contacts: {},
          groups: {},
          favorites: [],
          loading: false,
          error: null,
        }));
      },
    })),
    {
      name: 'phonebook-storage',
      partialize: (state) => ({
        contacts: state.contacts,
        groups: state.groups,
        favorites: state.favorites,
      }),
    }
  )
);