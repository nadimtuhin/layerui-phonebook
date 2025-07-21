import { describe, it, expect } from 'vitest'
import { validatePhone, formatPhone, validateEmail, normalizePhone } from '../validation'

describe('validation utils', () => {
  describe('validatePhone', () => {
    it('validates valid phone numbers', () => {
      expect(validatePhone('+14155552671')).toBe(true)
      expect(validatePhone('(415) 555-2671', 'US')).toBe(true)
      expect(validatePhone('+44 20 7946 0958')).toBe(true)
    })

    it('rejects invalid phone numbers', () => {
      expect(validatePhone('123')).toBe(false)
      expect(validatePhone('abc')).toBe(false)
      expect(validatePhone('')).toBe(false)
      expect(validatePhone('++1234567890')).toBe(false)
    })

    it('handles errors gracefully', () => {
      expect(validatePhone('invalid')).toBe(false)
    })
  })

  describe('formatPhone', () => {
    it('formats valid phone numbers', () => {
      const formatted = formatPhone('+14155552671')
      expect(formatted).toContain('+1')
    })

    it('returns original string for invalid numbers', () => {
      expect(formatPhone('invalid')).toBe('invalid')
      expect(formatPhone('')).toBe('')
    })
  })

  describe('validateEmail', () => {
    it('validates correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
      expect(validateEmail('user+tag@example.com')).toBe(true)
    })

    it('rejects invalid email formats', () => {
      expect(validateEmail('invalid')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('test.example.com')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('normalizePhone', () => {
    it('removes non-digit characters', () => {
      expect(normalizePhone('(555) 123-4567')).toBe('5551234567')
      expect(normalizePhone('+1-234-567-8900')).toBe('12345678900')
      expect(normalizePhone('123 456 7890')).toBe('1234567890')
    })

    it('handles empty strings', () => {
      expect(normalizePhone('')).toBe('')
    })
  })
})