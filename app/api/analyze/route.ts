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
        { error: 'Unauthorized. Please log in to analyze files.' },
        { status: 401 }
      )
    }

    // Get the form data from the request
    const formData = await request.formData()

    // Validate file exists
    const file = formData.get('file') as File | null
    const type = formData.get('type') as string | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!type || (type !== 'resume' && type !== 'portfolio')) {
      return NextResponse.json(
        { error: "Invalid analysis type. Must be 'resume' or 'portfolio'" },
        { status: 400 }
      )
    }

    // Check file size (max 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    const allowedExtensions = ['.pdf', '.docx']
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
    const isValidType = allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension)

    if (!isValidType) {
      return NextResponse.json(
        { error: 'Unsupported file type. Only PDF and DOCX files are allowed.' },
        { status: 400 }
      )
    }

    console.log('Forwarding file to backend:', file.name, 'Type:', type, 'Size:', file.size)

    // Create new FormData to forward to backend
    const backendFormData = new FormData()
    backendFormData.append('file', file)
    backendFormData.append('type', type)

    // Forward the request to the backend API
    const response = await fetch(`${BACKEND_URL}/analysis/analyze-file`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.backendToken}`,
      },
      body: backendFormData,
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Backend API error:', data)
      return NextResponse.json(data, { status: response.status })
    }

    console.log('Backend analysis successful, score:', data.analysis?.score)

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in analyze API:', error)
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')

    return NextResponse.json(
      { error: `Failed to analyze file: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
