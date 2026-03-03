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

const authSecret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET

if (process.env.NODE_ENV == "production" && !authSecret) {
  throw new Error("NEXTAUTH_SECRET is required in production")
}

const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: authSecret,
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
