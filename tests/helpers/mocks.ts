/**
 * Mock Utilities for Testing
 * Provides mocks for external services and common dependencies
 */

import { Role } from '@prisma/client'

// Mock NextAuth session
export const mockSession = {
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    role: Role.ADMIN,
    phone: '+1234567890',
    discountLimit: 50,
  },
}

// Mock authenticated request
export const mockAuthRequest = (role: Role = Role.ADMIN) => ({
  auth: {
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      role,
      phone: '+1234567890',
      discountLimit: 50,
    },
  },
})

// Mock unauthenticated request
export const mockUnauthenticatedRequest = {
  auth: null,
}

// Mock NextRequest with params
export const createMockRequest = (options: {
  method?: string
  body?: any
  query?: Record<string, string>
  headers?: Record<string, string>
  auth?: any
} = {}) => {
  const { method = 'GET', body = null, query = {}, headers = {}, auth = null } = options

  return {
    method,
    headers: new Headers(headers),
    nextUrl: {
      pathname: '/test',
      searchParams: new URLSearchParams(query),
    },
    url: `http://localhost:3000/test?${new URLSearchParams(query).toString()}`,
    body: body ? JSON.stringify(body) : null,
    json: async () => body,
    auth,
  }
}

// Mock fetch for API testing
export const mockFetch = (response: any, status = 200) => {
  return jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => response,
    headers: new Headers({ 'content-type': 'application/json' }),
  })
}

// Mock Stripe
export const mockStripe = {
  paymentIntents: {
    create: jest.fn().mockResolvedValue({
      id: 'pi_test123',
      client_secret: 'pi_test123_secret',
      status: 'requires_payment_method',
    }),
    retrieve: jest.fn().mockResolvedValue({
      id: 'pi_test123',
      status: 'succeeded',
      amount: 5000,
    }),
  },
}

// Mock Prisma client
export const createMockPrisma = () => ({
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
  },
  client: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  booking: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
  },
  room: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
  },
  invoice: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
  },
  $transaction: jest.fn((callback) => callback(createMockPrisma())),
})

// Test data factories
export const testData = {
  user: (overrides = {}) => ({
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    role: Role.ADMIN,
    phone: '+1234567890',
    discountLimit: 50,
    ...overrides,
  }),

  client: (overrides = {}) => ({
    id: 'test-client-id',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1987654321',
    companyName: 'Test Corp',
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),

  booking: (clientId = 'test-client-id', overrides = {}) => ({
    id: 'test-booking-id',
    clientId,
    studio: 'STUDIO_A',
    date: new Date(),
    startTime: '10:00',
    endTime: '12:00',
    engineer: 'Test Engineer',
    sessionType: 'RECORDING',
    status: 'PENDING',
    bookingCode: 'TEST-001',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),

  room: (overrides = {}) => ({
    id: 'test-room-id',
    name: 'Studio A',
    description: 'Main recording studio',
    baseRate: 200,
    rateWithEngineer: 300,
    rateWithoutEngineer: 150,
    status: 'AVAILABLE',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),

  invoice: (clientId = 'test-client-id', overrides = {}) => ({
    id: 'test-invoice-id',
    clientId,
    amount: 500,
    status: 'PENDING',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    issuedDate: new Date(),
    items: [{ description: 'Test session', amount: 500 }],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),
}
