import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreatePlaylistDialog } from "@/components/CreatePlaylistDialog";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import {
  ArrowLeft,
  Play,
  Shuffle,
  Edit,
  Trash2,
  Clock,
  Pause,
} from "lucide-react";

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export function PlaylistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentPlaylist, fetchPlaylistById, deletePlaylist, isLoading } =
    usePlaylistStore();
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPlaylistById(id);
    }
  }, [id, fetchPlaylistById]);

  const handlePlayPlaylist = () => {
    if (!currentPlaylist) return;

    const isCurrentPlaylistPlaying = currentPlaylist?.songs.some(
      (song) => song._id === currentSong?._id
    );
    if (isCurrentPlaylistPlaying) togglePlay();
    else {
      // start playing the playlist from the beginning
      playAlbum(currentPlaylist?.songs, 0);
    }
  };

  const handleShufflePlay = () => {
    if (currentPlaylist && currentPlaylist.songs.length > 0) {
      const shuffledSongs = [...currentPlaylist.songs].sort(
        () => Math.random() - 0.5
      );
      playAlbum(shuffledSongs, 0);
    }
  };

  const handlePlaySong = (index: number) => {
    if (!currentPlaylist) return;
    playAlbum(currentPlaylist?.songs, index);
  };

  const handleDeletePlaylist = async () => {
    if (!currentPlaylist) return;

    if (window.confirm("Are you sure you want to delete this playlist?")) {
      setIsDeleting(true);
      try {
        await deletePlaylist(currentPlaylist._id);
        navigate("/playlists");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const totalDuration =
    currentPlaylist?.songs.reduce((total, song) => total + song.duration, 0) ||
    0;

  if (isLoading) return null;

  if (!currentPlaylist) {
    return (
      <div className="h-full">
        <ScrollArea className="h-full rounded-md">
          <div className="p-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Playlist not found</h1>
              <Button onClick={() => navigate("/playlists")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Playlists
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="h-full ">
      <ScrollArea className="h-full rounded-md">
        {/* Main Content */}
        <div className="relative min-h-screen">
          {/* Bg gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80
					 to-zinc-900 pointer-events-none"
            aria-hidden="true"
          />

          {/* Content */}
          <div className="relative z-10 ">
            <div className="flex p-6 gap-6 pb-8">
              <div className="w-[250px] h-[240px] bg-gradient-to-br from-purple-500 to-pink-500 rounded shadow-xl flex items-center justify-center text-white font-bold text-6xl">
                {currentPlaylist.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col justify-end">
                <p className="text-sm font-medium">Playlist</p>
                <h1 className="text-7xl font-bold my-4">
                  {currentPlaylist.name}
                </h1>
                <div className="flex items-center gap-2 text-sm text-zinc-100">
                  {currentPlaylist.description && (
                    <span className="font-medium text-white">
                      {currentPlaylist.description}
                    </span>
                  )}
                  <span>• {currentPlaylist.songs.length} songs</span>
                  <span>• {formatDuration(totalDuration)}</span>
                  <span>
                    • {currentPlaylist.isPublic ? "Public" : "Private"}
                  </span>
                </div>
              </div>
            </div>

            {/* Play and Shuffle buttons */}
            <div className="px-6 pb-4 flex items-center gap-6">
              <Button
                onClick={handlePlayPlaylist}
                size="icon"
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400"
              >
                {isPlaying &&
                currentPlaylist?.songs.some(
                  (song) => song._id === currentSong?._id
                ) ? (
                  <Pause className="h-7 w-7 text-black" />
                ) : (
                  <Play className="h-7 w-7 text-black" />
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleShufflePlay}
                disabled={currentPlaylist.songs.length === 0}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Shuffle className="h-4 w-4 mr-2" />
                Shuffle
              </Button>
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditDialogOpen(true)}
                  className="text-white hover:bg-white/10"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDeletePlaylist}
                  disabled={isDeleting}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Table Section */}
            <div className="bg-black/20 backdrop-blur-sm">
              {/* Table header */}
              <div
                className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm 
            text-zinc-400 border-b border-white/5"
              >
                <div>#</div>
                <div>Title</div>
                <div>Date Added</div>
                <div>
                  <Clock className="h-4 w-4" />
                </div>
              </div>

              {/* Songs list */}
              <div className="px-6">
                <div className="space-y-2 py-4">
                  {currentPlaylist.songs.length === 0 ? (
                    <div className="text-center py-8 text-zinc-400">
                      <p>No songs in this playlist yet</p>
                      <p className="text-sm">
                        Add songs from the home page or albums
                      </p>
                    </div>
                  ) : (
                    currentPlaylist.songs.map((song, index) => {
                      const isCurrentSong = currentSong?._id === song._id;
                      return (
                        <div
                          key={song._id}
                          onClick={() => handlePlaySong(index)}
                          className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer"
                        >
                          {/* Play button */}
                          <div className="flex items-center justify-center">
                            {isCurrentSong && isPlaying ? (
                              <div className="size-4 text-green-500">♫</div>
                            ) : (
                              <span className="group-hover:hidden">
                                {index + 1}
                              </span>
                            )}
                            {!isCurrentSong && (
                              <Play className="h-4 w-4 hidden group-hover:block" />
                            )}
                          </div>

                          {/* Song info */}
                          <div className="flex items-center gap-3">
                            <img
                              src={song.imageUrl}
                              alt={song.title}
                              className="size-10"
                            />
                            <div>
                              <div className="font-medium text-white">
                                {song.title}
                              </div>
                              <div>{song.artist}</div>
                            </div>
                          </div>

                          {/* Date Added */}
                          <div className="flex items-center">
                            {song.createdAt?.split("T")[0]}
                          </div>

                          {/* Duration */}
                          <div className="flex items-center">
                            {formatDuration(song.duration)}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Edit Dialog */}
      <CreatePlaylistDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        playlist={currentPlaylist}
      />
    </div>
  );
}
