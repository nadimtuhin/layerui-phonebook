import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Contact, SearchFilters } from '@/types';
import { searchService } from '@/services/search';

interface SearchState {
  // State
  query: string;
  filters: SearchFilters;
  results: Contact[];
  isSearching: boolean;
  
  // Actions
  setQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  addGroupFilter: (groupId: string) => void;
  removeGroupFilter: (groupId: string) => void;
  toggleFavoritesFilter: () => void;
  clearSearch: () => void;
  
  // Search execution
  searchContacts: (contacts: Contact[]) => void;
}

export const useSearchStore = create<SearchState>()(
  immer((set, get) => ({
    // Initial state
    query: '',
    filters: {
      groups: [],
      favorites: false,
    },
    results: [],
    isSearching: false,

    // Actions
    setQuery: (query) => {
      set((state) => {
        state.query = query;
      });
    },

    setFilters: (newFilters) => {
      set((state) => {
        Object.assign(state.filters, newFilters);
      });
    },

    addGroupFilter: (groupId) => {
      set((state) => {
        if (!state.filters.groups.includes(groupId)) {
          state.filters.groups.push(groupId);
        }
      });
    },

    removeGroupFilter: (groupId) => {
      set((state) => {
        state.filters.groups = state.filters.groups.filter(id => id !== groupId);
      });
    },

    toggleFavoritesFilter: () => {
      set((state) => {
        state.filters.favorites = !state.filters.favorites;
      });
    },

    clearSearch: () => {
      set((state) => {
        state.query = '';
        state.filters = {
          groups: [],
          favorites: false,
        };
        state.results = [];
      });
    },

    searchContacts: (contacts) => {
      const { query, filters } = get();
      
      set((state) => {
        state.isSearching = true;
      });

      // Simulate async search for consistency
      setTimeout(() => {
        const results = searchService.searchContacts(contacts, {
          query,
          filters,
        });

        set((state) => {
          state.results = results;
          state.isSearching = false;
        });
      }, 100);
    },
  }))
);