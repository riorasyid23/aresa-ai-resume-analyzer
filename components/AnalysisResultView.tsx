'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Coins, FileText, Info } from 'lucide-react'
import { AnalysisResult } from '@/lib/store'

interface AnalysisResultViewProps {
    result: AnalysisResult
}

export default function AnalysisResultView({ result }: AnalysisResultViewProps) {
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

    const getScoreBadgeVariant = (score: number) => {
        if (score >= 80) return 'default' as const
        if (score >= 60) return 'secondary' as const
        return 'destructive' as const
    }

    const getScoreLabel = (score: number) => {
        if (score >= 80) return 'Excellent'
        if (score >= 60) return 'Good'
        return 'Needs Improvement'
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                    ARESA Analysis Results
                </h1>
                <Link href="/" className="text-primary hover:text-primary/80 text-sm">
                    ← Analyze another resume
                </Link>
            </div>

            {/* Credit Usage & File Info */}
            {(result.creditsDeducted || result.filename) && (
                <Alert className="mb-6 bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-800">Analysis Complete</AlertTitle>
                    <AlertDescription className="text-blue-700 flex flex-col sm:flex-row sm:items-center gap-4 mt-2">
                        {result.filename && (
                            <span className="flex items-center gap-1.5">
                                <FileText className="h-4 w-4" />
                                File: <span className="font-medium">{result.filename}</span>
                            </span>
                        )}
                        {result.creditsDeducted !== undefined && (
                            <span className="flex items-center gap-1.5">
                                <Coins className="h-4 w-4" />
                                Credits used: <span className="font-medium">{result.creditsDeducted}</span>
                                {result.creditsRemaining !== undefined && (
                                    <span className="opacity-80">(Remaining: {result.creditsRemaining})</span>
                                )}
                            </span>
                        )}
                    </AlertDescription>
                </Alert>
            )}

            {/* Resume Score */}
            <Card className="mb-6">
                <CardHeader className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <CardTitle className="text-xl">Resume Score</CardTitle>
                        <Badge variant={getScoreBadgeVariant(result.score)}>
                            {getScoreLabel(result.score)}
                        </Badge>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBg(result.score)}`}>
                            <span className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
                                {result.score}
                            </span>
                        </div>
                        <div className="w-full max-w-xs">
                            <Progress value={result.score} className="h-2" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-muted-foreground">
                        {result.score >= 80 ? 'Excellent resume!' :
                            result.score >= 60 ? 'Good resume with room for improvement' :
                                'Resume needs significant improvements'}
                    </p>
                </CardContent>
            </Card>

            <Separator className="my-6" />

            <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Strengths */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-700">
                            <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                                ✅ Strengths
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {result.strengths.map((strength: string, index: number) => (
                                <li key={index} className="text-foreground flex items-start">
                                    <span className="text-green-500 mr-3 mt-0.5">•</span>
                                    <span>{strength}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Weaknesses */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-700">
                            <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">
                                ⚠️ Areas for Improvement
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {result.weaknesses.map((weakness: string, index: number) => (
                                <li key={index} className="text-foreground flex items-start">
                                    <span className="text-red-500 mr-3 mt-0.5">•</span>
                                    <span>{weakness}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <Separator className="my-6" />

            {/* Actionable Improvements */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                            🚀 Actionable Improvements
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {result.improvements.map((improvement: string, index: number) => (
                            <li key={index} className="text-foreground flex items-start">
                                <Badge variant="outline" className="mr-3 mt-0.5 flex-shrink-0 w-6 h-6 p-0 flex items-center justify-center text-xs">
                                    {index + 1}
                                </Badge>
                                <span>{improvement}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            {/* Rewritten Summary */}
            {result.rewritten_summary && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-purple-700">
                            <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                                ✨ Suggested Summary Rewrite
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-muted rounded-md p-4">
                            <p className="text-foreground whitespace-pre-line">
                                {result.rewritten_summary}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
