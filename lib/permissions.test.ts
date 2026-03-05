import { describe, it, expect } from '@jest/globals';
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
} from '@/lib/permissions';
import { Role } from '@prisma/client';

describe('Permissions Module', () => {
  describe('rolePermissions', () => {
    it('should have permissions defined for all roles', () => {
      const roles: Role[] = ['ADMIN', 'MANAGER', 'BOOKING_AGENT', 'ENGINEER', 'INTERN', 'FINANCE', 'MARKETING', 'FRONT_DESK'];
      
      roles.forEach(role => {
        expect(rolePermissions[role]).toBeDefined();
        expect(Array.isArray(rolePermissions[role])).toBe(true);
      });
    });

    it('should have ADMIN with all permissions', () => {
      expect(rolePermissions.ADMIN).toContain('manage_users');
      expect(rolePermissions.ADMIN).toContain('view_reports');
      expect(rolePermissions.ADMIN).toContain('manage_inventory');
    });

    it('should have INTERN with minimal permissions', () => {
      expect(rolePermissions.INTERN).toContain('view_own_profile');
      expect(rolePermissions.INTERN).toContain('view_master_calendar');
      expect(rolePermissions.INTERN).not.toContain('book_sessions');
    });
  });

  describe('hasPermission', () => {
    it('should return true when role has permission', () => {
      expect(hasPermission('ADMIN', 'manage_users')).toBe(true);
      expect(hasPermission('MANAGER', 'book_sessions')).toBe(true);
      expect(hasPermission('ENGINEER', 'update_availability')).toBe(true);
    });

    it('should return false when role does not have permission', () => {
      expect(hasPermission('INTERN', 'manage_users')).toBe(false);
      expect(hasPermission('FRONT_DESK', 'view_reports')).toBe(false);
    });

    it('should return false for undefined role', () => {
      expect(hasPermission(undefined, 'manage_users')).toBe(false);
    });
  });

  describe('hasAnyPermission', () => {
    it('should return true when role has any of the permissions', () => {
      expect(hasAnyPermission('ENGINEER', ['update_availability', 'manage_users'])).toBe(true);
      expect(hasAnyPermission('INTERN', ['view_master_calendar', 'book_sessions'])).toBe(true);
    });

    it('should return false when role has none of the permissions', () => {
      expect(hasAnyPermission('INTERN', ['manage_users', 'manage_inventory'])).toBe(false);
    });
  });

  describe('hasAllPermissions', () => {
    it('should return true when role has all permissions', () => {
      expect(hasAllPermissions('ADMIN', ['manage_users', 'view_reports'])).toBe(true);
    });

    it('should return false when role is missing any permission', () => {
      expect(hasAllPermissions('ENGINEER', ['manage_users', 'update_availability'])).toBe(false);
    });
  });

  describe('getPermissions', () => {
    it('should return all permissions for a role', () => {
      const adminPermissions = getPermissions('ADMIN');
      expect(adminPermissions).toContain('manage_users');
      expect(adminPermissions).toContain('view_reports');
    });

    it('should return empty array for unknown role', () => {
      // @ts-ignore - Testing invalid role
      expect(getPermissions('UNKNOWN')).toEqual([]);
    });
  });

  describe('roleDisplayNames', () => {
    it('should have display names for all roles', () => {
      expect(roleDisplayNames.ADMIN).toBe('Administrator');
      expect(roleDisplayNames.MANAGER).toBe('Manager');
      expect(roleDisplayNames.ENGINEER).toBe('Engineer');
    });
  });

  describe('roleDescriptions', () => {
    it('should have descriptions for all roles', () => {
      expect(roleDescriptions.ADMIN).toBeDefined();
      expect(roleDescriptions.MANAGER).toBeDefined();
      expect(roleDescriptions.FINANCE).toBeDefined();
    });
  });

  describe('canApplyDiscount', () => {
    it('should allow ADMIN to apply any discount', () => {
      expect(canApplyDiscount('ADMIN', 50)).toBe(true);
      expect(canApplyDiscount('ADMIN', 100)).toBe(true);
    });

    it('should allow MANAGER to apply any discount', () => {
      expect(canApplyDiscount('MANAGER', 75)).toBe(true);
    });

    it('should allow BOOKING_AGENT to apply discounts within limit', () => {
      expect(canApplyDiscount('BOOKING_AGENT', 20)).toBe(true);
      expect(canApplyDiscount('BOOKING_AGENT', 30)).toBe(false);
    });

    it('should allow ENGINEER to apply discounts within limit', () => {
      expect(canApplyDiscount('ENGINEER', 10)).toBe(true);
      expect(canApplyDiscount('ENGINEER', 20)).toBe(false);
    });

    it('should respect custom discount limits', () => {
      expect(canApplyDiscount('BOOKING_AGENT', 30, 30)).toBe(true);
      expect(canApplyDiscount('BOOKING_AGENT', 31, 30)).toBe(false);
    });

    it('should deny discount for roles without permission', () => {
      expect(canApplyDiscount('INTERN', 10)).toBe(false);
      expect(canApplyDiscount(undefined, 10)).toBe(false);
    });
  });

  describe('canSetPrice', () => {
    it('should allow ADMIN to set any price', () => {
      expect(canSetPrice('ADMIN', 500)).toBe(true);
      expect(canSetPrice('ADMIN', 0)).toBe(true);
    });

    it('should allow MANAGER to set price within constraints', () => {
      expect(canSetPrice('MANAGER', 100, 50, 500)).toBe(true);
      expect(canSetPrice('MANAGER', 1000, 50, 500)).toBe(false);
      expect(canSetPrice('MANAGER', 10, 50, 500)).toBe(false);
    });

    it('should deny price setting for roles without permission', () => {
      expect(canSetPrice('INTERN', 100)).toBe(false);
      expect(canSetPrice('FRONT_DESK', 100)).toBe(false);
    });
  });
});
