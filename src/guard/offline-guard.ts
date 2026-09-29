"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

export function OfflineRouteGuard() {
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        if (!navigator.onLine && pathname !== "/home/downloads") {
            router.replace("/home/downloads")
        }
    }, [pathname, router])

    return null
}