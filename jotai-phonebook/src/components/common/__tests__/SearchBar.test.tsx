import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

// Mock search input component for unit testing
interface MockSearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onClear?: () => void
}

const MockSearchBar: React.FC<MockSearchBarProps> = ({ 
  value, 
  onChange, 
  placeholder = 'Search...', 
  onClear 
}) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border rounded px-2 py-1"
      />
      {value && (
        <button onClick={onClear} type="button">
          Clear
        </button>
      )}
    </div>
  )
}

describe('MockSearchBar', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
    placeholder: 'Search contacts...',
    onClear: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with placeholder', () => {
    render(<MockSearchBar {...defaultProps} />)
    expect(screen.getByPlaceholderText('Search contacts...')).toBeInTheDocument()
  })

  it('displays current value', () => {
    render(<MockSearchBar {...defaultProps} value="john" />)
    expect(screen.getByDisplayValue('john')).toBeInTheDocument()
  })

  it('shows clear button when there is text', () => {
    render(<MockSearchBar {...defaultProps} value="john" />)
    expect(screen.getByText('Clear')).toBeInTheDocument()
  })

  it('hides clear button when text is empty', () => {
    render(<MockSearchBar {...defaultProps} value="" />)
    expect(screen.queryByText('Clear')).not.toBeInTheDocument()
  })

  it('is accessible', () => {
    render(<MockSearchBar {...defaultProps} />)
    const input = screen.getByPlaceholderText('Search contacts...')
    
    expect(input).toHaveAttribute('type', 'text')
    expect(input).toBeVisible()
  })
})