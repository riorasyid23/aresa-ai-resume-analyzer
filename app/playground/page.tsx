'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useAnalysisStore } from '@/lib/store'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertTriangle, ExternalLink, RefreshCw, X, Upload, FileText, Link } from 'lucide-react'
import { toast } from 'sonner'

export default function AnalyzePage() {
  const [resumeText, setResumeText] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [loadingStep, setLoadingStep] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()
  const { update } = useSession()
  const setCurrentAnalysis = useAnalysisStore((state) => state.setCurrentAnalysis)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      const allowedExtensions = ['.pdf', '.docx']
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))

      if (allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension)) {
        setSelectedFile(file)
        setResumeText('') // Clear text when file is selected
        setPortfolioUrl('') // Clear URL when file is selected
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Determine which type of analysis to perform
    const isPortfolioAnalysis = portfolioUrl.trim() !== '' && !selectedFile && !resumeText.trim()

    if (!selectedFile && !resumeText.trim() && !isPortfolioAnalysis) {
      toast.error("Input Required", {
        description: "Please upload a PDF, DOCX, paste your resume text, or enter a portfolio URL",
        richColors: true,
        duration: 4000,
      })
      return
    }

    if (isPortfolioAnalysis) {
      const trimmedUrl = portfolioUrl.trim()
      console.log('Validating portfolio URL:', trimmedUrl)
      if (!trimmedUrl) {
        toast.error("Portfolio URL Required", {
          description: "Please enter a portfolio URL to analyze",
          richColors: true,
          duration: 4000,
        })
        return
      }
      if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
        toast.error("Invalid URL Format", {
          description: "Please enter a valid URL starting with http:// or https://",
          richColors: true,
          duration: 4000,
        })
        return
      }
      // Basic URL validation
      try {
        new URL(trimmedUrl)
      } catch {
        toast.error("Invalid URL", {
          description: "Please enter a valid URL format",
          richColors: true,
          duration: 4000,
        })
        return
      }
    }

    setIsAnalyzing(true)
    setLoadingStep('Extracting text from your resume...')
    setErrorMessage('') // Clear any previous errors

    try {
      if (isPortfolioAnalysis) {
        // Portfolio analysis
        setLoadingStep('Fetching portfolio content...')

        const response = await fetch('/api/analyze-portfolio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: portfolioUrl.trim() }),
        })

        if (!response.ok) {
          throw new Error('Portfolio analysis failed: ' + response.statusText)
        }

        setLoadingStep('Analyzing portfolio and generating insights...')

        const result = await response.json()
        if(!result.success) {
          throw new Error('Portfolio analysis failed')
        }

        // Save portfolio analysis result to backend and deduct credits
        // Temporarily disabled for debugging
        /*
        setLoadingStep('Saving analysis results...')
        const analysisData = {
          prompt: `Analyze portfolio/website: ${portfolioUrl.trim()}`,
          output: result.analysis || result.feedback || JSON.stringify(result)
        }

        try {
          const analysisResponse = await fetch('/api/analysis', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(analysisData),
          })

          const analysisResult = await analysisResponse.json()

          if (!analysisResponse.ok) {
            if (analysisResult.error?.includes('Insufficient credits')) {
              throw new Error('Insufficient credits. Please contact support to purchase more credits.')
            }
            throw new Error(analysisResult.error || 'Failed to save analysis results')
          }

          console.log('Portfolio analysis saved successfully, credits deducted:', analysisResult.creditsDeducted)

          // Update the result with credits information
          result.creditsDeducted = analysisResult.creditsDeducted
          result.creditsRemaining = analysisResult.creditsRemaining

          // Refresh session to update credits display
          await update()

        } catch (error) {
          console.error('Failed to save portfolio analysis:', error)
          // Continue with the flow but log the error
          toast.error("Portfolio analysis completed but failed to save results", {
            description: "Your analysis was successful but couldn't be saved. Credits may not have been deducted.",
            richColors: true,
            duration: 5000,
          })
        }
        */

        console.log('Portfolio analysis successful, storing data...')
        const analysisWithMetadata = {
          ...result,
          timestamp: Date.now(),
          portfolioUrl: portfolioUrl.trim(),
          type: 'portfolio'
        }

        setCurrentAnalysis(analysisWithMetadata)
        console.log('Data stored, navigating to /portfolio-results...')
        router.push('/portfolio-results')
      } else {
        // Resume analysis (existing logic)
        setLoadingStep('Extracting text from your resume...')

        const formData = new FormData()
        if (selectedFile) {
          formData.append('file', selectedFile)
        } else {
          formData.append('text', resumeText)
        }

        setLoadingStep('Sending resume to AI analysis...')

        const response = await fetch('/api/analyze', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Analysis failed: ' + response.statusText)
        }

        setLoadingStep('Analyzing content and generating insights...')

        const result = await response.json()
        if(!result.success) {
          throw new Error('Analysis failed')
        }

        // Save analysis result to backend and deduct credits
        // Temporarily disabled for debugging
        /*
        setLoadingStep('Saving analysis results...')
        const analysisData = {
          prompt: selectedFile ? `Analyze resume file: ${selectedFile.name}` : `Analyze resume text: ${resumeText.substring(0, 100)}...`,
          output: result.analysis || result.feedback || JSON.stringify(result)
        }

        try {
          const analysisResponse = await fetch('/api/analysis', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(analysisData),
          })

          const analysisResult = await analysisResponse.json()

          if (!analysisResponse.ok) {
            if (analysisResult.error?.includes('Insufficient credits')) {
              throw new Error('Insufficient credits. Please contact support to purchase more credits.')
            }
            throw new Error(analysisResult.error || 'Failed to save analysis results')
          }

          console.log('Analysis saved successfully, credits deducted:', analysisResult.creditsDeducted)

          // Update the result with credits information
          result.creditsDeducted = analysisResult.creditsDeducted
          result.creditsRemaining = analysisResult.creditsRemaining

          // Refresh session to update credits display
          await update()

        } catch (error) {
          console.error('Failed to save analysis:', error)
          // Continue with the flow but log the error
          toast.error("Analysis completed but failed to save results", {
            description: "Your analysis was successful but couldn't be saved. Credits may not have been deducted.",
            richColors: true,
            duration: 5000,
          })
        }
        */

        console.log('Analysis successful, storing data...')
        console.log('Result object:', result)
        console.log('Result success:', result.success)
        console.log('Result strengths:', result.strengths)
        console.log('Result weaknesses:', result.weaknesses)
        console.log('Result improvements:', result.improvements)

        const analysisWithMetadata = {
          ...result,
          timestamp: Date.now(),
          resumeText: selectedFile ? undefined : resumeText,
          filename: selectedFile?.name,
          type: 'resume'
        }

        console.log('Analysis with metadata:', analysisWithMetadata)
        setCurrentAnalysis(analysisWithMetadata)
        console.log('Data stored, navigating to /results...')
        router.push('/results')
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setErrorMessage(errorMessage)
      toast.error("Analysis Failed", {
        description: errorMessage,
        richColors: true,
        duration: 6000,
      })
    } finally {
      console.log('Finally block executed, resetting loading state')
      setIsAnalyzing(false)
      setLoadingStep('')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          ARESA Playground
        </h1>
        <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
          AI Resume Analysis Lab
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          Welcome to your AI-powered resume analysis playground! Upload files, paste text, or analyze portfolios to get comprehensive feedback and scoring.
        </p>
      </div>

      {errorMessage && (
        <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50/50 relative animate-in slide-in-from-top-2 duration-300">
          <AlertTriangle className="h-4 w-4" />
          <button
            onClick={() => setErrorMessage('')}
            className="absolute top-3 right-3 text-red-600 hover:text-red-800 transition-colors"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
          <AlertTitle className="text-red-800 font-semibold pr-8">
            Portfolio Analysis Failed
          </AlertTitle>
          <AlertDescription className="text-red-700 mt-2">
            <div className="space-y-2">
              <p className="font-medium">Unable to access the portfolio URL you provided.</p>
              <div className="text-sm space-y-1">
                <p className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">•</span>
                  <span>{errorMessage}</span>
                </p>
              </div>
              <div className="bg-red-100/70 rounded-md p-3 mt-3 border border-red-200/50">
                <p className="text-sm font-medium text-red-800 mb-2">💡 Suggestions:</p>
                <ul className="text-sm space-y-1 text-red-700">
                  <li className="flex items-center gap-2">
                    <ExternalLink className="h-3 w-3" />
                    Check if the URL is correct and publicly accessible
                  </li>
                  <li className="flex items-center gap-2">
                    <RefreshCw className="h-3 w-3" />
                    Try a different portfolio URL (GitHub, personal website, etc.)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-400"></span>
                    Some sites may block automated access
                  </li>
                </ul>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Upload File</span>
              <span className="sm:hidden">File</span>
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Paste Text</span>
              <span className="sm:hidden">Text</span>
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              <span className="hidden sm:inline">Portfolio</span>
              <span className="sm:hidden">URL</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
              <CardHeader className="text-center pb-3">
                <CardTitle className="flex items-center justify-center gap-2 text-foreground">
                  <Upload className="h-5 w-5" />
                  Upload Resume File
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  PDF or DOCX files supported • Drag & drop or click to browse
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    disabled={isAnalyzing}
                  />
                  <Label
                    htmlFor="file-upload"
                    onClick={(e) => {
                      e.preventDefault()
                      fileInputRef.current?.click()
                    }}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setIsDragOver(true)
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault()
                      setIsDragOver(false)
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      setIsDragOver(false)
                      const files = e.dataTransfer.files
                      if (files.length > 0) {
                        const file = files[0]
                        const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
                        const allowedExtensions = ['.pdf', '.docx']
                        const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))

                        if (allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension)) {
                          setSelectedFile(file)
                          setResumeText('')
                          setPortfolioUrl('')
                        } else {
                          toast.error("Invalid file type", {
                            description: "Please upload a PDF or DOCX file",
                            richColors: true,
                          })
                        }
                      }
                    }}
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                      isDragOver
                        ? 'border-blue-500 bg-blue-50/70 scale-105'
                        : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className={`w-8 h-8 mb-3 transition-colors ${
                        isDragOver ? 'text-blue-500' : 'text-gray-400'
                      }`} />
                      <p className="mb-2 text-sm text-muted-foreground text-center">
                        <span className="font-semibold text-foreground">
                          {isDragOver ? 'Drop your file here' : 'Click to upload'}
                        </span>{' '}
                        {!isDragOver && 'or drag and drop'}
                      </p>
                      <p className="text-xs text-muted-foreground">PDF, DOCX (MAX. 10MB)</p>
                    </div>
                  </Label>
                  {selectedFile && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <FileText className="h-5 w-5 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-800">{selectedFile.name}</p>
                        <p className="text-xs text-green-600">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="text" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-700">
                  <FileText className="h-5 w-5" />
                  Paste Resume Text
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Copy and paste your resume content directly from any document
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={resumeText}
                  onChange={(e) => {
                    setResumeText(e.target.value)
                    setSelectedFile(null) // Clear file when text is entered
                    setPortfolioUrl('') // Clear URL when text is entered
                  }}
                  placeholder="Paste your resume text here...&#10;&#10;Tip: Copy from your existing resume or LinkedIn profile"
                  rows={10}
                  disabled={isAnalyzing}
                  className="resize-none"
                />
                {resumeText && (
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-muted-foreground">
                      {resumeText.length} characters
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      resumeText.length > 1000 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                    }`}>
                      {resumeText.length > 1000 ? 'Good length' : 'Add more content'}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Link className="h-5 w-5" />
                  Analyze Portfolio/Website
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Get insights on your online presence, projects, and professional branding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="url"
                      value={portfolioUrl}
                      onChange={(e) => {
                        setPortfolioUrl(e.target.value)
                        setSelectedFile(null) // Clear file when URL is entered
                        setResumeText('') // Clear text when URL is entered
                      }}
                      placeholder="https://your-portfolio.com or https://github.com/yourusername"
                      disabled={isAnalyzing}
                    />
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      Supports GitHub, personal websites, LinkedIn profiles, and portfolios
                    </p>
                  </div>
                  {portfolioUrl && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <ExternalLink className="h-5 w-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-800 truncate">{portfolioUrl}</p>
                        <p className="text-xs text-blue-600">Ready for analysis</p>
                      </div>
                    </div>
                  )}
                  <div className="bg-muted/50 border border-border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-foreground mb-2">What we'll analyze:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Content quality and presentation</li>
                      <li>• Project showcase and descriptions</li>
                      <li>• Skills and technologies displayed</li>
                      <li>• Overall design and user experience</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {isAnalyzing && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <div>
                <p className="text-blue-800 font-medium">Analyzing your resume...</p>
                <p className="text-blue-600 text-sm">{loadingStep || 'This may take a few moments'}</p>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isAnalyzing || (!selectedFile && !resumeText.trim() && !portfolioUrl.trim())}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isAnalyzing && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
          {isAnalyzing ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>
    </div>
  )
}
