"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { CreditDropdown } from "@/components/CreditDropdown"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { User, LogOut, CreditCard, Sparkles, FileText, Menu } from "lucide-react"
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
      <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-slate-800 dark:bg-slate-950/95 dark:supports-[backdrop-filter]:bg-slate-950/60 transition-colors">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={logoSrc}
              alt="ARESA Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="hidden sm:inline text-lg font-semibold text-slate-900 dark:text-slate-50">
              ARESA
            </span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-16 h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
            <ThemeToggle />
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-slate-800 dark:bg-slate-950/95 dark:supports-[backdrop-filter]:bg-slate-950/60 transition-colors">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
          <Image
            src={logoSrc}
            alt="ARESA Logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span className="hidden sm:inline text-lg font-semibold text-slate-900 dark:text-slate-50">
            ARESA
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-1 flex-1 justify-center">
          {session && (
            <>
              <Link
                href="/playground"
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50 transition-colors rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Playground
              </Link>
              <Link
                href="/history"
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50 transition-colors rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                History
              </Link>
            </>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {session ? (
            <>
              {/* Credits Dropdown - Desktop Only */}
              {/* <div className="hidden sm:block">
              </div> */}
              <CreditDropdown />

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline text-sm font-medium">
                      {session.user.firstName}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm font-semibold">
                    {session.user.firstName}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/playground" className="cursor-pointer">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Playground
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/history" className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" />
                      History
                    </Link>
                  </DropdownMenuItem>
                  <div className="flex md:hidden px-2 py-1.5 text-xs">
                    <CreditCard className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span>{session.user.credits} credits</span>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-red-600 dark:text-red-400 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm" className="hidden sm:inline-flex">
                Sign In
              </Button>
            </Link>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <VisuallyHidden>
                <SheetTitle>Navigation Menu</SheetTitle>
              </VisuallyHidden>
              <div className="mt-8 space-y-4">
                {session ? (
                  <>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                        {session.user.firstName}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300">
                        <CreditCard className="h-4 w-4" />
                        <span>{session.user.credits} credits</span>
                      </div>
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2">
                      <SheetClose asChild>
                        <Link href="/playground">
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                          >
                            <Sparkles className="mr-2 h-4 w-4" />
                            Playground
                          </Button>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/history">
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            History
                          </Button>
                        </Link>
                      </SheetClose>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <SheetClose asChild>
                    <Link href="/login">
                      <Button className="w-full">Sign In</Button>
                    </Link>
                  </SheetClose>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
