import { Song } from "../services/songs/types";
import UseControls from "@/store/song-control-store";
import { Download, EllipsisVertical, Heart, Loader2, Minus, Plus, Trash } from "lucide-react";
import { usePlaylists } from "../hooks/usePlaylists";
import { AddSong, DeleteSong, UpdateSong } from "../services/songs";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Liked } from "../services/enums/liked";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { AddSongToPlaylist, RemoveSongFromPlaylist } from "../services/playlist";
import { HardDelete } from "../services/enums/hardDelete";
import { Checkbox } from "./ui/checkbox";
import { DeleteOfflineSong } from "@/services/offline";
import Link from "next/link";

interface Props {
    song: Song
    onClick: () => void
    playlistId?: string
}

export function OfflineSongItem({ song, onClick }: Props) {

    const {currentSong, isPlaying} = UseControls()

    const [alertOpen, setAlertOpen] = useState(false)

    const [popoverOpen, setPopoverOpen] = useState(false)

    const [onlyDeleteFile, setOnlyDeleteFile] = useState(true)

    const deleteSongMutation = useMutation({
        mutationFn: DeleteOfflineSong,
        onSuccess: () => {
            toast.success("Deleted song")
        },
        onError: () => {
            toast.error("Something went wrong!")
        }
    })

    return (
        <div className="flex h-17.5 items-center justify-between w-full space-x-4 border-b rounded-lg p-2 m-2 hover:bg-secondary" >
            <div className="flex items-center space-x-4 hover:cursor-pointer" onClick={() => {
                onClick()
            }}> 
                {song.img_url && (
                    <img className="size-10 object-cover" src={song.img_url} alt="" />
                )}
                <div>
                    <p className={`truncate max-w-50 md:max-w-75 lg:max-w-87.5 xl:max-w-full ${currentSong?.id === song.id && isPlaying ? "text-primary animate-pulse" : ""}`}>{(song.title ?? 'Untitled').replace(/\.mp3$/i, '')}</p>
                    {song?.artist && (() => {
                        const artists = [
                            ...new Set(
                                song.artist
                                    .split(",")
                                    .map((artist) => artist.trim())
                                    .filter(Boolean)
                            ),
                        ];

                        return (
                            <div className="flex items-center gap-1 truncate max-w-50 md:max-w-75 lg:max-w-87.5 xl:max-w-full text-sm text-muted-foreground">
                                {artists.map((artist, i) => (
                                    <Link
                                        key={artist}
                                        href={`/home/artist/${encodeURIComponent(artist)}`}
                                        className="hover:text-primary hover:underline"
                                    >
                                        {artist}
                                        {i < artists.length - 1 && ","}
                                    </Link>
                                ))}
                            </div>
                        );
                    })()}
                </div>    
            </div>
            <div className="flex items-center justify-center space-x-4">
                {
                    song.duration && (
                        <p>
                            {Math.floor(song.duration / 60)}:
                            {(song.duration % 60).toString().padStart(2, '0')}
                        </p>
                    )
                }
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger className="hover:cursor-pointer">
                        <EllipsisVertical />
                    </PopoverTrigger>
                    <PopoverContent className="space-y-2">
                        <AlertDialog open={alertOpen} onOpenChange={(open) => {
                                setAlertOpen(open);
                                if (!open) {
                                    setPopoverOpen(false);
                                }
                        }}>
                            <AlertDialogTrigger className="flex space-x-4 w-full hover:cursor-pointer hover:bg-secondary p-2 rounded-lg">
                                <Trash className="text-red-500 hover:animate-pulse hover:cursor-pointer"/> 
                                <p>Delete song</p>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    account and remove your data from our servers.
                                </AlertDialogDescription>
                                <div className="flex items-center space-x-2">
                                    <Checkbox checked={onlyDeleteFile} onCheckedChange={() => {
                                        setOnlyDeleteFile(!onlyDeleteFile)
                                    }} className="hover:cursor-pointer"/>
                                    <p>Only delete file</p>
                                </div>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => {
                                        deleteSongMutation.mutate({
                                            song_id: song.id
                                        })
                                    }}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}