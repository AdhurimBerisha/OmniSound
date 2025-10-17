import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { AddToPlaylistDialog } from "@/components/AddToPlaylistDialog";
import type { Song } from "@/types";
import { Pause, Play, Plus, Heart } from "lucide-react";

interface SongCardProps {
  song: Song;
  showAddToPlaylist?: boolean;
}

export function SongCard({ song, showAddToPlaylist = true }: SongCardProps) {
  const { currentSong, isPlaying, setCurrentSong, togglePlay } =
    usePlayerStore();
  const { likedSongs, likeSong, unlikeSong } = useMusicStore();
  const [addToPlaylistOpen, setAddToPlaylistOpen] = useState(false);

  const isCurrentSong = currentSong?._id === song._id;
  const isLiked = likedSongs.some((likedSong) => likedSong._id === song._id);

  const handlePlay = () => {
    if (isCurrentSong) togglePlay();
    else setCurrentSong(song);
  };

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiked) {
      unlikeSong(song._id);
    } else {
      likeSong(song._id);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <div className="group flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
        <div className="relative">
          <img
            src={song.imageUrl}
            alt={song.title}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <Button
            size="icon"
            onClick={handlePlay}
            className={`absolute inset-0 bg-green-500 hover:bg-green-400 hover:scale-105 transition-all 
              opacity-0 group-hover:opacity-100 ${
                isCurrentSong
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              }`}
          >
            {isCurrentSong && isPlaying ? (
              <Pause className="size-4 text-black" />
            ) : (
              <Play className="size-4 text-black" />
            )}
          </Button>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{song.title}</h3>
          <p className="text-sm text-muted-foreground truncate">
            {song.artist}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {formatDuration(song.duration)}
          </span>

          <Button
            size="icon"
            variant="ghost"
            onClick={handleLikeToggle}
            className={`opacity-0 group-hover:opacity-100 transition-opacity ${
              isLiked
                ? "text-red-500 hover:text-red-600"
                : "text-muted-foreground hover:text-red-500"
            }`}
          >
            <Heart className={`size-4 ${isLiked ? "fill-current" : ""}`} />
          </Button>

          {showAddToPlaylist && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setAddToPlaylistOpen(true)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Plus className="size-4" />
            </Button>
          )}
        </div>
      </div>

      <AddToPlaylistDialog
        open={addToPlaylistOpen}
        onOpenChange={setAddToPlaylistOpen}
        song={song}
      />
    </>
  );
}
