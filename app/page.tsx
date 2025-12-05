'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAnalysisStore } from '@/lib/store'

export default function Home() {
  const [resumeText, setResumeText] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const router = useRouter()
  const setCurrentAnalysis = useAnalysisStore((state) => state.setCurrentAnalysis)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file)
      setResumeText('') // Clear text when file is selected
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile && !resumeText.trim()) {
      alert('Please upload a PDF or paste your resume text')
      return
    }

    setIsAnalyzing(true)

    try {
      const formData = new FormData()
      if (selectedFile) {
        formData.append('file', selectedFile)
      } else {
        formData.append('text', resumeText)
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Analysis failed: ' + response.statusText)
      }

      const result = await response.json()
      if(!result.success) {
        throw new Error('Analysis failed')
      }

      // Store the result with additional metadata
      const analysisWithMetadata = {
        ...result,
        timestamp: Date.now(),
        resumeText: selectedFile ? undefined : resumeText, // Store text if pasted
        filename: selectedFile?.name,
      }

      setCurrentAnalysis(analysisWithMetadata)
      router.push('/results')
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to analyze resume. Please try again.')
    } finally {
      setIsAnalyzing(false)
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
              Upload Resume PDF
            </label>
            <input
              type="file"
              accept=".pdf"
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
              }}
              placeholder="Paste your resume text here..."
              rows={10}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={isAnalyzing}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isAnalyzing || (!selectedFile && !resumeText.trim())}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? 'Analyzing Resume...' : 'Analyze Resume'}
        </button>
      </form>
    </div>
  )
}
