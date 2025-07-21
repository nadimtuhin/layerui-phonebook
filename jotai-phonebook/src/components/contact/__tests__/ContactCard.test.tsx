import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ContactCard from '../ContactCard'
import { Contact } from '@/types'

describe('ContactCard', () => {
  const mockContact: Contact = {
    id: '1',
    name: { first: 'John', last: 'Doe' },
    phones: [
      { id: '1', number: '+1234567890', type: 'mobile', isPrimary: true },
      { id: '2', number: '+1987654321', type: 'home', isPrimary: false }
    ],
    emails: [
      { id: '1', address: 'john@example.com', type: 'personal', isPrimary: true }
    ],
    groups: ['friends'],
    isFavorite: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const defaultProps = {
    contact: mockContact,
    onClick: vi.fn(),
    onToggleFavorite: vi.fn(),
    view: 'list' as const
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders contact name', () => {
    render(<ContactCard {...defaultProps} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('displays primary phone number', () => {
    render(<ContactCard {...defaultProps} />)
    expect(screen.getByText(/\+1234567890/)).toBeInTheDocument()
  })

  it('shows initials when no avatar', () => {
    render(<ContactCard {...defaultProps} />)
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('displays avatar when provided', () => {
    const contactWithAvatar = {
      ...mockContact,
      avatar: 'https://example.com/avatar.jpg'
    }
    render(<ContactCard {...defaultProps} contact={contactWithAvatar} />)
    const avatar = screen.getByAltText('John Doe')
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg')
  })

  it('shows favorite star when contact is favorite', () => {
    const favoriteContact = { ...mockContact, isFavorite: true }
    render(<ContactCard {...defaultProps} contact={favoriteContact} />)
    const favoriteStars = screen.getAllByText('⭐')
    expect(favoriteStars).toHaveLength(2) // One in display, one in button
    expect(favoriteStars[0]).toBeInTheDocument()
  })

  it('calls onClick when card is clicked', () => {
    render(<ContactCard {...defaultProps} />)
    fireEvent.click(screen.getByText('John Doe'))
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1)
  })

  it('calls onToggleFavorite when favorite button is clicked', () => {
    render(<ContactCard {...defaultProps} />)
    const favoriteButton = screen.getByRole('button')
    fireEvent.click(favoriteButton)
    expect(defaultProps.onToggleFavorite).toHaveBeenCalledTimes(1)
  })

  it('prevents event propagation on favorite button click', () => {
    render(<ContactCard {...defaultProps} />)
    const favoriteButton = screen.getByRole('button')
    fireEvent.click(favoriteButton)
    expect(defaultProps.onClick).not.toHaveBeenCalled()
  })

  it('handles contact with no phones', () => {
    const contactNoPhones = { ...mockContact, phones: [] }
    render(<ContactCard {...defaultProps} contact={contactNoPhones} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.queryByText(/📞/)).not.toBeInTheDocument()
  })

  it('uses first phone when no primary phone', () => {
    const contactNoPrimary = {
      ...mockContact,
      phones: [
        { id: '1', number: '+1111111111', type: 'mobile', isPrimary: false },
        { id: '2', number: '+2222222222', type: 'home', isPrimary: false }
      ]
    }
    render(<ContactCard {...defaultProps} contact={contactNoPrimary} />)
    expect(screen.getByText(/\+1111111111/)).toBeInTheDocument()
  })

  describe('different view modes', () => {
    it('renders in grid view', () => {
      render(<ContactCard {...defaultProps} view="grid" />)
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    it('renders in card view', () => {
      render(<ContactCard {...defaultProps} view="card" />)
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })
})