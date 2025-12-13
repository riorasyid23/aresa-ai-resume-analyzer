'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Trash2, Eye, Plus, Calendar, FileText, CheckCircle, AlertCircle, Lightbulb, RefreshCw } from 'lucide-react'

interface AnalysisHistory {
  id: string
  userId: string
  inputText: string
  outputText: string
  creditCost: number
  createdAt: number
}

export default function History() {
  const [history, setHistory] = useState<AnalysisHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/analysis')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch analysis history')
      }

      setHistory(data)
    } catch (err) {
      console.error('Error fetching history:', err)
      setError(err instanceof Error ? err.message : 'Failed to load history')
      toast.error("Failed to load history", {
        description: "Unable to fetch your analysis history. Please try again.",
        richColors: true
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString() // Convert Unix timestamp to milliseconds
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
  const viewAnalysis = (analysis: AnalysisHistory) => {
    toast.info("Analysis Details", {
      description: `Analysis from ${formatDate(analysis.createdAt)}`,
      richColors: true
    })
  }

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

  if (history.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
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
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
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
      </div>

      <Separator className="mb-8" />

      <div className="grid gap-6">
        {history.map((analysis) => (
          <Card key={analysis.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white shadow-sm">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-1">
                      Resume Analysis
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(analysis.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">
                          {Math.abs(analysis.creditCost)} credits
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => viewAnalysis(analysis)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Analysis Input:</h4>
                  <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md line-clamp-2">
                    {analysis.inputText}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Analysis Output:</h4>
                  <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md line-clamp-3">
                    {analysis.outputText}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-sm text-muted-foreground">
                    ID: {analysis.id}
                  </div>
                  <Badge variant="secondary">
                    {new Date(analysis.createdAt * 1000).toLocaleDateString()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
