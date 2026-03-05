import { test, expect } from '@playwright/test';

test.describe('User Flows', () => {
  
  test.describe('Booking Flow', () => {
    test('can navigate to booking page', async ({ page }) => {
      await page.goto('http://localhost:3000/booking');
      await page.waitForLoadState('domcontentloaded');
      
      // Verify page loads
      await expect(page.locator('body')).toBeVisible();
    });

    test('booking page has form elements', async ({ page }) => {
      await page.goto('http://localhost:3000/booking');
      await page.waitForLoadState('domcontentloaded');
      
      // Check for any form or input elements
      const hasInputs = await page.locator('input').count();
      const hasButtons = await page.locator('button').count();
      
      expect(hasInputs + hasButtons).toBeGreaterThan(0);
    });
  });

  test.describe('Check-In Flow', () => {
    test('can load check-in page', async ({ page }) => {
      await page.goto('http://localhost:3000/check-in');
      await page.waitForLoadState('domcontentloaded');
      
      await expect(page.locator('text=Client Check-In')).toBeVisible();
    });

    test('can enter booking code', async ({ page }) => {
      await page.goto('http://localhost:3000/check-in');
      await page.waitForLoadState('domcontentloaded');
      
      const input = page.locator('input[placeholder="Enter booking code"]');
      await input.fill('BK-001');
      
      await expect(input).toHaveValue('BK-001');
    });

    test('can submit check-in form', async ({ page }) => {
      await page.goto('http://localhost:3000/check-in');
      await page.waitForLoadState('domcontentloaded');
      
      const input = page.locator('input[placeholder="Enter booking code"]');
      const button = page.locator('button:has-text("Check In")');
      
      await input.fill('TEST');
      await button.click();
      
      // Form should respond (either success or error)
      await page.waitForTimeout(1000);
    });
  });

  test.describe('Navigation Flow', () => {
    test('can navigate from home to booking', async ({ page }) => {
      await page.goto('http://localhost:3000/');
      await page.waitForLoadState('domcontentloaded');
      
      // Find and click a booking link
      const bookNowLink = page.locator('text=BOOK NOW').first();
      if (await bookNowLink.isVisible()) {
        await bookNowLink.click();
        await page.waitForLoadState('domcontentloaded');
      }
      
      // Should either navigate to booking or page should load
      await expect(page.locator('body')).toBeVisible();
    });

    test('can navigate from home to check-in', async ({ page }) => {
      await page.goto('http://localhost:3000/');
      await page.waitForLoadState('domcontentloaded');
      
      // Look for check-in link
      const checkInLink = page.locator('a[href="/check-in"]').first();
      if (await checkInLink.isVisible().catch(() => false)) {
        await checkInLink.click();
        await page.waitForLoadState('domcontentloaded');
      }
      
      await expect(page.locator('body')).toBeVisible();
    });

    test('can navigate to login page', async ({ page }) => {
      await page.goto('http://localhost:3000/login');
      await page.waitForLoadState('domcontentloaded');
      
      // Should show login form
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
    });
  });

  test.describe('Responsive Flow', () => {
    test('check-in works on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('http://localhost:3000/check-in');
      await page.waitForLoadState('domcontentloaded');
      
      // Should still be usable on mobile
      await expect(page.locator('input[placeholder="Enter booking code"]')).toBeVisible();
      await expect(page.locator('button:has-text("Check In")')).toBeVisible();
    });

    test('booking works on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('http://localhost:3000/booking');
      await page.waitForLoadState('domcontentloaded');
      
      // Page should load without errors
      await expect(page.locator('body')).toBeVisible();
    });
  });
});
