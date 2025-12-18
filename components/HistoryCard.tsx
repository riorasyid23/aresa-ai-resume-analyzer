'use client'

import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Calendar, Eye, FileText, CheckCircle, AlertTriangle, ArrowRight, Clock } from 'lucide-react'
import { TAnalysis } from '@/types/analysis'

interface HistoryCardProps {
    analysis: TAnalysis
}

export function HistoryCard({ analysis }: HistoryCardProps) {
    const router = useRouter()

    const parsedOutput = useMemo(() => {
        try {
            if (!analysis.outputText) return null
            return JSON.parse(analysis.outputText)
        } catch (e) {
            console.error('Failed to parse outputText', e)
            return null
        }
    }, [analysis.outputText])

    const formatDate = (timestamp: number) => {
        // Handle both seconds (Unix) and milliseconds
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

    const score = parsedOutput?.score || 0
    const strengths = parsedOutput?.strengths || []
    const summary = parsedOutput?.rewritten_summary || parsedOutput?.summary || ''

    return (
        <Card className="hover:shadow-md transition-all duration-300 border-l-4 border-l-primary/0 hover:border-l-primary overflow-hidden group">
            <CardHeader className="pb-3 pt-5">
                <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${score > 0 ? getScoreBg(score) : 'bg-red-100'}`}>
                            <span className={`text-xl font-bold ${score > 0 ? getScoreColor(score) : 'text-red-600'}`}>
                                {score > 0 ? score : '!'}
                            </span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                                Resume Analysis
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{formatDate(analysis.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                    {analysis.creditCost !== 0 && (
                        <Badge variant="secondary" className="font-mono text-xs">
                            {Math.abs(analysis.creditCost)} credits
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="pb-3">
                <div className="mb-4 space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Overall Score</span>
                        <span>{score > 0 ? `${score}/100` : 'Not Scored'}</span>
                    </div>
                    <Progress value={score} className="h-2" />
                </div>

                {strengths.length > 0 && (
                    <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                            {strengths.slice(0, 3).map((strength: string, i: number) => (
                                <Badge key={i} variant="outline">
                                    <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
                                    {strength.length > 30 ? strength.substring(0, 30) + '...' : strength}
                                </Badge>
                            ))}
                            {strengths.length > 3 && (
                                <Badge variant="default">
                                    +{strengths.length - 3} more
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                {summary ? (
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {summary !== "" ? summary : "No summary available"}
                    </p>
                ) : (score === 0 || !parsedOutput) && (
                    <div className="flex flex-col p-3 rounded-md bg-amber-50 border border-amber-100">
                        <div className="flex items-center gap-2 text-amber-700 font-medium text-sm">
                            <AlertTriangle className="w-4 h-4" />
                            <span>Analysis Failed</span>
                        </div>
                        <p className="text-xs text-amber-600/90 pl-6 leading-relaxed">
                            The analysis process could not be completed properly. This might be due to an unreadable file or server timeout. Click 'View Details' to check.
                        </p>
                    </div>
                )}
            </CardContent>

            <CardFooter className="pt-0 pb-4 flex justify-end">
                <Button
                    variant="ghost"
                    size="sm"
                    className="group/btn text-muted-foreground hover:text-foreground"
                    onClick={() => router.push(`/history/${analysis.id}`)}
                >
                    View Details
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
                </Button>
            </CardFooter>
        </Card>
    )
}
