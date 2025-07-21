import { BehaviorSubject, Observable, combineLatest, map, distinctUntilChanged, shareReplay, debounceTime, switchMap, of } from 'rxjs';
import { Contact, SearchFilters } from '@/types';
import { searchService } from '@/services/search';

export interface SearchState {
  query: string;
  filters: SearchFilters;
  results: Contact[];
  isSearching: boolean;
}

class SearchStore {
  private query$ = new BehaviorSubject<string>('');
  private filters$ = new BehaviorSubject<SearchFilters>({
    groups: [],
    favorites: false,
  });
  private results$ = new BehaviorSubject<Contact[]>([]);
  private isSearching$ = new BehaviorSubject<boolean>(false);

  // Public observables
  public readonly query = this.query$.asObservable().pipe(distinctUntilChanged());
  public readonly filters = this.filters$.asObservable().pipe(distinctUntilChanged());
  public readonly results = this.results$.asObservable().pipe(distinctUntilChanged());
  public readonly isSearching = this.isSearching$.asObservable().pipe(distinctUntilChanged());

  public readonly searchParams$ = combineLatest([
    this.query,
    this.filters
  ]).pipe(
    map(([query, filters]) => ({ query, filters })),
    shareReplay(1)
  );

  // Actions
  public setQuery(query: string): void {
    this.query$.next(query);
  }

  public setFilters(filters: Partial<SearchFilters>): void {
    const currentFilters = this.filters$.value;
    this.filters$.next({ ...currentFilters, ...filters });
  }

  public addGroupFilter(groupId: string): void {
    const currentFilters = this.filters$.value;
    if (!currentFilters.groups.includes(groupId)) {
      this.filters$.next({
        ...currentFilters,
        groups: [...currentFilters.groups, groupId]
      });
    }
  }

  public removeGroupFilter(groupId: string): void {
    const currentFilters = this.filters$.value;
    this.filters$.next({
      ...currentFilters,
      groups: currentFilters.groups.filter(id => id !== groupId)
    });
  }

  public toggleFavoritesFilter(): void {
    const currentFilters = this.filters$.value;
    this.filters$.next({
      ...currentFilters,
      favorites: !currentFilters.favorites
    });
  }

  public clearSearch(): void {
    this.query$.next('');
    this.filters$.next({
      groups: [],
      favorites: false,
    });
    this.results$.next([]);
  }

  // Search execution with debouncing
  public createSearchStream(contacts$: Observable<Contact[]>): Observable<Contact[]> {
    return combineLatest([
      this.searchParams$.pipe(debounceTime(300)),
      contacts$
    ]).pipe(
      switchMap(([{ query, filters }, contacts]) => {
        this.isSearching$.next(true);
        
        // Simulate async search
        return of(searchService.searchContacts(contacts, { query, filters })).pipe(
          map(results => {
            this.isSearching$.next(false);
            this.results$.next(results);
            return results;
          })
        );
      }),
      shareReplay(1)
    );
  }

  // Get current values
  public getCurrentQuery(): string {
    return this.query$.value;
  }

  public getCurrentFilters(): SearchFilters {
    return this.filters$.value;
  }

  public getCurrentResults(): Contact[] {
    return this.results$.value;
  }
}

export const searchStore = new SearchStore();