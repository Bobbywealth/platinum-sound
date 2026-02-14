import { Role } from '@prisma/client'

// Permission types
export type Permission = 
  | 'view_own_profile'
  | 'update_availability'
  | 'block_off_dates'
  | 'book_sessions'
  | 'apply_discounts'
  | 'swap_rooms'
  | 'swap_engineers'
  | 'override_pricing'
  | 'lock_rooms'
  | 'view_master_calendar'
  | 'set_engineer_rates'
  | 'override_engineer_rates'
  | 'set_room_prices'
  | 'manage_users'
  | 'view_reports'
  | 'manage_inventory'
  | 'create_work_orders'
  | 'sign_work_orders'
  | 'manage_email_settings'

// Permission matrix by role
export const rolePermissions: Record<Role, Permission[]> = {
  ADMIN: [
    'view_own_profile',
    'book_sessions',
    'apply_discounts',
    'swap_rooms',
    'swap_engineers',
    'override_pricing',
    'lock_rooms',
    'view_master_calendar',
    'set_engineer_rates',
    'override_engineer_rates',
    'set_room_prices',
    'manage_users',
    'view_reports',
    'manage_inventory',
    'create_work_orders',
    'sign_work_orders',
    'manage_email_settings',
  ],
  MANAGER: [
    'view_own_profile',
    'book_sessions',
    'apply_discounts',
    'swap_rooms',
    'swap_engineers',
    'override_pricing',
    'lock_rooms',
    'view_master_calendar',
    'set_room_prices',
    'view_reports',
    'manage_inventory',
    'create_work_orders',
    'sign_work_orders',
  ],
  BOOKING_AGENT: [
    'view_own_profile',
    'book_sessions',
    'apply_discounts',
    'swap_rooms',
    'swap_engineers',
    'override_pricing',
    'lock_rooms',
    'view_master_calendar',
  ],
  ENGINEER: [
    'view_own_profile',
    'update_availability',
    'block_off_dates',
    'book_sessions',
    'apply_discounts',
    'sign_work_orders',
  ],
}

// Check if a role has a specific permission
export function hasPermission(role: Role | undefined, permission: Permission): boolean {
  if (!role) return false
  return rolePermissions[role]?.includes(permission) ?? false
}

// Check if a role has any of the specified permissions
export function hasAnyPermission(role: Role | undefined, permissions: Permission[]): boolean {
  if (!role) return false
  return permissions.some(p => hasPermission(role, p))
}

// Check if a role has all of the specified permissions
export function hasAllPermissions(role: Role | undefined, permissions: Permission[]): boolean {
  if (!role) return false
  return permissions.every(p => hasPermission(role, p))
}

// Get all permissions for a role
export function getPermissions(role: Role): Permission[] {
  return rolePermissions[role] || []
}

// Role display names
export const roleDisplayNames: Record<Role, string> = {
  ADMIN: 'Administrator',
  MANAGER: 'Manager',
  BOOKING_AGENT: 'Booking Agent',
  ENGINEER: 'Engineer',
}

// Role descriptions
export const roleDescriptions: Record<Role, string> = {
  ADMIN: 'Full access to all system features and settings',
  MANAGER: 'Manage bookings, staff, reports, and studio operations',
  BOOKING_AGENT: 'Create and manage bookings, view calendar, handle client requests',
  ENGINEER: 'Update availability, manage sessions, apply discounts within limits',
}

// Check if user can apply a specific discount percentage
export function canApplyDiscount(role: Role | undefined, discountPercent: number, discountLimit?: number | null): boolean {
  if (!hasPermission(role, 'apply_discounts')) return false
  
  // Admin and Manager have no discount limits
  if (role === 'ADMIN' || role === 'MANAGER') return true
  
  // Booking Agent and Engineer have limits
  if (role === 'BOOKING_AGENT' || role === 'ENGINEER') {
    const maxDiscount = discountLimit ?? (role === 'BOOKING_AGENT' ? 25 : 15)
    return discountPercent <= maxDiscount
  }
  
  return false
}

// Check if user can set a specific price within room constraints
export function canSetPrice(
  role: Role | undefined, 
  price: number, 
  minPrice?: number | null, 
  maxPrice?: number | null
): boolean {
  if (!hasPermission(role, 'override_pricing') && !hasPermission(role, 'set_room_prices')) {
    return false
  }
  
  // Admin can set any price
  if (role === 'ADMIN') return true
  
  // Others must respect room constraints
  if (minPrice !== null && minPrice !== undefined && price < minPrice) return false
  if (maxPrice !== null && maxPrice !== undefined && price > maxPrice) return false
  
  return true
}
