import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from 'next-themes'
import { Providers } from '@/components/providers'
import { AuthNav } from '@/components/auth-nav'
import { SessionWatcher } from '@/components/session-watcher'

export const metadata: Metadata = {
  title: 'ARESA - AI Resume Analyzer',
  description: 'Transform your resume with intelligent AI-powered analysis and actionable feedback',
  icons: {
    icon: '/favicon-aresa.png',
    apple: '/favicon-aresa.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthNav />
            <SessionWatcher />
            <main>
              {children}
            </main>
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
