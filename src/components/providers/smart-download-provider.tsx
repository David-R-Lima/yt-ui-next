'use client'

import { SmartDownload } from "@/services/offline"
import { getCookie, setCookie } from "cookies-next"

import { useEffect } from "react"
import { toast } from "sonner"

export function SmartDownloadComponent() {
    useEffect(() => {
        const load = async () => {
            if (process.env.NODE_ENV === "development") {
                return
            }
            const smartdownload = await getCookie("smartDownload")
            const limit = await getCookie("downloadLimit")
            const lastRun = localStorage.getItem("smartdownload_last_run")

            if (smartdownload !== "true" || !limit || lastRun) {
                return
            }

            toast.message("smart download started")

            await SmartDownload(Number(limit))

            localStorage.setItem(
                "smartdownload_last_run",
                Date.now().toString()
            )
        }

        load()
    }, [])
    return null
}