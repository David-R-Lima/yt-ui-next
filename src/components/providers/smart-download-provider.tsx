'use client'

import { SmartDownload } from "@/services/offline"
import { getCookie, setCookie } from "cookies-next"

import { useEffect } from "react"
import { toast } from "sonner"

export function SmartDownloadComponent() {
    useEffect(() => {
        const load = async () => {
            const smartdownload = await getCookie("smartDownload")
            const limit = await getCookie("downloadLimit")
            const lastRun = await getCookie("smartdownload_last_run")

            if (smartdownload !== "true" || !limit || lastRun) {
                return
            }

            toast.message("smart download started")

            await SmartDownload(Number(limit))

            await setCookie("smartdownload_last_run", "true", {
                maxAge: 60 * 60 * 24,
            })
        }

        load()
    }, [])
    return null
}