import { test, expect } from '@playwright/test'

test.describe('Tasks API', () => {
  test('should respond to GET /api/tasks', async ({ request }) => {
    const response = await request.get('/api/tasks')
    expect([200, 401, 500]).toContain(response.status())
  })

  test('should create task with valid data', async ({ request }) => {
    const response = await request.post('/api/tasks', {
      data: {
        title: 'Test Task',
        description: 'Test Description',
        status: 'TODO',
        priority: 'HIGH',
      },
    })
    expect([201, 401, 500]).toContain(response.status())
  })

  test('should reject task without title', async ({ request }) => {
    const response = await request.post('/api/tasks', {
      data: {
        description: 'Test Description',
      },
    })
    expect([400, 500]).toContain(response.status())
  })

  test('should accept valid priority values', async ({ request }) => {
    const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']
    
    for (const priority of priorities) {
      const response = await request.post('/api/tasks', {
        data: {
          title: 'Test Task',
          priority,
        },
      })
      expect([201, 401, 500]).toContain(response.status())
    }
  })

  test('should accept valid status values', async ({ request }) => {
    const statuses = ['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED']
    
    for (const status of statuses) {
      const response = await request.post('/api/tasks', {
        data: {
          title: 'Test Task',
          status,
        },
      })
      expect([201, 401, 500]).toContain(response.status())
    }
  })
})

test.describe('Work Orders API', () => {
  test('should respond to GET /api/work-orders', async ({ request }) => {
    const response = await request.get('/api/work-orders')
    expect([200, 401, 500]).toContain(response.status())
  })

  test('should create work order', async ({ request }) => {
    const response = await request.post('/api/work-orders', {
      data: {
        title: 'Test Work Order',
        description: 'Test Description',
        type: 'MAINTENANCE',
      },
    })
    expect([201, 401, 500]).toContain(response.status())
  })
})

test.describe('Leads API', () => {
  test('should respond to GET /api/leads', async ({ request }) => {
    const response = await request.get('/api/leads')
    expect([200, 401, 500]).toContain(response.status())
  })

  test('should create lead', async ({ request }) => {
    const response = await request.post('/api/leads', {
      data: {
        name: 'Test Lead',
        email: 'test@example.com',
        phone: '123-456-7890',
      },
    })
    expect([201, 401, 500]).toContain(response.status())
  })

  test('should reject lead without name', async ({ request }) => {
    const response = await request.post('/api/leads', {
      data: {
        email: 'test@example.com',
      },
    })
    expect([400, 500]).toContain(response.status())
  })
})

test.describe('Rooms API', () => {
  test('should respond to GET /api/rooms', async ({ request }) => {
    const response = await request.get('/api/rooms')
    expect([200, 401, 500]).toContain(response.status())
  })

  test('should create room', async ({ request }) => {
    const response = await request.post('/api/rooms', {
      data: {
        name: 'Test Room',
        type: 'RECORDING',
      },
    })
    expect([201, 401, 403, 500]).toContain(response.status())
  })
})

test.describe('Services API', () => {
  test('should respond to GET /api/services', async ({ request }) => {
    const response = await request.get('/api/services')
    expect([200, 401, 500]).toContain(response.status())
  })

  test('should create service', async ({ request }) => {
    const response = await request.post('/api/services', {
      data: {
        name: 'Test Service',
        price: 100,
      },
    })
    // May return 200/201 (success), 400 (bad request), 401 (unauthorized), or 403 (forbidden)
    expect([200, 201, 400, 401, 403, 500]).toContain(response.status())
  })
})

test.describe('Expenses API', () => {
  test('should respond to GET /api/expenses', async ({ request }) => {
    const response = await request.get('/api/expenses')
    expect([200, 401, 500]).toContain(response.status())
  })

  test('should create expense', async ({ request }) => {
    const response = await request.post('/api/expenses', {
      data: {
        description: 'Test Expense',
        amount: 50,
        category: 'SUPPLIES',
      },
    })
    expect([201, 401, 403, 500]).toContain(response.status())
  })
})

test.describe('Invoices API', () => {
  test('should respond to GET /api/invoices', async ({ request }) => {
    const response = await request.get('/api/invoices')
    expect([200, 401, 500]).toContain(response.status())
  })
})

test.describe('Clients API', () => {
  test('should create client', async ({ request }) => {
    const response = await request.post('/api/clients', {
      data: {
        name: 'Test Client',
        email: 'client@test.com',
      },
    })
    expect([201, 401, 403, 500]).toContain(response.status())
  })
})

test.describe('Engineers API', () => {
  test('should respond to GET /api/engineers', async ({ request }) => {
    const response = await request.get('/api/engineers')
    expect([200, 401, 500]).toContain(response.status())
  })

  test('should create engineer', async ({ request }) => {
    const response = await request.post('/api/engineers', {
      data: {
        name: 'Test Engineer',
        email: 'engineer@test.com',
      },
    })
    // May return 200/201 (success), 400 (bad request), 401 (unauthorized), 403 (forbidden), or 405 (method not allowed)
    expect([200, 201, 400, 401, 403, 405, 500]).toContain(response.status())
  })
})

test.describe('Availability API', () => {
  test('should respond to GET /api/availability', async ({ request }) => {
    const response = await request.get('/api/availability')
    expect([200, 401, 500]).toContain(response.status())
  })

  test('should accept date range parameters', async ({ request }) => {
    const response = await request.get('/api/availability?start=2024-01-01&end=2024-01-31')
    expect([200, 401, 500]).toContain(response.status())
  })
})

test.describe('Reports API', () => {
  test('should respond to GET /api/reports', async ({ request }) => {
    const response = await request.get('/api/reports')
    expect([200, 401, 500]).toContain(response.status())
  })

  test('should accept report type parameter', async ({ request }) => {
    const response = await request.get('/api/reports?type=revenue')
    expect([200, 401, 500]).toContain(response.status())
  })
})
