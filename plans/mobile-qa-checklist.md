# Mobile QA Checklist

## Scope
This checklist covers smoke-level mobile layout QA for the following critical routes:

- `/`
- `/booking`
- `/check-in`
- `/dashboard`
- `/dashboard/bookings`
- `/dashboard/inventory`
- `/dashboard/reports`

## Breakpoints
Run checks at each breakpoint width with a mobile-friendly height (e.g. 900px):

- `320`
- `375`
- `390`
- `768`

## Acceptance Checks
Apply these checks on every route and breakpoint unless intentionally exempted.

### 1) No horizontal scroll
- Confirm `document.documentElement.scrollWidth <= window.innerWidth`.
- Exception: intentionally scrollable table wrappers (`overflow-x-auto`) are allowed.
- Reject if page-level or body-level horizontal overflow appears.

### 2) Tap target size and spacing
- Primary actions (buttons, menu toggles, links used as buttons) should be comfortably tappable.
- Minimum target size guideline: approximately `40px` on at least one axis.
- Verify key actions are not overlapping and remain reachable without accidental taps.

### 3) Readable typography
- Validate body/base text remains readable on small screens.
- Ensure text does not collapse to unreadable size (generally not below ~`14px`).
- Confirm headings and labels remain legible and not clipped.

### 4) Action bars stack/wrap properly
- Multi-action sections should stack or wrap on narrow viewports.
- Confirm action controls do not overflow container bounds.
- For booking flow, previous/next actions should remain visible and usable at 320px.

### 5) Dialogs fit viewport
- Any open dialog (`[role="dialog"]`) must fit inside viewport width/height.
- No clipped close buttons or inaccessible actions.
- Background overlay should not trap hidden off-screen content.

## Route-specific smoke expectations

### Public routes
- `/`: hero content visible; key CTAs visible and tappable.
- `/booking`: step indicator and navigation actions visible; action bar responsive.
- `/check-in`: heading, booking code input, and check-in button visible.

### Dashboard routes
- Mobile menu toggle visible on small breakpoints.
- Opening menu reveals sidebar navigation and primary destination links.
- Route-specific key controls are visible (e.g., New Booking, Add Item, Generate Report).

## Automation mapping
Automated smoke checks live in:

- `tests/public/mobile-layout.spec.ts`
- `tests/dashboard/mobile-layout.spec.ts`
- shared helpers: `tests/helpers/mobile-layout.ts`
