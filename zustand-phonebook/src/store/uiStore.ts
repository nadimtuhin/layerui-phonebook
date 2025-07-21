import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface UIState {
  // State
  selectedContact?: string;
  isContactFormOpen: boolean;
  isGroupManagerOpen: boolean;
  isImportExportOpen: boolean;
  view: 'list' | 'grid' | 'card';
  theme: 'light' | 'dark';
  
  // Actions
  selectContact: (contactId?: string) => void;
  openContactForm: () => void;
  closeContactForm: () => void;
  openGroupManager: () => void;
  closeGroupManager: () => void;
  openImportExport: () => void;
  closeImportExport: () => void;
  setView: (view: 'list' | 'grid' | 'card') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  closeAllModals: () => void;
}

export const useUIStore = create<UIState>()(
  immer((set) => ({
    // Initial state
    selectedContact: undefined,
    isContactFormOpen: false,
    isGroupManagerOpen: false,
    isImportExportOpen: false,
    view: 'list',
    theme: 'light',

    // Actions
    selectContact: (contactId) => {
      set((state) => {
        state.selectedContact = contactId;
      });
    },

    openContactForm: () => {
      set((state) => {
        state.isContactFormOpen = true;
      });
    },

    closeContactForm: () => {
      set((state) => {
        state.isContactFormOpen = false;
        state.selectedContact = undefined;
      });
    },

    openGroupManager: () => {
      set((state) => {
        state.isGroupManagerOpen = true;
      });
    },

    closeGroupManager: () => {
      set((state) => {
        state.isGroupManagerOpen = false;
      });
    },

    openImportExport: () => {
      set((state) => {
        state.isImportExportOpen = true;
      });
    },

    closeImportExport: () => {
      set((state) => {
        state.isImportExportOpen = false;
      });
    },

    setView: (view) => {
      set((state) => {
        state.view = view;
      });
    },

    setTheme: (theme) => {
      set((state) => {
        state.theme = theme;
      });
    },

    closeAllModals: () => {
      set((state) => {
        state.isContactFormOpen = false;
        state.isGroupManagerOpen = false;
        state.isImportExportOpen = false;
        state.selectedContact = undefined;
      });
    },
  }))
);