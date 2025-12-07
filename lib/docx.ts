import mammoth from 'mammoth'

export async function extractTextFromDOCX(docxBuffer: Buffer): Promise<string> {
  try {
    console.log('Starting DOCX extraction, buffer length:', docxBuffer.length)
    const result = await mammoth.extractRawText({ buffer: docxBuffer })
    console.log('DOCX extraction successful, text length:', result.value.length)
    return result.value
  } catch (error) {
    console.error('Error extracting text from DOCX:', error)
    throw new Error(`Failed to extract text from DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
