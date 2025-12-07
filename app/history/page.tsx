'use client'

import Link from 'next/link'
import { useAnalysisStore } from '@/lib/store'
import { useState } from 'react'

export default function History() {
  const { history, removeFromHistory, clearHistory, setCurrentAnalysisFromHistory } = useAnalysisStore()
  const [showConfirm, setShowConfirm] = useState(false)

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

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

  const viewAnalysis = (analysis: any) => {
    setCurrentAnalysisFromHistory(analysis)
  }

  if (history.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ARESA Analysis History</h1>
        <p className="text-gray-600">No previous analyses found</p>
        </div>
        <div className="text-center">
          <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            Analyze a Resume
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ARESA Analysis History</h1>
          <p className="text-gray-600">{history.length} previous analyses</p>
        </div>
        <div className="flex gap-4">
          <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            New Analysis
          </Link>
          <button
            onClick={() => setShowConfirm(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Clear History
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Clear History?</h3>
            <p className="text-gray-600 mb-6">This will permanently delete all your analysis history.</p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  clearHistory()
                  setShowConfirm(false)
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex-1"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {history.map((analysis, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-full ${getScoreBg(analysis.score)} flex items-center justify-center`}>
                    <span className={`text-xl font-bold ${getScoreColor(analysis.score)}`}>
                      {analysis.score}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Resume Score
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Analyzed on {formatDate(analysis.timestamp)}
                    </p>
                    {analysis.filename && (
                      <p className="text-gray-600 text-sm">
                        File: {analysis.filename}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">Strengths ({analysis.strengths.length})</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {analysis.strengths.slice(0, 2).map((strength, i) => (
                        <li key={i} className="truncate">• {strength}</li>
                      ))}
                      {analysis.strengths.length > 2 && (
                        <li className="text-gray-500">+{analysis.strengths.length - 2} more</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-red-700 mb-2">Areas for Improvement ({analysis && analysis.weaknesses ? analysis.weaknesses.length : 0})</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {(analysis.weaknesses || []).slice(0, 2).map((weakness, i) => (
                        <li key={i} className="truncate">• {weakness}</li>
                      ))}
                      {(analysis && analysis.weaknesses ? analysis.weaknesses.length : 0) > 2 && (
                        <li className="text-gray-500">+{analysis.weaknesses.length - 2} more</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-blue-700 mb-2">Recommendations ({analysis && analysis.improvements ? analysis.improvements.length : 0})</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {(analysis.improvements || []).slice(0, 2).map((improvement, i) => (
                        <li key={i} className="truncate">• {improvement}</li>
                      ))}
                      {(analysis && analysis.improvements ? analysis.improvements.length : 0) > 2 && (
                        <li className="text-gray-500">+{analysis.improvements.length - 2} more</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <Link
                  href="/results"
                  onClick={() => viewAnalysis(analysis)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                >
                  View Details
                </Link>
                <button
                  onClick={() => removeFromHistory(index)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
