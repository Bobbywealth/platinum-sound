import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaClient, Role } from "@prisma/client"
import { compare } from "bcryptjs"

const prisma = new PrismaClient()

declare module "next-auth" {
  interface User {
    id: string
    email: string
    name: string
    role: Role
    phone?: string | null
    discountLimit?: number | null
  }
  interface Session {
    user: User
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string
    role: Role
    phone?: string | null
    discountLimit?: number | null
  }
}

const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials

        if (!email || !password) {
          return null
        }

        // Demo auth for development - replace with database lookup in production
        // In production, uncomment the database code below
        
        /*
        const user = await prisma.user.findUnique({
          where: { email: email as string },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            role: true,
            phone: true,
            discountLimit: true,
          }
        })

        if (!user) {
          return null
        }

        const isValid = await compare(password as string, user.password)
        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name || '',
          role: user.role,
          phone: user.phone,
          discountLimit: user.discountLimit,
        }
        */

        // Demo credentials for development
        const demoUsers: Record<string, { password: string; name: string; role: Role; phone: string; discountLimit: number }> = {
          "admin@platinumsound.com": { 
            password: "admin123", 
            name: "Admin User", 
            role: "ADMIN",
            phone: "+1 (212) 265-6060",
            discountLimit: 100,
          },
          "manager@platinumsound.com": { 
            password: "manager123", 
            name: "Studio Manager", 
            role: "MANAGER",
            phone: "+1 (212) 265-6061",
            discountLimit: 50,
          },
          "booking@platinumsound.com": { 
            password: "booking123", 
            name: "Booking Agent", 
            role: "BOOKING_AGENT",
            phone: "+1 (212) 265-6062",
            discountLimit: 25,
          },
          "engineer@platinumsound.com": { 
            password: "engineer123", 
            name: "Engineer", 
            role: "ENGINEER",
            phone: "+1 (212) 265-6063",
            discountLimit: 15,
          },
          "alex@platinumsound.com": {
            password: "alex123",
            name: "Alex Morgan",
            role: "ENGINEER",
            phone: "+1 (555) 111-2222",
            discountLimit: 15,
          },
          "jamie@platinumsound.com": {
            password: "jamie123",
            name: "Jamie Lee",
            role: "ENGINEER",
            phone: "+1 (555) 222-3333",
            discountLimit: 15,
          },
          "taylor@platinumsound.com": {
            password: "taylor123",
            name: "Taylor Rivera",
            role: "ENGINEER",
            phone: "+1 (555) 333-4444",
            discountLimit: 15,
          },
          "jordan@platinumsound.com": {
            password: "jordan123",
            name: "Jordan Blake",
            role: "ENGINEER",
            phone: "+1 (555) 444-5555",
            discountLimit: 15,
          },
        }

        const demoUser = demoUsers[email as string]
        if (demoUser && password === demoUser.password) {
          return {
            id: Math.random().toString(36).substr(2, 9),
            email: email as string,
            name: demoUser.name,
            role: demoUser.role,
            phone: demoUser.phone,
            discountLimit: demoUser.discountLimit,
          }
        }

        return null
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.phone = user.phone
        token.discountLimit = user.discountLimit
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.phone = token.phone
        session.user.discountLimit = token.discountLimit
      }
      return session
    },
  },
})

export { auth, handlers, signIn, signOut }
