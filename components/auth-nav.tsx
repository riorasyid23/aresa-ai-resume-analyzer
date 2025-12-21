"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { User, LogOut, CreditCard, Sparkles, FileText } from "lucide-react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

export function AuthNav() {
  const { data: session, status } = useSession()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const logoSrc = mounted && resolvedTheme === "light"
    ? "/aresa-logo-light.svg"
    : "/aresa-logo.svg"

  if (status === "loading") {
    return (
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Image src={logoSrc} alt="ARESA Logo" width={32} height={32} className="w-8 h-8 transition-opacity duration-300" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                ARESA
              </span>
            </Link>
            <div className="flex items-center space-x-6">
              <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image src={logoSrc} alt="ARESA Logo" width={32} height={32} className="w-8 h-8 transition-opacity duration-300" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              ARESA
            </span>
          </Link>
          <div className="flex items-center space-x-6">
            {session ? (
              <>
                <Link href="/playground" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <span className="hidden sm:inline">Playground</span>
                  <Sparkles className="h-5 w-5 sm:hidden" />
                </Link>
                <Link href="/history" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <span className="hidden sm:inline">History</span>
                  <FileText className="h-5 w-5 sm:hidden" />
                </Link>
                <div className="flex items-center space-x-1 sm:space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <CreditCard className="h-4 w-4" />
                  <span className="hidden xs:inline">{session.user.credits} <span className="hidden md:inline">credits</span></span>
                  <span className="xs:hidden font-medium">{session.user.credits}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  <span className="hidden md:inline text-sm text-gray-600 dark:text-gray-300">
                    {session.user.firstName}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center space-x-1 px-2 sm:px-3"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="default" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
