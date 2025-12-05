import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AnalysisResult {
  success: boolean
  score: number
  strengths: string[]
  weaknesses: string[]
  improvements: string[]
  rewritten_summary: string
  timestamp: number
  resumeText?: string
  filename?: string
}

interface AnalysisStore {
  currentAnalysis: AnalysisResult | null
  history: AnalysisResult[]
  setCurrentAnalysis: (analysis: AnalysisResult) => void
  setCurrentAnalysisFromHistory: (analysis: AnalysisResult) => void
  clearCurrentAnalysis: () => void
  addToHistory: (analysis: AnalysisResult) => void
  clearHistory: () => void
  removeFromHistory: (index: number) => void
}

export const useAnalysisStore = create<AnalysisStore>()(
  persist(
    (set, get) => ({
      currentAnalysis: null,
      history: [],
      setCurrentAnalysis: (analysis: AnalysisResult) => {
        set({ currentAnalysis: analysis })
        // Also add to history (only for new analyses)
        get().addToHistory(analysis)
      },
      setCurrentAnalysisFromHistory: (analysis: AnalysisResult) => {
        // Set current analysis without adding to history (for viewing existing history items)
        set({ currentAnalysis: analysis })
      },
      clearCurrentAnalysis: () => set({ currentAnalysis: null }),
      addToHistory: (analysis: AnalysisResult) => {
        const history = get().history
        // Check if this analysis already exists in history (by timestamp)
        const exists = history.some(item => item.timestamp === analysis.timestamp)
        if (!exists) {
          const newHistory = [analysis, ...history].slice(0, 50) // Keep only last 50 analyses
          set({ history: newHistory })
        }
      },
      clearHistory: () => set({ history: [] }),
      removeFromHistory: (index: number) => {
        const history = get().history
        const newHistory = history.filter((_, i) => i !== index)
        set({ history: newHistory })
      },
    }),
    {
      name: 'analysis-store',
      // Only persist history, not current analysis
      partialize: (state) => ({ history: state.history }),
    }
  )
)
