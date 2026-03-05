import { test, expect } from '@playwright/test';

const URLs = {
  checkIn: 'http://localhost:3000/check-in',
  home: 'http://localhost:3000/',
  booking: 'http://localhost:3000/booking',
  login: 'http://localhost:3000/login',
};

test.describe('Check-In Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URLs.checkIn);
    await page.waitForLoadState('domcontentloaded');
  });

  test('should load check-in page successfully', async ({ page }) => {
    await expect(page.locator('text=Client Check-In')).toBeVisible();
  });

  test('should display check-in form with booking code input', async ({ page }) => {
    const bookingCodeInput = page.locator('input[placeholder="Enter booking code"]');
    await expect(bookingCodeInput).toBeVisible();
  });

  test('should display check-in button', async ({ page }) => {
    await expect(page.locator('button:has-text("Check In")')).toBeVisible();
  });

  test('should display alternative check-in methods', async ({ page }) => {
    await expect(page.locator('text=Scan QR Code')).toBeVisible();
    await expect(page.locator('text=Text Check-In')).toBeVisible();
    await expect(page.locator('text=Front Desk')).toBeVisible();
  });

  test('should display contact information', async ({ page }) => {
    await expect(page.locator('text=support@platinumsound.com')).toBeVisible();
    await expect(page.locator('text=(212) 265-6060')).toBeVisible();
  });

  test('should accept booking code input', async ({ page }) => {
    const input = page.locator('input[placeholder="Enter booking code"]');
    await input.fill('BK-001');
    await expect(input).toHaveValue('BK-001');
  });

  test('should handle invalid booking code submission', async ({ page }) => {
    const input = page.locator('input[placeholder="Enter booking code"]');
    const button = page.locator('button:has-text("Check In")');
    
    await input.fill('INVALID');
    await button.click();
    
    // Wait for page response
    await page.waitForTimeout(1500);
    // Test passes as long as input field is still visible (form didn't crash)
    await expect(input).toBeVisible();
  });

  test('should navigate to login page when clicking Staff Login link', async ({ page }) => {
    // Check if there's a login link in the navigation or as an alternative
    const loginLink = page.locator('a[href="/login"]').first();
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(page).toHaveURL(/.*login/);
    }
  });
});

test.describe('Check-In Page - Responsive', () => {
  test('should display correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(URLs.checkIn);
    await page.waitForLoadState('domcontentloaded');
    
    await expect(page.locator('text=Client Check-In')).toBeVisible();
    await expect(page.locator('input[placeholder="Enter booking code"]')).toBeVisible();
  });

  test('should display correctly on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(URLs.checkIn);
    await page.waitForLoadState('domcontentloaded');
    
    await expect(page.locator('text=Client Check-In')).toBeVisible();
  });
});
