/**
 * Test Database Setup/Teardown Utilities
 * Provides isolated test database operations for integration testing
 */

import { PrismaClient, Role, BookingStatus, ClientStatus, Studio, SessionType, SessionMode, InvoiceStatus, RoomStatus } from '@prisma/client'

const prisma = new PrismaClient()

export const testDb = {
  /**
   * Clean all data from the test database
   * WARNING: Only use in test environments
   */
  async clean() {
    // Delete in correct order to respect foreign keys
    await prisma.bookingMicAddOn.deleteMany()
    await prisma.sessionExtension.deleteMany()
    await prisma.paymentSplit.deleteMany()
    await prisma.bookingAuthorization.deleteMany()
    await prisma.bookingRoom.deleteMany()
    await prisma.referral.deleteMany()
    await prisma.booking.deleteMany()
    await prisma.invoice.deleteMany()
    await prisma.expense.deleteMany()
    await prisma.roomLockout.deleteMany()
    await prisma.engineerAvailability.deleteMany()
    await prisma.roomAssignment.deleteMany()
    await prisma.engineerRate.deleteMany()
    await prisma.roomPricing.deleteMany()
    await prisma.servicePricing.deleteMany()
    await prisma.clientRevenue.deleteMany()
    await prisma.client.deleteMany()
    await prisma.staff.deleteMany()
    await prisma.task.deleteMany()
    await prisma.workOrder.deleteMany()
    await prisma.inventoryItem.deleteMany()
    await prisma.lead.deleteMany()
    await prisma.micOption.deleteMany()
    await prisma.referral.deleteMany()
    await prisma.scheduledReport.deleteMany()
    await prisma.userProfile.deleteMany()
    await prisma.user.deleteMany()
  },

  /**
   * Seed test data for authentication tests
   */
  async seedAuthTestData() {
    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash('testpassword123', 10)

    const admin = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        name: 'Test Admin',
        password: hashedPassword,
        role: Role.ADMIN,
        phone: '+1234567890',
      },
    })

    const manager = await prisma.user.create({
      data: {
        email: 'manager@test.com',
        name: 'Test Manager',
        password: hashedPassword,
        role: Role.MANAGER,
      },
    })

    const engineer = await prisma.user.create({
      data: {
        email: 'engineer@test.com',
        name: 'Test Engineer',
        password: hashedPassword,
        role: Role.ENGINEER,
      },
    })

    return { admin, manager, engineer }
  },

  /**
   * Seed test data for client/booking tests
   */
  async seedClientBookingTestData() {
    const client = await prisma.client.create({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        phone: '+1987654321',
        companyName: 'Test Corp',
        status: ClientStatus.ACTIVE,
      },
    })

    const room = await prisma.room.create({
      data: {
        name: 'Studio A',
        description: 'Main recording studio',
        baseRate: 200,
        rateWithEngineer: 300,
        rateWithoutEngineer: 150,
        status: RoomStatus.AVAILABLE,
      },
    })

    const booking = await prisma.booking.create({
      data: {
        clientId: client.id,
        studio: Studio.STUDIO_A,
        date: new Date(),
        startTime: '10:00',
        endTime: '12:00',
        engineer: 'Test Engineer',
        sessionType: SessionType.RECORDING,
        sessionMode: SessionMode.IN_PERSON,
        status: BookingStatus.CONFIRMED,
        bookingCode: 'TEST-001',
      },
    })

    const invoice = await prisma.invoice.create({
      data: {
        clientId: client.id,
        amount: 500,
        status: InvoiceStatus.PENDING,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        items: [{ description: 'Test session', amount: 500 }],
      },
    })

    return { client, room, booking, invoice }
  },

  /**
   * Create a test room
   */
  async createRoom(overrides = {}) {
    return prisma.room.create({
      data: {
        name: `Test Room ${Date.now()}`,
        description: 'Test room description',
        baseRate: 100,
        rateWithEngineer: 150,
        rateWithoutEngineer: 75,
        status: RoomStatus.AVAILABLE,
        ...overrides,
      },
    })
  },

  /**
   * Create a test client
   */
  async createClient(overrides = {}) {
    return prisma.client.create({
      data: {
        firstName: 'Test',
        lastName: 'Client',
        email: `client${Date.now()}@test.com`,
        status: ClientStatus.ACTIVE,
        ...overrides,
      },
    })
  },

  /**
   * Create a test booking
   */
  async createBooking(clientId: string, overrides = {}) {
    return prisma.booking.create({
      data: {
        clientId,
        studio: Studio.STUDIO_A,
        date: new Date(),
        startTime: '10:00',
        endTime: '12:00',
        engineer: 'Test Engineer',
        sessionType: SessionType.RECORDING,
        status: BookingStatus.PENDING,
        bookingCode: `BK-${Date.now()}`,
        ...overrides,
      },
    })
  },

  /**
   * Create a test user
   */
  async createUser(overrides = {}) {
    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash('password123', 10)
    
    return prisma.user.create({
      data: {
        email: `user${Date.now()}@test.com`,
        name: 'Test User',
        password: hashedPassword,
        role: Role.MANAGER,
        ...overrides,
      },
    })
  },
}

export default testDb
