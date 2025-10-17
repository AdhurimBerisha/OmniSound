import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreatePlaylistDialog } from "@/components/CreatePlaylistDialog";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { Plus, Music, Clock, Pause, Play } from "lucide-react";

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export function PlaylistPage() {
  const { playlists, isLoading, fetchUserPlaylists } = usePlaylistStore();
  const { songs, fetchSongs } = useMusicStore();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetchUserPlaylists();
    fetchSongs();
  }, [fetchUserPlaylists, fetchSongs]);

  if (isLoading) {
    return (
      <div className="h-full">
        <ScrollArea className="h-full rounded-md">
          <div className="relative min-h-screen">
            <div className="animate-pulse p-6">
              <div className="h-8 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  if (playlists.length === 0) {
    return (
      <div className="h-full">
        <ScrollArea className="h-full rounded-md">
          <div className="relative min-h-screen">
            <div className="p-6">
              <div className="text-center py-12">
                <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h1 className="text-2xl font-bold mb-2">No playlists yet</h1>
                <p className="text-muted-foreground mb-4">
                  Create your first playlist to organize your favorite songs
                </p>
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Playlist
                </Button>
              </div>
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
                <Music className="h-24 w-24" />
              </div>
              <div className="flex flex-col justify-end">
                <p className="text-sm font-medium">Playlists</p>
                <h1 className="text-7xl font-bold my-4">Your Library</h1>
                <div className="flex items-center gap-2 text-sm text-zinc-100">
                  <span className="font-medium text-white">
                    {playlists.length} playlists
                  </span>
                  <span>
                    •{" "}
                    {playlists.reduce((total, p) => total + p.songs.length, 0)}{" "}
                    songs
                  </span>
                </div>
              </div>
            </div>

            {/* Create Playlist button */}
            <div className="px-6 pb-4 flex items-center gap-6">
              <Button
                onClick={() => setCreateDialogOpen(true)}
                className="bg-green-500 hover:bg-green-400 text-black font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Playlist
              </Button>
            </div>

            {/* Playlists Grid */}
            <div className="bg-black/20 backdrop-blur-sm">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Your Playlists</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {playlists.map((playlist) => (
                    <div
                      key={playlist._id}
                      className="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer relative"
                    >
                      <div className="relative mb-4">
                        <div className="aspect-square rounded-md shadow-lg overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <span className="text-white font-bold text-4xl">
                            {playlist.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <h3 className="font-medium mb-2 truncate">
                        {playlist.name}
                      </h3>
                      <p className="text-sm text-zinc-400 truncate">
                        {playlist.songs.length} songs
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      <CreatePlaylistDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
