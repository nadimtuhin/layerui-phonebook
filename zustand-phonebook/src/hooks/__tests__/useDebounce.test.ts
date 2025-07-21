import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '../useDebounce'

// Mock timers for more reliable testing
vi.useFakeTimers()

describe('useDebounce', () => {
  beforeEach(() => {
    vi.clearAllTimers()
  })

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    expect(result.current).toBe('initial')
  })

  it('debounces value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 }
      }
    )

    expect(result.current).toBe('initial')

    // Update the value
    rerender({ value: 'updated', delay: 500 })
    
    // Value should still be the initial value immediately
    expect(result.current).toBe('initial')

    // Fast-forward time by 250ms (less than delay)
    act(() => {
      vi.advanceTimersByTime(250)
    })
    expect(result.current).toBe('initial')

    // Fast-forward time by another 250ms (total 500ms = delay)
    act(() => {
      vi.advanceTimersByTime(250)
    })
    expect(result.current).toBe('updated')
  })

  it('resets timer on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 }
      }
    )

    // Update value multiple times rapidly
    rerender({ value: 'change1', delay: 500 })
    
    act(() => {
      vi.advanceTimersByTime(250)
    })
    
    rerender({ value: 'change2', delay: 500 })
    
    act(() => {
      vi.advanceTimersByTime(250)
    })
    
    // Should still be initial because timer was reset
    expect(result.current).toBe('initial')
    
    // Now wait full delay
    act(() => {
      vi.advanceTimersByTime(500)
    })
    
    expect(result.current).toBe('change2')
  })

  it('works with different data types', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 0, delay: 300 }
      }
    )

    expect(result.current).toBe(0)

    rerender({ value: 42, delay: 300 })
    
    act(() => {
      vi.advanceTimersByTime(300)
    })
    
    expect(result.current).toBe(42)
  })

  it('handles zero delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 0 }
      }
    )

    expect(result.current).toBe('initial')

    rerender({ value: 'updated', delay: 0 })
    
    // With zero delay, should update immediately
    act(() => {
      vi.advanceTimersByTime(0)
    })
    
    expect(result.current).toBe('updated')
  })
})