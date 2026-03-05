import { PrismaClient, Role } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Create the main admin user
  const hashedPassword = await hash("admin123", 12)
  
  const user = await prisma.user.upsert({
    where: { email: "admin@platinumsound.com" },
    update: {},
    create: {
      email: "admin@platinumsound.com",
      name: "Admin",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  })

  console.log("Created admin user:", user.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
