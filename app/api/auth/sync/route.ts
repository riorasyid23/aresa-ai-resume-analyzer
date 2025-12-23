import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://aresa-api-worker.rio-rasyid23.workers.dev"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.backendToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Call the backend /auth/sync endpoint
    const response = await fetch(`${BACKEND_URL}/auth/sync`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.backendToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to sync user data" },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json({
      id: data.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      credits: data.credits,
      creditResetAt: data.creditResetAt,
    })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
