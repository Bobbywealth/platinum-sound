import { PrismaClient, Role } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Create a test admin user
  const hashedPassword = await hash("admin123", 12)
  
  const user = await prisma.user.upsert({
    where: { email: "admin@platinum.com" },
    update: {},
    create: {
      email: "admin@platinum.com",
      name: "Admin User",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  })

  console.log("Created user:", user.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
