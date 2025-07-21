import { describe, it, expect } from 'vitest'
import { 
  selectAllContacts, 
  selectContactById, 
  selectFavoriteContacts,
  selectContactsByGroup
} from '../contactSelectors'
import { RootState } from '@/types'
import { Contact } from '@/types'

describe('contactSelectors', () => {
  const mockContact1: Contact = {
    id: '1',
    name: { first: 'John', last: 'Doe' },
    phones: [{ id: '1', number: '+1234567890', type: 'mobile', isPrimary: true }],
    emails: [{ id: '1', address: 'john@example.com', type: 'personal', isPrimary: true }],
    groups: ['friends'],
    isFavorite: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const mockContact2: Contact = {
    id: '2',
    name: { first: 'Jane', last: 'Smith' },
    phones: [{ id: '2', number: '+1987654321', type: 'work', isPrimary: true }],
    emails: [{ id: '2', address: 'jane@company.com', type: 'work', isPrimary: true }],
    groups: ['work'],
    isFavorite: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const mockState: RootState = {
    contacts: {
      contacts: {
        '1': mockContact1,
        '2': mockContact2
      },
      groups: {},
      callHistory: {},
      favorites: ['1'],
      loading: false,
      error: null,
      lastSync: undefined,
      selectedContact: undefined
    },
    search: {
      query: '',
      filters: { groups: [], favorites: false },
      results: [],
      isSearching: false
    },
    ui: {
      view: 'list',
      theme: 'light',
      sidebarOpen: true,
      isContactFormOpen: false,
      isGroupManagerOpen: false,
      isImportExportOpen: false
    }
  }

  describe('selectAllContacts', () => {
    it('returns all contacts as array', () => {
      const contacts = selectAllContacts(mockState)
      expect(contacts).toHaveLength(2)
      expect(contacts).toContain(mockContact1)
      expect(contacts).toContain(mockContact2)
    })

    it('returns empty array when no contacts', () => {
      const emptyState: RootState = {
        ...mockState,
        contacts: { ...mockState.contacts, contacts: {} }
      }
      const contacts = selectAllContacts(emptyState)
      expect(contacts).toEqual([])
    })
  })

  describe('selectContactById', () => {
    it('returns contact by id', () => {
      const selector = selectContactById('1')
      const contact = selector(mockState)
      expect(contact).toEqual(mockContact1)
    })

    it('returns undefined for non-existent id', () => {
      const selector = selectContactById('999')
      const contact = selector(mockState)
      expect(contact).toBeUndefined()
    })
  })

  describe('selectFavoriteContacts', () => {
    it('returns only favorite contacts', () => {
      const favorites = selectFavoriteContacts(mockState)
      expect(favorites).toHaveLength(1)
      expect(favorites[0]).toEqual(mockContact1)
    })

    it('returns empty array when no favorites', () => {
      const stateWithoutFavorites: RootState = {
        ...mockState,
        contacts: { ...mockState.contacts, favorites: [] }
      }
      const favorites = selectFavoriteContacts(stateWithoutFavorites)
      expect(favorites).toEqual([])
    })
  })

  describe('selectContactsByGroup', () => {
    it('returns contacts in specified group', () => {
      const selector = selectContactsByGroup('friends')
      const contacts = selector(mockState)
      expect(contacts).toHaveLength(1)
      expect(contacts[0]).toEqual(mockContact1)
    })

    it('returns empty array for non-existent group', () => {
      const selector = selectContactsByGroup('nonexistent')
      const contacts = selector(mockState)
      expect(contacts).toEqual([])
    })
  })

  describe('selectAllContacts count', () => {
    it('returns correct count of contacts', () => {
      const contacts = selectAllContacts(mockState)
      expect(contacts.length).toBe(2)
    })

    it('returns 0 when no contacts', () => {
      const emptyState: RootState = {
        ...mockState,
        contacts: { ...mockState.contacts, contacts: {} }
      }
      const contacts = selectAllContacts(emptyState)
      expect(contacts.length).toBe(0)
    })
  })
})