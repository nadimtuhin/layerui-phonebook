import { describe, it, expect, vi, beforeEach } from 'vitest'
import { firstValueFrom, take } from 'rxjs'
import { contactStore } from '../contactStore'
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

describe('contactStore (RxJS)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    contactStore.reset()
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

  describe('Observable State', () => {
    it('provides initial empty state', async () => {
      const contacts = await firstValueFrom(contactStore.contacts$)
      const contactList = await firstValueFrom(contactStore.contactList$)
      const favorites = await firstValueFrom(contactStore.favorites$)
      const loading = await firstValueFrom(contactStore.loading$)
      const error = await firstValueFrom(contactStore.error$)

      expect(contacts).toEqual({})
      expect(contactList).toEqual([])
      expect(favorites).toEqual([])
      expect(loading).toBe(false)
      expect(error).toBe(null)
    })

    it('emits updates when state changes', async () => {
      const contactsPromise = firstValueFrom(contactStore.contacts$.pipe(take(2)))
      
      contactStore.addContact(mockContact)
      
      const contacts = await contactsPromise
      expect(contacts).toEqual({ '1': mockContact })
    })
  })

  describe('Contact Management', () => {
    it('adds contact to state', async () => {
      contactStore.addContact(mockContact)

      const contacts = await firstValueFrom(contactStore.contacts$)
      const contactList = await firstValueFrom(contactStore.contactList$)
      
      expect(contacts).toEqual({ '1': mockContact })
      expect(contactList).toEqual([mockContact])
    })

    it('adds favorite contact and updates favorites list', async () => {
      contactStore.addContact(mockFavoriteContact)

      const contacts = await firstValueFrom(contactStore.contacts$)
      const favorites = await firstValueFrom(contactStore.favorites$)
      const favoriteContacts = await firstValueFrom(contactStore.favoriteContacts$)
      
      expect(contacts).toEqual({ '2': mockFavoriteContact })
      expect(favorites).toEqual(['2'])
      expect(favoriteContacts).toEqual([mockFavoriteContact])
    })

    it('updates existing contact', async () => {
      contactStore.addContact(mockContact)
      
      const updates = { name: { first: 'Johnny', last: 'Doe' } }
      contactStore.updateContact('1', updates)

      const contacts = await firstValueFrom(contactStore.contacts$)
      expect(contacts['1'].name.first).toBe('Johnny')
    })

    it('toggles favorite status', async () => {
      contactStore.addContact(mockContact)
      
      // Toggle to favorite
      contactStore.toggleFavorite('1')
      
      let contacts = await firstValueFrom(contactStore.contacts$)
      let favorites = await firstValueFrom(contactStore.favorites$)
      
      expect(contacts['1'].isFavorite).toBe(true)
      expect(favorites).toEqual(['1'])
      
      // Toggle back to not favorite
      contactStore.toggleFavorite('1')
      
      contacts = await firstValueFrom(contactStore.contacts$)
      favorites = await firstValueFrom(contactStore.favorites$)
      
      expect(contacts['1'].isFavorite).toBe(false)
      expect(favorites).toEqual([])
    })

    it('deletes contact', async () => {
      contactStore.addContact(mockContact)
      contactStore.addContact(mockFavoriteContact)
      
      contactStore.deleteContact('2')

      const contacts = await firstValueFrom(contactStore.contacts$)
      const favorites = await firstValueFrom(contactStore.favorites$)
      
      expect(contacts).toEqual({ '1': mockContact })
      expect(favorites).toEqual([])
    })

    it('sets multiple contacts at once', async () => {
      const contacts = [mockContact, mockFavoriteContact]
      contactStore.setContacts(contacts)

      const storeContacts = await firstValueFrom(contactStore.contacts$)
      const favorites = await firstValueFrom(contactStore.favorites$)
      
      expect(storeContacts).toEqual({
        '1': mockContact,
        '2': mockFavoriteContact
      })
      expect(favorites).toEqual(['2'])
    })
  })

  describe('Group Management', () => {
    it('sets groups', async () => {
      contactStore.setGroups([mockGroup])

      const groups = await firstValueFrom(contactStore.groups$)
      const groupList = await firstValueFrom(contactStore.groupList$)
      
      expect(groups).toEqual({ 'group1': mockGroup })
      expect(groupList).toEqual([mockGroup])
    })
  })

  describe('Loading and Error States', () => {
    it('manages loading state', async () => {
      contactStore.setLoading(true)
      
      let loading = await firstValueFrom(contactStore.loading$)
      expect(loading).toBe(true)
      
      contactStore.setLoading(false)
      
      loading = await firstValueFrom(contactStore.loading$)
      expect(loading).toBe(false)
    })

    it('manages error state', async () => {
      const errorMessage = 'Test error'
      contactStore.setError(errorMessage)
      
      let error = await firstValueFrom(contactStore.error$)
      expect(error).toBe(errorMessage)
      
      contactStore.setError(null)
      
      error = await firstValueFrom(contactStore.error$)
      expect(error).toBe(null)
    })
  })

  describe('Utility Methods', () => {
    beforeEach(() => {
      contactStore.setContacts([mockContact, mockFavoriteContact])
    })

    it('gets contact by id', async () => {
      const contact = await firstValueFrom(contactStore.getContactById('1'))
      expect(contact).toEqual(mockContact)
    })

    it('returns undefined for non-existent contact id', async () => {
      const contact = await firstValueFrom(contactStore.getContactById('nonexistent'))
      expect(contact).toBeUndefined()
    })

    it('gets contacts by group', async () => {
      const contactWithGroup = { ...mockContact, groups: ['group1'] }
      contactStore.updateContact('1', { groups: ['group1'] })
      
      const groupContacts = await firstValueFrom(contactStore.getContactsByGroup('group1'))
      expect(groupContacts).toHaveLength(1)
      expect(groupContacts[0].id).toBe('1')
    })
  })

  describe('State Reset', () => {
    it('resets to initial state', async () => {
      contactStore.addContact(mockContact)
      contactStore.setLoading(true)
      contactStore.setError('Test error')
      
      contactStore.reset()

      const contacts = await firstValueFrom(contactStore.contacts$)
      const loading = await firstValueFrom(contactStore.loading$)
      const error = await firstValueFrom(contactStore.error$)
      const favorites = await firstValueFrom(contactStore.favorites$)
      
      expect(contacts).toEqual({})
      expect(loading).toBe(false)
      expect(error).toBe(null)
      expect(favorites).toEqual([])
    })
  })

  describe('Derived State', () => {
    it('provides contact list observable', async () => {
      contactStore.setContacts([mockContact, mockFavoriteContact])
      
      const contactList = await firstValueFrom(contactStore.contactList$)
      expect(contactList).toHaveLength(2)
      expect(contactList.some(c => c.id === '1')).toBe(true)
      expect(contactList.some(c => c.id === '2')).toBe(true)
    })

    it('provides favorite contacts observable', async () => {
      contactStore.setContacts([mockContact, mockFavoriteContact])
      
      const favoriteContacts = await firstValueFrom(contactStore.favoriteContacts$)
      expect(favoriteContacts).toHaveLength(1)
      expect(favoriteContacts[0].id).toBe('2')
    })
  })
})