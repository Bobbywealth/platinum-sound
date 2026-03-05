import { describe, it, expect } from '@jest/globals';
import { cn, formatCurrency, formatDate, formatTime, truncate, slugify, capitalize, generateId, getInitials, getRelativeTime } from '@/lib/utils';

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
      // tailwind-merge merges conflicting classes - last one wins
      expect(cn('p-2 p-4', 'm-2 m-4')).toBe('p-4 m-4');
      expect(cn('p-2', 'p-4')).toBe('p-4');
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
      // Create date in local timezone to avoid UTC conversion issues
      const date = new Date(2024, 0, 15); // January 15, 2024 in local time
      expect(formatDate(date)).toBe('Jan 15, 2024');
    });

    it('handles string dates', () => {
      // String dates are parsed as UTC, so we need to use a format that works
      // Using ISO format with time to ensure correct parsing
      const date = new Date('2024-01-15T12:00:00');
      expect(formatDate(date)).toBe('Jan 15, 2024');
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

  describe('formatTime', () => {
    it('formats time in 12-hour format with AM/PM', () => {
      expect(formatTime('09:30')).toBe('9:30 AM');
      expect(formatTime('12:00')).toBe('12:00 PM');
      expect(formatTime('13:45')).toBe('1:45 PM');
      expect(formatTime('00:00')).toBe('12:00 AM');
      expect(formatTime('23:59')).toBe('11:59 PM');
    });
  });

  describe('generateId', () => {
    it('generates a random alphanumeric string', () => {
      const id = generateId();
      expect(id).toHaveLength(7);
      expect(typeof id).toBe('string');
    });

    it('generates unique ids', () => {
      const ids = new Set(Array.from({ length: 100 }, () => generateId()));
      expect(ids.size).toBe(100);
    });
  });

  describe('getInitials', () => {
    it('extracts initials from name', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('Alice Smith')).toBe('AS');
      expect(getInitials('Bob')).toBe('B'); // Single name returns just first char
      expect(getInitials('')).toBe('');
    });

    it('limits to 2 characters', () => {
      expect(getInitials('John Paul Doe')).toBe('JP');
    });
  });

  describe('getRelativeTime', () => {
    it('returns "just now" for recent dates', () => {
      const now = new Date();
      expect(getRelativeTime(now)).toBe('just now');
    });

    it('returns minutes ago for dates within an hour', () => {
      const date = new Date(Date.now() - 5 * 60 * 1000);
      expect(getRelativeTime(date)).toBe('5m ago');
    });

    it('returns hours ago for dates within a day', () => {
      const date = new Date(Date.now() - 3 * 60 * 60 * 1000);
      expect(getRelativeTime(date)).toBe('3h ago');
    });

    it('returns days ago for dates within a week', () => {
      const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      expect(getRelativeTime(date)).toBe('2d ago');
    });
  });
});
