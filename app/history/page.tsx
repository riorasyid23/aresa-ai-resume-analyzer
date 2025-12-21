'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { RefreshCw, FileText, Plus, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAnalysisStore } from '@/lib/store'
import { TAnalysis } from '@/types/analysis'
import { HistoryCard } from '@/components/HistoryCard'
import { motion, AnimatePresence } from 'framer-motion'

export default function History() {
  const router = useRouter()
  const { fetchHistory, history } = useAnalysisStore()
  const [currentHistory, setCurrentHistory] = useState<TAnalysis[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchHistory()
  }, [])

  useEffect(() => {
    if (history) {
      setLoading(false)
      setCurrentHistory(history)
    }
  }, [history])

  // const fetchHistory = async () => {
  //   try {
  //     setLoading(true)
  //     setError(null)
  //
  //     const response = await fetch('/api/analysis')
  //     const data = await response.json()
  //
  //     if (!response.ok) {
  //       throw new Error(data.error || 'Failed to fetch analysis history')
  //     }
  //
  //     setHistory(data)
  //   } catch (err) {
  //     console.error('Error fetching history:', err)
  //     setError(err instanceof Error ? err.message : 'Failed to load history')
  //     toast.error("Failed to load history", {
  //       description: "Unable to fetch your analysis history. Please try again.",
  //       richColors: true
  //     })
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const formatDate = (timestamp: number) => {
    // "2025-12-16T05:01:01.000Z" ==> 16 Dec 2025

    const date = new Date(timestamp);

    const formatter = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const formattedDate = formatter.format(date);

    return formattedDate;
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

  // For now, we'll show a simple view since we don't have the full analysis details from the backend
  // In a real implementation, you might want to store more details or fetch individual analyses
  // const viewAnalysis = (analysis: AnalysisHistory) => {
  //   toast.info("Analysis Details", {
  //     description: `Analysis from ${formatDate(analysis.createdAt)}`,
  //     richColors: true
  //   })
  // }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">ARESA Analysis History</h1>
          <p className="text-muted-foreground">Loading your analysis history...</p>
        </div>

        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
              <p className="text-muted-foreground">Fetching your analysis history...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">ARESA Analysis History</h1>
          <p className="text-muted-foreground">Error loading analysis history</p>
        </div>

        <Card className="text-center py-12 border-red-200">
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
              <div>
                <CardTitle className="text-lg mb-2 text-red-600">Failed to Load History</CardTitle>
                <p className="text-muted-foreground mb-6">{error}</p>
              </div>
              <Button onClick={fetchHistory} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentHistory.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 py-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">ARESA Analysis History</h1>
          <p className="text-muted-foreground">No previous analyses found</p>
        </div>

        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <CardTitle className="text-lg mb-2">Get Started with Resume Analysis</CardTitle>
                <p className="text-muted-foreground mb-6">
                  Upload your resume, paste text, or analyze a portfolio to see your analysis history here.
                </p>
              </div>
              <Button asChild size="lg">
                <Link href="/playground">
                  <Plus className="w-4 h-4 mr-2" />
                  Start New Analysis
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">ARESA Analysis History</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <FileText className="w-4 h-4" />
            {history.length} previous {history.length === 1 ? 'analysis' : 'analyses'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="default">
            <Link href="/playground">
              <Plus className="w-4 h-4 mr-2" />
              New Analysis
            </Link>
          </Button>
          <Button onClick={fetchHistory} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </motion.div>

      <Separator className="mb-8" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col space-y-6"
      >
        <AnimatePresence>
          {currentHistory.map((analysis) => (
            <motion.div key={analysis.id} variants={item}>
              <HistoryCard analysis={analysis} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
