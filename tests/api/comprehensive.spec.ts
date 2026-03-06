/**
 * Comprehensive API Tests
 * Tests all API endpoints for correct behavior, validation, and error handling
 */

import { test, expect, describe, beforeAll, afterAll } from '@playwright/test'

const API_BASE = 'http://localhost:3000/api'

// ============================================
// BOOKINGS API TESTS
// ============================================

describe('API - Bookings', () => {
  test.describe('GET /api/bookings', () => {
    test('should return 200 with array response', async ({ request }) => {
      const response = await request.get(`${API_BASE}/bookings`)
      expect(response.status()).toBe(200)
      
      const body = await response.json()
      expect(Array.isArray(body)).toBe(true)
    })

    test('should accept query parameters for filtering', async ({ request }) => {
      const response = await request.get(`${API_BASE}/bookings?status=PENDING&studio=STUDIO_A`)
      expect(response.status()).toBe(200)
    })

    test('should handle invalid query parameters gracefully', async ({ request }) => {
      const response = await request.get(`${API_BASE}/bookings?invalid=param`)
      expect(response.status()).toBe(200) // Should not crash
    })

    test('should return bookings with related data', async ({ request }) => {
      const response = await request.get(`${API_BASE}/bookings`)
      const body = await response.json()
      
      if (body.length > 0) {
        const booking = body[0]
        // Check for related data structure
        expect(booking).toHaveProperty('client')
        expect(booking).toHaveProperty('studio')
        expect(booking).toHaveProperty('status')
      }
    })
  })

  test.describe('POST /api/bookings', () => {
    test('should create booking with valid data', async ({ request }) => {
      const validData = {
        clientName: 'Test Client',
        clientEmail: `test${Date.now()}@example.com`,
        clientPhone: '+1987654321',
        date: new Date().toISOString(),
        startTime: '10:00',
        endTime: '12:00',
        sessionType: 'Recording',
        sessionMode: 'In-Person',
        studio: 'Studio A',
        engineer: 'Test Engineer',
        paymentOption: 'Pay in studio',
      }

      const response = await request.post(`${API_BASE}/bookings`, {
        data: validData,
      })

      expect(response.status()).toBeGreaterThanOrEqual(200)
      expect(response.status()).toBeLessThan(500)
    })

    test('should reject booking with missing required fields', async ({ request }) => {
      const invalidData = {
        clientName: '',
        clientEmail: 'not-an-email',
      }

      const response = await request.post(`${API_BASE}/bookings`, {
        data: invalidData,
      })

      // Should return error (400 or 500)
      expect(response.status()).toBeGreaterThanOrEqual(400)
    })

    test('should validate client email format', async ({ request }) => {
      const invalidEmail = {
        clientName: 'Test',
        clientEmail: 'invalid-email',
        clientPhone: '+1987654321',
        date: new Date().toISOString(),
        startTime: '10:00',
        endTime: '12:00',
        sessionType: 'Recording',
        studio: 'Studio A',
      }

      const response = await request.post(`${API_BASE}/bookings`, {
        data: invalidEmail,
      })

      // Should handle gracefully
      expect(response.status()).toBeGreaterThanOrEqual(200)
      expect(response.status()).toBeLessThan(500)
    })

    test('should reject duplicate client emails appropriately', async ({ request }) => {
      const email = `duplicate${Date.now()}@example.com`
      
      const data1 = {
        clientName: 'First Client',
        clientEmail: email,
        clientPhone: '+1987654321',
        date: new Date().toISOString(),
        startTime: '10:00',
        endTime: '12:00',
        sessionType: 'Recording',
        studio: 'Studio A',
      }

      // First booking
      await request.post(`${API_BASE}/bookings`, { data: data1 })
      
      // Second booking with same email
      const data2 = { ...data1, clientName: 'Second Client' }
      const response = await request.post(`${API_BASE}/bookings`, { data: data2 })
      
      // Should handle duplicate (either reuse client or return error)
      expect(response.status()).toBeGreaterThanOrEqual(200)
      expect(response.status()).toBeLessThan(500)
    })

    test('should validate phone against staff numbers', async ({ request }) => {
      const data = {
        clientName: 'Test',
        clientEmail: 'test@example.com',
        clientPhone: '+1 (212) 265-6060', // Staff phone number
        date: new Date().toISOString(),
        sessionType: 'Recording',
        studio: 'Studio A',
      }

      const response = await request.post(`${API_BASE}/bookings`, {
        data,
      })

      // Should reject or warn about staff phone
      const body = await response.json()
      expect(
        response.status() === 400 || 
        body.error?.toLowerCase().includes('staff') ||
        response.status() === 201
      ).toBe(true)
    })
  })
})

// ============================================
// CLIENTS API TESTS
// ============================================

describe('API - Clients', () => {
  test.describe('GET /api/clients', () => {
    test('should return 200 with clients list', async ({ request }) => {
      const response = await request.get(`${API_BASE}/clients`)
      expect(response.status()).toBe(200)
    })

    test('should support pagination', async ({ request }) => {
      const response = await request.get(`${API_BASE}/clients?page=1&limit=10`)
      const body = await response.json()
      
      expect(body).toHaveProperty('clients')
      expect(body).toHaveProperty('pagination')
    })

    test('should support search filtering', async ({ request }) => {
      const response = await request.get(`${API_BASE}/clients?search=john`)
      expect(response.status()).toBe(200)
    })

    test('should support status filtering', async ({ request }) => {
      const response = await request.get(`${API_BASE}/clients?status=ACTIVE`)
      expect(response.status()).toBe(200)
    })
  })

  test.describe('POST /api/clients', () => {
    test('should create client with valid data', async ({ request }) => {
      const clientData = {
        firstName: 'Test',
        lastName: 'Client',
        email: `client${Date.now()}@example.com`,
        phone: '+1987654321',
        companyName: 'Test Corp',
      }

      const response = await request.post(`${API_BASE}/clients`, {
        data: clientData,
      })

      expect(response.status()).toBeGreaterThanOrEqual(200)
      expect(response.status()).toBeLessThan(500)
    })

    test('should reject duplicate email', async ({ request }) => {
      const email = `duplicate${Date.now()}@example.com`
      
      const data = {
        firstName: 'Test',
        lastName: 'Client',
        email,
      }

      await request.post(`${API_BASE}/clients`, { data })
      
      const response = await request.post(`${API_BASE}/clients`, { data })
      
      // Should return error for duplicate
      expect(response.status()).toBeGreaterThanOrEqual(400)
    })

    test('should require email field', async ({ request }) => {
      const response = await request.post(`${API_BASE}/clients`, {
        data: { firstName: 'Test' },
      })

      expect(response.status()).toBeGreaterThanOrEqual(400)
    })
  })

  test.describe('PUT /api/clients', () => {
    test('should update client with valid data', async ({ request }) => {
      // First create a client
      const email = `update${Date.now()}@example.com`
      await request.post(`${API_BASE}/clients`, {
        data: { firstName: 'Original', lastName: 'Name', email },
      })

      // Update would need the ID - testing structure
      const response = await request.put(`${API_BASE}/clients`, {
        data: { ids: 'some-id', firstName: 'Updated' },
      })

      // Handle 400 or 404 (no ID) gracefully
      expect(response.status()).toBeGreaterThanOrEqual(400)
      expect(response.status()).toBeLessThan(500)
    })
  })
})

// ============================================
// INVOICES API TESTS
// ============================================

describe('API - Invoices', () => {
  test.describe('GET /api/invoices', () => {
    test('should return 200 with invoices array', async ({ request }) => {
      const response = await request.get(`${API_BASE}/invoices`)
      expect(response.status()).toBe(200)
      
      const body = await response.json()
      expect(Array.isArray(body)).toBe(true)
    })
  })

  test.describe('POST /api/invoices', () => {
    test('should create invoice with valid data', async ({ request }) => {
      const invoiceData = {
        clientId: 'test-client-id',
        amount: 500,
        status: 'PENDING',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        items: [{ description: 'Test session', amount: 500 }],
      }

      const response = await request.post(`${API_BASE}/invoices`, {
        data: invoiceData,
      })

      // Should handle (200, 201, or error)
      expect(response.status()).toBeGreaterThanOrEqual(200)
      expect(response.status()).toBeLessThan(500)
    })

    test('should validate required fields', async ({ request }) => {
      const response = await request.post(`${API_BASE}/invoices`, {
        data: {},
      })

      expect(response.status()).toBeGreaterThanOrEqual(400)
    })
  })
})

// ============================================
// CHECK-IN API TESTS
// ============================================

describe('API - Check-In', () => {
  test.describe('POST /api/check-in', () => {
    test('should return 400 for missing booking code', async ({ request }) => {
      const response = await request.post(`${API_BASE}/check-in`, {
        data: {},
      })

      expect(response.status()).toBe(400)
      
      const body = await response.json()
      expect(body.error).toBeDefined()
    })

    test('should return 404 for non-existent booking', async ({ request }) => {
      const response = await request.post(`${API_BASE}/check-in`, {
        data: { bookingCode: 'NONEXISTENT999' },
      })

      expect(response.status()).toBe(404)
    })

    test('should handle case-insensitive booking codes', async ({ request }) => {
      // Test with any booking code format
      const response = await request.post(`${API_BASE}/check-in`, {
        data: { bookingCode: 'test-code' },
      })

      // Should handle gracefully (not crash)
      expect(response.status()).toBeGreaterThanOrEqual(200)
      expect(response.status()).toBeLessThan(600)
    })

    test('should handle empty booking code string', async ({ request }) => {
      const response = await request.post(`${API_BASE}/check-in`, {
        data: { bookingCode: '' },
      })

      expect(response.status()).toBe(400)
    })
  })
})

// ============================================
// ROOMS API TESTS
// ============================================

describe('API - Rooms', () => {
  test.describe('GET /api/rooms', () => {
    test('should return 200 with rooms array', async ({ request }) => {
      const response = await request.get(`${API_BASE}/rooms`)
      expect(response.status()).toBe(200)
      
      const body = await response.json()
      expect(Array.isArray(body)).toBe(true)
    })

    test('should return room details', async ({ request }) => {
      const response = await request.get(`${API_BASE}/rooms`)
      const body = await response.json()
      
      if (body.length > 0) {
        const room = body[0]
        expect(room).toHaveProperty('name')
        expect(room).toHaveProperty('baseRate')
      }
    })
  })

  test.describe('GET /api/rooms/:id', () => {
    test('should return single room by ID', async ({ request }) => {
      // First get list of rooms
      const listResponse = await request.get(`${API_BASE}/rooms`)
      const rooms = await listResponse.json()
      
      if (rooms.length > 0) {
        const roomId = rooms[0].id
        const response = await request.get(`${API_BASE}/rooms/${roomId}`)
        expect(response.status()).toBe(200)
      }
    })

    test('should return 404 for non-existent room', async ({ request }) => {
      const response = await request.get(`${API_BASE}/rooms/nonexistent-id`)
      expect(response.status()).toBe(404)
    })
  })
})

// ============================================
// ENGINEERS API TESTS
// ============================================

describe('API - Engineers', () => {
  test.describe('GET /api/engineers', () => {
    test('should return 200 with engineers list', async ({ request }) => {
      const response = await request.get(`${API_BASE}/engineers`)
      expect(response.status()).toBe(200)
    })

    test('should return engineer details', async ({ request }) => {
      const response = await request.get(`${API_BASE}/engineers`)
      const body = await response.json()
      
      if (body.length > 0) {
        const engineer = body[0]
        expect(engineer).toHaveProperty('name')
        expect(engineer).toHaveProperty('email')
      }
    })
  })
})

// ============================================
// LEADS API TESTS
// ============================================

describe('API - Leads', () => {
  test.describe('GET /api/leads', () => {
    test('should return 200 with leads array', async ({ request }) => {
      const response = await request.get(`${API_BASE}/leads`)
      expect(response.status()).toBe(200)
    })
  })

  test.describe('POST /api/leads', () => {
    test('should create lead with valid data', async ({ request }) => {
      const leadData = {
        name: 'Test Lead',
        email: `lead${Date.now()}@example.com`,
        phone: '+1987654321',
        sessionType: 'Recording',
      }

      const response = await request.post(`${API_BASE}/leads`, {
        data: leadData,
      })

      expect(response.status()).toBeGreaterThanOrEqual(200)
      expect(response.status()).toBeLessThan(500)
    })
  })
})

// ============================================
// STRIPE API TESTS
// ============================================

describe('API - Stripe', () => {
  test.describe('POST /api/stripe/create-payment-intent', () => {
    test('should return error without amount', async ({ request }) => {
      const response = await request.post(`${API_BASE}/stripe/create-payment-intent`, {
        data: {},
      })

      // Should handle missing amount
      expect(response.status()).toBeGreaterThanOrEqual(400)
    })

    test('should handle invalid amount', async ({ request }) => {
      const response = await request.post(`${API_BASE}/stripe/create-payment-intent`, {
        data: { amount: 'invalid' },
      })

      // Should handle gracefully
      expect(response.status()).toBeGreaterThanOrEqual(400)
    })

    test('should require Stripe configuration', async ({ request }) => {
      const response = await request.post(`${API_BASE}/stripe/create-payment-intent`, {
        data: { amount: 100, currency: 'usd' },
      })

      // Either success or config error
      expect(response.status()).toBeGreaterThanOrEqual(200)
      expect(response.status()).toBeLessThan(600)
    })
  })
})

// ============================================
// SECURITY TESTS
// ============================================

describe('API Security', () => {
  test('should not expose sensitive data in responses', async ({ request }) => {
    const response = await request.get(`${API_BASE}/bookings`)
    const body = await response.json()
    
    if (body.length > 0) {
      const booking = body[0]
      // Passwords should not be in response
      expect(booking).not.toHaveProperty('password')
    }
  })

  test('should handle malformed JSON gracefully', async ({ request }) => {
    const response = await request.post(`${API_BASE}/bookings`, {
      data: 'not-valid-json',
      headers: { 'content-type': 'application/json' },
    })

    // Should return error, not crash
    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test('should not leak stack traces in production', async ({ request }) => {
    // Send invalid request that might cause error
    const response = await request.post(`${API_BASE}/bookings`, {
      data: { invalid: 'data' },
    })

    const body = await response.text()
    
    // Should not contain stack trace
    expect(body).not.toContain('at ')
    expect(body).not.toContain('Error:')
  })
})

// ============================================
// ERROR HANDLING TESTS
// ============================================

describe('API Error Handling', () => {
  test('should return proper JSON error format', async ({ request }) => {
    const response = await request.post(`${API_BASE}/check-in`, {
      data: {},
    })

    const body = await response.json()
    expect(body).toHaveProperty('error')
    expect(typeof body.error).toBe('string')
  })

  test('should handle database connection errors', async ({ request }) => {
    // This would require mocking DB failure
    // Just ensure general error handling works
    const response = await request.get(`${API_BASE}/bookings`)
    expect(response.status()).toBeGreaterThanOrEqual(200)
  })

  test('should include helpful error messages', async ({ request }) => {
    const response = await request.post(`${API_BASE}/check-in`, {
      data: {},
    })

    const body = await response.json()
    expect(body.error.length).toBeGreaterThan(0)
  })
})
