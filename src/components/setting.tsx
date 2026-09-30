'use client'
import { Loader2 } from "lucide-react";
import { ModeToggle } from "./theme-toggle";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Button } from "./ui/button";
import { AddYoutubeSongComponent } from "./settings/add-youtube-songs";
import { YoutubeAuthComponent } from "./settings/youtube-auth";
import { DownloadsSettingsComponent } from "./settings/downloads";

export function SettingsComponent() {

    return (
        <div className="w-full">
            <Accordion type="single" collapsible className="w-full ">
                <AccordionItem value="theme" >
                    <AccordionTrigger className="hover:cursor-pointer">Theme</AccordionTrigger>
                    <AccordionContent>
                        <ModeToggle></ModeToggle>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="yt-song" className="hover:cursor-pointer">
                    <AccordionTrigger>Add youtube song</AccordionTrigger>
                    <AccordionContent>
                        <AddYoutubeSongComponent></AddYoutubeSongComponent>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="log-yt">
                    <AccordionTrigger className="hover:cursor-pointer">Youtube auth</AccordionTrigger>
                    <AccordionContent>
                        <YoutubeAuthComponent></YoutubeAuthComponent>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="downloads">
                    <AccordionTrigger className="hover:cursor-pointer">Downloads</AccordionTrigger>
                    <AccordionContent>
                        <DownloadsSettingsComponent></DownloadsSettingsComponent>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}