/**
 * Unit Tests - Utilities
 * Tests for utility functions
 */

import { 
  formatCurrency, 
  formatDate, 
  formatTime, 
  cn,
  generateBookingCode,
  calculateSessionDuration,
  validateEmail,
  validatePhone
} from '@/lib/utils'

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    test('should format USD currency correctly', () => {
      expect(formatCurrency(100)).toBe('$100.00')
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
      expect(formatCurrency(0)).toBe('$0.00')
    })

    test('should handle negative amounts', () => {
      expect(formatCurrency(-50)).toBe('-$50.00')
    })

    test('should handle zero decimal amounts', () => {
      expect(formatCurrency(100, { minimumFractionDigits: 0 })).toBe('$100')
    })
  })

  describe('formatDate', () => {
    test('should format date correctly', () => {
      const date = new Date('2024-03-15')
      const formatted = formatDate(date)
      expect(formatted).toContain('2024')
      expect(formatted).toContain('15')
    })

    test('should handle different locales', () => {
      const date = new Date('2024-03-15')
      const formatted = formatDate(date, 'en-GB')
      expect(formatted).toContain('15')
      expect(formatted).toContain('2024')
    })
  })

  describe('formatTime', () => {
    test('should format time correctly', () => {
      const date = new Date('2024-03-15T14:30:00')
      const formatted = formatTime(date)
      expect(formatted).toMatch(/\d{1,2}:\d{2}/)
    })
  })

  describe('cn (className utility)', () => {
    test('should merge class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar')
    })

    test('should handle falsy values', () => {
      expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
      expect(cn('foo', null, undefined, 'bar')).toBe('foo bar')
    })

    test('should handle conditional classes', () => {
      const condition = true
      expect(cn('foo', condition && 'bar')).toBe('foo bar')
      expect(cn('foo', false && 'bar')).toBe('foo')
    })

    test('should handle arrays', () => {
      expect(cn(['foo', 'bar'])).toBe('foo bar')
    })
  })

  describe('generateBookingCode', () => {
    test('should generate unique codes', () => {
      const code1 = generateBookingCode()
      const code2 = generateBookingCode()
      expect(code1).not.toBe(code2)
    })

    test('should generate string codes', () => {
      const code = generateBookingCode()
      expect(typeof code).toBe('string')
      expect(code.length).toBeGreaterThan(0)
    })

    test('should generate codes with prefix', () => {
      const code = generateBookingCode('BK')
      expect(code.startsWith('BK-')).toBe(true)
    })
  })

  describe('calculateSessionDuration', () => {
    test('should calculate duration in hours', () => {
      expect(calculateSessionDuration('10:00', '12:00')).toBe(2)
      expect(calculateSessionDuration('09:00', '17:00')).toBe(8)
    })

    test('should handle same start and end time', () => {
      expect(calculateSessionDuration('10:00', '10:00')).toBe(0)
    })

    test('should handle PM times', () => {
      expect(calculateSessionDuration('2:00', '5:00')).toBe(3)
    })
  })

  describe('validateEmail', () => {
    test('should validate correct emails', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
      expect(validateEmail('user+tag@example.org')).toBe(true)
    })

    test('should reject invalid emails', () => {
      expect(validateEmail('invalid')).toBe(false)
      expect(validateEmail('invalid@')).toBe(false)
      expect(validateEmail('@domain.com')).toBe(false)
      expect(validateEmail('test@.com')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('validatePhone', () => {
    test('should validate correct phone numbers', () => {
      expect(validatePhone('+1234567890')).toBe(true)
      expect(validatePhone('1234567890')).toBe(true)
      expect(validatePhone('(123) 456-7890')).toBe(true)
      expect(validatePhone('123-456-7890')).toBe(true)
    })

    test('should reject invalid phone numbers', () => {
      expect(validatePhone('123')).toBe(false)
      expect(validatePhone('abcdefghij')).toBe(false)
      expect(validatePhone('')).toBe(false)
    })
  })
})
