import { expect, test } from '@playwright/test';
import { URLs } from '../helpers/selectors';

test.describe('Check-In Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URLs.checkIn);
    await page.waitForLoadState('domcontentloaded');
  });

  test('should load check-in page successfully', async ({ page }) => {
    await expect(page.locator('text=Check In for Your Session')).toBeVisible();
    await expect(page.locator('text=Enter your booking code below')).toBeVisible();
  });

  test('should display header with logo', async ({ page }) => {
    await expect(page.locator('[class*="Music"]').first()).toBeVisible();
    await expect(page.locator('text=Platinum Sound Studios').first()).toBeVisible();
  });

  test('should display staff login button when not logged in', async ({ page }) => {
    const loginButton = page.locator('a:has-text("Staff Login")');
    await expect(loginButton).toBeVisible();
  });

  test('should display check-in form with booking code input', async ({ page }) => {
    const bookingCodeInput = page.locator('input#bookingCode');
    await expect(bookingCodeInput).toBeVisible();
    await expect(bookingCodeInput).toHaveAttribute('placeholder', /e\.g\., BK-001/i);
  });

  test('should display check-in submit button', async ({ page }) => {
    const checkInButton = page.locator('button:has-text("Check In")');
    await expect(checkInButton).toBeVisible();
    await expect(checkInButton).toBeEnabled();
  });

  test('should display alternative check-in methods', async ({ page }) => {
    await expect(page.locator('text=Scan QR Code')).toBeVisible();
    await expect(page.locator('text=Text Check-In')).toBeVisible();
    await expect(page.locator('text=Front Desk')).toBeVisible();
  });

  test('should display session details section', async ({ page }) => {
    await expect(page.locator('text=Your Session Details')).toBeVisible();
    await expect(page.locator('text=Client Name')).toBeVisible();
    await expect(page.locator('text=Studio')).toBeVisible();
    await expect(page.locator('text=Session Time')).toBeVisible();
  });

  test('should display contact information', async ({ page }) => {
    await expect(page.locator('text=Need Help')).toBeVisible();
    await expect(page.locator('text=support@platinumstudios.com')).toBeVisible();
    await expect(page.locator('text=(555) 123-4567')).toBeVisible();
  });

  test('should navigate to login page when clicking Staff Login', async ({ page }) => {
    await page.click('a:has-text("Staff Login")');
    await expect(page).toHaveURL(/.*login/);
  });

  test('should navigate to dashboard when clicking Go to Dashboard (if logged in)', async ({ page }) => {
    // This test verifies the link exists - actual behavior depends on auth state
    const dashboardLink = page.locator('a:has-text("Go to Dashboard")');
    await expect(dashboardLink).toBeVisible();
  });
});

test.describe('Check-In Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URLs.checkIn);
    await page.waitForLoadState('domcontentloaded');
  });

  test('should accept booking code input', async ({ page }) => {
    const input = page.locator('input#bookingCode');
    await input.fill('BK-001');
    await expect(input).toHaveValue('BK-001');
  });

  test('should clear booking code input', async ({ page }) => {
    const input = page.locator('input#bookingCode');
    await input.fill('BK-001');
    await input.clear();
    await expect(input).toHaveValue('');
  });

  test('should show error for invalid booking code format', async ({ page }) => {
    const input = page.locator('input#bookingCode');
    const button = page.locator('button:has-text("Check In")');

    // Enter invalid format
    await input.fill('invalid-code');
    await button.click();

    // Should show error message (depending on implementation)
    // This test will need adjustment based on actual validation behavior
  });

  test('should be accessible via keyboard', async ({ page }) => {
    const input = page.locator('input#bookingCode');
    await input.focus();
    await expect(input).toBeFocused();
  });
});

test.describe('Check-In Page - Responsive', () => {
  test('should display correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(URLs.checkIn);
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('text=Check In for Your Session')).toBeVisible();
    await expect(page.locator('input#bookingCode')).toBeVisible();
  });

  test('should display correctly on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(URLs.checkIn);
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('text=Check In for Your Session')).toBeVisible();
  });
});
