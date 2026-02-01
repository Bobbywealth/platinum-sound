export const URLs = {
  home: "/",
  login: "/login",
  checkIn: "/check-in",
  dashboard: "/dashboard",
  dashboardBookings: "/dashboard/bookings",
  dashboardClients: "/dashboard/clients",
  dashboardInvoices: "/dashboard/invoices",
  dashboardSchedule: "/dashboard/schedule",
  dashboardSettings: "/dashboard/settings",
}

export const selectors = {
  // Navigation
  navLogo: '[class*="Music"]',
  navBrand: "text=Platinum Sound",
  staffLoginButton: 'a:has-text("Staff Login")',
  dashboardLink: 'a:has-text("Go to Dashboard")',

  // Check-in page
  checkInTitle: "text=Check In for Your Session",
  bookingCodeInput: "input#bookingCode",
  checkInButton: 'button:has-text("Check In")',
  sessionDetailsSection: "text=Your Session Details",
  needHelpSection: "text=Need Help",

  // Forms
  emailInput: 'input[type="email"]',
  passwordInput: 'input[type="password"]',
  signInButton: 'button:has-text("Sign In")',

  // Dashboard
  dashboardStats: '[class*="grid"]',
  todaySessions: "text=Today's Sessions",
  upcomingBookings: "text=Upcoming Bookings",

  // Alternative check-in methods
  qrCodeOption: "text=Scan QR Code",
  textCheckInOption: "text=Text Check-In",
  frontDeskOption: "text=Front Desk",

  // Session details
  clientNameField: "text=Client Name",
  studioField: "text=Studio",
  sessionTimeField: "text=Session Time",

  // Contact info
  supportEmail: "text=support@platinumsound.com",
  supportPhone: "text=(555) 123-4567",
}
