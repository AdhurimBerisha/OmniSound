import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Play, Shuffle, Clock, Pause, Heart } from "lucide-react";

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export function LikedSongsPage() {
  const { likedSongs, fetchLikedSongs, likeSong, unlikeSong, isLoading } =
    useMusicStore();
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

  useEffect(() => {
    fetchLikedSongs();
  }, [fetchLikedSongs]);

  const handlePlayLikedSongs = () => {
    if (likedSongs.length === 0) return;

    const isCurrentPlaylistPlaying = likedSongs.some(
      (song) => song._id === currentSong?._id
    );
    if (isCurrentPlaylistPlaying) togglePlay();
    else {
      playAlbum(likedSongs, 0);
    }
  };

  const handleShufflePlay = () => {
    if (likedSongs.length > 0) {
      const shuffledSongs = [...likedSongs].sort(() => Math.random() - 0.5);
      playAlbum(shuffledSongs, 0);
    }
  };

  const handlePlaySong = (index: number) => {
    if (likedSongs.length === 0) return;
    playAlbum(likedSongs, index);
  };

  const handleLikeToggle = (songId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isLiked = likedSongs.some((song) => song._id === songId);
    if (isLiked) {
      unlikeSong(songId);
    } else {
      likeSong(songId);
    }
  };

  const totalDuration = likedSongs.reduce(
    (total, song) => total + song.duration,
    0
  );

  if (isLoading) return null;

  if (likedSongs.length === 0) {
    return (
      <div className="h-full">
        <ScrollArea className="h-full rounded-md">
          <div className="p-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">No liked songs yet</h1>
              <p className="text-muted-foreground mb-4">
                Songs you like will appear here
              </p>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="h-full">
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
          <div className="relative z-10">
            <div className="flex p-6 gap-6 pb-8">
              <div className="w-[250px] h-[240px] rounded shadow-xl overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-6xl">
                  ♥
                </div>
              </div>
              <div className="flex flex-col justify-end">
                <p className="text-sm font-medium">Playlist</p>
                <h1 className="text-7xl font-bold my-4">Liked Songs</h1>
                <div className="flex items-center gap-2 text-sm text-zinc-100">
                  <span className="font-medium text-white">Songs you love</span>
                  <span>• {likedSongs.length} songs</span>
                  <span>• {formatDuration(totalDuration)}</span>
                </div>
              </div>
            </div>

            {/* Play and Shuffle buttons */}
            <div className="px-6 pb-4 flex items-center gap-6">
              <Button
                onClick={handlePlayLikedSongs}
                size="icon"
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400"
              >
                {isPlaying &&
                likedSongs.some((song) => song._id === currentSong?._id) ? (
                  <Pause className="h-7 w-7 text-black" />
                ) : (
                  <Play className="h-7 w-7 text-black" />
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleShufflePlay}
                disabled={likedSongs.length === 0}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Shuffle className="h-4 w-4 mr-2" />
                Shuffle
              </Button>
            </div>

            {/* Table Section */}
            <div className="bg-black/20 backdrop-blur-sm">
              {/* Table header */}
              <div
                className="grid grid-cols-[16px_4fr_2fr_1fr_auto] gap-4 px-10 py-2 text-sm 
            text-zinc-400 border-b border-white/5"
              >
                <div>#</div>
                <div>Title</div>
                <div>Date Added</div>
                <div>
                  <Clock className="h-4 w-4" />
                </div>
                <div></div>
              </div>

              {/* Songs list */}
              <div className="px-6">
                <div className="space-y-2 py-4">
                  {likedSongs.map((song, index) => {
                    const isCurrentSong = currentSong?._id === song._id;
                    return (
                      <div
                        key={song._id}
                        className="grid grid-cols-[16px_4fr_2fr_1fr_auto] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group"
                      >
                        {/* Play button */}
                        <div
                          className="flex items-center justify-center cursor-pointer"
                          onClick={() => handlePlaySong(index)}
                        >
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
                        <div
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => handlePlaySong(index)}
                        >
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
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => handlePlaySong(index)}
                        >
                          {song.createdAt?.split("T")[0]}
                        </div>

                        {/* Duration */}
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => handlePlaySong(index)}
                        >
                          {formatDuration(song.duration)}
                        </div>

                        {/* Like button */}
                        <div className="flex items-center justify-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleLikeToggle(song._id, e)}
                            className="size-8 text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Heart className="h-4 w-4 fill-current" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
