import { TAnalysis } from '@/types/analysis'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AnalysisResult {
  id?: string // Analysis ID from backend
  success: boolean
  score: number
  strengths: string[]
  weaknesses: string[]
  improvements: string[]
  rewritten_summary?: string // Optional for portfolio analysis
  summary?: string // For portfolio analysis
  timestamp: number
  resumeText?: string
  filename?: string
  portfolioUrl?: string
  type?: 'resume' | 'portfolio'
  error?: string
  // New fields from backend API
  fileSize?: number
  extractedTextLength?: number
  creditsDeducted?: number
  creditsRemaining?: number
}

// Backend API response structure
interface BackendAnalysisResponse {
  id?: string
  analysisId?: string
  analysis: {
    success: boolean
    score: number
    strengths: string[]
    weaknesses: string[]
    improvements: string[]
    rewritten_summary?: string
  }
  fileName: string
  fileSize: number
  extractedTextLength: number
  creditsDeducted: number
  creditsRemaining: number
  error?: string
}

interface AnalysisStore {
  currentAnalysis: AnalysisResult | null
  history: TAnalysis[]
  creditsRemaining: number | null
  analyzeResumeFile: (file: File, type: 'resume' | 'portfolio') => Promise<AnalysisResult>
  fetchAnalysis: (id: string) => Promise<AnalysisResult>
  setCurrentAnalysis: (analysis: AnalysisResult) => void
  setCurrentAnalysisFromHistory: (analysis: AnalysisResult) => void
  clearCurrentAnalysis: () => void
  fetchHistory: () => Promise<void>
  // addToHistory: (analysis: AnalysisResult) => void
  clearHistory: () => void
  removeFromHistory: (index: number) => void
  setCreditsRemaining: (credits: number) => void
}

export const useAnalysisStore = create<AnalysisStore>()(
  persist(
    (set, get) => ({
      currentAnalysis: null,
      history: [],
      creditsRemaining: null,
      analyzeResumeFile: async (file: File, type: 'resume' | 'portfolio') => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', type)

        try {
          const response = await fetch('/api/analyze', {
            method: 'POST',
            body: formData,
          })

          const result = await response.json()

          // Handle error responses
          if (!response.ok || result.error) {
            const errorResult: AnalysisResult = {
              success: false,
              score: 0,
              strengths: [],
              weaknesses: [],
              improvements: [],
              error: result.error || 'Analysis failed',
              timestamp: Date.now(),
              filename: file.name,
              type,
            }
            return errorResult
          }

          // Map backend response to AnalysisResult
          const backendResponse = result as BackendAnalysisResponse

          const analysisResult: AnalysisResult = {
            id: backendResponse.id || backendResponse.analysisId,
            success: backendResponse.analysis.success,
            score: backendResponse.analysis.score,
            strengths: backendResponse.analysis.strengths,
            weaknesses: backendResponse.analysis.weaknesses,
            improvements: backendResponse.analysis.improvements,
            rewritten_summary: backendResponse.analysis.rewritten_summary,
            timestamp: Date.now(),
            filename: backendResponse.fileName,
            type,
            fileSize: backendResponse.fileSize,
            extractedTextLength: backendResponse.extractedTextLength,
            creditsDeducted: backendResponse.creditsDeducted,
            creditsRemaining: backendResponse.creditsRemaining,
          }

          // Update credits remaining in store
          if (backendResponse.creditsRemaining !== undefined) {
            set({ creditsRemaining: backendResponse.creditsRemaining })
          }

          return analysisResult
        } catch (error) {
          console.error('Error analyzing file:', error)
          const errorResult: AnalysisResult = {
            success: false,
            score: 0,
            strengths: [],
            weaknesses: [],
            improvements: [],
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            timestamp: Date.now(),
            filename: file.name,
            type,
          }
          return errorResult
        }
      },
      fetchAnalysis: async (id: string) => {
        try {
          const response = await fetch(`/api/analysis/${id}`)

          if (!response.ok) {
            throw new Error(`Failed to fetch analysis: ${response.statusText}`)
          }

          const result = await response.json()

          if (result.error) {
            throw new Error(result.error)
          }

          // Parse the outputText string if it exists and is a string
          let analysisData = result.outputText;
          if (typeof result.outputText === 'string') {
            try {
              analysisData = JSON.parse(result.outputText);
            } catch (e) {
              console.error("Failed to parse outputText as JSON", e);
              // Fallback or handle as partial failure
            }
          }

          // Map to AnalysisResult
          const analysisResult: AnalysisResult = {
            id: result.id,
            success: analysisData.success || true, // Default to true if parsed successfully
            score: analysisData.score || 0,
            strengths: analysisData.strengths || [],
            weaknesses: analysisData.weaknesses || [],
            improvements: analysisData.improvements || [],
            rewritten_summary: analysisData.rewritten_summary,
            timestamp: new Date(result.createdAt).getTime(),
            filename: result.filename || 'Analysis Result', // We might not have filename if not stored
            type: 'resume', // Defaulting to resume for now, or infer?
            creditsDeducted: result.creditCost ? Math.abs(result.creditCost) : 0,
            creditsRemaining: undefined, // Usually not part of historical fetch unless we fetch profile
          }

          // Update current analysis
          set({ currentAnalysis: analysisResult })

          return analysisResult
        } catch (error) {
          console.error('Error fetching analysis:', error)
          throw error
        }
      },
      setCurrentAnalysis: (analysis: AnalysisResult) => {
        set({ currentAnalysis: analysis })
        // Also add to history (only for new analyses)
        // get().addToHistory(analysis)
      },
      setCurrentAnalysisFromHistory: (analysis: AnalysisResult) => {
        // Set current analysis without adding to history (for viewing existing history items)
        set({ currentAnalysis: analysis })
      },
      clearCurrentAnalysis: () => set({ currentAnalysis: null }),
      fetchHistory: async () => {
        try {
          const response = await fetch("/api/analysis")

          if (response.status !== 200) {
            throw new Error("Failed to fetch analysis history")
          }

          const result = await response.json()

          set({
            history: result
          })

        } catch (error) {
          throw error
        }

      },
      // addToHistory: (analysis: AnalysisResult) => {
      //   const history = get().history
      //   // Check if this analysis already exists in history (by timestamp or id)
      //   const exists = history.some(item =>
      //     (analysis.id && item.id === analysis.id) ||
      //     item.timestamp === analysis.timestamp
      //   )
      //   if (!exists) {
      //     const newHistory = [analysis, ...history].slice(0, 50) // Keep only last 50 analyses
      //     set({ history: newHistory })
      //   }
      // },
      clearHistory: () => set({ history: [] }),
      removeFromHistory: (index: number) => {
        const history = get().history
        const newHistory = history.filter((_, i) => i !== index)
        set({ history: newHistory })
      },
      setCreditsRemaining: (credits: number) => set({ creditsRemaining: credits }),
    }),
    {
      name: 'analysis-store',
      // Persist history and credits
      partialize: (state) => ({ history: state.history, creditsRemaining: state.creditsRemaining }),
    }
  )
)

