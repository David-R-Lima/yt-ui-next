'use client'

import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "../ui/checkbox"
import { GetTotalSize } from "@/services/offline";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { getCookie, setCookie } from "cookies-next"
import { useState } from "react";

const estimate = async () => {
    if (navigator.storage && navigator.storage.estimate) {
        navigator.storage.estimate().then(estimate => {
            console.log(`Required: ${estimate.usage}, Quota: ${estimate.quota}`);
        });
    }
}

function formatStorage(bytes: number) {
    if (bytes >= 1024 ** 3) {
        return `${(bytes / 1024 ** 3).toFixed(2)} GB`
    }

    return `${(bytes / 1024 ** 2).toFixed(1)} MB`
}


export function DownloadsSettingsComponent() {
    // estimate()
    const totalSizeQuery = useQuery({
        queryKey: ['totalSizeDownloads'],
        queryFn: GetTotalSize
    })

    const [downloadLimit, setDownloadLimit] = useState(() => {
        const value = getCookie("downloadLimit")
        return value ? Number(value) : 0
    })

    const [enableSmartDownload, setEnableSmartDownload] = useState(() => {
        const value = getCookie("smartDownload")
        return value === "true"
    })

    const saveSettings = () => {
        setCookie("smartDownload", enableSmartDownload)

        if(downloadLimit) {
            setCookie("downloadLimit", downloadLimit)
        }
    }


    return (
        <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
                <h1>Total size: </h1>

                {totalSizeQuery.data && (
                    <p> {formatStorage(totalSizeQuery.data)}</p>
                )}
            </div>
            <div className="flex flex-row items-center space-x-2">
                <h1>Download Limit:</h1>
                <Input type="number" defaultValue={downloadLimit} onChange={(e) => {
                    setDownloadLimit(Number(e.currentTarget.value))
                }} className="max-w-30"></Input>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox checked={enableSmartDownload} onCheckedChange={(e) => {
                    setEnableSmartDownload(!enableSmartDownload)
                }}></Checkbox>
                <h1>Enable smart downloads</h1>
            </div>
            <div>
            </div>
                <Button className="w-40" onClick={() => {
                    saveSettings()
                }}>Save</Button>
            <div>
                <Button className="w-40" variant={'destructive'}>Clear downloads</Button>
            </div>
        </div>
    )
}