"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"
import { Clock, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function SessionWatcher() {
    const { data: session, status } = useSession()
    const [showModal, setShowModal] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (status !== "authenticated" || !session?.loginAt) return

        const checkSession = () => {
            const fifteenMinutesInMs = 15 * 60 * 1000
            // const fifteenMinutesInMs = 20 * 1000  // 20 seconds for testing
            const now = Date.now()
            const loginTime = session.loginAt as number
            const expiryTime = loginTime + fifteenMinutesInMs

            if (now >= expiryTime) {
                setShowModal(true)
            }
        }

        // Check every 10 seconds
        const interval = setInterval(checkSession, 10000)

        // Initial check
        checkSession()

        return () => clearInterval(interval)
    }, [session, status])

    const handleLogout = async () => {
        setShowModal(false)
        await signOut({ callbackUrl: "/login" })
    }

    return (
        <AlertDialog open={showModal} onOpenChange={setShowModal}>
            <AlertDialogContent className="max-w-[90vw] sm:max-w-[425px] border-none bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl overflow-hidden p-0">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-rose-500/10 pointer-events-none" />

                <div className="p-6 sm:p-8 text-center relative z-10">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4 sm:mb-6"
                    >
                        <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                    </motion.div>

                    <AlertDialogHeader className="mb-4 sm:mb-6">
                        <AlertDialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                            Session Expired
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
                            Your session has reached its security limit. To keep your account secure, please sign in again to continue using
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400"> ARESA</span>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="sm:justify-center">
                        <AlertDialogAction
                            onClick={handleLogout}
                            className="w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Securely Re-login
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}
