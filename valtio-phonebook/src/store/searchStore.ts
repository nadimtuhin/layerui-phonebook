import { proxy } from 'valtio';
import { derive } from 'valtio/utils';
import { Contact, SearchFilters } from '@/types';
import { searchService } from '@/services/search';
import { contactState } from './contactStore';

export interface SearchState {
  query: string;
  filters: SearchFilters;
  results: Contact[];
  isSearching: boolean;
}

// Search state
export const searchState = proxy<SearchState>({
  query: '',
  filters: {
    groups: [],
    favorites: false,
  },
  results: [],
  isSearching: false,
});

// Derived search state
export const derivedSearchState = derive({
  hasQuery: (get) => get(searchState).query.trim().length > 0,
  displayContacts: (get) => {
    const search = get(searchState);
    const contacts = Object.values(get(contactState).contacts);
    return search.query.trim() ? search.results : contacts;
  },
});

// Search actions
export const searchActions = {
  setQuery(query: string) {
    searchState.query = query;
    this.performSearch();
  },

  setFilters(filters: Partial<SearchFilters>) {
    Object.assign(searchState.filters, filters);
    this.performSearch();
  },

  addGroupFilter(groupId: string) {
    if (!searchState.filters.groups.includes(groupId)) {
      searchState.filters.groups.push(groupId);
      this.performSearch();
    }
  },

  removeGroupFilter(groupId: string) {
    searchState.filters.groups = searchState.filters.groups.filter(id => id !== groupId);
    this.performSearch();
  },

  toggleFavoritesFilter() {
    searchState.filters.favorites = !searchState.filters.favorites;
    this.performSearch();
  },

  clearSearch() {
    searchState.query = '';
    searchState.filters = {
      groups: [],
      favorites: false,
    };
    searchState.results = [];
  },

  performSearch() {
    const { query, filters } = searchState;
    const contacts = Object.values(contactState.contacts);

    if (!query.trim()) {
      searchState.results = [];
      searchState.isSearching = false;
      return;
    }

    searchState.isSearching = true;

    // Debounce search in real implementation
    setTimeout(() => {
      const results = searchService.searchContacts(contacts, {
        query,
        filters,
      });

      searchState.results = results;
      searchState.isSearching = false;
    }, 100);
  },

  searchContacts(contacts: Contact[]) {
    const { query, filters } = searchState;
    
    if (!query.trim()) {
      searchState.results = [];
      return;
    }

    searchState.isSearching = true;
    
    setTimeout(() => {
      const results = searchService.searchContacts(contacts, {
        query,
        filters,
      });

      searchState.results = results;
      searchState.isSearching = false;
    }, 100);
  },
};