import { Contact, ContactGroup, CallHistoryEntry } from './contact';

export interface ContactsState {
  contacts: Record<string, Contact>;
  groups: Record<string, ContactGroup>;
  callHistory: Record<string, CallHistoryEntry>;
  favorites: string[];
  loading: boolean;
  error: string | null;
  lastSync?: Date;
}

export interface SearchState {
  query: string;
  filters: SearchFilters;
  results: string[];
  isSearching: boolean;
}

export interface SearchFilters {
  groups: string[];
  favorites: boolean;
  phoneType?: string;
  emailType?: string;
}

export interface UIState {
  selectedContact?: string;
  isContactFormOpen: boolean;
  isGroupManagerOpen: boolean;
  isImportExportOpen: boolean;
  view: 'list' | 'grid' | 'card';
  theme: 'light' | 'dark';
}

export interface SyncState {
  isOnline: boolean;
  lastSyncAttempt?: Date;
  pendingChanges: string[];
  syncStatus: 'idle' | 'syncing' | 'error';
}

export interface RootState {
  contacts: ContactsState;
  search: SearchState;
  ui: UIState;
  sync: SyncState;
}