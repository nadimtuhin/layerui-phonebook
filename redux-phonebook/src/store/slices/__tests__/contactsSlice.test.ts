import { describe, it, expect, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import contactsReducer, { 
  toggleFavorite, 
  clearError,
  fetchContacts,
  createContact,
  updateContact,
  deleteContact
} from '../contactsSlice'
import { Contact, ContactsState } from '@/types'

// Mock the API
vi.mock('@/services/api', () => ({
  contactsApi: {
    getContacts: vi.fn(),
    createContact: vi.fn(),
    updateContact: vi.fn(),
    deleteContact: vi.fn()
  }
}))

describe('contactsSlice', () => {
  const initialState: ContactsState = {
    contacts: {},
    groups: {},
    callHistory: {},
    favorites: [],
    loading: false,
    error: null,
    lastSync: undefined,
    selectedContact: undefined
  }

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

  describe('reducers', () => {
    it('should handle initialState', () => {
      const state = contactsReducer(undefined, { type: '@@INIT' })
      expect(state.selectedContact).toBeUndefined()
      expect(state.contacts).toEqual({})
    })

    it('should handle toggleFavorite', () => {
      const stateWithContact = {
        ...initialState,
        contacts: { '1': mockContact },
        favorites: []
      }
      
      const state = contactsReducer(stateWithContact, toggleFavorite('1'))
      expect(state.favorites).toContain('1')
      expect(state.contacts['1'].isFavorite).toBe(true)
    })

    it('should handle toggleFavorite remove from favorites', () => {
      const favoriteContact = { ...mockContact, isFavorite: true }
      const stateWithFavorite = {
        ...initialState,
        contacts: { '1': favoriteContact },
        favorites: ['1']
      }
      
      const state = contactsReducer(stateWithFavorite, toggleFavorite('1'))
      expect(state.favorites).not.toContain('1')
      expect(state.contacts['1'].isFavorite).toBe(false)
    })

    it('should handle clearError', () => {
      const stateWithError = { ...initialState, error: 'Some error' }
      const state = contactsReducer(stateWithError, clearError())
      expect(state.error).toBeNull()
    })
  })

  describe('async thunks', () => {
    let store: ReturnType<typeof configureStore>

    beforeEach(() => {
      store = configureStore({
        reducer: { contacts: contactsReducer }
      })
    })

    it('should handle fetchContacts.pending', () => {
      const action = { type: fetchContacts.pending.type }
      const state = contactsReducer(initialState, action)
      
      expect(state.loading).toBe(true)
      expect(state.error).toBeNull()
    })

    it('should handle fetchContacts.fulfilled', () => {
      const contacts = [mockContact]
      const action = { 
        type: fetchContacts.fulfilled.type, 
        payload: contacts 
      }
      const state = contactsReducer(initialState, action)
      
      expect(state.loading).toBe(false)
      expect(state.contacts).toEqual({ '1': mockContact })
      expect(state.lastSync).toBeDefined()
    })

    it('should handle fetchContacts.rejected', () => {
      const action = { 
        type: fetchContacts.rejected.type, 
        error: { message: 'Network error' } 
      }
      const state = contactsReducer(initialState, action)
      
      expect(state.loading).toBe(false)
      expect(state.error).toBe('Network error')
    })

    it('should handle createContact.fulfilled', () => {
      const action = { 
        type: createContact.fulfilled.type, 
        payload: mockContact 
      }
      const state = contactsReducer(initialState, action)
      
      expect(state.loading).toBe(false)
      expect(state.contacts['1']).toEqual(mockContact)
    })

    it('should handle updateContact.fulfilled', () => {
      const updatedContact = { ...mockContact, name: { first: 'Jane', last: 'Doe' } }
      const stateWithContact = {
        ...initialState,
        contacts: { '1': mockContact }
      }
      
      const action = { 
        type: updateContact.fulfilled.type, 
        payload: updatedContact 
      }
      const state = contactsReducer(stateWithContact, action)
      
      expect(state.contacts['1'].name.first).toBe('Jane')
    })

    it('should handle deleteContact.fulfilled', () => {
      const stateWithContact = {
        ...initialState,
        contacts: { '1': mockContact }
      }
      
      const action = { 
        type: deleteContact.fulfilled.type, 
        payload: '1' 
      }
      const state = contactsReducer(stateWithContact, action)
      
      expect(state.contacts['1']).toBeUndefined()
    })
  })
})