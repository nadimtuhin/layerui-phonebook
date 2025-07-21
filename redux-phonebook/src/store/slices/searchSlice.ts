import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SearchState, SearchFilters, SearchContactsRequest } from '@/types';
import { searchService } from '@/services/search';

const initialState: SearchState = {
  query: '',
  filters: {
    groups: [],
    favorites: false,
  },
  results: [],
  isSearching: false,
};

export const searchContacts = createAsyncThunk(
  'search/searchContacts',
  async (request: SearchContactsRequest, { getState }) => {
    const state = getState() as any;
    const contacts = Object.values(state.contacts.contacts);
    return searchService.searchContacts(contacts, request);
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<SearchFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSearch: (state) => {
      state.query = '';
      state.results = [];
      state.filters = {
        groups: [],
        favorites: false,
      };
    },
    addGroupFilter: (state, action: PayloadAction<string>) => {
      if (!state.filters.groups.includes(action.payload)) {
        state.filters.groups.push(action.payload);
      }
    },
    removeGroupFilter: (state, action: PayloadAction<string>) => {
      state.filters.groups = state.filters.groups.filter(id => id !== action.payload);
    },
    toggleFavoritesFilter: (state) => {
      state.filters.favorites = !state.filters.favorites;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchContacts.pending, (state) => {
        state.isSearching = true;
      })
      .addCase(searchContacts.fulfilled, (state, action) => {
        state.isSearching = false;
        state.results = action.payload.map(contact => contact.id);
      })
      .addCase(searchContacts.rejected, (state) => {
        state.isSearching = false;
        state.results = [];
      });
  },
});

export const {
  setQuery,
  setFilters,
  clearSearch,
  addGroupFilter,
  removeGroupFilter,
  toggleFavoritesFilter,
} = searchSlice.actions;

export default searchSlice.reducer;