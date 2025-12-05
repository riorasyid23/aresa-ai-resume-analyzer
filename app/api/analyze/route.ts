import { NextRequest, NextResponse } from 'next/server'
import { extractTextFromPDF } from '@/lib/pdf'
import { analyzeResumeWithGroq } from '@/lib/groq'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    let resumeText: string

    // Check if a file was uploaded
    const file = formData.get('file') as File | null
    const textInput = formData.get('text') as string | null

    if (file) {
      // Handle PDF file upload
      if (file.type !== 'application/pdf') {
        return NextResponse.json(
          { error: 'Only PDF files are allowed' },
          { status: 400 }
        )
      }

      // Convert file to buffer for pdf-parse
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Extract text from PDF
      resumeText = await extractTextFromPDF(buffer)
    } else if (textInput) {
      // Handle direct text input
      resumeText = textInput.trim()
      if (!resumeText) {
        return NextResponse.json(
          { error: 'Resume text cannot be empty' },
          { status: 400 }
        )
      }
    } else {
      return NextResponse.json(
        { error: 'Either a PDF file or resume text must be provided' },
        { status: 400 }
      )
    }

    // Analyze the resume using Groq
    const analysis = await analyzeResumeWithGroq(resumeText)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error in analyze API:', error)
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')

    return NextResponse.json(
      { error: `Failed to analyze resume: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
