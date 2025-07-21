# Jotai Phonebook - Bottom-Up Atomic State Management

A comprehensive phonebook application built with **Jotai** demonstrating atomic state management, bottom-up composition, and fine-grained reactivity patterns.

## ⚛️ Why Jotai?

Jotai provides **atomic state management** with:
- **Bottom-up composition** - Build complex state from simple atoms
- **Fine-grained reactivity** - Only affected components re-render
- **Derived state** - Automatic dependency tracking
- **Async atoms** - First-class async support
- **No providers needed** - Global state without context hell

## 🏗️ Architecture

### Atomic State Design
```typescript
// Base atoms - primitive state pieces
export const contactsAtom = atom<Record<string, Contact>>({});
export const favoritesAtom = atom<string[]>([]);
export const selectedContactAtom = atom<string | undefined>(undefined);

// Derived atoms - computed from base atoms
export const contactListAtom = atom<Contact[]>((get) => {
  const contacts = get(contactsAtom);
  return Object.values(contacts);
});

export const favoriteContactsAtom = atom<Contact[]>((get) => {
  const contacts = get(contactsAtom);
  const favorites = get(favoritesAtom);
  return favorites.map(id => contacts[id]).filter(Boolean);
});

// Read-write atoms - actions that modify state
export const addContactAction = atom(
  null,
  (get, set, contact: Contact) => {
    const contacts = get(contactsAtom);
    set(contactsAtom, { ...contacts, [contact.id]: contact });
    
    if (contact.isFavorite) {
      const favorites = get(favoritesAtom);
      set(favoritesAtom, [...favorites, contact.id]);
    }
  }
);
```

### Async Atoms
```typescript
// Async atom for data fetching
export const contactsQueryAtom = atom(async (get) => {
  const response = await contactsApi.getContacts();
  return response.data;
});

// Async write atom for mutations
export const createContactAction = atom(
  null,
  async (get, set, contactData: CreateContactRequest) => {
    set(loadingAtom, true);
    try {
      const response = await contactsApi.createContact(contactData);
      set(addContactAction, response.data);
    } catch (error) {
      set(errorAtom, error.message);
    } finally {
      set(loadingAtom, false);
    }
  }
);
```

### Component Integration
```typescript
const ContactList: React.FC = () => {
  // Subscribe to specific atoms - fine-grained reactivity
  const contacts = useAtomValue(filteredContactsAtom);
  const view = useAtomValue(viewAtom);
  
  // Actions for state updates
  const selectContact = useSetAtom(selectContactAction);
  const toggleFavorite = useSetAtom(toggleFavoriteAction);

  return (
    <div>
      {contacts.map(contact => (
        <ContactCard
          key={contact.id}
          contact={contact}
          onClick={() => selectContact(contact.id)}
          onToggleFavorite={() => toggleFavorite(contact.id)}
        />
      ))}
    </div>
  );
};
```

## 🚀 Key Features

### Atomic Patterns
- ✅ **Primitive Atoms** - Simple state pieces
- ✅ **Derived Atoms** - Computed values with dependencies
- ✅ **Async Atoms** - Data fetching and mutations
- ✅ **Write-only Atoms** - Actions and side effects
- ✅ **Family Atoms** - Dynamic atom creation

### Performance Optimizations
- ✅ **Fine-grained Updates** - Only affected components re-render
- ✅ **Automatic Memoization** - Built-in dependency tracking
- ✅ **Lazy Evaluation** - Atoms computed only when needed
- ✅ **Structural Sharing** - Efficient state updates
- ✅ **Bundle Splitting** - Tree-shakable atoms

### Developer Experience
- ✅ **No Providers** - Global state without context
- ✅ **TypeScript Support** - Full type inference
- ✅ **DevTools Integration** - Excellent debugging experience
- ✅ **Hot Reloading** - Preserves state during development
- ✅ **Testing Support** - Easy to mock and test atoms

## 📁 Project Structure

```
src/
├── store/
│   ├── atoms.ts            # Base and derived atoms
│   ├── actions.ts          # Action atoms for mutations
│   └── index.ts            # Re-exports
├── components/
│   ├── contact/            # Contact components
│   ├── search/             # Search components
│   └── common/             # Shared components
├── hooks/
│   └── useDebounce.ts      # Custom hooks
├── services/
│   ├── api.ts              # API integration
│   ├── search.ts           # Search logic
│   └── storage.ts          # Storage utilities
└── types/
    └── index.ts            # TypeScript types
```

## 🎯 Jotai Patterns Demonstrated

### 1. **Atomic Composition**
```typescript
// Base atoms
const firstNameAtom = atom('');
const lastNameAtom = atom('');

// Derived atom
const fullNameAtom = atom((get) => {
  const first = get(firstNameAtom);
  const last = get(lastNameAtom);
  return `${first} ${last}`.trim();
});

// Read-write derived atom
const upperCaseNameAtom = atom(
  (get) => get(fullNameAtom).toUpperCase(),
  (get, set, newValue: string) => {
    const [first, last] = newValue.toLowerCase().split(' ');
    set(firstNameAtom, first || '');
    set(lastNameAtom, last || '');
  }
);
```

### 2. **Async Data Fetching**
```typescript
// Async read atom
const userAtom = atom(async (get) => {
  const userId = get(userIdAtom);
  if (!userId) return null;
  
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
});

// Loading state derived from async atom
const userLoadingAtom = atom((get) => {
  try {
    get(userAtom);
    return false;
  } catch (promise) {
    if (promise instanceof Promise) {
      return true; // Still loading
    }
    throw promise; // Actual error
  }
});
```

### 3. **Atom Families**
```typescript
// Dynamic atoms for contact by ID
export const contactByIdAtom = (id: string) => atom((get) => {
  const contacts = get(contactsAtom);
  return contacts[id];
});

// Usage in components
const ContactDetail: React.FC<{ contactId: string }> = ({ contactId }) => {
  const contact = useAtomValue(contactByIdAtom(contactId));
  return <div>{contact?.name.first}</div>;
};
```

### 4. **Search with Debouncing**
```typescript
const searchQueryAtom = atom('');
const debouncedQueryAtom = atom((get) => get(searchQueryAtom));

// Debounced search results
const searchResultsAtom = atom(async (get) => {
  const query = get(debouncedQueryAtom);
  if (!query) return [];
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100));
  const contacts = get(contactListAtom);
  return searchService.search(contacts, query);
});
```

### 5. **Complex State Updates**
```typescript
const deleteContactAction = atom(
  null,
  (get, set, contactId: string) => {
    // Update multiple atoms atomically
    const contacts = get(contactsAtom);
    const { [contactId]: deleted, ...remaining } = contacts;
    set(contactsAtom, remaining);
    
    // Remove from favorites
    const favorites = get(favoritesAtom);
    set(favoritesAtom, favorites.filter(id => id !== contactId));
    
    // Clear selection if this contact was selected
    const selected = get(selectedContactAtom);
    if (selected === contactId) {
      set(selectedContactAtom, undefined);
    }
  }
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
- **jotai** - Atomic state management
- **jotai-tanstack-query** - React Query integration
- **react** - UI framework
- **@tanstack/react-query** - Data fetching

## 🧪 Testing Strategy

### Atom Testing
```typescript
import { atom } from 'jotai';
import { renderHook } from '@testing-library/react';
import { useAtomValue, useSetAtom } from 'jotai';

test('should update contact', () => {
  const { result } = renderHook(() => ({
    contacts: useAtomValue(contactsAtom),
    addContact: useSetAtom(addContactAction)
  }));
  
  act(() => {
    result.current.addContact(mockContact);
  });
  
  expect(Object.keys(result.current.contacts)).toHaveLength(1);
});
```

### Component Testing with Provider
```typescript
import { Provider } from 'jotai';
import { render } from '@testing-library/react';

test('renders with atoms', () => {
  render(
    <Provider>
      <ContactList />
    </Provider>
  );
});
```

### Mock Atoms for Testing
```typescript
const mockContactsAtom = atom<Record<string, Contact>>({
  '1': mockContact
});

// Use in tests
const TestComponent = () => {
  const contacts = useAtomValue(mockContactsAtom);
  return <div>{Object.keys(contacts).length}</div>;
};
```

## 📊 Performance Characteristics

### Bundle Size
- **Jotai Core**: ~3KB gzipped
- **React integration**: ~1KB additional
- **Total overhead**: ~4KB (very lightweight)

### Runtime Performance
- **Re-renders**: Only components using changed atoms
- **Memory usage**: Minimal overhead per atom
- **Computation**: Lazy evaluation and memoization

### Scalability
- **Atoms**: Can scale to thousands without performance issues
- **Dependencies**: Automatic tracking with no manual optimization
- **Code splitting**: Atoms can be loaded on-demand

## 🔍 When to Use Jotai

### Perfect For:
✅ **Performance-critical apps** requiring minimal re-renders  
✅ **Component-focused architecture** with local state  
✅ **Gradual adoption** in existing codebases  
✅ **Type-safe applications** with complex state relationships  
✅ **Avoiding prop drilling** without context complexity  

### Consider Alternatives For:
❌ **Simple apps** where useState suffices  
❌ **Teams preferring centralized state** (Redux-style)  
❌ **Heavy async flows** (RxJS might be better)  
❌ **Time-travel debugging** requirements  

## 🎓 Learning Resources

### Official Documentation
- [Jotai Documentation](https://jotai.org/)
- [Core Concepts](https://jotai.org/docs/core/atom)
- [Utils Documentation](https://jotai.org/docs/utilities/storage)

### Key Concepts
- **Atoms** - Units of state
- **Derived Atoms** - Computed values
- **Async Atoms** - Asynchronous state
- **Atom Families** - Dynamic atom creation
- **Providers** - State isolation

### Best Practices
- Keep atoms small and focused
- Use derived atoms for computed values
- Leverage async atoms for data fetching
- Test atoms independently
- Use TypeScript for better DX

## 🚀 Production Considerations

### Code Splitting
```typescript
// Lazy load atom definitions
const ContactAtoms = lazy(() => import('./atoms/contactAtoms'));
```

### Error Boundaries
```typescript
const ErrorBoundary: React.FC = ({ children }) => {
  return (
    <Provider>
      <Suspense fallback={<Loading />}>
        <ErrorFallback>
          {children}
        </ErrorFallback>
      </Suspense>
    </Provider>
  );
};
```

### DevTools Integration
```typescript
import { DevTools } from 'jotai-devtools';

const App = () => (
  <Provider>
    <DevTools />
    <MainApp />
  </Provider>
);
```

### Memory Management
```typescript
// Atoms are garbage collected when no longer referenced
// No manual cleanup needed in most cases
const temporaryAtom = atom(someValue);
// When component unmounts, atom is automatically cleaned up
```

---

This Jotai implementation demonstrates how to build scalable React applications with atomic state management, fine-grained reactivity, and excellent TypeScript support while maintaining minimal bundle size and optimal performance.