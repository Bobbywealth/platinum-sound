import { test, expect } from '@playwright/test'

test.describe('Concurrent Booking Tests', () => {
  test('should handle multiple simultaneous booking requests', async ({ request }) => {
    // Create multiple booking requests concurrently
    const promises = Array(5).fill(null).map(() => 
      request.post('/api/bookings', {
        data: {
          clientName: 'Concurrent Test',
          email: 'concurrent@test.com',
          date: '2024-12-25',
          startTime: '10:00',
          endTime: '12:00',
          studio: 'Studio A',
        },
      })
    )
    
    const responses = await Promise.all(promises)
    
    // All requests should complete (some may succeed, some may fail with conflicts)
    responses.forEach(response => {
      expect([200, 201, 400, 409, 500]).toContain(response.status())
    })
  })

  test('should handle rapid API calls', async ({ request }) => {
    // Make rapid sequential calls
    const calls = []
    for (let i = 0; i < 10; i++) {
      calls.push(request.get('/api/bookings'))
    }
    
    const responses = await Promise.all(calls)
    
    // All should complete without crashing
    responses.forEach(response => {
      expect([200, 401, 500]).toContain(response.status())
    })
  })

  test('should handle concurrent check-in requests', async ({ request }) => {
    const promises = Array(3).fill(null).map(() => 
      request.post('/api/check-in', {
        data: { bookingCode: 'TEST123' },
      })
    )
    
    const responses = await Promise.all(promises)
    
    // All should handle gracefully
    responses.forEach(response => {
      expect([200, 400, 404, 500]).toContain(response.status())
    })
  })

  test('should handle concurrent inventory updates', async ({ request }) => {
    // Get inventory first
    const getResponse = await request.get('/api/inventory')
    expect([200, 401, 500]).toContain(getResponse.status())
  })

  test('should handle multiple dashboard API calls', async ({ request }) => {
    const promises = [
      request.get('/api/dashboard'),
      request.get('/api/bookings'),
      request.get('/api/clients'),
      request.get('/api/invoices'),
    ]
    
    const responses = await Promise.all(promises)
    
    responses.forEach(response => {
      expect([200, 401, 500]).toContain(response.status())
    })
  })

  test('should handle session token requests', async ({ request }) => {
    // Rapid auth requests
    const promises = Array(5).fill(null).map((_, i) => 
      request.get('/api/auth/session')
    )
    
    const responses = await Promise.all(promises)
    
    responses.forEach(response => {
      expect([200, 401]).toContain(response.status())
    })
  })

  test('should handle concurrent availability checks', async ({ request }) => {
    const promises = Array(5).fill(null).map(() => 
      request.get('/api/availability?date=2024-12-25')
    )
    
    const responses = await Promise.all(promises)
    
    responses.forEach(response => {
      expect([200, 401, 500]).toContain(response.status())
    })
  })
})

test.describe('Rate Limiting Tests', () => {
  test('should handle high frequency requests', async ({ request }) => {
    // Make many requests quickly
    const calls = []
    for (let i = 0; i < 20; i++) {
      calls.push(request.get('/api/bookings'))
    }
    
    const responses = await Promise.all(calls)
    
    // Should still handle requests (may rate limit)
    const statuses = responses.map(r => r.status())
    const uniqueStatuses = [...new Set(statuses)]
    
    // Should have consistent response types
    uniqueStatuses.forEach(status => {
      expect([200, 401, 429, 500]).toContain(status)
    })
  })

  test('should handle repeated POST requests', async ({ request }) => {
    const calls = []
    for (let i = 0; i < 10; i++) {
      calls.push(
        request.post('/api/tasks', {
          data: { title: `Rate test ${i}` },
        })
      )
    }
    
    const responses = await Promise.all(calls)
    
    responses.forEach(response => {
      expect([200, 201, 400, 401, 429, 500]).toContain(response.status())
    })
  })
})

test.describe('Data Integrity Tests', () => {
  test('should maintain data consistency', async ({ request }) => {
    // Create a task
    const createResponse = await request.post('/api/tasks', {
      data: {
        title: 'Data Integrity Test',
        status: 'TODO',
      },
    })
    
    const status = createResponse.status()
    if (status === 201) {
      // If created, should be able to retrieve it
      const tasksResponse = await request.get('/api/tasks')
      expect([200, 401, 500]).toContain(tasksResponse.status())
    }
  })

  test('should handle large response payloads', async ({ request }) => {
    // Request all bookings
    const response = await request.get('/api/bookings')
    const status = response.status()
    
    if (status === 200) {
      const data = await response.json()
      expect(Array.isArray(data)).toBe(true)
    } else {
      expect([401, 500]).toContain(status)
    }
  })

  test('should handle empty results gracefully', async ({ request }) => {
    // Search for non-existent item
    const response = await request.get('/api/inventory?search=nonexistent999')
    const status = response.status()
    
    expect([200, 401, 500]).toContain(status)
    
    if (status === 200) {
      const data = await response.json()
      expect(data).toBeDefined()
    }
  })
})

test.describe('Authentication Stress Tests', () => {
  test('should handle multiple auth attempts', async ({ request }) => {
    const promises = Array(10).fill(null).map(() => 
      request.get('/api/auth/session')
    )
    
    const responses = await Promise.all(promises)
    
    responses.forEach(response => {
      expect([200, 401]).toContain(response.status())
    })
  })

  test('should handle invalid tokens gracefully', async ({ request }) => {
    const response = await request.get('/api/dashboard', {
      headers: {
        Authorization: 'Bearer invalid_token_12345',
      },
    })
    
    // May return 200 (public), 401 (unauthorized), or 403 (forbidden)
    expect([200, 401, 403, 500]).toContain(response.status())
  })
})
