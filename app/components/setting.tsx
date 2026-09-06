'use client'
import { Loader2, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { ModeToggle } from "./theme-toggle";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { AddSong } from "@/services/songs";
import { useState } from "react";


export function SettingsDialog() {

    const [url, setUrl] = useState("")

    const addYoutubeSongMutation = useMutation({
        mutationFn: AddSong
    })

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Settings className="hover:cursor-pointer text-primary"  />
            </DialogTrigger>
            <DialogContent className="flex w-full min-w-[30vw] min-h-[20vh]">
                <Accordion type="single" collapsible className="w-full ">
                    <AccordionItem value="theme" >
                        <AccordionTrigger className="hover:cursor-pointer">Theme</AccordionTrigger>
                        <AccordionContent>
                            <ModeToggle></ModeToggle>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="yt-song" className="hover:cursor-pointer">
                        <AccordionTrigger>Add youtube song</AccordionTrigger>
                        <AccordionContent className="flex items-center justify-center space-x-4">
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
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </DialogContent>
        </Dialog>
    )
}