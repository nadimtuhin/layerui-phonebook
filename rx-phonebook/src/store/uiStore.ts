import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';

export interface UIState {
  selectedContact?: string;
  isContactFormOpen: boolean;
  isGroupManagerOpen: boolean;
  isImportExportOpen: boolean;
  view: 'list' | 'grid' | 'card';
  theme: 'light' | 'dark';
}

class UIStore {
  private state$ = new BehaviorSubject<UIState>({
    selectedContact: undefined,
    isContactFormOpen: false,
    isGroupManagerOpen: false,
    isImportExportOpen: false,
    view: 'list',
    theme: 'light',
  });

  // Public observables
  public readonly selectedContact$ = this.state$.pipe(
    map(state => state.selectedContact),
    distinctUntilChanged()
  );

  public readonly isContactFormOpen$ = this.state$.pipe(
    map(state => state.isContactFormOpen),
    distinctUntilChanged()
  );

  public readonly isGroupManagerOpen$ = this.state$.pipe(
    map(state => state.isGroupManagerOpen),
    distinctUntilChanged()
  );

  public readonly isImportExportOpen$ = this.state$.pipe(
    map(state => state.isImportExportOpen),
    distinctUntilChanged()
  );

  public readonly view$ = this.state$.pipe(
    map(state => state.view),
    distinctUntilChanged()
  );

  public readonly theme$ = this.state$.pipe(
    map(state => state.theme),
    distinctUntilChanged()
  );

  // Actions
  public selectContact(contactId?: string): void {
    this.updateState(state => ({ ...state, selectedContact: contactId }));
  }

  public openContactForm(): void {
    this.updateState(state => ({ ...state, isContactFormOpen: true }));
  }

  public closeContactForm(): void {
    this.updateState(state => ({ 
      ...state, 
      isContactFormOpen: false,
      selectedContact: undefined 
    }));
  }

  public openGroupManager(): void {
    this.updateState(state => ({ ...state, isGroupManagerOpen: true }));
  }

  public closeGroupManager(): void {
    this.updateState(state => ({ ...state, isGroupManagerOpen: false }));
  }

  public openImportExport(): void {
    this.updateState(state => ({ ...state, isImportExportOpen: true }));
  }

  public closeImportExport(): void {
    this.updateState(state => ({ ...state, isImportExportOpen: false }));
  }

  public setView(view: 'list' | 'grid' | 'card'): void {
    this.updateState(state => ({ ...state, view }));
  }

  public setTheme(theme: 'light' | 'dark'): void {
    this.updateState(state => ({ ...state, theme }));
  }

  public closeAllModals(): void {
    this.updateState(state => ({
      ...state,
      isContactFormOpen: false,
      isGroupManagerOpen: false,
      isImportExportOpen: false,
      selectedContact: undefined,
    }));
  }

  // Get current values
  public getCurrentState(): UIState {
    return this.state$.value;
  }

  private updateState(updater: (state: UIState) => UIState): void {
    this.state$.next(updater(this.state$.value));
  }
}

export const uiStore = new UIStore();