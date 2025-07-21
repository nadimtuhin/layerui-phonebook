import { proxy } from 'valtio';

export interface UIState {
  selectedContact?: string;
  isContactFormOpen: boolean;
  isGroupManagerOpen: boolean;
  isImportExportOpen: boolean;
  view: 'list' | 'grid' | 'card';
  theme: 'light' | 'dark';
}

// UI state
export const uiState = proxy<UIState>({
  selectedContact: undefined,
  isContactFormOpen: false,
  isGroupManagerOpen: false,
  isImportExportOpen: false,
  view: 'list',
  theme: 'light',
});

// UI actions
export const uiActions = {
  selectContact(contactId?: string) {
    uiState.selectedContact = contactId;
  },

  openContactForm() {
    uiState.isContactFormOpen = true;
  },

  closeContactForm() {
    uiState.isContactFormOpen = false;
    uiState.selectedContact = undefined;
  },

  openGroupManager() {
    uiState.isGroupManagerOpen = true;
  },

  closeGroupManager() {
    uiState.isGroupManagerOpen = false;
  },

  openImportExport() {
    uiState.isImportExportOpen = true;
  },

  closeImportExport() {
    uiState.isImportExportOpen = false;
  },

  setView(view: 'list' | 'grid' | 'card') {
    uiState.view = view;
  },

  setTheme(theme: 'light' | 'dark') {
    uiState.theme = theme;
  },

  closeAllModals() {
    uiState.isContactFormOpen = false;
    uiState.isGroupManagerOpen = false;
    uiState.isImportExportOpen = false;
    uiState.selectedContact = undefined;
  },
};