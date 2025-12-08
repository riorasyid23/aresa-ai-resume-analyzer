'use client'

import Link from 'next/link'
import { useAnalysisStore } from '@/lib/store'
import { useState } from 'react'
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
import { Trash2, Eye, Plus, Calendar, FileText, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react'

export default function History() {
  const { history, removeFromHistory, clearHistory, setCurrentAnalysisFromHistory } = useAnalysisStore()

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

  const handleDeleteAnalysis = async (index: number, analysis: any) => {
    try {
      // Get analysis type for the toast message
      const analysisType = analysis.type === 'portfolio' ? 'Portfolio analysis' : 'Resume analysis'

      // Remove from history
      removeFromHistory(index)

      // Show success toast
      toast.success(`${analysisType} deleted successfully`, {
        description: "The analysis has been removed from your history.",
        richColors: true
      })
    } catch (error) {
      console.error('Error deleting analysis:', error)
      toast.error("Failed to delete analysis", {
        description: "An error occurred while deleting the analysis. Please try again.",
        richColors: true
      })
    }
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
                <Link href="/">
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
            <Link href="/">
              <Plus className="w-4 h-4 mr-2" />
              New Analysis
            </Link>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear History
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear All History?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your analysis history
                  and remove all stored data from your browser.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    try {
                      clearHistory()
                      toast.success("History cleared successfully", {
                        description: "All analysis history has been removed.",
                        duration: 3000,
                      })
                    } catch (error) {
                      console.error('Error clearing history:', error)
                      toast.error("Failed to clear history", {
                        description: "An error occurred while clearing your history. Please try again.",
                        duration: 4000,
                      })
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Clear All History
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Separator className="mb-8" />

      <div className="grid gap-6">
        {history.map((analysis, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full ${getScoreBg(analysis.score)} flex items-center justify-center border-2 border-white shadow-sm`}>
                    <span className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
                      {analysis.score}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-1">
                      {analysis.type === 'portfolio' ? 'Portfolio Analysis' : 'Resume Analysis'}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(analysis.timestamp)}
                      </div>
                      {analysis.filename && (
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {analysis.filename}
                        </div>
                      )}
                      {analysis.portfolioUrl && (
                        <div className="flex items-center gap-1">
                          <Badge variant="secondary" className="text-xs">
                            Portfolio
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="mt-2">
                      <Badge variant={analysis.score >= 80 ? "default" : analysis.score >= 60 ? "secondary" : "destructive"}>
                        {analysis.score >= 80 ? "Excellent" : analysis.score >= 60 ? "Good" : "Needs Improvement"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={analysis.type === 'portfolio' ? '/portfolio-results' : '/results'} onClick={() => viewAnalysis(analysis)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Link>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Analysis?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this analysis from your history. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteAnalysis(index, analysis)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete Analysis
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <h4 className="font-medium text-green-700">Strengths</h4>
                    <Badge variant="outline" className="text-xs">{analysis.strengths.length}</Badge>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1 pl-6">
                    {analysis.strengths.slice(0, 2).map((strength, i) => (
                      <li key={i} className="truncate">• {strength}</li>
                    ))}
                    {analysis.strengths.length > 2 && (
                      <li className="text-muted-foreground text-xs">+{analysis.strengths.length - 2} more</li>
                    )}
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <h4 className="font-medium text-red-700">Areas for Improvement</h4>
                    <Badge variant="outline" className="text-xs">{(analysis.weaknesses || []).length}</Badge>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1 pl-6">
                    {(analysis.weaknesses || []).slice(0, 2).map((weakness, i) => (
                      <li key={i} className="truncate">• {weakness}</li>
                    ))}
                    {(analysis.weaknesses || []).length > 2 && (
                      <li className="text-muted-foreground text-xs">+{(analysis.weaknesses || []).length - 2} more</li>
                    )}
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-blue-600" />
                    <h4 className="font-medium text-blue-700">Recommendations</h4>
                    <Badge variant="outline" className="text-xs">{(analysis.improvements || []).length}</Badge>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1 pl-6">
                    {(analysis.improvements || []).slice(0, 2).map((improvement, i) => (
                      <li key={i} className="truncate">• {improvement}</li>
                    ))}
                    {(analysis.improvements || []).length > 2 && (
                      <li className="text-muted-foreground text-xs">+{(analysis.improvements || []).length - 2} more</li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
