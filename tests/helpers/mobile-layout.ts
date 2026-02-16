import { expect, Page } from '@playwright/test'

export const MOBILE_BREAKPOINTS = [320, 375, 390, 768]

export async function gotoAtWidth(page: Page, route: string, width: number) {
  await page.setViewportSize({ width, height: 900 })
  await page.goto(route)
  await page.waitForLoadState('domcontentloaded')
}

export async function expectNoHorizontalScroll(page: Page) {
  const hasHorizontalOverflow = await page.evaluate(() => {
    const doc = document.documentElement
    return doc.scrollWidth > window.innerWidth + 1
  })

  expect(hasHorizontalOverflow).toBeFalsy()
}

export async function expectControlsInViewport(page: Page, selectors: string[]) {
  for (const selector of selectors) {
    const locator = page.locator(selector).first()
    await expect(locator).toBeVisible()
    const box = await locator.boundingBox()
    expect(box).not.toBeNull()
    if (!box) continue
    expect(box.x).toBeGreaterThanOrEqual(0)
    expect(box.y).toBeGreaterThanOrEqual(0)
    expect(box.x + box.width).toBeLessThanOrEqual(page.viewportSize()!.width)
    expect(box.y + box.height).toBeLessThanOrEqual(page.viewportSize()!.height + 400)
  }
}

export async function expectMinimumTapTarget(page: Page, selector: string, min = 40) {
  const locator = page.locator(selector).first()
  await expect(locator).toBeVisible()
  const box = await locator.boundingBox()
  expect(box).not.toBeNull()
  if (!box) return
  expect(Math.max(box.width, box.height)).toBeGreaterThanOrEqual(min)
}

export async function expectReadableTypography(page: Page, selector = 'body', minPx = 14) {
  const size = await page.locator(selector).first().evaluate((element) => {
    const fontSize = window.getComputedStyle(element).fontSize
    return Number.parseFloat(fontSize)
  })

  expect(size).toBeGreaterThanOrEqual(minPx)
}

export async function expectVisibleDialogsToFitViewport(page: Page) {
  const dialogs = page.locator('[role="dialog"]:visible')
  const count = await dialogs.count()

  for (let i = 0; i < count; i += 1) {
    const box = await dialogs.nth(i).boundingBox()
    if (!box) continue
    expect(box.width).toBeLessThanOrEqual(page.viewportSize()!.width)
    expect(box.height).toBeLessThanOrEqual(page.viewportSize()!.height)
  }
}
