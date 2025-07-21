import { BehaviorSubject, Observable, combineLatest, map, distinctUntilChanged, shareReplay, switchMap, catchError, of, tap } from 'rxjs';
import { Contact, ContactGroup } from '@/types';
import { contactsApi, groupsApi } from '@/services/api';

export interface ContactState {
  contacts: Record<string, Contact>;
  groups: Record<string, ContactGroup>;
  favorites: string[];
  loading: boolean;
  error: string | null;
}

class ContactStore {
  private state$ = new BehaviorSubject<ContactState>({
    contacts: {},
    groups: {},
    favorites: [],
    loading: false,
    error: null,
  });

  // Public observables
  public readonly contacts$ = this.state$.pipe(
    map(state => state.contacts),
    distinctUntilChanged(),
    shareReplay(1)
  );

  public readonly contactList$ = this.contacts$.pipe(
    map(contacts => Object.values(contacts)),
    shareReplay(1)
  );

  public readonly groups$ = this.state$.pipe(
    map(state => state.groups),
    distinctUntilChanged(),
    shareReplay(1)
  );

  public readonly groupList$ = this.groups$.pipe(
    map(groups => Object.values(groups)),
    shareReplay(1)
  );

  public readonly favorites$ = this.state$.pipe(
    map(state => state.favorites),
    distinctUntilChanged(),
    shareReplay(1)
  );

  public readonly favoriteContacts$ = combineLatest([
    this.contacts$,
    this.favorites$
  ]).pipe(
    map(([contacts, favorites]) => 
      favorites.map(id => contacts[id]).filter(Boolean)
    ),
    shareReplay(1)
  );

  public readonly loading$ = this.state$.pipe(
    map(state => state.loading),
    distinctUntilChanged(),
    shareReplay(1)
  );

  public readonly error$ = this.state$.pipe(
    map(state => state.error),
    distinctUntilChanged(),
    shareReplay(1)
  );

  // Actions
  public setLoading(loading: boolean): void {
    this.updateState(state => ({ ...state, loading }));
  }

  public setError(error: string | null): void {
    this.updateState(state => ({ ...state, error }));
  }

  public setContacts(contacts: Contact[]): void {
    const contactsMap = contacts.reduce((acc, contact) => {
      acc[contact.id] = contact;
      return acc;
    }, {} as Record<string, Contact>);

    const favorites = contacts
      .filter(contact => contact.isFavorite)
      .map(contact => contact.id);

    this.updateState(state => ({
      ...state,
      contacts: contactsMap,
      favorites,
    }));
  }

  public addContact(contact: Contact): void {
    this.updateState(state => ({
      ...state,
      contacts: { ...state.contacts, [contact.id]: contact },
      favorites: contact.isFavorite && !state.favorites.includes(contact.id)
        ? [...state.favorites, contact.id]
        : state.favorites,
    }));
  }

  public updateContact(id: string, updates: Partial<Contact>): void {
    this.updateState(state => {
      const contact = state.contacts[id];
      if (!contact) return state;

      const updatedContact = { ...contact, ...updates };
      const favorites = updatedContact.isFavorite
        ? state.favorites.includes(id) 
          ? state.favorites 
          : [...state.favorites, id]
        : state.favorites.filter(fId => fId !== id);

      return {
        ...state,
        contacts: { ...state.contacts, [id]: updatedContact },
        favorites,
      };
    });
  }

  public deleteContact(id: string): void {
    this.updateState(state => {
      const { [id]: deleted, ...contacts } = state.contacts;
      return {
        ...state,
        contacts,
        favorites: state.favorites.filter(fId => fId !== id),
      };
    });
  }

  public toggleFavorite(id: string): void {
    this.updateState(state => {
      const contact = state.contacts[id];
      if (!contact) return state;

      const isFavorite = !contact.isFavorite;
      const updatedContact = { ...contact, isFavorite };
      
      const favorites = isFavorite
        ? state.favorites.includes(id)
          ? state.favorites
          : [...state.favorites, id]
        : state.favorites.filter(fId => fId !== id);

      return {
        ...state,
        contacts: { ...state.contacts, [id]: updatedContact },
        favorites,
      };
    });
  }

  public setGroups(groups: ContactGroup[]): void {
    const groupsMap = groups.reduce((acc, group) => {
      acc[group.id] = group;
      return acc;
    }, {} as Record<string, ContactGroup>);

    this.updateState(state => ({ ...state, groups: groupsMap }));
  }

  // Async operations
  public fetchContacts(): Observable<Contact[]> {
    this.setLoading(true);
    this.setError(null);

    return contactsApi.getContacts().then(response => response.data).catch(error => {
      this.setError(error.message);
      throw error;
    }).finally(() => {
      this.setLoading(false);
    });
  }

  public createContact(contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Observable<Contact> {
    const contact: Contact = {
      ...contactData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return of(contactsApi.createContact({ contact })).pipe(
      switchMap(promise => promise),
      map(response => response.data),
      tap(createdContact => this.addContact(createdContact)),
      catchError(error => {
        this.setError(error.message);
        throw error;
      })
    );
  }

  public saveContact(contact: Contact): Observable<Contact> {
    return of(contactsApi.updateContact({
      id: contact.id,
      contact: { ...contact, updatedAt: new Date() }
    })).pipe(
      switchMap(promise => promise),
      map(response => response.data),
      tap(updatedContact => this.updateContact(contact.id, updatedContact)),
      catchError(error => {
        this.setError(error.message);
        throw error;
      })
    );
  }

  public removeContact(id: string): Observable<void> {
    return of(contactsApi.deleteContact(id)).pipe(
      switchMap(promise => promise),
      tap(() => this.deleteContact(id)),
      catchError(error => {
        this.setError(error.message);
        throw error;
      })
    );
  }

  public fetchGroups(): Observable<ContactGroup[]> {
    return of(groupsApi.getGroups()).pipe(
      switchMap(promise => promise),
      map(response => response.data),
      tap(groups => this.setGroups(groups)),
      catchError(error => {
        this.setError(error.message);
        throw error;
      })
    );
  }

  // Utilities
  public getContactById(id: string): Observable<Contact | undefined> {
    return this.contacts$.pipe(
      map(contacts => contacts[id]),
      distinctUntilChanged()
    );
  }

  public getContactsByGroup(groupId: string): Observable<Contact[]> {
    return this.contactList$.pipe(
      map(contacts => contacts.filter(contact => contact.groups.includes(groupId)))
    );
  }

  private updateState(updater: (state: ContactState) => ContactState): void {
    this.state$.next(updater(this.state$.value));
  }

  public reset(): void {
    this.state$.next({
      contacts: {},
      groups: {},
      favorites: [],
      loading: false,
      error: null,
    });
  }
}

export const contactStore = new ContactStore();