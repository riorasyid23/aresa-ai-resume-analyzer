import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://aresa-api-worker.rio-rasyid23.workers.dev"

export async function POST(request: NextRequest) {
  try {
    // Get the user session
    const session = await getServerSession(authOptions)

    if (!session?.backendToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get the request body
    const body = await request.json()
    const { prompt, output } = body

    if (!prompt || !output) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt and output' },
        { status: 400 }
      )
    }

    // Forward to backend API
    const response = await fetch(`${BACKEND_URL}/analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.backendToken}`,
      },
      body: JSON.stringify({ prompt, output }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Analysis API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the user session
    const session = await getServerSession(authOptions)

    if (!session?.backendToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Forward to backend API
    const response = await fetch(`${BACKEND_URL}/analysis/history`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.backendToken}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Analysis history API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
