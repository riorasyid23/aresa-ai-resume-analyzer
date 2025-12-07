'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAnalysisStore } from '@/lib/store'

export default function Home() {
  const [resumeText, setResumeText] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [loadingStep, setLoadingStep] = useState('')
  const router = useRouter()
  const setCurrentAnalysis = useAnalysisStore((state) => state.setCurrentAnalysis)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      const allowedExtensions = ['.pdf', '.docx']
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))

      if (allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension)) {
        setSelectedFile(file)
        setResumeText('') // Clear text when file is selected
        setPortfolioUrl('') // Clear URL when file is selected
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Determine which type of analysis to perform
    const isPortfolioAnalysis = portfolioUrl.trim() !== '' && !selectedFile && !resumeText.trim()

    if (!selectedFile && !resumeText.trim() && !isPortfolioAnalysis) {
      alert('Please upload a PDF, DOCX, paste your resume text, or enter a portfolio URL')
      return
    }

    if (isPortfolioAnalysis) {
      const trimmedUrl = portfolioUrl.trim()
      console.log('Validating portfolio URL:', trimmedUrl)
      if (!trimmedUrl) {
        alert('Please enter a portfolio URL')
        return
      }
      if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
        alert('Please enter a valid URL starting with http:// or https://')
        return
      }
      // Basic URL validation
      try {
        new URL(trimmedUrl)
      } catch {
        alert('Please enter a valid URL')
        return
      }
    }

    setIsAnalyzing(true)
    setLoadingStep('Extracting text from your resume...')

    try {
      if (isPortfolioAnalysis) {
        // Portfolio analysis
        setLoadingStep('Fetching portfolio content...')

        const response = await fetch('/api/analyze-portfolio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: portfolioUrl.trim() }),
        })

        if (!response.ok) {
          throw new Error('Portfolio analysis failed: ' + response.statusText)
        }

        setLoadingStep('Analyzing portfolio and generating insights...')

        const result = await response.json()
        if(!result.success) {
          throw new Error('Portfolio analysis failed')
        }

        console.log('Portfolio analysis successful, storing data...')
        const analysisWithMetadata = {
          ...result,
          timestamp: Date.now(),
          portfolioUrl: portfolioUrl.trim(),
          type: 'portfolio'
        }

        setCurrentAnalysis(analysisWithMetadata)
        console.log('Data stored, navigating to /portfolio-results...')
        router.push('/portfolio-results')
      } else {
        // Resume analysis (existing logic)
        setLoadingStep('Extracting text from your resume...')

        const formData = new FormData()
        if (selectedFile) {
          formData.append('file', selectedFile)
        } else {
          formData.append('text', resumeText)
        }

        setLoadingStep('Sending resume to AI analysis...')

        const response = await fetch('/api/analyze', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Analysis failed: ' + response.statusText)
        }

        setLoadingStep('Analyzing content and generating insights...')

        const result = await response.json()
        if(!result.success) {
          throw new Error('Analysis failed')
        }

        console.log('Analysis successful, storing data...')
        const analysisWithMetadata = {
          ...result,
          timestamp: Date.now(),
          resumeText: selectedFile ? undefined : resumeText,
          filename: selectedFile?.name,
          type: 'resume'
        }

        setCurrentAnalysis(analysisWithMetadata)
        console.log('Data stored, navigating to /results...')
        router.push('/results')
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      alert(`Failed to analyze resume: ${errorMessage}`)
    } finally {
      console.log('Finally block executed, resetting loading state')
      setIsAnalyzing(false)
      setLoadingStep('')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ARESA
        </h1>
        <h2 className="text-2xl font-semibold text-blue-600 mb-2">
          AI Resume Analyzer
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Transform your resume with intelligent AI-powered analysis. Get comprehensive feedback, scoring, and actionable recommendations to land more interviews.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Resume (PDF or DOCX)
            </label>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={isAnalyzing}
            />
            {selectedFile && (
              <p className="mt-2 text-sm text-green-600">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          <div className="text-center text-gray-500 text-sm">- OR -</div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paste Resume Text
            </label>
            <textarea
              value={resumeText}
              onChange={(e) => {
                setResumeText(e.target.value)
                setSelectedFile(null) // Clear file when text is entered
                setPortfolioUrl('') // Clear URL when text is entered
              }}
              placeholder="Paste your resume text here..."
              rows={10}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={isAnalyzing}
            />
          </div>

          <div className="text-center text-gray-500 text-sm">- OR -</div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Analyze Portfolio/Website
            </label>
            <input
              type="url"
              value={portfolioUrl}
              onChange={(e) => {
                setPortfolioUrl(e.target.value)
                setSelectedFile(null) // Clear file when URL is entered
                setResumeText('') // Clear text when URL is entered
              }}
              placeholder="https://your-portfolio.com or https://github.com/yourusername"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={isAnalyzing}
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter a URL to analyze a portfolio, personal website, or GitHub profile
            </p>
          </div>
        </div>

        {isAnalyzing && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <div>
                <p className="text-blue-800 font-medium">Analyzing your resume...</p>
                <p className="text-blue-600 text-sm">{loadingStep || 'This may take a few moments'}</p>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isAnalyzing || (!selectedFile && !resumeText.trim() && !portfolioUrl.trim())}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isAnalyzing && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
          {isAnalyzing ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>
    </div>
  )
}
