import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState } from '@/types';

const initialState: UIState = {
  selectedContact: undefined,
  isContactFormOpen: false,
  isGroupManagerOpen: false,
  isImportExportOpen: false,
  view: 'list',
  theme: 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    selectContact: (state, action: PayloadAction<string | undefined>) => {
      state.selectedContact = action.payload;
    },
    openContactForm: (state) => {
      state.isContactFormOpen = true;
    },
    closeContactForm: (state) => {
      state.isContactFormOpen = false;
    },
    openGroupManager: (state) => {
      state.isGroupManagerOpen = true;
    },
    closeGroupManager: (state) => {
      state.isGroupManagerOpen = false;
    },
    openImportExport: (state) => {
      state.isImportExportOpen = true;
    },
    closeImportExport: (state) => {
      state.isImportExportOpen = false;
    },
    setView: (state, action: PayloadAction<'list' | 'grid' | 'card'>) => {
      state.view = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    closeAllModals: (state) => {
      state.isContactFormOpen = false;
      state.isGroupManagerOpen = false;
      state.isImportExportOpen = false;
    },
  },
});

export const {
  selectContact,
  openContactForm,
  closeContactForm,
  openGroupManager,
  closeGroupManager,
  openImportExport,
  closeImportExport,
  setView,
  setTheme,
  closeAllModals,
} = uiSlice.actions;

export default uiSlice.reducer;