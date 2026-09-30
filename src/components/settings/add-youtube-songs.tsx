'use client'

import { Loader2 } from "lucide-react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useMutation } from "@tanstack/react-query"
import { AddSong } from "@/services/songs"
import { useState } from "react"


export function AddYoutubeSongComponent() {

    const [url, setUrl] = useState("")

    const addYoutubeSongMutation = useMutation({
        mutationFn: AddSong
    })
    return (
        <div className="flex items-center justify-center space-x-4">
            <Input placeholder="Ex: https://youtu.be/dQw4w9WgXcQ?si=2o-nEuzG3yqBx4IA" onChange={(e) => {
                setUrl(e.target.value)
            }}></Input>
            {addYoutubeSongMutation.isPending && <Loader2 className="animate-spin"/>}
            {!addYoutubeSongMutation.isPending && (
                <Button onClick={() => {
                    addYoutubeSongMutation.mutate({
                        url
                    })
                }}>Add</Button>
            )}
        </div>
    )
}