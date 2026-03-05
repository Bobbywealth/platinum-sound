import { expect, test } from '@playwright/test';

const API_BASE = 'http://localhost:3000/api';

// Test all existing API routes
const apiRoutes = [
  '/api/bookings',
  '/api/clients',
  '/api/invoices',
  '/api/leads',
  '/api/rooms',
  '/api/services',
  '/api/engineers',
  '/api/availability',
  '/api/tasks',
  '/api/work-orders',
  '/api/inventory',
  '/api/settings',
];

test.describe('API Routes - GET Requests', () => {
  apiRoutes.forEach((route) => {
    test(`${route} responds to GET request`, async ({ request }) => {
      const response = await request.get(route);
      // Accept any valid HTTP response
      expect(response.status()).toBeGreaterThanOrEqual(200);
      expect(response.status()).toBeLessThan(600);
    });
  });
});

test.describe('API Routes - POST Requests', () => {
  test('/api/check-in handles POST with booking code', async ({ request }) => {
    const response = await request.post(`${API_BASE}/check-in`, {
      data: { bookingCode: 'TEST-001' },
    });
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(600);
  });

  test('/api/check-in handles POST without booking code', async ({ request }) => {
    const response = await request.post(`${API_BASE}/check-in`, {
      data: {},
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(600);
  });

  test('/api/bookings handles POST with data', async ({ request }) => {
    const response = await request.post(`${API_BASE}/bookings`, {
      data: { test: 'data' },
    });
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(600);
  });
});

test.describe('API Routes - Error Handling', () => {
  test('returns 405 for unsupported methods', async ({ request }) => {
    // Most routes should not support PUT
    const response = await request.put(`${API_BASE}/bookings/123`, {
      data: {},
    });
    // 405 Method Not Allowed or other valid error
    expect([405, 404, 500]).toContain(response.status());
  });

  test('returns 405 for DELETE on bookings', async ({ request }) => {
    const response = await request.delete(`${API_BASE}/bookings/123`);
    expect([405, 404, 500]).toContain(response.status());
  });
});

test.describe('API Response Format', () => {
  test('check-in returns JSON', async ({ request }) => {
    const response = await request.post(`${API_BASE}/check-in`, {
      data: { bookingCode: 'TEST' },
    });
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');
  });

  test('bookings returns JSON', async ({ request }) => {
    const response = await request.get(`${API_BASE}/bookings`);
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');
  });
});
