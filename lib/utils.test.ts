import { describe, it, expect } from '@jest/globals';
import { cn, formatCurrency, formatDate, truncate, slugify, capitalize } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('cn', () => {
    it('merges class names correctly', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('handles conditional classes', () => {
      expect(cn('base', true && 'conditional')).toBe('base conditional');
      expect(cn('base', false && 'conditional')).toBe('base');
    });

    it('handles tailwind merge patterns', () => {
      expect(cn('p-2 p-4', 'm-2 m-4')).toBe('m-2 m-4 p-2 p-4');
    });
  });

  describe('formatCurrency', () => {
    it('formats USD correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
    });
  });

  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date)).toBe('January 15, 2024');
    });

    it('handles string dates', () => {
      expect(formatDate('2024-01-15')).toBe('January 15, 2024');
    });
  });

  describe('truncate', () => {
    it('truncates long strings', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...');
    });

    it('returns original string if shorter', () => {
      expect(truncate('Hi', 10)).toBe('Hi');
    });
  });

  describe('slugify', () => {
    it('converts text to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Test 123!')).toBe('test-123');
    });
  });

  describe('capitalize', () => {
    it('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('world')).toBe('World');
    });
  });
});
