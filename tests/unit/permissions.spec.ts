/**
 * Unit Tests - Permissions
 * Tests for role-based access control and permission logic
 */

import { 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions,
  getPermissions,
  canApplyDiscount,
  canSetPrice,
  rolePermissions,
  roleDisplayNames,
  roleDescriptions
} from '@/lib/permissions'
import { Role } from '@prisma/client'

describe('Permissions Module', () => {
  describe('hasPermission', () => {
    test('should return true when role has permission', () => {
      expect(hasPermission(Role.ADMIN, 'view_own_profile')).toBe(true)
      expect(hasPermission(Role.MANAGER, 'book_sessions')).toBe(true)
      expect(hasPermission(Role.ENGINEER, 'update_availability')).toBe(true)
    })

    test('should return false when role does not have permission', () => {
      expect(hasPermission(Role.ENGINEER, 'manage_users')).toBe(false)
      expect(hasPermission(Role.INTERN, 'set_engineer_rates')).toBe(false)
      expect(hasPermission(Role.FRONT_DESK, 'apply_discounts')).toBe(false)
    })

    test('should return false for undefined role', () => {
      expect(hasPermission(undefined, 'view_own_profile')).toBe(false)
    })

    test('should return false for invalid role', () => {
      expect(hasPermission('INVALID_ROLE' as Role, 'view_own_profile')).toBe(false)
    })

    test('should allow admins to manage users', () => {
      expect(hasPermission(Role.ADMIN, 'manage_users')).toBe(true)
    })

    test('should allow managers to view reports', () => {
      expect(hasPermission(Role.MANAGER, 'view_reports')).toBe(true)
    })

    test('should allow engineers to update availability', () => {
      expect(hasPermission(Role.ENGINEER, 'update_availability')).toBe(true)
    })

    test('should not allow interns to book sessions', () => {
      expect(hasPermission(Role.INTERN, 'book_sessions')).toBe(false)
    })
  })

  describe('hasAnyPermission', () => {
    test('should return true if role has any of the permissions', () => {
      expect(hasAnyPermission(Role.ADMIN, ['manage_users', 'view_reports'])).toBe(true)
      expect(hasAnyPermission(Role.ENGINEER, ['book_sessions', 'manage_users'])).toBe(true)
    })

    test('should return false if role has none of the permissions', () => {
      expect(hasAnyPermission(Role.INTERN, ['manage_users', 'set_engineer_rates'])).toBe(false)
    })

    test('should return false for undefined role', () => {
      expect(hasAnyPermission(undefined, ['view_own_profile'])).toBe(false)
    })
  })

  describe('hasAllPermissions', () => {
    test('should return true if role has all permissions', () => {
      expect(hasAllPermissions(Role.ADMIN, ['view_own_profile', 'manage_users'])).toBe(true)
    })

    test('should return false if role is missing any permission', () => {
      expect(hasAllPermissions(Role.ENGINEER, ['manage_users', 'book_sessions'])).toBe(false)
    })
  })

  describe('getPermissions', () => {
    test('should return array of permissions for role', () => {
      const adminPermissions = getPermissions(Role.ADMIN)
      expect(Array.isArray(adminPermissions)).toBe(true)
      expect(adminPermissions.length).toBeGreaterThan(0)
    })

    test('should return empty array for invalid role', () => {
      expect(getPermissions('INVALID' as Role)).toEqual([])
    })

    test('admin should have most permissions', () => {
      const adminPermissions = getPermissions(Role.ADMIN)
      const engineerPermissions = getPermissions(Role.ENGINEER)
      
      expect(adminPermissions.length).toBeGreaterThan(engineerPermissions.length)
    })
  })

  describe('canApplyDiscount', () => {
    test('admin can apply any discount', () => {
      expect(canApplyDiscount(Role.ADMIN, 100)).toBe(true)
      expect(canApplyDiscount(Role.ADMIN, 50)).toBe(true)
    })

    test('manager can apply any discount', () => {
      expect(canApplyDiscount(Role.MANAGER, 100)).toBe(true)
    })

    test('booking agent can apply discount within limit', () => {
      // Default limit is 25%
      expect(canApplyDiscount(Role.BOOKING_AGENT, 20)).toBe(true)
      expect(canApplyDiscount(Role.BOOKING_AGENT, 30)).toBe(false)
    })

    test('engineer can apply discount within limit', () => {
      // Default limit is 15%
      expect(canApplyDiscount(Role.ENGINEER, 10)).toBe(true)
      expect(canApplyDiscount(Role.ENGINEER, 20)).toBe(false)
    })

    test('engineer can use custom discount limit', () => {
      expect(canApplyDiscount(Role.ENGINEER, 20, null, 25)).toBe(true)
      expect(canApplyDiscount(Role.ENGINEER, 30, null, 25)).toBe(false)
    })

    test('intern cannot apply discounts', () => {
      expect(canApplyDiscount(Role.INTERN, 5)).toBe(false)
    })

    test('returns false for roles without apply_discounts permission', () => {
      expect(canApplyDiscount(Role.FRONT_DESK, 5)).toBe(false)
    })

    test('returns false for undefined role', () => {
      expect(canApplyDiscount(undefined, 5)).toBe(false)
    })
  })

  describe('canSetPrice', () => {
    test('admin can set any price', () => {
      expect(canSetPrice(Role.ADMIN, 500)).toBe(true)
      expect(canSetPrice(Role.ADMIN, 0)).toBe(true)
    })

    test('manager can set price within constraints', () => {
      expect(canSetPrice(Role.MANAGER, 100, 50, 200)).toBe(true)
      expect(canSetPrice(Role.MANAGER, 300, 50, 200)).toBe(false)
      expect(canSetPrice(Role.MANAGER, 25, 50, 200)).toBe(false)
    })

    test('returns false for roles without pricing permissions', () => {
      expect(canSetPrice(Role.ENGINEER, 100)).toBe(false)
      expect(canSetPrice(Role.INTERN, 100)).toBe(false)
    })

    test('returns false for undefined role', () => {
      expect(canSetPrice(undefined, 100)).toBe(false)
    })
  })

  describe('rolePermissions', () => {
    test('should have permissions for all roles', () => {
      expect(rolePermissions).toHaveProperty(Role.ADMIN)
      expect(rolePermissions).toHaveProperty(Role.MANAGER)
      expect(rolePermissions).toHaveProperty(Role.ENGINEER)
      expect(rolePermissions).toHaveProperty(Role.INTERN)
      expect(rolePermissions).toHaveProperty(Role.BOOKING_AGENT)
      expect(rolePermissions).toHaveProperty(Role.FINANCE)
      expect(rolePermissions).toHaveProperty(Role.MARKETING)
      expect(rolePermissions).toHaveProperty(Role.FRONT_DESK)
    })

    test('each role should have view_own_profile', () => {
      Object.values(rolePermissions).forEach(permissions => {
        expect(permissions).toContain('view_own_profile')
      })
    })
  })

  describe('roleDisplayNames', () => {
    test('should have display names for all roles', () => {
      expect(roleDisplayNames[Role.ADMIN]).toBe('Administrator')
      expect(roleDisplayNames[Role.MANAGER]).toBe('Manager')
      expect(roleDisplayNames[Role.ENGINEER]).toBe('Engineer')
    })
  })

  describe('roleDescriptions', () => {
    test('should have descriptions for all roles', () => {
      expect(roleDescriptions[Role.ADMIN]).toBeTruthy()
      expect(roleDescriptions[Role.MANAGER]).toBeTruthy()
      expect(roleDescriptions[Role.ENGINEER]).toBeTruthy()
    })
  })
})
