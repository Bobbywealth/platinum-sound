import { test, expect } from '@playwright/test';
import { 
  expectNoHorizontalScroll,
  expectControlsInViewport,
  expectMinimumTapTarget,
} from '../helpers/mobile-layout';

// Note: Dashboard tests require authentication. 
// These tests verify the login page loads correctly.

const routeConfigs = [
  {
    route: '/login',
    heading: 'text=Sign In',
    controls: ['input[type="email"]', 'input[type="password"]'],
    primaryTapTarget: 'button:has-text("Sign In")',
  },
];

const widths = [320, 375, 390, 768];

test.describe('Dashboard mobile smoke layout', () => {
  widths.forEach((width) => {
    routeConfigs.forEach((routeConfig) => {
      test(`${routeConfig.route} renders cleanly at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(routeConfig.route);
        await page.waitForLoadState('domcontentloaded');

        await expect(page.locator(routeConfig.heading).first()).toBeVisible();
        await expectNoHorizontalScroll(page);
      });
    });
  });
});
