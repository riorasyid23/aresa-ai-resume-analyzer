import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'
import { analyzePortfolioWithGroq } from '@/lib/groq'

interface PortfolioAnalysis {
  success: boolean
  score: number
  strengths: string[]
  weaknesses: string[]
  improvements: string[]
  summary: string
}

async function fetchPageContent(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PortfolioAnalyzer/1.0)'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status}`)
    }

    const html = await response.text()
    console.log("HTML", html.substring(0, 10))
    return html
  } catch (error) {
    console.error('Error fetching page:', error)
    throw new Error('Failed to fetch the provided URL')
  }
}

function extractTextFromHTML(html: string): string {
  try {
    const $ = cheerio.load(html)

    // Remove script and style elements
    $('script, style, nav, footer, aside, .nav, .footer, .sidebar').remove()

    // Extract text from main content areas
    const textSelectors = [
      'main',
      '[role="main"]',
      '.content',
      '.main-content',
      'article',
      '.post',
      '.entry-content',
      'body'
    ]

    let extractedText = ''

    for (const selector of textSelectors) {
      const elements = $(selector)
      if (elements.length > 0) {
        extractedText = elements.text().trim()
        if (extractedText.length > 500) { // If we have substantial content, use it
          break
        }
      }
    }

    // Fallback to body if no main content found
    if (!extractedText || extractedText.length < 100) {
      extractedText = $('body').text().trim()
    }

    // Clean up the text
    extractedText = extractedText
      .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim()

    // Limit text length to avoid token limits
    const maxLength = 1000
    if (extractedText.length > maxLength) {
      console.log("Limit Reached")
      extractedText = extractedText.substring(0, maxLength) + '...'
    }

    console.log("Extracted", extractedText.substring(0, 10))

    return extractedText
  } catch (error) {
    console.error('Error extracting text from HTML:', error)
    throw new Error('Failed to extract text from the webpage')
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required and must be a string' },
        { status: 400 }
      )
    }

    // Basic URL validation
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    console.log('Fetching content from URL:', url)

    // Fetch and extract text from the URL
    const html = await fetchPageContent(url)
    const extractedText = extractTextFromHTML(html)

    if (!extractedText || extractedText.length < 50) {
      return NextResponse.json(
        { error: 'Unable to extract sufficient content from the provided URL' },
        { status: 400 }
      )
    }

    console.log('Extracted text length:', extractedText.length)

    // Analyze the portfolio using Groq
    const analysis = await analyzePortfolioWithGroq(extractedText)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error in analyze-portfolio API:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      { error: `Failed to analyze portfolio: ${errorMessage}` },
      { status: 500 }
    )
  }
}
