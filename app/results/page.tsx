'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAnalysisStore } from '@/lib/store'
import AnalysisResultView from '@/components/AnalysisResultView'

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

  // Check if the result has an error or missing required properties
  if (currentAnalysis.error || !Array.isArray(currentAnalysis.strengths) || !Array.isArray(currentAnalysis.weaknesses) || !Array.isArray(currentAnalysis.improvements)) {
    return (
      <div className="text-center">
        <p className="text-red-600 mb-4">
          {currentAnalysis.error || 'Analysis failed or returned invalid data. Please check the console for details.'}
        </p>
        <p className="text-gray-600 text-sm mb-4">
          Debug info: success={currentAnalysis.success ? 'true' : 'false'}
        </p>
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          Go back to upload
        </Link>
      </div>
    )
  }

  return <AnalysisResultView result={currentAnalysis} />
}
