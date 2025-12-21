import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://aresa-api-worker.rio-rasyid23.workers.dev"

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as const,
    maxAge: 15 * 60, // 15 minutes
    updateAge: 15 * 60, // 15 minutes
    // maxAge: 20, // 20 seconds for testing
    // updateAge: 20, // 20 seconds for testing
  },
  jwt: {
    maxAge: 15 * 60, // 15 minutes
    // maxAge: 20, // 20 seconds for testing
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          // Call the backend API
          const response = await fetch(`${BACKEND_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          let data
          try {
            data = await response.json()
          } catch (error) {
            console.error('Failed to parse response JSON:', error)
            return null
          }

          if (!response.ok) {
            // Return null for invalid credentials
            console.log('Auth failed with status:', response.status, data)
            return null
          }

          // Return user object that will be saved in the JWT
          return {
            id: data.user.id,
            email: data.user.email,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            phoneNumber: data.user.phoneNumber,
            credits: data.user.credits,
            // Store the backend JWT token
            backendToken: data.token,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }


    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }: { token: any, user: any, trigger?: string, session?: any }) {
      // Add user data to JWT token
      if (user) {
        token.id = user.id
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.phoneNumber = user.phoneNumber
        token.credits = user.credits
        token.backendToken = user.backendToken
        token.loginAt = Date.now()
      }

      // Handle session update
      if (trigger === "update" && session) {
        if (session.credits !== undefined) {
          token.credits = session.credits
        }
        // Add other updateable fields here if needed
      }

      return token
    },
    async session({ session, token }: { session: any, token: any }) {
      // Add user data to session
      if (token && session?.user) {
        session.user.id = token.id as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.phoneNumber = token.phoneNumber as string
        session.user.credits = token.credits as number
        session.backendToken = token.backendToken as string
        session.loginAt = token.loginAt as number
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
}
