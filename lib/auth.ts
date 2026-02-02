import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

declare module "next-auth" {
  interface User {
    id: string
    email: string
    name: string
    role: "admin" | "manager" | "engineer"
  }
  interface Session {
    user: User
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

        // Simple demo auth - replace with database lookup
        if (email === "admin@platinumsound.com" && password === "admin123") {
          return {
            id: "1",
            email: "admin@platinumsound.com",
            name: "Admin User",
            role: "admin",
          }
        }

        if (email === "manager@platinumsound.com" && password === "manager123") {
          return {
            id: "2",
            email: "manager@platinumsound.com",
            name: "Studio Manager",
            role: "manager",
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
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as "admin" | "manager" | "engineer"
      }
      return session
    },
  },
})

export { auth, handlers, signIn, signOut }

