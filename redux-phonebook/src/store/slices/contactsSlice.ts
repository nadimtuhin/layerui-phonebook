import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Contact, ContactsState, CreateContactRequest, UpdateContactRequest } from '@/types';
import { contactsApi } from '@/services/api';

const initialState: ContactsState = {
  contacts: {},
  groups: {},
  callHistory: {},
  favorites: [],
  loading: false,
  error: null,
  lastSync: undefined,
};

export const fetchContacts = createAsyncThunk(
  'contacts/fetchContacts',
  async () => {
    const response = await contactsApi.getContacts();
    return response.data;
  }
);

export const createContact = createAsyncThunk(
  'contacts/createContact',
  async (request: CreateContactRequest) => {
    const response = await contactsApi.createContact(request);
    return response.data;
  }
);

export const updateContact = createAsyncThunk(
  'contacts/updateContact',
  async (request: UpdateContactRequest) => {
    const response = await contactsApi.updateContact(request);
    return response.data;
  }
);

export const deleteContact = createAsyncThunk(
  'contacts/deleteContact',
  async (contactId: string) => {
    await contactsApi.deleteContact(contactId);
    return contactId;
  }
);

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const contactId = action.payload;
      const contact = state.contacts[contactId];
      if (contact) {
        contact.isFavorite = !contact.isFavorite;
        if (contact.isFavorite) {
          if (!state.favorites.includes(contactId)) {
            state.favorites.push(contactId);
          }
        } else {
          state.favorites = state.favorites.filter(id => id !== contactId);
        }
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    addToGroup: (state, action: PayloadAction<{ contactId: string; groupId: string }>) => {
      const { contactId, groupId } = action.payload;
      const contact = state.contacts[contactId];
      if (contact && !contact.groups.includes(groupId)) {
        contact.groups.push(groupId);
      }
    },
    removeFromGroup: (state, action: PayloadAction<{ contactId: string; groupId: string }>) => {
      const { contactId, groupId } = action.payload;
      const contact = state.contacts[contactId];
      if (contact) {
        contact.groups = contact.groups.filter(id => id !== groupId);
      }
    },
    bulkDelete: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach(contactId => {
        delete state.contacts[contactId];
        state.favorites = state.favorites.filter(id => id !== contactId);
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        const contacts = action.payload;
        state.contacts = contacts.reduce((acc, contact) => {
          acc[contact.id] = contact;
          if (contact.isFavorite) {
            state.favorites.push(contact.id);
          }
          return acc;
        }, {} as Record<string, Contact>);
        state.lastSync = new Date();
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch contacts';
      })
      .addCase(createContact.fulfilled, (state, action) => {
        const contact = action.payload;
        state.contacts[contact.id] = contact;
        if (contact.isFavorite) {
          state.favorites.push(contact.id);
        }
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        const contact = action.payload;
        state.contacts[contact.id] = contact;
        if (contact.isFavorite && !state.favorites.includes(contact.id)) {
          state.favorites.push(contact.id);
        } else if (!contact.isFavorite) {
          state.favorites = state.favorites.filter(id => id !== contact.id);
        }
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        const contactId = action.payload;
        delete state.contacts[contactId];
        state.favorites = state.favorites.filter(id => id !== contactId);
      });
  },
});

export const { 
  toggleFavorite, 
  clearError, 
  addToGroup, 
  removeFromGroup, 
  bulkDelete 
} = contactsSlice.actions;

export default contactsSlice.reducer;