'use client'

import { ListPlus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreatePlaylistSchema, CreatePlaylistType } from "@/services/playlist/types";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { CreatePlaylist } from "@/services/playlist";
import { toast } from "sonner";
import { useState } from "react";

export function AddPlaylistDialog() {
    const [open, setOpen] = useState(false)
    const {
        setValue,
        handleSubmit,
    } = useForm<CreatePlaylistType>({
        resolver: zodResolver(CreatePlaylistSchema),
    })

    const submit = useMutation({
        mutationFn: CreatePlaylist,
        onSuccess: () => {
            toast.message("Playlist created successfully")
            setOpen(false)
        },
        onError: (error) => {
            console.error(error)
        }
    })

    const handleSubmitForm = async (data: CreatePlaylistType) => {
        await submit.mutateAsync({
            ...data
        })
    }
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <ListPlus className="text-primary hover:cursor-pointer"/>
            </DialogTrigger>
            <DialogContent>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleSubmitForm)}>
                    <h1>Create playlist</h1>
                    <Input placeholder="Playlist name *" onChange={(e) => {
                        setValue('name', e.target.value)
                    }}></Input>
                    <Input placeholder="Description" onChange={(e) => {
                        setValue('description', e.target.value)
                    }}></Input>
                    {submit.isPending && (
                        <Button onClick={(e) =>{
                            e.preventDefault()
                        }}><Loader2 className="animate-spin"></Loader2></Button>
                    )}
                    {!submit.isPending && (
                        <Button>Create</Button>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    )
}