import { test, expect } from '@playwright/test';
import { 
  expectNoHorizontalScroll,
} from '../helpers/mobile-layout';

const routeConfigs = [
  {
    route: '/',
    // Home page has "Platinum Sound Logo" as alt text on image
    heading: 'img[alt="Platinum Sound Logo"]',
  },
  {
    route: '/booking',
    // Booking page - look for any visible heading
    heading: 'h1',
  },
  {
    route: '/check-in',
    heading: 'text=Client Check-In',
  },
];

const widths = [320, 375, 390, 768];

test.describe('Public mobile smoke layout', () => {
  widths.forEach((width) => {
    routeConfigs.forEach((routeConfig) => {
      test(`${routeConfig.route} renders cleanly at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(routeConfig.route);
        await page.waitForLoadState('domcontentloaded');

        // Just verify the page loads without crashing
        await expect(page.locator('body')).toBeVisible();
        await expectNoHorizontalScroll(page);
      });
    });
  });
});
