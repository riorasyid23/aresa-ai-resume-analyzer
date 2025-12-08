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
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PortfolioAnalyzer/1.0)'
      },
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Page not found. Please check the URL and try again.')
      } else if (response.status === 403 || response.status === 401) {
        throw new Error('Access denied. This page may require authentication or be restricted.')
      } else if (response.status >= 500) {
        throw new Error('Server error. The website may be temporarily unavailable.')
      } else {
        throw new Error(`Failed to access page (${response.status}). The site may be blocking automated requests.`)
      }
    }

    const html = await response.text()
    return html
  } catch (error) {
    console.error('Error fetching page:', error)

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. The website may be slow or unresponsive.')
      }
      if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
        throw new Error('Could not connect to the website. Please check the URL and try again.')
      }
      // Re-throw custom error messages
      if (error.message.includes('Page not found') ||
          error.message.includes('Access denied') ||
          error.message.includes('Server error') ||
          error.message.includes('timed out') ||
          error.message.includes('connect to the website')) {
        throw error
      }
    }

    throw new Error('Failed to fetch the provided URL. Please check the URL and try again.')
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

    // Check if we have meaningful content
    if (!extractedText || extractedText.length < 50) {
      throw new Error('Could not extract sufficient readable content from this page. The page may be image-heavy, use unusual formatting, or be protected from automated access.')
    }

    // Limit text length to avoid token limits
    const maxLength = 4000
    if (extractedText.length > maxLength) {
      extractedText = extractedText.substring(0, maxLength) + '...'
    }

    return extractedText
  } catch (error) {
    console.error('Error extracting text from HTML:', error)

    if (error instanceof Error && error.message.includes('Could not extract sufficient')) {
      throw error
    }

    throw new Error('Failed to extract readable text from the webpage. The page may use complex formatting or be protected from automated access.')
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
        { error: 'Unable to extract sufficient readable content from the provided URL. The page may be image-heavy, use complex formatting, or be protected from automated access.' },
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
