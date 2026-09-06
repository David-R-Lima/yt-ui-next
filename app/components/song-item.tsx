import { Song } from "@/services/songs/types";
import UseControls from "@/store/song-control-store";
import { Download, EllipsisVertical, Heart, Loader2, Minus, Plus, Trash } from "lucide-react";
import { usePlaylists } from "@/hooks/usePlaylists";
import { AddSong, DeleteSong, UpdateSong } from "@/services/songs";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Liked } from "@/services/enums/liked";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { AddSongToPlaylist, RemoveSongFromPlaylist } from "@/services/playlist";
import { HardDelete } from "@/services/enums/hardDelete";
import { Checkbox } from "./ui/checkbox";

interface Props {
    song: Song
    onClick: () => void
    playlistId?: string
}

export function SongItem({ song, onClick, playlistId }: Props) {

    const {currentSong, isPlaying} = UseControls()

    const [alertOpen, setAlertOpen] = useState(false)

    const [popoverOpen, setPopoverOpen] = useState(false)

    const [onlyDeleteFile, setOnlyDeleteFile] = useState(true)

    const playlists = usePlaylists()

    const addSongtoPlaylistMutation = useMutation({
        mutationFn: AddSongToPlaylist,
        onSuccess: () => {
            toast.success("Song Added to playlist")
            playlists.refetch()
        },
        onError: () => {
            toast.error("Something went wrong!")
        }
    })

    const removeSongFromPlaylistMutation = useMutation({
        mutationFn: RemoveSongFromPlaylist,
        onSuccess: () => {
            toast.success("Song Removed to playlist")
            playlists.refetch()
        },
        onError: () => {
            toast.error("Something went wrong!")
        }
    })

    const updateSongMutation = useMutation({
        mutationFn: UpdateSong,
        onSuccess: () => {
            toast.success("Liked song")
        },
        onError: () => {
            toast.error("Something went wrong!")
        }
    })

    const deleteSongMutation = useMutation({
        mutationFn: DeleteSong,
        onSuccess: () => {
            toast.success("Deleted song")
            playlists.refetch()
        },
        onError: () => {
            toast.error("Something went wrong!")
        }
    })

    const downloadSongMutation = useMutation({
        mutationKey: ["download", playlistId],
        mutationFn: AddSong,
        onSuccess: () => {
            toast.success("Downloaded song")
        },
        onError: () => {
            toast.error("Something went wrong!")
        }
    })

    return (
        <div className="flex h-[70px] items-center justify-between w-full space-x-4 border-b rounded-lg p-2 m-2 hover:bg-secondary" >
            <div className="flex items-center space-x-4 hover:cursor-pointer" onClick={() => {
                onClick()
            }}> 
                {song.img_url && (
                    <img className="size-10" src={song.img_url} alt="" />
                )}
                <p className={`truncate max-w-[100px] md:max-w-[300px] lg:max-w-[350px] xl:max-w-full ${currentSong?.id === song.id && isPlaying ? "text-primary animate-pulse" : ""}`}>{(song.title ?? 'Untitled').replace(/\.mp3$/i, '')}</p>

                {
                    song.duration && (
                        <p>
                            {Math.floor(song.duration / 60)}:
                            {(song.duration % 60).toString().padStart(2, '0')}
                        </p>
                    )
                }
                {
                    !song.local_url && song.youtube_url && !downloadSongMutation.isPending && (
                        <Download className="hover:animate-pulse text-primary" onClick={() => {
                            downloadSongMutation.mutate({
                                url: song.youtube_url as string
                            })
                        }}></Download>
                    )
                }
                {
                    downloadSongMutation.isPending && (
                        <Loader2 className="animate-spin text-primary" />
                    )
                }
            </div>
            <div className="flex items-center justify-center space-x-4">
                <DropdownMenu>
                    <DropdownMenuTrigger className="hover:cursor-pointer">                
                        <Plus />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Playlists</DropdownMenuLabel>
                        <DropdownMenuSeparator></DropdownMenuSeparator>
                        {playlists.data && playlists.data.playlists.map((playlist, i) => (
                            <DropdownMenuItem key={i} className="hover:cursor-pointer" onClick={() => {
                                addSongtoPlaylistMutation.mutate({
                                    songId: song.id,
                                    playlistId: playlist.id,
                                })
                            }}>
                                {playlist.name ?? "no name"}
                            </DropdownMenuItem>

                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                {
                    song.liked ? (
                        <Heart className="fill-primary text-primary transition-colors hover:animate-pulse hover:cursor-pointer" onClick={() => {
                            updateSongMutation.mutate({
                                song_id: song.id,
                                liked: Liked.FALSE
                            })

                            song.liked = false
                        }}/>
                    ) : (
                        <Heart className="transition-colors hover:animate-pulse hover:cursor-pointer" onClick={() => {
                            updateSongMutation.mutate({
                                song_id: song.id,
                                liked: Liked.TRUE
                            })

                            song.liked = true
                        }}/>
                    )
                }
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger className="hover:cursor-pointer">
                        <EllipsisVertical />
                    </PopoverTrigger>
                    <PopoverContent className="space-y-2">
                        {song && playlistId && (
                            <div className="flex space-x-4 hover:cursor-pointer hover:bg-secondary p-2 rounded-lg" onClick={() => {
                                if(song && playlistId) {
                                    removeSongFromPlaylistMutation.mutate({
                                        songId: song.id,
                                        playlistId: playlistId
                                    })
                                }
                            }}> 
                                <Minus />
                                <p>Remove from playlist</p>
                            </div>
                        )}
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
                                            hard_delete: onlyDeleteFile ? HardDelete.FALSE : HardDelete.TRUE,
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