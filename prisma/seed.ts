import { PrismaClient, Role } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const defaultPassword = "password123" // Default password for all staff

  // Create the main admin user
  const adminPassword = await hash("admin123", 12)
  const staffPassword = await hash(defaultPassword, 12)

  // Admin
  await prisma.user.upsert({
    where: { email: "admin@platinumsound.com" },
    update: {},
    create: {
      email: "admin@platinumsound.com",
      name: "Admin",
      password: adminPassword,
      role: Role.ADMIN,
    },
  })
  console.log("Created admin: admin@platinumsound.com / admin123")

  // Chief Engineers
  await prisma.user.upsert({
    where: { email: "jerry@platinumsound.com" },
    update: {},
    create: {
      email: "jerry@platinumsound.com",
      name: "Jerry Wonda",
      password: staffPassword,
      role: Role.ENGINEER,
    },
  })
  await prisma.user.upsert({
    where: { email: "serge@platinumsound.com" },
    update: {},
    create: {
      email: "serge@platinumsound.com",
      name: "Serge",
      password: staffPassword,
      role: Role.ENGINEER,
    },
  })

  // Staff Engineers
  await prisma.user.upsert({
    where: { email: "julian@platinumsound.com" },
    update: {},
    create: {
      email: "julian@platinumsound.com",
      name: "Julian",
      password: staffPassword,
      role: Role.ENGINEER,
    },
  })
  await prisma.user.upsert({
    where: { email: "jack@platinumsound.com" },
    update: {},
    create: {
      email: "jack@platinumsound.com",
      name: "Jack",
      password: staffPassword,
      role: Role.ENGINEER,
    },
  })
  await prisma.user.upsert({
    where: { email: "solon@platinumsound.com" },
    update: {},
    create: {
      email: "solon@platinumsound.com",
      name: "Solon",
      password: staffPassword,
      role: Role.ENGINEER,
    },
  })

  // Senior Engineers
  await prisma.user.upsert({
    where: { email: "knice@platinumsound.com" },
    update: {},
    create: {
      email: "knice@platinumsound.com",
      name: "Knice",
      password: staffPassword,
      role: Role.ENGINEER,
    },
  })
  await prisma.user.upsert({
    where: { email: "rene@platinumsound.com" },
    update: {},
    create: {
      email: "rene@platinumsound.com",
      name: "Rene",
      password: staffPassword,
      role: Role.ENGINEER,
    },
  })
  await prisma.user.upsert({
    where: { email: "darren@platinumsound.com" },
    update: {},
    create: {
      email: "darren@platinumsound.com",
      name: "Darren",
      password: staffPassword,
      role: Role.ENGINEER,
    },
  })

  // Engineers
  await prisma.user.upsert({
    where: { email: "kyle@platinumsound.com" },
    update: {},
    create: {
      email: "kyle@platinumsound.com",
      name: "Kyle",
      password: staffPassword,
      role: Role.ENGINEER,
    },
  })
  await prisma.user.upsert({
    where: { email: "jacob@platinumsound.com" },
    update: {},
    create: {
      email: "jacob@platinumsound.com",
      name: "Jacob",
      password: staffPassword,
      role: Role.ENGINEER,
    },
  })
  await prisma.user.upsert({
    where: { email: "rohan@platinumsound.com" },
    update: {},
    create: {
      email: "rohan@platinumsound.com",
      name: "Rohan",
      password: staffPassword,
      role: Role.ENGINEER,
    },
  })
  await prisma.user.upsert({
    where: { email: "chris@platinumsound.com" },
    update: {},
    create: {
      email: "chris@platinumsound.com",
      name: "Chris",
      password: staffPassword,
      role: Role.ENGINEER,
    },
  })

  // Additional staff
  await prisma.user.upsert({
    where: { email: "lisa@platinumsound.com" },
    update: {},
    create: {
      email: "lisa@platinumsound.com",
      name: "Lisa",
      password: staffPassword,
      role: Role.ENGINEER,
    },
  })
  await prisma.user.upsert({
    where: { email: "spice@platinumsound.com" },
    update: {},
    create: {
      email: "spice@platinumsound.com",
      name: "Spice",
      password: staffPassword,
      role: Role.ENGINEER,
    },
  })
  await prisma.user.upsert({
    where: { email: "marshall@platinumsound.com" },
    update: {},
    create: {
      email: "marshall@platinumsound.com",
      name: "Marshall",
      password: staffPassword,
      role: Role.ENGINEER,
    },
  })

  console.log("All staff users created successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
