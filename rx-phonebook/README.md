# RxJS Phonebook - Reactive Stream-Based State Management

A comprehensive phonebook application built with **RxJS** demonstrating reactive programming patterns, stream-based state management, and declarative data flow in React applications.

## 🌊 Why RxJS?

RxJS provides **powerful reactive programming** capabilities:
- **Declarative data flow** - Compose complex async operations
- **Built-in operators** - debounceTime, combineLatest, switchMap
- **Stream composition** - Combine multiple data sources effortlessly
- **Async handling** - First-class support for complex async scenarios
- **Real-time ready** - Perfect for WebSocket and event-driven apps

## 🏗️ Architecture

### Reactive State Management
```typescript
class ContactStore {
  private state$ = new BehaviorSubject<ContactState>({
    contacts: {},
    loading: false,
    error: null
  });

  // Reactive observables
  public readonly contacts$ = this.state$.pipe(
    map(state => state.contacts),
    distinctUntilChanged(),
    shareReplay(1)
  );

  public readonly contactList$ = this.contacts$.pipe(
    map(contacts => Object.values(contacts)),
    shareReplay(1)
  );

  // Async operations as observables
  public fetchContacts(): Observable<Contact[]> {
    this.setLoading(true);
    return of(contactsApi.getContacts()).pipe(
      switchMap(promise => promise),
      map(response => response.data),
      tap(contacts => this.setContacts(contacts)),
      catchError(error => {
        this.setError(error.message);
        return throwError(error);
      }),
      finalize(() => this.setLoading(false))
    );
  }
}
```

### Reactive Search with Debouncing
```typescript
class SearchStore {
  private query$ = new BehaviorSubject<string>('');
  private filters$ = new BehaviorSubject<SearchFilters>({ groups: [], favorites: false });

  // Debounced search stream
  public createSearchStream(contacts$: Observable<Contact[]>): Observable<Contact[]> {
    return combineLatest([
      this.query$.pipe(debounceTime(300)),
      this.filters$,
      contacts$
    ]).pipe(
      switchMap(([query, filters, contacts]) => {
        return of(searchService.searchContacts(contacts, { query, filters }));
      }),
      shareReplay(1)
    );
  }
}
```

### React Integration
```typescript
// Custom hook for reactive state
const useObservable = <T>(observable$: Observable<T>, initial: T): T => {
  const [value, setValue] = useState<T>(initial);
  
  useEffect(() => {
    const subscription = observable$.subscribe(setValue);
    return () => subscription.unsubscribe();
  }, [observable$]);
  
  return value;
};

// Component usage
const ContactList: React.FC = () => {
  const contacts = useObservable(contactStore.contactList$, []);
  const searchResults = useObservable(searchStore.results, []);
  const loading = useObservable(contactStore.loading$, false);

  useEffect(() => {
    // Set up reactive search pipeline
    const subscription = searchStore
      .createSearchStream(contactStore.contactList$)
      .subscribe();
    
    return () => subscription.unsubscribe();
  }, []);

  return <div>{/* Render contacts */}</div>;
};
```

## 🚀 Key Features

### Reactive Patterns
- ✅ **Stream Composition** - combineLatest, merge, switchMap
- ✅ **Debounced Operations** - Search with debounceTime
- ✅ **Error Handling** - catchError and retry strategies
- ✅ **Memory Management** - Automatic subscription cleanup
- ✅ **Real-time Updates** - BehaviorSubject for state

### Advanced Operators
- ✅ **Data Transformation** - map, filter, scan
- ✅ **Async Control** - switchMap, mergeMap, concatMap
- ✅ **Timing Control** - debounceTime, throttleTime, delay
- ✅ **Combination** - combineLatest, withLatestFrom, zip
- ✅ **Error Recovery** - retry, retryWhen, catchError

### Performance Optimizations
- ✅ **shareReplay** - Multicast observables
- ✅ **distinctUntilChanged** - Prevent duplicate emissions
- ✅ **Subscription Management** - Automatic cleanup
- ✅ **Cold vs Hot** - Proper observable temperature

## 📁 Project Structure

```
src/
├── store/
│   ├── contactStore.ts      # Reactive contact state
│   ├── searchStore.ts       # Search streams
│   └── uiStore.ts          # UI state observables
├── hooks/
│   ├── useObservable.ts     # React-RxJS integration
│   └── useDebounce.ts       # Debouncing utilities
├── components/
│   ├── contact/            # Contact components
│   ├── search/             # Search components
│   └── common/             # Shared components
├── services/
│   ├── api.ts              # API observables
│   ├── search.ts           # Search algorithms
│   └── storage.ts          # Storage streams
└── types/
    └── index.ts            # TypeScript definitions
```

## 🎯 RxJS Patterns Demonstrated

### 1. **State Management with BehaviorSubject**
```typescript
class Store {
  private state$ = new BehaviorSubject<State>(initialState);
  
  // Selectors as observables
  public readonly data$ = this.state$.pipe(
    map(state => state.data),
    distinctUntilChanged()
  );
  
  // Actions update state
  public updateData(data: any): void {
    const currentState = this.state$.value;
    this.state$.next({ ...currentState, data });
  }
}
```

### 2. **Async Operations as Streams**
```typescript
public fetchData(): Observable<Data> {
  return this.http.get<Data>('/api/data').pipe(
    tap(data => this.updateState({ data })),
    catchError(error => {
      this.updateState({ error: error.message });
      return throwError(error);
    }),
    retry(3),
    shareReplay(1)
  );
}
```

### 3. **Complex Stream Composition**
```typescript
const searchResults$ = combineLatest([
  this.query$.pipe(debounceTime(300)),
  this.filters$,
  this.data$
]).pipe(
  switchMap(([query, filters, data]) => 
    this.performSearch(query, filters, data)
  ),
  startWith([]),
  shareReplay(1)
);
```

### 4. **Error Handling Strategies**
```typescript
const dataStream$ = this.fetchData().pipe(
  retryWhen(errors => 
    errors.pipe(
      scan((count, error) => {
        if (count >= 3) throw error;
        return count + 1;
      }, 0),
      delay(1000)
    )
  ),
  catchError(error => {
    this.showError(error.message);
    return of([]); // Fallback value
  })
);
```

### 5. **Real-time Data Flows**
```typescript
// WebSocket integration
const messages$ = new WebSocketSubject('ws://localhost:8080');

const notifications$ = messages$.pipe(
  filter(msg => msg.type === 'notification'),
  map(msg => msg.payload),
  scan((acc, notification) => [notification, ...acc], []),
  shareReplay(1)
);
```

## 🛠️ Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run test         # Run tests
npm run lint         # Lint code
npm run typecheck    # TypeScript checking
```

### Key Dependencies
- **rxjs** - Reactive programming library
- **react** - UI framework
- **fuse.js** - Fuzzy search
- **dexie** - IndexedDB wrapper

## 🧪 Testing Strategy

### Observable Testing
```typescript
import { TestScheduler } from 'rxjs/testing';

describe('ContactStore', () => {
  let testScheduler: TestScheduler;
  
  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });
  
  it('should emit contacts after fetch', () => {
    testScheduler.run(({ cold, hot, expectObservable }) => {
      const store = new ContactStore();
      const contacts$ = store.contacts$;
      
      expectObservable(contacts$).toBe('a', {
        a: mockContacts
      });
    });
  });
});
```

### Component Testing with Observables
```typescript
import { render } from '@testing-library/react';
import { BehaviorSubject } from 'rxjs';

const mockStore = {
  contacts$: new BehaviorSubject([mockContact]),
  loading$: new BehaviorSubject(false)
};

test('renders contact list', () => {
  render(<ContactList store={mockStore} />);
  // Test component behavior
});
```

## 📊 Performance Characteristics

### Bundle Size
- **RxJS Core**: ~45KB gzipped
- **Operators**: Tree-shakable (~5-15KB additional)
- **Total overhead**: ~50-60KB

### Runtime Performance
- **Stream processing**: Highly optimized
- **Memory usage**: Efficient with proper cleanup
- **Async operations**: Non-blocking and composable

### Observable Temperature
- **Cold observables**: Lazy evaluation, new execution per subscriber
- **Hot observables**: Shared execution, multicast with shareReplay
- **Subjects**: Bridge between cold and hot

## 🔍 When to Use RxJS

### Perfect For:
✅ **Real-time applications** (chat, live data, notifications)  
✅ **Complex async flows** (multiple API calls, data transformation)  
✅ **Event-driven architecture** (user interactions, WebSockets)  
✅ **Data streaming** (infinite scroll, real-time updates)  
✅ **Advanced async patterns** (retry logic, cancellation)  

### Consider Alternatives For:
❌ **Simple CRUD apps** (may be overkill)  
❌ **Teams new to reactive programming** (learning curve)  
❌ **Bundle size constraints** (RxJS is relatively large)  
❌ **Static applications** (limited async requirements)  

## 🎓 Learning Resources

### Official Documentation
- [RxJS Documentation](https://rxjs.dev/)
- [Observable Pattern](https://rxjs.dev/guide/observable)
- [Operators Guide](https://rxjs.dev/guide/operators)

### Key Concepts
- **Observables** - Lazy push collections
- **Operators** - Pure functions for stream transformation
- **Subjects** - Multicasting observables
- **Subscription** - Execution management
- **Schedulers** - Timing control

### Common Patterns
- **Stream composition** with operators
- **Error handling** strategies
- **Memory management** and cleanup
- **Testing** with marble diagrams
- **Performance** optimization techniques

## 🚀 Production Considerations

### Memory Management
```typescript
class Component extends React.Component {
  private subscription = new Subscription();
  
  componentDidMount() {
    this.subscription.add(
      dataStream$.subscribe(data => this.setState({ data }))
    );
  }
  
  componentWillUnmount() {
    this.subscription.unsubscribe(); // Prevent memory leaks
  }
}
```

### Error Boundaries
```typescript
const errorHandler = (error: Error) => {
  console.error('Stream error:', error);
  // Send to error reporting service
};

const stream$ = dataStream$.pipe(
  catchError(error => {
    errorHandler(error);
    return of(fallbackData);
  })
);
```

### Performance Monitoring
```typescript
const timedStream$ = dataStream$.pipe(
  tap(() => console.time('stream-processing')),
  /* operators */,
  tap(() => console.timeEnd('stream-processing'))
);
```

---

This RxJS implementation demonstrates how to build reactive applications with powerful stream composition, advanced async patterns, and declarative data flow management.