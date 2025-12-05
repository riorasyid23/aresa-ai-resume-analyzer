'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAnalysisStore } from '@/lib/store'

interface AnalysisResult {
  success: boolean
  score: number
  strengths: string[]
  weaknesses: string[]
  improvements: string[]
  rewritten_summary: string
}

export default function Results() {
  const router = useRouter()
  const currentAnalysis = useAnalysisStore((state) => state.currentAnalysis)

  if (!currentAnalysis) {
    return (
      <div className="text-center">
        <p className="text-red-600 mb-4">No analysis data found</p>
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          Go back to upload
        </Link>
      </div>
    )
  }

  const result = currentAnalysis

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ARESA Analysis Results
        </h1>
        <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
          ← Analyze another resume
        </Link>
      </div>

      {/* Resume Score */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBg(result.score)} mb-4`}>
            <span className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
              {result.score}
            </span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Resume Score</h2>
          <p className="text-gray-600">
            {result.score >= 80 ? 'Excellent resume!' :
             result.score >= 60 ? 'Good resume with room for improvement' :
             'Resume needs significant improvements'}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Strengths */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
            <span className="mr-2">✅</span> Strengths
          </h3>
          <ul className="space-y-2">
            {result.strengths.map((strength: string, index: number) => (
              <li key={index} className="text-gray-700 flex items-start">
                <span className="text-green-500 mr-2 mt-1">•</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center">
            <span className="mr-2">⚠️</span> Areas for Improvement
          </h3>
          <ul className="space-y-2">
            {result.weaknesses.map((weakness: string, index: number) => (
              <li key={index} className="text-gray-700 flex items-start">
                <span className="text-red-500 mr-2 mt-1">•</span>
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actionable Improvements */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
          <span className="mr-2">🚀</span> Actionable Improvements
        </h3>
        <ul className="space-y-3">
          {result.improvements.map((improvement: string, index: number) => (
            <li key={index} className="text-gray-700 flex items-start">
              <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">
                {index + 1}
              </span>
              <span>{improvement}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Rewritten Summary */}
      {result.rewritten_summary && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-purple-700 mb-4 flex items-center">
            <span className="mr-2">✨</span> Suggested Summary Rewrite
          </h3>
          <div className="bg-gray-50 rounded-md p-4">
            <p className="text-gray-700 whitespace-pre-line">
              {result.rewritten_summary}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
