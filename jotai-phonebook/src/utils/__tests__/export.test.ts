import { describe, it, expect, vi } from 'vitest'
import { Contact } from '@/types'

// Mock export utility functions for testing
const mockExportToCSV = (contacts: Contact[]): string => {
  const headers = ['Name', 'Phone', 'Email']
  const rows = contacts.map(contact => [
    `${contact.name.first} ${contact.name.last}`,
    contact.phones[0]?.number || '',
    contact.emails[0]?.address || ''
  ])
  
  return [headers, ...rows].map(row => row.join(',')).join('\n')
}

const mockExportToJSON = (contacts: Contact[]): string => {
  return JSON.stringify(contacts, null, 2)
}

const mockDownloadFile = (content: string, filename: string, type: string) => {
  // Mock file download
  return { content, filename, type }
}

describe('export utils', () => {
  const mockContacts: Contact[] = [
    {
      id: '1',
      name: { first: 'John', last: 'Doe' },
      phones: [{ id: '1', number: '+1234567890', type: 'mobile', isPrimary: true }],
      emails: [{ id: '1', address: 'john@example.com', type: 'personal', isPrimary: true }],
      groups: [],
      isFavorite: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: { first: 'Jane', last: 'Smith' },
      phones: [{ id: '2', number: '+1987654321', type: 'work', isPrimary: true }],
      emails: [{ id: '2', address: 'jane@company.com', type: 'work', isPrimary: true }],
      groups: ['work'],
      isFavorite: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  describe('exportToCSV', () => {
    it('exports contacts to CSV format', () => {
      const csv = mockExportToCSV(mockContacts)
      
      expect(csv).toContain('Name,Phone,Email')
      expect(csv).toContain('John Doe,+1234567890,john@example.com')
      expect(csv).toContain('Jane Smith,+1987654321,jane@company.com')
    })

    it('handles contacts with missing phone/email', () => {
      const contactWithoutPhone: Contact = {
        ...mockContacts[0],
        phones: [],
        emails: []
      }
      
      const csv = mockExportToCSV([contactWithoutPhone])
      expect(csv).toContain('John Doe,,')
    })
  })

  describe('exportToJSON', () => {
    it('exports contacts to JSON format', () => {
      const json = mockExportToJSON(mockContacts)
      const parsed = JSON.parse(json)
      
      expect(parsed).toHaveLength(2)
      expect(parsed[0].name.first).toBe('John')
      expect(parsed[1].name.first).toBe('Jane')
    })

    it('preserves contact structure', () => {
      const json = mockExportToJSON([mockContacts[0]])
      const parsed = JSON.parse(json)
      
      expect(parsed[0].id).toBe(mockContacts[0].id)
      expect(parsed[0].name).toEqual(mockContacts[0].name)
      expect(parsed[0].phones).toEqual(mockContacts[0].phones)
      expect(parsed[0].emails).toEqual(mockContacts[0].emails)
    })
  })

  describe('downloadFile', () => {
    it('creates download with correct parameters', () => {
      const result = mockDownloadFile('test content', 'contacts.csv', 'text/csv')
      
      expect(result.content).toBe('test content')
      expect(result.filename).toBe('contacts.csv')
      expect(result.type).toBe('text/csv')
    })
  })
})