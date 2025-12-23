import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      firstName: string
      lastName: string
      phoneNumber: string
      credits: number
      creditResetAt: string
    }
    backendToken: string
    loginAt: number
  }

  interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    phoneNumber: string
    credits: number
    creditResetAt: string
    backendToken: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    firstName: string
    lastName: string
    phoneNumber: string
    credits: number
    creditResetAt: string
    backendToken: string
    loginAt: number
  }
}
