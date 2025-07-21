import { describe, it, expect, vi, beforeEach } from 'vitest'
import { contactState, derivedContactState, contactActions } from '../contactStore'
import { Contact, ContactGroup } from '@/types'

// Mock the API module
vi.mock('@/services/api', () => ({
  contactsApi: {
    getContacts: vi.fn(),
    createContact: vi.fn(),
    updateContact: vi.fn(),
    deleteContact: vi.fn(),
  },
  groupsApi: {
    getGroups: vi.fn(),
    createGroup: vi.fn(),
    updateGroup: vi.fn(),
    deleteGroup: vi.fn(),
  }
}))

describe('contactStore (Valtio)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    contactActions.reset()
  })

  const mockContact: Contact = {
    id: '1',
    name: { first: 'John', last: 'Doe' },
    phones: [{ id: '1', number: '+1234567890', type: 'mobile', isPrimary: true }],
    emails: [{ id: '1', address: 'john@example.com', type: 'personal', isPrimary: true }],
    groups: [],
    isFavorite: false,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  }

  const mockFavoriteContact: Contact = {
    ...mockContact,
    id: '2',
    name: { first: 'Jane', last: 'Smith' },
    isFavorite: true
  }

  const mockGroup: ContactGroup = {
    id: 'group1',
    name: 'Friends',
    color: '#blue',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  }

  describe('Initial State', () => {
    it('provides initial empty state', () => {
      expect(contactState.contacts).toEqual({})
      expect(contactState.groups).toEqual({})
      expect(contactState.favorites).toEqual([])
      expect(contactState.loading).toBe(false)
      expect(contactState.error).toBe(null)
    })

    it('provides correct derived state', () => {
      expect(derivedContactState.contactList).toEqual([])
      expect(derivedContactState.groupList).toEqual([])
      expect(derivedContactState.favoriteContacts).toEqual([])
      expect(derivedContactState.contactCount).toBe(0)
    })
  })

  describe('Contact Management', () => {
    it('adds contact to state', () => {
      contactActions.addContact(mockContact)

      expect(contactState.contacts['1']).toEqual(mockContact)
      expect(derivedContactState.contactList).toEqual([mockContact])
      expect(derivedContactState.contactCount).toBe(1)
    })

    it('adds favorite contact and updates favorites list', () => {
      contactActions.addContact(mockFavoriteContact)

      expect(contactState.contacts['2']).toEqual(mockFavoriteContact)
      expect(contactState.favorites).toEqual(['2'])
      expect(derivedContactState.favoriteContacts).toEqual([mockFavoriteContact])
    })

    it('prevents duplicate favorites', () => {
      contactActions.addContact(mockFavoriteContact)
      contactActions.addContact(mockFavoriteContact) // Add again

      expect(contactState.favorites).toEqual(['2'])
      expect(contactState.favorites).toHaveLength(1)
    })

    it('updates existing contact', () => {
      contactActions.addContact(mockContact)
      
      const updates = { name: { first: 'Johnny', last: 'Doe' } }
      contactActions.updateContact('1', updates)

      expect(contactState.contacts['1'].name.first).toBe('Johnny')
    })

    it('updates contact favorite status through update', () => {
      contactActions.addContact(mockContact)
      
      contactActions.updateContact('1', { isFavorite: true })

      expect(contactState.contacts['1'].isFavorite).toBe(true)
      expect(contactState.favorites).toEqual(['1'])
    })

    it('ignores updates to non-existent contacts', () => {
      const originalState = { ...contactState }
      
      contactActions.updateContact('nonexistent', { name: { first: 'Test', last: 'User' } })

      expect(contactState.contacts).toEqual(originalState.contacts)
    })

    it('toggles favorite status', () => {
      contactActions.addContact(mockContact)
      
      // Toggle to favorite
      contactActions.toggleFavorite('1')
      
      expect(contactState.contacts['1'].isFavorite).toBe(true)
      expect(contactState.favorites).toEqual(['1'])
      
      // Toggle back to not favorite
      contactActions.toggleFavorite('1')
      
      expect(contactState.contacts['1'].isFavorite).toBe(false)
      expect(contactState.favorites).toEqual([])
    })

    it('ignores toggle on non-existent contact', () => {
      const originalFavorites = [...contactState.favorites]
      
      contactActions.toggleFavorite('nonexistent')
      
      expect(contactState.favorites).toEqual(originalFavorites)
    })

    it('deletes contact', () => {
      contactActions.addContact(mockContact)
      contactActions.addContact(mockFavoriteContact)
      
      contactActions.deleteContact('2')

      expect(contactState.contacts['2']).toBeUndefined()
      expect(contactState.favorites).toEqual([])
      expect(derivedContactState.contactCount).toBe(1)
    })

    it('sets multiple contacts at once', () => {
      const contacts = [mockContact, mockFavoriteContact]
      contactActions.setContacts(contacts)

      expect(contactState.contacts).toEqual({
        '1': mockContact,
        '2': mockFavoriteContact
      })
      expect(contactState.favorites).toEqual(['2'])
      expect(derivedContactState.contactCount).toBe(2)
    })

    it('clears existing contacts when setting new ones', () => {
      contactActions.addContact(mockContact)
      
      const newContacts = [mockFavoriteContact]
      contactActions.setContacts(newContacts)

      expect(contactState.contacts).toEqual({ '2': mockFavoriteContact })
      expect(contactState.favorites).toEqual(['2'])
    })
  })

  describe('Group Management', () => {
    it('sets groups', () => {
      contactActions.setGroups([mockGroup])

      expect(contactState.groups).toEqual({ 'group1': mockGroup })
      expect(derivedContactState.groupList).toEqual([mockGroup])
    })

    it('adds single group', () => {
      contactActions.addGroup(mockGroup)

      expect(contactState.groups['group1']).toEqual(mockGroup)
    })

    it('updates existing group', () => {
      contactActions.addGroup(mockGroup)
      
      const updates = { name: 'Best Friends' }
      contactActions.updateGroup('group1', updates)

      expect(contactState.groups['group1'].name).toBe('Best Friends')
    })

    it('ignores updates to non-existent groups', () => {
      contactActions.updateGroup('nonexistent', { name: 'Test' })
      
      expect(contactState.groups['nonexistent']).toBeUndefined()
    })

    it('deletes group and removes from contacts', () => {
      const contactWithGroup = { ...mockContact, groups: ['group1'] }
      contactActions.addContact(contactWithGroup)
      contactActions.addGroup(mockGroup)
      
      contactActions.deleteGroup('group1')

      expect(contactState.groups['group1']).toBeUndefined()
      expect(contactState.contacts['1'].groups).toEqual([])
    })
  })

  describe('Loading and Error States', () => {
    it('manages loading state', () => {
      contactActions.setLoading(true)
      expect(contactState.loading).toBe(true)
      
      contactActions.setLoading(false)
      expect(contactState.loading).toBe(false)
    })

    it('manages error state', () => {
      const errorMessage = 'Test error'
      contactActions.setError(errorMessage)
      expect(contactState.error).toBe(errorMessage)
      
      contactActions.setError(null)
      expect(contactState.error).toBe(null)
    })

    it('clears error', () => {
      contactActions.setError('Test error')
      contactActions.clearError()
      expect(contactState.error).toBe(null)
    })
  })

  describe('Utility Methods', () => {
    beforeEach(() => {
      contactActions.setContacts([mockContact, mockFavoriteContact])
    })

    it('gets contact by id', () => {
      const contact = contactActions.getContactById('1')
      expect(contact).toEqual(mockContact)
    })

    it('returns undefined for non-existent contact id', () => {
      const contact = contactActions.getContactById('nonexistent')
      expect(contact).toBeUndefined()
    })

    it('gets contacts by group', () => {
      contactActions.updateContact('1', { groups: ['group1'] })
      
      const groupContacts = contactActions.getContactsByGroup('group1')
      expect(groupContacts).toHaveLength(1)
      expect(groupContacts[0].id).toBe('1')
    })

    it('returns empty array for non-existent group', () => {
      const groupContacts = contactActions.getContactsByGroup('nonexistent')
      expect(groupContacts).toEqual([])
    })
  })

  describe('State Reset', () => {
    it('resets to initial state', () => {
      contactActions.addContact(mockContact)
      contactActions.setLoading(true)
      contactActions.setError('Test error')
      
      contactActions.reset()

      expect(contactState.contacts).toEqual({})
      expect(contactState.groups).toEqual({})
      expect(contactState.favorites).toEqual([])
      expect(contactState.loading).toBe(false)
      expect(contactState.error).toBe(null)
    })
  })

  describe('Derived State Reactivity', () => {
    it('updates contact list when contacts change', () => {
      expect(derivedContactState.contactList).toEqual([])
      
      contactActions.addContact(mockContact)
      expect(derivedContactState.contactList).toEqual([mockContact])
      
      contactActions.addContact(mockFavoriteContact)
      expect(derivedContactState.contactList).toHaveLength(2)
    })

    it('updates favorite contacts when favorites change', () => {
      contactActions.setContacts([mockContact, mockFavoriteContact])
      
      expect(derivedContactState.favoriteContacts).toEqual([mockFavoriteContact])
      
      contactActions.toggleFavorite('1')
      expect(derivedContactState.favoriteContacts).toHaveLength(2)
    })

    it('updates contact count when contacts change', () => {
      expect(derivedContactState.contactCount).toBe(0)
      
      contactActions.addContact(mockContact)
      expect(derivedContactState.contactCount).toBe(1)
      
      contactActions.deleteContact('1')
      expect(derivedContactState.contactCount).toBe(0)
    })
  })

  describe('Edge Cases', () => {
    it('handles empty contact arrays', () => {
      contactActions.setContacts([])
      
      expect(contactState.contacts).toEqual({})
      expect(contactState.favorites).toEqual([])
      expect(derivedContactState.contactCount).toBe(0)
    })

    it('handles multiple group deletions', () => {
      const contact = { ...mockContact, groups: ['group1', 'group2'] }
      contactActions.addContact(contact)
      
      contactActions.deleteGroup('group1')
      expect(contactState.contacts['1'].groups).toEqual(['group2'])
      
      contactActions.deleteGroup('group2')
      expect(contactState.contacts['1'].groups).toEqual([])
    })
  })
})