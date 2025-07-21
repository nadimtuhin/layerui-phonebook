import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Provider } from 'jotai'
import SearchBar from '../SearchBar'

describe('SearchBar Integration', () => {
  it('renders search input', () => {
    render(
      <Provider>
        <SearchBar />
      </Provider>
    )
    expect(screen.getByPlaceholderText('Search contacts...')).toBeInTheDocument()
  })

  it('renders favorites filter button', () => {
    render(
      <Provider>
        <SearchBar />
      </Provider>
    )
    expect(screen.getByTitle('Filter favorites')).toBeInTheDocument()
  })

  it('allows typing in search input', () => {
    render(
      <Provider>
        <SearchBar />
      </Provider>
    )
    const input = screen.getByPlaceholderText('Search contacts...')
    fireEvent.change(input, { target: { value: 'john' } })
    expect(input).toHaveValue('john')
  })

  it('allows clicking favorites filter', () => {
    render(
      <Provider>
        <SearchBar />
      </Provider>
    )
    const button = screen.getByTitle('Filter favorites')
    fireEvent.click(button)
    // Component should handle click without errors
    expect(button).toBeInTheDocument()
  })
})