'use client'

import { useMutation } from "@tanstack/react-query"
import { Button } from "../ui/button"
import { LoginYoutube } from "@/services/youtube"
import { Loader2 } from "lucide-react"


export function YoutubeAuthComponent() {

    const loginYoutube = useMutation({
        mutationFn: LoginYoutube,
        onSuccess: ({data}) => {
            window.open(data.url, "_blank", "noopener,noreferrer")
        }
    })

    return (
        <div>
            {loginYoutube.isPending && <Loader2 className="animate-spin"/>}
            {!loginYoutube.isPending && (
                <Button onClick={()=> {
                    loginYoutube.mutate()
                }}>Auth</Button>
            )}
        </div>
    )
}