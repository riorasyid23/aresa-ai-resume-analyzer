'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useAnalysisStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, CheckCircle2, Sparkles, AlertCircle, X, ArrowRight, Zap, Shield, FileSearch } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function AnalyzePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [loadingStep, setLoadingStep] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)

  const router = useRouter()
  const { update } = useSession()
  const setCurrentAnalysis = useAnalysisStore((state) => state.setCurrentAnalysis)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    validateAndSetFile(file)
  }

  const validateAndSetFile = (file: File | undefined) => {
    if (file) {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      const allowedExtensions = ['.pdf', '.docx']
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))

      if (allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension)) {
        if (file.size > 10 * 1024 * 1024) {
          toast.error("File too large", {
            description: "Please upload a file smaller than 10MB",
            richColors: true,
          })
          return
        }
        setSelectedFile(file)
        toast.success("File selected", {
          description: file.name,
          icon: <FileText className="w-4 h-4" />,
          duration: 2000
        })
      } else {
        toast.error("Invalid file type", {
          description: "Please upload a PDF or DOCX file",
          richColors: true,
        })
      }
    }
  }

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error("Input Required", {
        description: "Please upload a PDF or DOCX file to analyze",
        richColors: true,
      })
      return
    }

    setIsAnalyzing(true)
    setLoadingStep('Extracting text from your resume...')

    try {
      const analyzeResumeFile = useAnalysisStore.getState().analyzeResumeFile
      setLoadingStep('Uploading file to server...')

      // Artificial delay for UX if it's too fast, but we'll stick to real logic

      setLoadingStep('Analyzing content with AI...')
      const result = await analyzeResumeFile(selectedFile, 'resume')

      if (!result.success || result.error) {
        throw new Error(result.error || 'Analysis failed')
      }

      if (result.creditsRemaining !== undefined) {
        await update()
      }

      setCurrentAnalysis(result)

      if (result.id) {
        router.push(`/results/${result.id}`)
      } else {
        router.push('/results')
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      toast.error("Analysis Failed", {
        description: errorMessage,
        richColors: true,
        duration: 6000,
      })
      setIsAnalyzing(false)
      setLoadingStep('')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      validateAndSetFile(files[0])
    }
  }

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob" />
        <div className="absolute top-[30%] left-[10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-[20%] left-[30%] w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="w-full max-w-5xl mx-auto z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Left Column: Text & Features */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none px-3 py-1 text-sm font-medium dark:bg-blue-900/30 dark:text-blue-300">
              <Sparkles className="w-4 h-4 mr-2 inline-block" />
              AI-Powered Resume Analysis
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
              Optimize Your Resume needed for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Dream Job</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed">
              Upload your resume and get instant, detailed feedback on ATS compatibility, content quality, and formatting to land more interviews.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              { icon: Zap, label: "Instant ATS Score", desc: "Get a score based on industry standards" },
              { icon: FileSearch, label: "Deep Content Analysis", desc: "Detailed feedback on every section" },
              { icon: Shield, label: "Privacy First", desc: "Your data is secure and never shared" },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 backdrop-blur-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (idx * 0.1) }}
              >
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                  <feature.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{feature.label}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Column: Upload Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl ring-1 ring-gray-200 dark:ring-gray-800">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold">Upload Resume</h2>
                  <p className="text-gray-500 text-sm">Supported formats: PDF, DOCX (Max 10MB)</p>
                </div>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "relative group cursor-pointer flex flex-col items-center justify-center w-full h-64 rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out",
                    isDragOver
                      ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 scale-[1.02]"
                      : "border-gray-300 dark:border-gray-700 hover:border-blue-400 hover:bg-gray-50/50 dark:hover:bg-gray-800/50",
                    selectedFile ? "border-green-500 bg-green-50/30 dark:bg-green-900/10" : ""
                  )}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isAnalyzing}
                  />

                  <AnimatePresence mode="wait">
                    {selectedFile ? (
                      <motion.div
                        key="file-selected"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex flex-col items-center p-4 text-center w-full"
                      >
                        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                          <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <p className="font-semibold text-lg text-gray-900 dark:text-white truncate max-w-[240px] mb-1">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={clearFile}
                            className="hover:text-red-600 hover:border-red-200 hover:bg-red-50"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                          <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSubmit()
                            }}
                            disabled={isAnalyzing}
                          >
                            {isAnalyzing ? (
                              <span className="flex items-center">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                Analyzing...
                              </span>
                            ) : (
                              <span className="flex items-center">
                                Results <ArrowRight className="w-4 h-4 ml-1" />
                              </span>
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="upload-prompt"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center text-center"
                      >
                        <div className={cn(
                          "w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110",
                          isDragOver ? "bg-blue-100 text-blue-600" : "bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500"
                        )}>
                          <Upload className="w-10 h-10" />
                        </div>
                        <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                          {isDragOver ? "Drop file here" : "Click to upload or drag & drop"}
                        </p>
                        <p className="text-sm text-gray-500 max-w-[260px]">
                          We support PDF and DOCX files for instant AI analysis.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Analysis Progress */}
                <AnimatePresence>
                  {isAnalyzing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-900/50">
                        <div className="flex items-center gap-3">
                          <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                          </div>
                          <p className="text-sm font-medium text-blue-700 dark:text-blue-300 animate-pulse">
                            {loadingStep}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  )
}
