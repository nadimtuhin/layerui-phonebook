import { describe, it, expect, beforeEach } from 'vitest'
import { createStore } from 'jotai'
import { 
  contactsAtom, 
  searchQueryAtom, 
  searchFiltersAtom 
} from '../atoms'
import { Contact } from '@/types'

describe('store actions (basic)', () => {
  let store: ReturnType<typeof createStore>

  beforeEach(() => {
    store = createStore()
  })

  const mockContact: Contact = {
    id: '1',
    name: { first: 'John', last: 'Doe' },
    phones: [{ id: '1', number: '+1234567890', type: 'mobile', isPrimary: true }],
    emails: [{ id: '1', address: 'john@example.com', type: 'personal', isPrimary: true }],
    groups: [],
    isFavorite: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  it('can set contacts directly', () => {
    store.set(contactsAtom, { '1': mockContact })
    expect(store.get(contactsAtom)).toEqual({ '1': mockContact })
  })

  it('can update search query', () => {
    store.set(searchQueryAtom, 'john')
    expect(store.get(searchQueryAtom)).toBe('john')
  })

  it('can update search filters', () => {
    const filters = { groups: ['friends'], favorites: true }
    store.set(searchFiltersAtom, filters)
    expect(store.get(searchFiltersAtom)).toEqual(filters)
  })

  it('can clear search query using reset', () => {
    store.set(searchQueryAtom, 'john')
    expect(store.get(searchQueryAtom)).toBe('john')
    
    // Reset atom
    store.set(searchQueryAtom, '')
    expect(store.get(searchQueryAtom)).toBe('')
  })
})