import { expect, test, Page } from '@playwright/test'
import {
  expectControlsInViewport,
  expectMinimumTapTarget,
  expectNoHorizontalScroll,
  expectReadableTypography,
  expectVisibleDialogsToFitViewport,
  gotoAtWidth,
  MOBILE_BREAKPOINTS,
} from '../helpers/mobile-layout'

const dashboardRoutes = [
  { route: '/dashboard', heading: 'text=Overview', controls: ['text=Total Revenue'] },
  { route: '/dashboard/bookings', heading: 'text=Bookings', controls: ['button:has-text("New Booking")'] },
  { route: '/dashboard/inventory', heading: 'text=Inventory', controls: ['button:has-text("Add Item")'] },
  { route: '/dashboard/reports', heading: 'text=Reports', controls: ['button:has-text("Generate Report")'] },
]

async function loginAsAdmin(page: Page) {
  await page.goto('/login')
  await page.fill('#email', 'admin@platinumsound.com')
  await page.fill('#password', 'admin123')
  await page.click('button:has-text("Sign In")')
  await page.waitForURL('**/dashboard')
}

test.describe('Dashboard mobile smoke layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 })
    await loginAsAdmin(page)
  })

  for (const width of MOBILE_BREAKPOINTS) {
    for (const routeConfig of dashboardRoutes) {
      test(`${routeConfig.route} renders cleanly at ${width}px`, async ({ page }) => {
        await gotoAtWidth(page, routeConfig.route, width)

        await expect(page.locator(routeConfig.heading).first()).toBeVisible()
        await expectNoHorizontalScroll(page)
        await expectControlsInViewport(page, routeConfig.controls)
        await expectMinimumTapTarget(page, 'button:has(svg.lucide-menu)')
        await expectReadableTypography(page)
        await expectVisibleDialogsToFitViewport(page)

        const mobileMenuButton = page.locator('button:has(svg.lucide-menu)').first()
        await expect(mobileMenuButton).toBeVisible()
        await mobileMenuButton.click()

        const mobileSidebar = page.locator('aside:has-text("Platinum Sound")').first()
        await expect(mobileSidebar).toBeVisible()
        await expect(mobileSidebar.locator('text=Bookings')).toBeVisible()
      })
    }
  }
})
