import { atom } from 'jotai';
import { 
  contactsAtom, 
  groupsAtom, 
  favoritesAtom, 
  selectedContactAtom,
  isContactFormOpenAtom,
  isGroupManagerOpenAtom,
  isImportExportOpenAtom,
  viewAtom,
  themeAtom,
  searchQueryAtom,
  searchFiltersAtom,
  searchResultsAtom,
  isSearchingAtom,
  loadingAtom,
  errorAtom,
  contactListAtom
} from './atoms';
import { Contact, ContactGroup, SearchFilters } from '@/types';
import { contactsApi, groupsApi } from '@/services/api';
import { searchService } from '@/services/search';

// Contact actions
export const setContactsAction = atom(
  null,
  (get, set, contacts: Contact[]) => {
    const contactsMap = contacts.reduce((acc, contact) => {
      acc[contact.id] = contact;
      return acc;
    }, {} as Record<string, Contact>);

    const favorites = contacts
      .filter(contact => contact.isFavorite)
      .map(contact => contact.id);

    set(contactsAtom, contactsMap);
    set(favoritesAtom, favorites);
  }
);

export const addContactAction = atom(
  null,
  (get, set, contact: Contact) => {
    const contacts = get(contactsAtom);
    set(contactsAtom, { ...contacts, [contact.id]: contact });
    
    if (contact.isFavorite) {
      const favorites = get(favoritesAtom);
      if (!favorites.includes(contact.id)) {
        set(favoritesAtom, [...favorites, contact.id]);
      }
    }
  }
);

export const updateContactAction = atom(
  null,
  (get, set, { id, updates }: { id: string; updates: Partial<Contact> }) => {
    const contacts = get(contactsAtom);
    const contact = contacts[id];
    if (!contact) return;

    const updatedContact = { ...contact, ...updates };
    set(contactsAtom, { ...contacts, [id]: updatedContact });

    // Update favorites
    const favorites = get(favoritesAtom);
    if (updatedContact.isFavorite && !favorites.includes(id)) {
      set(favoritesAtom, [...favorites, id]);
    } else if (!updatedContact.isFavorite && favorites.includes(id)) {
      set(favoritesAtom, favorites.filter(fId => fId !== id));
    }
  }
);

export const deleteContactAction = atom(
  null,
  (get, set, id: string) => {
    const contacts = get(contactsAtom);
    const { [id]: deleted, ...remainingContacts } = contacts;
    set(contactsAtom, remainingContacts);

    const favorites = get(favoritesAtom);
    set(favoritesAtom, favorites.filter(fId => fId !== id));
  }
);

export const toggleFavoriteAction = atom(
  null,
  (get, set, id: string) => {
    const contacts = get(contactsAtom);
    const contact = contacts[id];
    if (!contact) return;

    const isFavorite = !contact.isFavorite;
    const updatedContact = { ...contact, isFavorite };
    set(contactsAtom, { ...contacts, [id]: updatedContact });

    const favorites = get(favoritesAtom);
    if (isFavorite) {
      if (!favorites.includes(id)) {
        set(favoritesAtom, [...favorites, id]);
      }
    } else {
      set(favoritesAtom, favorites.filter(fId => fId !== id));
    }
  }
);

// Async contact actions
export const fetchContactsAction = atom(
  null,
  async (get, set) => {
    set(loadingAtom, true);
    set(errorAtom, null);

    try {
      const response = await contactsApi.getContacts();
      set(setContactsAction, response.data);
    } catch (error) {
      set(errorAtom, error instanceof Error ? error.message : 'Failed to fetch contacts');
    } finally {
      set(loadingAtom, false);
    }
  }
);

export const createContactAction = atom(
  null,
  async (get, set, contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const contact: Contact = {
        ...contactData,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const response = await contactsApi.createContact({ contact });
      set(addContactAction, response.data);
    } catch (error) {
      set(errorAtom, error instanceof Error ? error.message : 'Failed to create contact');
      throw error;
    }
  }
);

export const saveContactAction = atom(
  null,
  async (get, set, contact: Contact) => {
    try {
      const response = await contactsApi.updateContact({
        id: contact.id,
        contact: { ...contact, updatedAt: new Date() }
      });
      set(updateContactAction, { id: contact.id, updates: response.data });
    } catch (error) {
      set(errorAtom, error instanceof Error ? error.message : 'Failed to save contact');
      throw error;
    }
  }
);

export const removeContactAction = atom(
  null,
  async (get, set, id: string) => {
    try {
      await contactsApi.deleteContact(id);
      set(deleteContactAction, id);
    } catch (error) {
      set(errorAtom, error instanceof Error ? error.message : 'Failed to delete contact');
      throw error;
    }
  }
);

// Group actions
export const setGroupsAction = atom(
  null,
  (get, set, groups: ContactGroup[]) => {
    const groupsMap = groups.reduce((acc, group) => {
      acc[group.id] = group;
      return acc;
    }, {} as Record<string, ContactGroup>);
    set(groupsAtom, groupsMap);
  }
);

export const fetchGroupsAction = atom(
  null,
  async (get, set) => {
    try {
      const response = await groupsApi.getGroups();
      set(setGroupsAction, response.data);
    } catch (error) {
      set(errorAtom, error instanceof Error ? error.message : 'Failed to fetch groups');
    }
  }
);

// UI actions
export const selectContactAction = atom(
  null,
  (get, set, contactId?: string) => {
    set(selectedContactAtom, contactId);
  }
);

export const openContactFormAction = atom(
  null,
  (get, set) => {
    set(isContactFormOpenAtom, true);
  }
);

export const closeContactFormAction = atom(
  null,
  (get, set) => {
    set(isContactFormOpenAtom, false);
    set(selectedContactAtom, undefined);
  }
);

export const setViewAction = atom(
  null,
  (get, set, view: 'list' | 'grid' | 'card') => {
    set(viewAtom, view);
  }
);

export const setThemeAction = atom(
  null,
  (get, set, theme: 'light' | 'dark') => {
    set(themeAtom, theme);
  }
);

// Search actions
export const setSearchQueryAction = atom(
  null,
  (get, set, query: string) => {
    set(searchQueryAtom, query);
  }
);

export const setSearchFiltersAction = atom(
  null,
  (get, set, filters: Partial<SearchFilters>) => {
    const currentFilters = get(searchFiltersAtom);
    set(searchFiltersAtom, { ...currentFilters, ...filters });
  }
);

export const toggleFavoritesFilterAction = atom(
  null,
  (get, set) => {
    const filters = get(searchFiltersAtom);
    set(searchFiltersAtom, { ...filters, favorites: !filters.favorites });
  }
);

export const searchContactsAction = atom(
  null,
  (get, set) => {
    const query = get(searchQueryAtom);
    const filters = get(searchFiltersAtom);
    const contacts = get(contactListAtom);

    if (!query.trim()) {
      set(searchResultsAtom, []);
      return;
    }

    set(isSearchingAtom, true);
    
    // Simulate async search
    setTimeout(() => {
      const results = searchService.searchContacts(contacts, { query, filters });
      set(searchResultsAtom, results);
      set(isSearchingAtom, false);
    }, 100);
  }
);

export const clearSearchAction = atom(
  null,
  (get, set) => {
    set(searchQueryAtom, '');
    set(searchFiltersAtom, { groups: [], favorites: false });
    set(searchResultsAtom, []);
  }
);