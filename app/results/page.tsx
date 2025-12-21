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
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <p className="text-red-600 mb-4 font-medium">No analysis data found</p>
        <Link href="/" className="text-indigo-600 hover:text-indigo-800 transition-colors">
          Go back to upload
        </Link>
      </div>
    )
  }

  // Check if the result has an error or missing required properties
  if (currentAnalysis.error || !Array.isArray(currentAnalysis.strengths) || !Array.isArray(currentAnalysis.weaknesses) || !Array.isArray(currentAnalysis.improvements)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <p className="text-red-600 mb-4 font-medium max-w-lg">
          {currentAnalysis.error || 'Analysis failed or returned invalid data. Please check the console for details.'}
        </p>
        <p className="text-gray-500 text-sm mb-6">
          Debug info: success={currentAnalysis.success ? 'true' : 'false'}
        </p>
        <Link href="/" className="text-indigo-600 hover:text-indigo-800 transition-colors font-medium">
          Go back to upload
        </Link>
      </div>
    )
  }

  return <AnalysisResultView result={currentAnalysis} />
}
