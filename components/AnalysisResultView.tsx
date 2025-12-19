'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Coins, FileText, Info } from 'lucide-react'
import { AnalysisResult } from '@/lib/store'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

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

    // Animation variants
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
        <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="max-w-4xl mx-auto"
        >
            <motion.div variants={item} className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                    ARESA Analysis Results
                </h1>
                <Link href="/" className="text-primary hover:text-primary/80 text-sm transition-colors">
                    ← Analyze another resume
                </Link>
            </motion.div>

            {/* Credit Usage & File Info */}
            {(result.creditsDeducted || result.filename) && (
                <motion.div variants={item}>
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
                </motion.div>
            )}

            {/* Resume Score */}
            <motion.div variants={item}>
                <Card className="mb-6 overflow-hidden border-2">
                    <CardHeader className="text-center bg-gray-50/50 dark:bg-gray-800/50 pb-6">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <CardTitle className="text-xl">Resume Score</CardTitle>
                            <Badge variant={getScoreBadgeVariant(result.score)}>
                                {getScoreLabel(result.score)}
                            </Badge>
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
                                className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getScoreBg(result.score)} ring-4 ring-offset-4 ring-offset-background ${getScoreColor(result.score).replace('text-', 'ring-').replace('600', '100')}`}
                            >
                                <span className={`text-4xl font-black ${getScoreColor(result.score)}`}>
                                    {result.score}
                                </span>
                            </motion.div>
                            <div className="w-full max-w-sm space-y-2">
                                <Progress value={result.score} className="h-3" />
                                <div className="flex justify-between text-xs text-muted-foreground w-full px-1">
                                    <span>0</span>
                                    <span>50</span>
                                    <span>100</span>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="text-center pt-6">
                        <p className="text-lg font-medium text-foreground">
                            {result.score >= 80 ? 'Excellent work! Your resume is ready for the big leagues.' :
                                result.score >= 60 ? 'Good layout, but content needs more punch.' :
                                    'Your resume needs a significant overhaul to pass ATS.'}
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

            <Separator className="my-6" />

            <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Strengths */}
                <motion.div variants={item}>
                    <Card className="h-full border-green-200 dark:border-green-900/30">
                        <CardHeader className="bg-green-50/30 dark:bg-green-900/10 border-b border-green-100 dark:border-green-900/30">
                            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                                <span>✅ Strengths</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <ul className="space-y-3">
                                {result.strengths.map((strength: string, index: number) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + (index * 0.1) }}
                                        className="text-foreground flex items-start text-sm"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-3 mt-1.5 shrink-0" />
                                        <span>{strength}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Weaknesses */}
                <motion.div variants={item}>
                    <Card className="h-full border-red-200 dark:border-red-900/30">
                        <CardHeader className="bg-red-50/30 dark:bg-red-900/10 border-b border-red-100 dark:border-red-900/30">
                            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                                <span>⚠️ Areas for Improvement</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <ul className="space-y-3">
                                {result.weaknesses.map((weakness: string, index: number) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + (index * 0.1) }}
                                        className="text-foreground flex items-start text-sm"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-3 mt-1.5 shrink-0" />
                                        <span>{weakness}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <Separator className="my-6" />

            {/* Actionable Improvements */}
            <motion.div variants={item}>
                <Card className="mb-6 border-blue-200 dark:border-blue-900/30">
                    <CardHeader className="bg-blue-50/30 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/30">
                        <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                            🚀 Actionable Improvements
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <ul className="space-y-4">
                            {result.improvements.map((improvement: string, index: number) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 + (index * 0.1) }}
                                    className="text-foreground flex items-start"
                                >
                                    <div className="mr-4 mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold border border-blue-200 dark:border-blue-800">
                                        {index + 1}
                                    </div>
                                    <span className="text-sm">{improvement}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Rewritten Summary */}
            {result.rewritten_summary && (
                <motion.div variants={item}>
                    <Card className="border-purple-200 dark:border-purple-900/30">
                        <CardHeader className="bg-purple-50/30 dark:bg-purple-900/10 border-b border-purple-100 dark:border-purple-900/30">
                            <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
                                ✨ Suggested Summary Rewrite
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="bg-muted/50 rounded-lg p-6 border border-border">
                                <p className="text-foreground whitespace-pre-line leading-relaxed italic">
                                    "{result.rewritten_summary}"
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </motion.div>
    )
}
