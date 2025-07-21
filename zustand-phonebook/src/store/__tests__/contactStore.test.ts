import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useContactStore } from '../contactStore'
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

describe('contactStore (Zustand)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
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

  // Helper to get fresh store state
  const getStoreState = () => {
    const { result } = renderHook(() => useContactStore())
    return result.current
  }

  describe('Initial State', () => {
    it('provides initial empty state', () => {
      const store = getStoreState()
      
      expect(store.contacts).toEqual({})
      expect(store.groups).toEqual({})
      expect(store.favorites).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
    })
  })

  describe('Contact Management', () => {
    it('adds contact to state', () => {
      const { result } = renderHook(() => useContactStore())

      act(() => {
        result.current.addContact(mockContact)
      })

      expect(result.current.contacts['1']).toEqual(mockContact)
    })

    it('adds favorite contact and updates favorites list', () => {
      const { result } = renderHook(() => useContactStore())

      act(() => {
        result.current.addContact(mockFavoriteContact)
      })

      expect(result.current.contacts['2']).toEqual(mockFavoriteContact)
      expect(result.current.favorites).toEqual(['2'])
    })

    it('prevents duplicate favorites', () => {
      const { result } = renderHook(() => useContactStore())

      act(() => {
        result.current.addContact(mockFavoriteContact)
        result.current.addContact(mockFavoriteContact) // Add again
      })

      expect(result.current.favorites).toEqual(['2'])
      expect(result.current.favorites).toHaveLength(1)
    })

    it('updates existing contact', () => {
      const { result } = renderHook(() => useContactStore())

      act(() => {
        result.current.addContact(mockContact)
      })

      const updates = { name: { first: 'Johnny', last: 'Doe' } }
      
      act(() => {
        result.current.updateContact('1', updates)
      })

      expect(result.current.contacts['1'].name.first).toBe('Johnny')
    })

    it('updates contact favorite status through update', () => {
      const { result } = renderHook(() => useContactStore())

      act(() => {
        result.current.addContact(mockContact)
      })
      
      act(() => {
        result.current.updateContact('1', { isFavorite: true })
      })

      expect(result.current.contacts['1'].isFavorite).toBe(true)
      expect(result.current.favorites).toEqual(['1'])
    })

    it('ignores updates to non-existent contacts', () => {
      const { result } = renderHook(() => useContactStore())
      const originalContacts = { ...result.current.contacts }
      
      act(() => {
        result.current.updateContact('nonexistent', { name: { first: 'Test', last: 'User' } })
      })

      expect(result.current.contacts).toEqual(originalContacts)
    })

    it('toggles favorite status', () => {
      const { result } = renderHook(() => useContactStore())

      act(() => {
        result.current.addContact(mockContact)
      })
      
      // Toggle to favorite
      act(() => {
        result.current.toggleFavorite('1')
      })
      
      expect(result.current.contacts['1'].isFavorite).toBe(true)
      expect(result.current.favorites).toEqual(['1'])
      
      // Toggle back to not favorite
      act(() => {
        result.current.toggleFavorite('1')
      })
      
      expect(result.current.contacts['1'].isFavorite).toBe(false)
      expect(result.current.favorites).toEqual([])
    })

    it('ignores toggle on non-existent contact', () => {
      const { result } = renderHook(() => useContactStore())
      const originalFavorites = [...result.current.favorites]
      
      act(() => {
        result.current.toggleFavorite('nonexistent')
      })
      
      expect(result.current.favorites).toEqual(originalFavorites)
    })

    it('deletes contact', () => {
      const { result } = renderHook(() => useContactStore())

      act(() => {
        result.current.addContact(mockContact)
        result.current.addContact(mockFavoriteContact)
      })
      
      act(() => {
        result.current.deleteContact('2')
      })

      expect(result.current.contacts['2']).toBeUndefined()
      expect(result.current.favorites).toEqual([])
    })

    it('sets multiple contacts at once', () => {
      const { result } = renderHook(() => useContactStore())
      const contacts = [mockContact, mockFavoriteContact]
      
      act(() => {
        result.current.setContacts(contacts)
      })

      expect(result.current.contacts).toEqual({
        '1': mockContact,
        '2': mockFavoriteContact
      })
      expect(result.current.favorites).toEqual(['2'])
    })

    it('clears existing contacts when setting new ones', () => {
      const { result } = renderHook(() => useContactStore())

      act(() => {
        result.current.addContact(mockContact)
      })
      
      const newContacts = [mockFavoriteContact]
      
      act(() => {
        result.current.setContacts(newContacts)
      })

      expect(result.current.contacts).toEqual({ '2': mockFavoriteContact })
      expect(result.current.favorites).toEqual(['2'])
    })
  })

  describe('Group Management', () => {
    it('sets groups', () => {
      const { result } = renderHook(() => useContactStore())
      
      act(() => {
        result.current.setGroups([mockGroup])
      })

      expect(result.current.groups).toEqual({ 'group1': mockGroup })
    })

    it('adds single group', () => {
      const { result } = renderHook(() => useContactStore())
      
      act(() => {
        result.current.addGroup(mockGroup)
      })

      expect(result.current.groups['group1']).toEqual(mockGroup)
    })

    it('updates existing group', () => {
      const { result } = renderHook(() => useContactStore())
      
      act(() => {
        result.current.addGroup(mockGroup)
      })
      
      const updates = { name: 'Best Friends' }
      
      act(() => {
        result.current.updateGroup('group1', updates)
      })

      expect(result.current.groups['group1'].name).toBe('Best Friends')
    })

    it('ignores updates to non-existent groups', () => {
      const { result } = renderHook(() => useContactStore())
      
      act(() => {
        result.current.updateGroup('nonexistent', { name: 'Test' })
      })
      
      expect(result.current.groups['nonexistent']).toBeUndefined()
    })

    it('deletes group and removes from contacts', () => {
      const { result } = renderHook(() => useContactStore())
      const contactWithGroup = { ...mockContact, groups: ['group1'] }
      
      act(() => {
        result.current.addContact(contactWithGroup)
        result.current.addGroup(mockGroup)
      })
      
      act(() => {
        result.current.deleteGroup('group1')
      })

      expect(result.current.groups['group1']).toBeUndefined()
      expect(result.current.contacts['1'].groups).toEqual([])
    })
  })

  describe('Loading and Error States', () => {
    it('manages loading and error states', () => {
      const { result } = renderHook(() => useContactStore())
      
      act(() => {
        result.current.loading = true
        result.current.error = 'Test error'
      })
      
      expect(result.current.loading).toBe(true)
      expect(result.current.error).toBe('Test error')
    })

    it('clears error', () => {
      const { result } = renderHook(() => useContactStore())
      
      act(() => {
        result.current.error = 'Test error'
      })
      
      act(() => {
        result.current.clearError()
      })
      
      expect(result.current.error).toBe(null)
    })
  })

  describe('State Reset', () => {
    it('resets to initial state', () => {
      const { result } = renderHook(() => useContactStore())
      
      act(() => {
        result.current.addContact(mockContact)
        result.current.loading = true
        result.current.error = 'Test error'
      })
      
      act(() => {
        result.current.reset()
      })

      expect(result.current.contacts).toEqual({})
      expect(result.current.groups).toEqual({})
      expect(result.current.favorites).toEqual([])
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
    })
  })

  describe('Derived State', () => {
    it('provides correct contact list', () => {
      const { result } = renderHook(() => useContactStore())
      
      act(() => {
        result.current.setContacts([mockContact, mockFavoriteContact])
      })
      
      const contactList = Object.values(result.current.contacts)
      expect(contactList).toHaveLength(2)
      expect(contactList.some(c => c.id === '1')).toBe(true)
      expect(contactList.some(c => c.id === '2')).toBe(true)
    })

    it('provides correct favorite contacts', () => {
      const { result } = renderHook(() => useContactStore())
      
      act(() => {
        result.current.setContacts([mockContact, mockFavoriteContact])
      })
      
      const favoriteContacts = result.current.favorites
        .map(id => result.current.contacts[id])
        .filter(Boolean)
        
      expect(favoriteContacts).toHaveLength(1)
      expect(favoriteContacts[0].id).toBe('2')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty contact arrays', () => {
      const { result } = renderHook(() => useContactStore())
      
      act(() => {
        result.current.setContacts([])
      })
      
      expect(result.current.contacts).toEqual({})
      expect(result.current.favorites).toEqual([])
    })

    it('handles multiple group deletions', () => {
      const { result } = renderHook(() => useContactStore())
      const contact = { ...mockContact, groups: ['group1', 'group2'] }
      
      act(() => {
        result.current.addContact(contact)
      })
      
      act(() => {
        result.current.deleteGroup('group1')
      })
      
      expect(result.current.contacts['1'].groups).toEqual(['group2'])
      
      act(() => {
        result.current.deleteGroup('group2')
      })
      
      expect(result.current.contacts['1'].groups).toEqual([])
    })

    it('handles concurrent state updates', () => {
      const { result } = renderHook(() => useContactStore())
      
      // Simulate concurrent updates
      act(() => {
        result.current.addContact(mockContact)
        result.current.toggleFavorite('1')
        result.current.updateContact('1', { name: { first: 'Johnny', last: 'Doe' } })
      })

      expect(result.current.contacts['1'].isFavorite).toBe(true)
      expect(result.current.contacts['1'].name.first).toBe('Johnny')
      expect(result.current.favorites).toEqual(['1'])
    })
  })

  describe('Persistence', () => {
    it('maintains state structure for persistence', () => {
      const { result } = renderHook(() => useContactStore())
      
      act(() => {
        result.current.setContacts([mockContact, mockFavoriteContact])
        result.current.setGroups([mockGroup])
      })

      // The store should maintain the correct structure for persistence
      const persistableState = {
        contacts: result.current.contacts,
        groups: result.current.groups,
        favorites: result.current.favorites
      }

      expect(persistableState.contacts).toEqual({
        '1': mockContact,
        '2': mockFavoriteContact
      })
      expect(persistableState.groups).toEqual({ 'group1': mockGroup })
      expect(persistableState.favorites).toEqual(['2'])
    })
  })
})