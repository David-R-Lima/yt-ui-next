'use client'

import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "../ui/checkbox"
import { GetTotalSize } from "@/services/offline";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
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

    const [downloadLimitUnit, setDownloadLimitUnit] = useState<
        "kb" | "mb" | "gb"
    >(() => {
        const value = getCookie("downloadLimitUnit")

        if (value === "kb" || value === "mb" || value === "gb") {
            return value
        }

        return "gb"
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
        if(downloadLimitUnit) {
            setCookie("downloadLimitUnit", downloadLimitUnit)
        }
    }


    return (
        <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
                <h1>Total size: </h1>

                {totalSizeQuery.data && (
                    <p>{formatStorage(totalSizeQuery.data)}</p>
                )}
            </div>
            <h1>Download Limit:</h1>
            <div className="flex items-center space-x-2">
                <Input type="number" defaultValue={downloadLimit} onChange={(e) => {
                    setDownloadLimit(Number(e.currentTarget.value))
                }} className="max-w-30"></Input>
                <Select defaultValue={downloadLimitUnit} onValueChange={(e: "kb" | "mb" | "gb") => {
                    setDownloadLimitUnit(e)
                }}>
                    <SelectTrigger className="max-w-30" >
                        <SelectValue placeholder="GBs" />
                    </SelectTrigger>
                        <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Size</SelectLabel>
                            <SelectItem value={"kb"}>KBs</SelectItem>
                            <SelectItem value={"mb"}>MBs</SelectItem>
                            <SelectItem value={"gb"}>GBs</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
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