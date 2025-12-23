"use client"

import { useState } from "react"
import { useSession, signIn } from "next-auth/react"
import { CreditCard, RefreshCw, Zap, Gift } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function CreditDropdown() {
  const { data: session, update } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  if (!session?.user) {
    return null
  }

  const handleSync = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/sync")

      if (!response.ok) {
        throw new Error("Failed to sync credits")
      }

      const data = await response.json()
      console.log("Sync data:", data)

      // Update session with new credits and creditResetAt
      await update({
        credits: data.credits,
        creditResetAt: data.creditResetAt,
      })

      toast({
        description: `Credits updated! You now have ${data.credits} credits.`,
      })
    } catch (error) {
      console.error("Sync error:", error)
      toast({
        variant: "destructive",
        description: "Failed to update credits. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetDate = session.user.creditResetAt
    ? new Date(session.user.creditResetAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900 dark:hover:to-orange-900 border border-amber-400 dark:border-amber-700 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <div className="relative">
            <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400 fill-amber-600 dark:fill-amber-400" />
          </div>
          <span className="text-xs font-bold text-amber-700 dark:text-amber-100">
            {session.user.credits}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border border-amber-200 dark:border-amber-900/30 shadow-2xl">
        {/* Premium Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 dark:from-amber-600 dark:via-orange-500 dark:to-amber-600 px-6 py-6">
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_25%,rgba(68,68,68,.2)_50%,transparent_50%,transparent_75%,rgba(68,68,68,.2)_75%,rgba(68,68,68,.2))] bg-[length:60px_60px]"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-white uppercase tracking-widest opacity-95">
                Your Valuable Credits
              </p>
              <Gift className="h-4 w-4 text-white" />
            </div>
            <p className="text-4xl font-black text-white drop-shadow-lg">
              {session.user.credits}
            </p>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Credit Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border border-amber-200 dark:border-amber-600 rounded-lg p-3 hover:from-slate-100 hover:to-slate-150 dark:hover:from-slate-750 dark:hover:to-slate-650 transition-colors">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-widest mb-1">
                Status
              </p>
              <p className="text-sm font-bold text-amber-900 dark:text-amber-100">
                {session.user.credits > 0 ? "✨ Active" : "⚠️ Low"}
              </p>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border border-amber-200 dark:border-amber-600 rounded-lg p-3">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-widest mb-1">
                Renews On
              </p>
              <p className="text-xs font-mono text-amber-700 dark:text-amber-200">
                {resetDate}
              </p>
            </div>
          </div>

          {/* Info Message */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-750 border border-amber-300 dark:border-amber-600 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-xs text-amber-900 dark:text-amber-100 leading-relaxed">
              💎 Your credits are valuable assets. Use them wisely and they'll reset on the date above.
            </p>
          </div>

          <DropdownMenuSeparator className="bg-amber-200 dark:bg-amber-700" />

          {/* Sync Button - Premium Style */}
          <Button
            onClick={handleSync}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-amber-600/50 active:scale-95"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span className="font-semibold">
              {isLoading ? "Syncing..." : "Sync Credits"}
            </span>
          </Button>

          {/* Footer Text */}
          <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-2">
            Click refresh to update from server
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
