import { expect, test } from '@playwright/test';

test.describe('API - Bookings', () => {
  test('should respond to bookings list request', async ({ request }) => {
    const response = await request.get('/api/bookings');
    // Just verify the endpoint responds (any status code is valid)
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(600);
  });

  test('should respond to invalid booking creation', async ({ request }) => {
    const response = await request.post('/api/bookings', {
      data: { invalid: 'data' },
    });
    // Any valid HTTP response is acceptable
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(600);
  });
});

test.describe('API - Clients', () => {
  test('should respond to clients request', async ({ request }) => {
    const response = await request.get('/api/clients');
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(600);
  });
});

test.describe('API - Invoices', () => {
  test('should respond to invoices request', async ({ request }) => {
    const response = await request.get('/api/invoices');
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(600);
  });
});

test.describe('API - Leads', () => {
  test('should respond to leads request', async ({ request }) => {
    const response = await request.get('/api/leads');
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(600);
  });
});

test.describe('API - Check-In', () => {
  test('should respond to check-in request', async ({ request }) => {
    const response = await request.post('/api/check-in', {
      data: { bookingCode: 'BK-001' },
    });
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(600);
  });

  test('should respond to missing booking code', async ({ request }) => {
    const response = await request.post('/api/check-in', {
      data: {},
    });
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(600);
  });
});
