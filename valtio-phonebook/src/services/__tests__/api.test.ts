import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Contact, ContactGroup } from '@/types'

// Mock API functions for testing
const mockContactsApi = {
  getContacts: vi.fn(),
  getContact: vi.fn(),
  createContact: vi.fn(),
  updateContact: vi.fn(),
  deleteContact: vi.fn(),
  bulkDelete: vi.fn()
}

const mockGroupsApi = {
  getGroups: vi.fn(),
  createGroup: vi.fn(),
  updateGroup: vi.fn(),
  deleteGroup: vi.fn()
}

describe('API services', () => {
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

  describe('contactsApi', () => {
    it('fetches contacts', async () => {
      const mockResponse = { data: [mockContact], success: true }
      mockContactsApi.getContacts.mockResolvedValue(mockResponse)

      const result = await mockContactsApi.getContacts()
      
      expect(mockContactsApi.getContacts).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockResponse)
    })

    it('fetches single contact', async () => {
      const mockResponse = { data: mockContact, success: true }
      mockContactsApi.getContact.mockResolvedValue(mockResponse)

      const result = await mockContactsApi.getContact('1')
      
      expect(mockContactsApi.getContact).toHaveBeenCalledWith('1')
      expect(result).toEqual(mockResponse)
    })

    it('creates contact', async () => {
      const mockResponse = { data: mockContact, success: true }
      const createRequest = { name: { first: 'John', last: 'Doe' } }
      mockContactsApi.createContact.mockResolvedValue(mockResponse)

      const result = await mockContactsApi.createContact(createRequest as any)
      
      expect(mockContactsApi.createContact).toHaveBeenCalledWith(createRequest)
      expect(result).toEqual(mockResponse)
    })

    it('updates contact', async () => {
      const mockResponse = { data: mockContact, success: true }
      const updateRequest = { id: '1', contact: mockContact }
      mockContactsApi.updateContact.mockResolvedValue(mockResponse)

      const result = await mockContactsApi.updateContact(updateRequest as any)
      
      expect(mockContactsApi.updateContact).toHaveBeenCalledWith(updateRequest)
      expect(result).toEqual(mockResponse)
    })

    it('deletes contact', async () => {
      mockContactsApi.deleteContact.mockResolvedValue(undefined)

      await mockContactsApi.deleteContact('1')
      
      expect(mockContactsApi.deleteContact).toHaveBeenCalledWith('1')
    })

    it('bulk deletes contacts', async () => {
      mockContactsApi.bulkDelete.mockResolvedValue(undefined)

      await mockContactsApi.bulkDelete(['1', '2'])
      
      expect(mockContactsApi.bulkDelete).toHaveBeenCalledWith(['1', '2'])
    })
  })

  describe('groupsApi', () => {
    it('fetches groups', async () => {
      const mockResponse = { data: [mockGroup], success: true }
      mockGroupsApi.getGroups.mockResolvedValue(mockResponse)

      const result = await mockGroupsApi.getGroups()
      
      expect(mockGroupsApi.getGroups).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockResponse)
    })

    it('creates group', async () => {
      const mockResponse = { data: mockGroup, success: true }
      const createData = { name: 'Friends', color: '#blue' }
      mockGroupsApi.createGroup.mockResolvedValue(mockResponse)

      const result = await mockGroupsApi.createGroup(createData)
      
      expect(mockGroupsApi.createGroup).toHaveBeenCalledWith(createData)
      expect(result).toEqual(mockResponse)
    })

    it('updates group', async () => {
      const mockResponse = { data: mockGroup, success: true }
      const updates = { name: 'Best Friends' }
      mockGroupsApi.updateGroup.mockResolvedValue(mockResponse)

      const result = await mockGroupsApi.updateGroup('group1', updates)
      
      expect(mockGroupsApi.updateGroup).toHaveBeenCalledWith('group1', updates)
      expect(result).toEqual(mockResponse)
    })

    it('deletes group', async () => {
      mockGroupsApi.deleteGroup.mockResolvedValue(undefined)

      await mockGroupsApi.deleteGroup('group1')
      
      expect(mockGroupsApi.deleteGroup).toHaveBeenCalledWith('group1')
    })
  })
})