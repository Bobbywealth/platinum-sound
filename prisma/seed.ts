import { PrismaClient, Role, RoomStatus, InventoryCategory, EquipmentCondition, InventoryStatus, SessionMode, SignatureType, EmailType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create Rooms
  const studioA = await prisma.room.upsert({
    where: { name: 'Studio A' },
    update: {},
    create: {
      name: 'Studio A',
      description: 'Main recording studio with live room and control room. Features SSL console and Pro Tools HDX.',
      baseRate: 150,
      rateWithEngineer: 200,
      rateWithoutEngineer: 100,
      status: RoomStatus.AVAILABLE,
      amenities: {
        features: ['SSL Console', 'Pro Tools HDX', 'Live Room', 'Vocal Booth', 'Piano'],
        capacity: 15,
        squareFeet: 1200
      }
    }
  })

  const studioB = await prisma.room.upsert({
    where: { name: 'Studio B' },
    update: {},
    create: {
      name: 'Studio B',
      description: 'Production suite with writing room. Perfect for beat making and mixing.',
      baseRate: 100,
      rateWithEngineer: 150,
      rateWithoutEngineer: 75,
      status: RoomStatus.AVAILABLE,
      amenities: {
        features: ['Pro Tools', 'Logic Pro', 'Ableton Live', 'MIDI Controller', 'Monitoring'],
        capacity: 8,
        squareFeet: 600
      }
    }
  })

  const studioC = await prisma.room.upsert({
    where: { name: 'Studio C' },
    update: {},
    create: {
      name: 'Studio C',
      description: 'Mixing and mastering suite with premium monitoring and acoustic treatment.',
      baseRate: 125,
      rateWithEngineer: 175,
      rateWithoutEngineer: 85,
      status: RoomStatus.AVAILABLE,
      amenities: {
        features: ['Pro Tools HDX', 'Logic Pro', 'Premium Monitoring', 'Acoustic Treatment'],
        capacity: 6,
        squareFeet: 400
      }
    }
  })

  console.log('Created rooms:', { studioA: studioA.id, studioB: studioB.id, studioC: studioC.id })

  // Create Mic Options
  const standardMic = await prisma.micOption.upsert({
    where: { id: 'standard-mic' },
    update: {},
    create: {
      id: 'standard-mic',
      name: 'Standard Mic (Included)',
      description: 'Neumann TLM 103 or equivalent large-diaphragm condenser',
      upcharge: 0,
      isPremium: false,
      isActive: true
    }
  })

  const sm7b = await prisma.micOption.upsert({
    where: { id: 'shure-sm7b' },
    update: {},
    create: {
      id: 'shure-sm7b',
      name: 'Shure SM7B',
      description: 'Dynamic microphone ideal for vocals and podcasts',
      upcharge: 25,
      isPremium: true,
      isActive: true
    }
  })

  const u87 = await prisma.micOption.upsert({
    where: { id: 'neumann-u87' },
    update: {},
    create: {
      id: 'neumann-u87',
      name: 'Neumann U87',
      description: 'Legendary studio condenser microphone',
      upcharge: 75,
      isPremium: true,
      isActive: true
    }
  })

  const c12 = await prisma.micOption.upsert({
    where: { id: 'akg-c12' },
    update: {},
    create: {
      id: 'akg-c12',
      name: 'AKG C12 VR',
      description: 'Vintage-style tube condenser microphone',
      upcharge: 100,
      isPremium: true,
      isActive: true
    }
  })

  const sonyC800 = await prisma.micOption.upsert({
    where: { id: 'sony-c800g' },
    update: {},
    create: {
      id: 'sony-c800g',
      name: 'Sony C-800G',
      description: 'Premium tube condenser with Peltier cooling system',
      upcharge: 150,
      isPremium: true,
      isActive: true
    }
  })

  console.log('Created mic options:', { standardMic: standardMic.id, sm7b: sm7b.id, u87: u87.id })

  // Create Service Pricing
  const services = [
    { serviceType: 'Recording', sessionMode: SessionMode.IN_PERSON, basePrice: 200, description: 'In-studio recording session with engineer' },
    { serviceType: 'Recording', sessionMode: SessionMode.ONLINE, basePrice: 0, description: 'Online recording not available' },
    { serviceType: 'Mixing', sessionMode: SessionMode.IN_PERSON, basePrice: 300, description: 'In-studio mixing session' },
    { serviceType: 'Mixing', sessionMode: SessionMode.ONLINE, basePrice: 250, description: 'Online mixing for international artists' },
    { serviceType: 'Mastering', sessionMode: SessionMode.IN_PERSON, basePrice: 150, description: 'In-studio mastering session' },
    { serviceType: 'Mastering', sessionMode: SessionMode.ONLINE, basePrice: 100, description: 'Online mastering service' },
    { serviceType: 'Production', sessionMode: SessionMode.IN_PERSON, basePrice: 250, description: 'In-studio production session' },
    { serviceType: 'Production', sessionMode: SessionMode.ONLINE, basePrice: 200, description: 'Remote production session' },
    { serviceType: 'Podcast', sessionMode: SessionMode.IN_PERSON, basePrice: 150, description: 'In-studio podcast recording' },
    { serviceType: 'Podcast', sessionMode: SessionMode.ONLINE, basePrice: 0, description: 'Online podcast not available' },
    { serviceType: 'Voiceover', sessionMode: SessionMode.IN_PERSON, basePrice: 175, description: 'In-studio voiceover recording' },
    { serviceType: 'Voiceover', sessionMode: SessionMode.ONLINE, basePrice: 0, description: 'Online voiceover not available' },
  ]

  for (const service of services) {
    await prisma.servicePricing.upsert({
      where: {
        serviceType_sessionMode: {
          serviceType: service.serviceType,
          sessionMode: service.sessionMode
        }
      },
      update: {},
      create: service
    })
  }

  console.log('Created service pricing')

  // Create Email Notification Settings
  const emailSettings = [
    { role: Role.ADMIN, emailType: EmailType.BOOKING_CREATED, enabled: true },
    { role: Role.ADMIN, emailType: EmailType.BOOKING_AUTHORIZATION, enabled: true },
    { role: Role.ADMIN, emailType: EmailType.WORK_ORDER_CREATED, enabled: true },
    { role: Role.ADMIN, emailType: EmailType.END_OF_DAY_REPORT, enabled: true },
    { role: Role.ADMIN, emailType: EmailType.WEEKLY_REPORT, enabled: true },
    { role: Role.ADMIN, emailType: EmailType.PAYMENT_RECEIVED, enabled: true },
    { role: Role.ADMIN, emailType: EmailType.ROOM_LOCKOUT, enabled: true },
    { role: Role.MANAGER, emailType: EmailType.BOOKING_CREATED, enabled: true },
    { role: Role.MANAGER, emailType: EmailType.BOOKING_AUTHORIZATION, enabled: true },
    { role: Role.MANAGER, emailType: EmailType.END_OF_DAY_REPORT, enabled: true },
    { role: Role.MANAGER, emailType: EmailType.WEEKLY_REPORT, enabled: true },
    { role: Role.MANAGER, emailType: EmailType.PAYMENT_RECEIVED, enabled: true },
    { role: Role.MANAGER, emailType: EmailType.ROOM_LOCKOUT, enabled: true },
    { role: Role.BOOKING_AGENT, emailType: EmailType.BOOKING_CREATED, enabled: true },
    { role: Role.BOOKING_AGENT, emailType: EmailType.BOOKING_AUTHORIZATION, enabled: true },
    { role: Role.BOOKING_AGENT, emailType: EmailType.ROOM_LOCKOUT, enabled: true },
    { role: Role.ENGINEER, emailType: EmailType.WORK_ORDER_CREATED, enabled: true },
  ]

  for (const setting of emailSettings) {
    await prisma.emailNotificationSetting.upsert({
      where: {
        role_emailType: {
          role: setting.role,
          emailType: setting.emailType
        }
      },
      update: { enabled: setting.enabled },
      create: setting
    })
  }

  console.log('Created email notification settings')

  // Create Sample Inventory Items
  const inventoryItems = [
    {
      name: 'Neumann TLM 103',
      category: InventoryCategory.MICROPHONES,
      subCategory: 'Large Diaphragm Condenser',
      description: 'Large-diaphragm condenser microphone',
      serialNumber: 'NTLM103-001',
      condition: EquipmentCondition.EXCELLENT,
      location: 'Mic Locker',
      stock: 4,
      reorderPoint: 2,
      status: InventoryStatus.IN_STOCK,
      purchasePrice: 1100,
    },
    {
      name: 'Shure SM7B',
      category: InventoryCategory.MICROPHONES,
      subCategory: 'Dynamic',
      description: 'Dynamic microphone for vocals and broadcasting',
      serialNumber: 'SSM7B-001',
      condition: EquipmentCondition.GOOD,
      location: 'Studio B',
      stock: 2,
      reorderPoint: 2,
      status: InventoryStatus.IN_STOCK,
      purchasePrice: 399,
    },
    {
      name: 'Sony MDR-7506',
      category: InventoryCategory.EQUIPMENT,
      subCategory: 'Headphones',
      description: 'Professional studio headphones',
      serialNumber: 'SM7506-001',
      condition: EquipmentCondition.GOOD,
      location: 'Studio A',
      stock: 12,
      reorderPoint: 6,
      status: InventoryStatus.IN_STOCK,
      purchasePrice: 100,
    },
    {
      name: 'XLR Cables (20ft)',
      category: InventoryCategory.CABLES,
      subCategory: 'XLR',
      description: '20-foot XLR cables for microphones',
      stock: 8,
      reorderPoint: 10,
      status: InventoryStatus.LOW_STOCK,
      location: 'Supply Room',
      purchasePrice: 15,
    },
    {
      name: 'Audio Interface Cables',
      category: InventoryCategory.CABLES,
      subCategory: 'USB/Firewire',
      description: 'Cables for audio interfaces',
      stock: 3,
      reorderPoint: 6,
      status: InventoryStatus.LOW_STOCK,
      location: 'Supply Room',
      purchasePrice: 25,
    },
    {
      name: 'Studio Notebook',
      category: InventoryCategory.OFFICE_SUPPLIES,
      subCategory: 'Stationery',
      description: 'Notebooks for session notes',
      stock: 20,
      reorderPoint: 10,
      status: InventoryStatus.IN_STOCK,
      location: 'Office',
      purchasePrice: 5,
    },
    {
      name: 'USB Flash Drive 64GB',
      category: InventoryCategory.OFFICE_SUPPLIES,
      subCategory: 'Storage',
      description: 'USB drives for session file transfers',
      stock: 15,
      reorderPoint: 10,
      status: InventoryStatus.IN_STOCK,
      location: 'Office',
      purchasePrice: 12,
    },
    {
      name: 'MIDI Controller - Akai MPK249',
      category: InventoryCategory.INSTRUMENTS,
      subCategory: 'Controllers',
      description: '49-key MIDI controller',
      serialNumber: 'AMPK249-001',
      condition: EquipmentCondition.GOOD,
      location: 'Studio B',
      stock: 2,
      reorderPoint: 1,
      status: InventoryStatus.IN_STOCK,
      purchasePrice: 399,
    },
  ]

  for (const item of inventoryItems) {
    await prisma.inventoryItem.create({
      data: item
    })
  }

  console.log('Created inventory items')

  // Create Admin User (password: admin123)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@platinumsound.com' },
    update: {},
    create: {
      email: 'admin@platinumsound.com',
      name: 'Admin User',
      password: '$2a$10$rQZ9Z9Z9Z9Z9Z9Z9Z9Z9Z.9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9', // Placeholder - should be hashed
      role: Role.ADMIN,
      phone: '+1 (212) 265-6060',
      discountLimit: 100,
    }
  })

  // Create Manager User
  await prisma.user.upsert({
    where: { email: 'manager@platinumsound.com' },
    update: {},
    create: {
      email: 'manager@platinumsound.com',
      name: 'Studio Manager',
      password: '$2a$10$rQZ9Z9Z9Z9Z9Z9Z9Z9Z9Z.9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9',
      role: Role.MANAGER,
      phone: '+1 (212) 265-6061',
      discountLimit: 50,
    }
  })

  // Create Booking Agent User
  await prisma.user.upsert({
    where: { email: 'booking@platinumsound.com' },
    update: {},
    create: {
      email: 'booking@platinumsound.com',
      name: 'Booking Agent',
      password: '$2a$10$rQZ9Z9Z9Z9Z9Z9Z9Z9Z9Z.9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9',
      role: Role.BOOKING_AGENT,
      phone: '+1 (212) 265-6062',
      discountLimit: 25,
    }
  })

  // Create Engineer Users
  const engineers = [
    { name: 'Alex Morgan', email: 'alex@platinumsound.com', phone: '+1 (555) 111-2222' },
    { name: 'Jamie Lee', email: 'jamie@platinumsound.com', phone: '+1 (555) 222-3333' },
    { name: 'Taylor Rivera', email: 'taylor@platinumsound.com', phone: '+1 (555) 333-4444' },
    { name: 'Jordan Blake', email: 'jordan@platinumsound.com', phone: '+1 (555) 444-5555' },
  ]

  for (const engineer of engineers) {
    const user = await prisma.user.upsert({
      where: { email: engineer.email },
      update: {},
      create: {
        email: engineer.email,
        name: engineer.name,
        password: '$2a$10$rQZ9Z9Z9Z9Z9Z9Z9Z9Z9Z.9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9',
        role: Role.ENGINEER,
        phone: engineer.phone,
        discountLimit: 15,
      }
    })

    // Assign engineers to rooms
    if (engineer.name === 'Alex Morgan' || engineer.name === 'Taylor Rivera') {
      await prisma.roomAssignment.create({
        data: {
          roomId: studioA.id,
          engineerId: user.id,
          isPrimary: engineer.name === 'Alex Morgan'
        }
      })
      await prisma.roomAssignment.create({
        data: {
          roomId: studioC.id,
          engineerId: user.id,
          isPrimary: false
        }
      })
    } else {
      await prisma.roomAssignment.create({
        data: {
          roomId: studioB.id,
          engineerId: user.id,
          isPrimary: engineer.name === 'Jamie Lee'
        }
      })
    }

    // Create engineer rates
    await prisma.engineerRate.create({
      data: {
        engineerId: user.id,
        hourlyRate: 75,
        minRate: 50,
        maxRate: 150,
      }
    })
  }

  console.log('Created users and engineer assignments')

  // Create Room Pricing
  await prisma.roomPricing.create({
    data: {
      roomId: studioA.id,
      minPrice: 100,
      maxPrice: 300,
      createdBy: adminUser.id
    }
  })

  await prisma.roomPricing.create({
    data: {
      roomId: studioB.id,
      minPrice: 75,
      maxPrice: 200,
      createdBy: adminUser.id
    }
  })

  await prisma.roomPricing.create({
    data: {
      roomId: studioC.id,
      minPrice: 85,
      maxPrice: 250,
      createdBy: adminUser.id
    }
  })

  console.log('Created room pricing')

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
