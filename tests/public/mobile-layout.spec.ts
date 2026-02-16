import { expect, test } from '@playwright/test'
import {
  expectControlsInViewport,
  expectMinimumTapTarget,
  expectNoHorizontalScroll,
  expectReadableTypography,
  expectVisibleDialogsToFitViewport,
  gotoAtWidth,
  MOBILE_BREAKPOINTS,
} from '../helpers/mobile-layout'

const publicRouteChecks: Array<{
  route: string
  heading: string
  controls: string[]
  primaryTapTarget: string
}> = [
  {
    route: '/',
    heading: 'text=PLATINUM SOUNDS',
    controls: ['a:has-text("Book a Session")', 'a:has-text("Log In")'],
    primaryTapTarget: 'a:has-text("Book a Session")',
  },
  {
    route: '/booking',
    heading: 'text=Step 1 of 5',
    controls: ['button:has-text("Next")'],
    primaryTapTarget: 'button:has-text("Next")',
  },
  {
    route: '/check-in',
    heading: 'text=Check In for Your Session',
    controls: ['input#bookingCode', 'button:has-text("Check In")'],
    primaryTapTarget: 'button:has-text("Check In")',
  },
]

test.describe('Public mobile smoke layout', () => {
  for (const width of MOBILE_BREAKPOINTS) {
    for (const routeConfig of publicRouteChecks) {
      test(`${routeConfig.route} renders cleanly at ${width}px`, async ({ page }) => {
        await gotoAtWidth(page, routeConfig.route, width)

        await expect(page.locator(routeConfig.heading).first()).toBeVisible()
        await expectNoHorizontalScroll(page)
        await expectControlsInViewport(page, routeConfig.controls)
        await expectMinimumTapTarget(page, routeConfig.primaryTapTarget)
        await expectReadableTypography(page)
        await expectVisibleDialogsToFitViewport(page)
      })
    }
  }

  test('booking action bar stacks/wraps on mobile', async ({ page }) => {
    await gotoAtWidth(page, '/booking', 320)

    const previousButton = page.locator('button:has-text("Previous")')
    const nextButton = page.locator('button:has-text("Next")')

    await expect(previousButton).toBeVisible()
    await expect(nextButton).toBeVisible()

    const previousBox = await previousButton.boundingBox()
    const nextBox = await nextButton.boundingBox()

    expect(previousBox).not.toBeNull()
    expect(nextBox).not.toBeNull()
    if (!previousBox || !nextBox) return

    expect(nextBox.y).toBeGreaterThanOrEqual(previousBox.y)
  })
})
