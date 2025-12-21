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
    backendToken: string
    loginAt: number
  }
}
