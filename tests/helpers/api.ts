/**
 * API Test Helpers
 * Utilities for testing Next.js API routes
 */

import { NextRequest } from 'next/server'

/**
 * Create a NextRequest object for testing
 */
export function createApiRequest(options: {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: any
  query?: Record<string, string>
  headers?: Record<string, string>
  cookies?: Record<string, string>
} = {}): NextRequest {
  const { 
    method = 'GET', 
    body = null, 
    query = {}, 
    headers = { 'content-type': 'application/json' },
    cookies = {}
  } = options

  const searchParams = new URLSearchParams(query)
  const url = `http://localhost:3000/api/test?${searchParams.toString()}`

  // Create a mock Request-like object
  const mockRequest = {
    method,
    url,
    headers: new Headers(headers),
    nextUrl: {
      pathname: '/api/test',
      searchParams,
    },
    json: body ? async () => body : async () => ({}),
    text: body ? async () => JSON.stringify(body) : async () => '',
    cookie: (name: string) => cookies[name] || null,
    cookies: cookies,
  } as unknown as NextRequest

  return mockRequest
}

/**
 * Parse API response
 */
export async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text()
  try {
    return JSON.parse(text)
  } catch {
    return text as unknown as T
  }
}

/**
 * Assert response status
 */
export function expectStatus(response: Response, expected: number): void {
  if (response.status !== expected) {
    throw new Error(`Expected status ${expected}, got ${response.status}`)
  }
}

/**
 * Assert response success
 */
export function expectSuccess(response: Response): void {
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`Expected success status, got ${response.status}`)
  }
}

/**
 * Assert response error
 */
export function expectError(response: Response): void {
  if (response.status < 400) {
    throw new Error(`Expected error status (4xx/5xx), got ${response.status}`)
  }
}

/**
 * Assert response has error message
 */
export async function expectErrorMessage(response: Response, message?: string): Promise<void> {
  const body = await parseResponse<{ error?: string }>(response)
  if (!body.error) {
    throw new Error('Expected response to contain error message')
  }
  if (message && !body.error.includes(message)) {
    throw new Error(`Expected error to contain "${message}", got "${body.error}"`)
  }
}

/**
 * Build query string
 */
export function buildQuery(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value))
    }
  })
  return searchParams.toString()
}

/**
 * Test data for API tests
 */
export const apiTestData = {
  validBooking: {
    clientName: 'John Doe',
    clientEmail: 'john@example.com',
    clientPhone: '+1987654321',
    date: new Date().toISOString(),
    startTime: '10:00',
    endTime: '12:00',
    sessionType: 'Recording',
    sessionMode: 'In-Person',
    studio: 'Studio A',
    engineer: 'Test Engineer',
    paymentOption: 'Pay in studio',
  },

  invalidBooking: {
    clientName: '',
    clientEmail: 'invalid-email',
    clientPhone: '',
    date: 'invalid-date',
  },

  validClient: {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    phone: '+1987654321',
    companyName: 'Test Company',
  },

  validInvoice: {
    clientId: 'test-client-id',
    amount: 500,
    status: 'PENDING',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    items: [{ description: 'Studio session', amount: 500 }],
  },

  checkIn: {
    bookingCode: 'TEST-001',
  },

  emptyCheckIn: {
    bookingCode: '',
  },

  invalidCheckIn: {
    bookingCode: 'NONEXISTENT',
  },
}
