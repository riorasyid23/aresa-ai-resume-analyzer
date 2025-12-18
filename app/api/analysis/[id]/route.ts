import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://aresa-api-worker.rio-rasyid23.workers.dev"

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.backendToken) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const id = req.nextUrl.pathname.split('/').pop();

        if (!id) {
            return NextResponse.json({
                error: "ID Is Missing",
                status: 404
            })
        }

        // Forward to backend API
        const response = await fetch(`${BACKEND_URL}/analysis/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${session.backendToken}`,
            },
        })

        const data = await response.json()

        if (!response.ok) {
            // If 404 from backend, return 404
            if (response.status === 404) {
                return NextResponse.json(
                    { error: 'Analysis not found' },
                    { status: 404 }
                )
            }
            return NextResponse.json(data, { status: response.status })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error fetching analysis details:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
