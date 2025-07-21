import { describe, it, expect, beforeEach } from 'vitest'
import { createStore } from 'jotai'
import { 
  contactsAtom, 
  groupsAtom, 
  favoritesAtom,
  selectedContactAtom,
  isContactFormOpenAtom,
  searchQueryAtom,
  searchFiltersAtom,
  contactListAtom,
  favoriteContactsAtom,
  filteredContactsAtom
} from '../atoms'
import { Contact, ContactGroup } from '@/types'

describe('atoms', () => {
  let store: ReturnType<typeof createStore>

  beforeEach(() => {
    store = createStore()
  })

  const mockContact: Contact = {
    id: '1',
    name: { first: 'John', last: 'Doe' },
    phones: [{ id: '1', number: '+1234567890', type: 'mobile', isPrimary: true }],
    emails: [{ id: '1', address: 'john@example.com', type: 'personal', isPrimary: true }],
    groups: ['group1'],
    isFavorite: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const mockGroup: ContactGroup = {
    id: 'group1',
    name: 'Friends',
    color: '#blue',
    createdAt: new Date(),
    updatedAt: new Date()
  }

  describe('base atoms', () => {
    it('initializes contactsAtom with empty object', () => {
      expect(store.get(contactsAtom)).toEqual({})
    })

    it('updates contactsAtom', () => {
      store.set(contactsAtom, { '1': mockContact })
      expect(store.get(contactsAtom)).toEqual({ '1': mockContact })
    })

    it('initializes groupsAtom with empty object', () => {
      expect(store.get(groupsAtom)).toEqual({})
    })

    it('updates groupsAtom', () => {
      store.set(groupsAtom, { 'group1': mockGroup })
      expect(store.get(groupsAtom)).toEqual({ 'group1': mockGroup })
    })

    it('initializes favoritesAtom with empty array', () => {
      expect(store.get(favoritesAtom)).toEqual([])
    })

    it('updates favoritesAtom', () => {
      store.set(favoritesAtom, ['1', '2'])
      expect(store.get(favoritesAtom)).toEqual(['1', '2'])
    })
  })

  describe('UI atoms', () => {
    it('initializes selectedContactAtom as undefined', () => {
      expect(store.get(selectedContactAtom)).toBeUndefined()
    })

    it('updates selectedContactAtom', () => {
      store.set(selectedContactAtom, '1')
      expect(store.get(selectedContactAtom)).toBe('1')
    })

    it('initializes isContactFormOpenAtom as false', () => {
      expect(store.get(isContactFormOpenAtom)).toBe(false)
    })

    it('toggles isContactFormOpenAtom', () => {
      store.set(isContactFormOpenAtom, true)
      expect(store.get(isContactFormOpenAtom)).toBe(true)
    })
  })

  describe('search atoms', () => {
    it('initializes searchQueryAtom with empty string', () => {
      expect(store.get(searchQueryAtom)).toBe('')
    })

    it('updates searchQueryAtom', () => {
      store.set(searchQueryAtom, 'john')
      expect(store.get(searchQueryAtom)).toBe('john')
    })

    it('initializes searchFiltersAtom with default values', () => {
      expect(store.get(searchFiltersAtom)).toEqual({
        groups: [],
        favorites: false
      })
    })
  })

  describe('derived atoms', () => {
    beforeEach(() => {
      store.set(contactsAtom, { '1': mockContact })
      store.set(groupsAtom, { 'group1': mockGroup })
    })

    it('contactListAtom returns array of contacts', () => {
      const contactList = store.get(contactListAtom)
      expect(contactList).toHaveLength(1)
      expect(contactList[0]).toEqual(mockContact)
    })

    it('favoriteContactsAtom returns favorite contacts', () => {
      store.set(favoritesAtom, ['1'])
      const favorites = store.get(favoriteContactsAtom)
      expect(favorites).toHaveLength(1)
      expect(favorites[0]).toEqual(mockContact)
    })

    it('filteredContactsAtom returns all contacts when no search query', () => {
      const filtered = store.get(filteredContactsAtom)
      expect(filtered).toHaveLength(1)
      expect(filtered[0]).toEqual(mockContact)
    })
  })
})