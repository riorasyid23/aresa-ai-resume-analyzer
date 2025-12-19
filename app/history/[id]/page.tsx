'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAnalysisStore, AnalysisResult } from '@/lib/store'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import AnalysisResultView from '@/components/AnalysisResultView'

export default function HistoryDetail() {
    const { id } = useParams()
    const { fetchAnalysis, currentAnalysis } = useAnalysisStore()
    const [result, setResult] = useState<AnalysisResult | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!id) return

        const loadAnalysis = async () => {
            setLoading(true)
            try {
                await fetchAnalysis(id as string)
            } catch (err) {
                setError('Failed to load analysis')
            } finally {
                setLoading(false)
            }
        }

        loadAnalysis()
    }, [id])

    useEffect(() => {
        if (currentAnalysis) {
            setResult(currentAnalysis)
            setLoading(false)
        }
    }, [currentAnalysis])

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto py-12">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 mx-auto text-blue-500 animate-spin mb-4" />
                    <h2 className="text-xl font-semibold">Loading Analysis...</h2>
                </div>
            </div>
        )
    }

    if (error || !result) {
        return (
            <div className="max-w-4xl mx-auto py-12">
                <Card className="border-red-200">
                    <CardContent className="flex flex-col items-center p-6 text-center">
                        <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
                        <h2 className="text-xl font-bold text-red-700 mb-2">Analysis Not Found</h2>
                        <p className="text-gray-600 mb-6">
                            We couldn't find the analysis you're looking for. It might have been deleted or the ID is incorrect.
                        </p>
                        <Button asChild>
                            <Link href="/history">Back to History</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return <AnalysisResultView result={result} />
}
