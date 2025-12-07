import { NextRequest, NextResponse } from 'next/server'
import { extractTextFromPDF } from '@/lib/pdf'
import { extractTextFromDOCX } from '@/lib/docx'
import { analyzeResumeWithGroq } from '@/lib/groq'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    let resumeText = ''

    // Check if a file was uploaded
    const file = formData.get('file') as File | null
    const textInput = formData.get('text') as string | null

    if (file) {
      console.log('Processing file:', file.name, 'Type:', file.type, 'Size:', file.size)

      // Handle PDF or DOCX file upload
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      const allowedExtensions = ['.pdf', '.docx']

      // Check both MIME type and file extension
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
      const isValidType = allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension)

      if (!isValidType) {
        console.log('File type not allowed:', file.type, 'Extension:', fileExtension)
        return NextResponse.json(
          { error: 'Only PDF and DOCX files are allowed' },
          { status: 400 }
        )
      }

      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      console.log('Buffer created, length:', buffer.length)

      // Extract text based on file type
      // const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))

      if (file.type === 'application/pdf' || fileExtension === '.pdf') {
        console.log('Processing as PDF')
        resumeText = await extractTextFromPDF(buffer)
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileExtension === '.docx') {
        console.log('Processing as DOCX')
        resumeText = await extractTextFromDOCX(buffer)
      }

      console.log('Extracted text length:', resumeText.length)
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
        { error: 'Either a PDF file, DOCX file, or resume text must be provided' },
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
