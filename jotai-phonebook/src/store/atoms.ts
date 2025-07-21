import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';
import { Contact, ContactGroup, SearchFilters } from '@/types';

// Base atoms
export const contactsAtom = atom<Record<string, Contact>>({});
export const groupsAtom = atom<Record<string, ContactGroup>>({});
export const favoritesAtom = atom<string[]>([]);

// UI atoms
export const selectedContactAtom = atom<string | undefined>(undefined);
export const isContactFormOpenAtom = atom<boolean>(false);
export const isGroupManagerOpenAtom = atom<boolean>(false);
export const isImportExportOpenAtom = atom<boolean>(false);
export const viewAtom = atom<'list' | 'grid' | 'card'>('list');
export const themeAtom = atom<'light' | 'dark'>('light');

// Search atoms
export const searchQueryAtom = atomWithReset<string>('');
export const searchFiltersAtom = atomWithReset<SearchFilters>({
  groups: [],
  favorites: false,
});
export const searchResultsAtom = atom<Contact[]>([]);
export const isSearchingAtom = atom<boolean>(false);

// Loading and error atoms
export const loadingAtom = atom<boolean>(false);
export const errorAtom = atom<string | null>(null);

// Derived atoms
export const contactListAtom = atom<Contact[]>((get) => {
  const contacts = get(contactsAtom);
  return Object.values(contacts);
});

export const groupListAtom = atom<ContactGroup[]>((get) => {
  const groups = get(groupsAtom);
  return Object.values(groups);
});

export const favoriteContactsAtom = atom<Contact[]>((get) => {
  const contacts = get(contactsAtom);
  const favorites = get(favoritesAtom);
  return favorites.map(id => contacts[id]).filter(Boolean);
});

export const filteredContactsAtom = atom<Contact[]>((get) => {
  const contacts = get(contactListAtom);
  const query = get(searchQueryAtom);
  const results = get(searchResultsAtom);
  
  return query.trim() ? results : contacts;
});

// Contact by ID atom (for detail view)
export const contactByIdAtom = (id: string) => atom<Contact | undefined>((get) => {
  const contacts = get(contactsAtom);
  return contacts[id];
});

// Group contacts atom
export const contactsByGroupAtom = (groupId: string) => atom<Contact[]>((get) => {
  const contacts = get(contactListAtom);
  return contacts.filter(contact => contact.groups.includes(groupId));
});