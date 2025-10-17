import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { useChatStore } from "@/stores/useChatStore";
import { CreatePlaylistDialog } from "@/components/CreatePlaylistDialog";
import { SignedIn } from "@clerk/clerk-react";
import {
  HomeIcon,
  Library,
  MessageCircle,
  Music,
  Plus,
  Heart,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const LeftSidebar = () => {
  const { albums, fetchAlbums, isLoading, likedSongs, fetchLikedSongs } =
    useMusicStore();
  const {
    playlists,
    fetchUserPlaylists,
    isLoading: playlistsLoading,
  } = usePlaylistStore();
  const { getTotalUnreadCount } = useChatStore();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const totalUnreadMessages = getTotalUnreadCount();

  useEffect(() => {
    fetchAlbums();
    fetchUserPlaylists();
    fetchLikedSongs();
  }, [fetchAlbums, fetchUserPlaylists, fetchLikedSongs]);
  console.log({ albums });

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Navigation menu */}
      <div className="rounded-lg bg-zinc-900 p-4">
        <div className="space-y-2">
          <Link
            to={"/"}
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: "w-full justify-start text-white hover:bg-zinc-800",
              })
            )}
          >
            <HomeIcon className="mr-2 size-5" />
            <span className="hidden md:inline">Home</span>
          </Link>

          <SignedIn>
            <Link
              to={"/chat"}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className:
                    "w-full justify-start text-white hover:bg-zinc-800 relative",
                })
              )}
            >
              <MessageCircle className="mr-2 size-5" />
              <span className="hidden md:inline">Messages</span>
              {totalUnreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalUnreadMessages > 99 ? "99+" : totalUnreadMessages}
                </span>
              )}
            </Link>

            <Link
              to={"/playlists"}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className:
                    "w-full justify-start text-white hover:bg-zinc-800",
                })
              )}
            >
              <Music className="mr-2 size-5" />
              <span className="hidden md:inline">My Playlists</span>
            </Link>

            <Link
              to={"/liked-songs"}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className:
                    "w-full justify-start text-white hover:bg-zinc-800",
                })
              )}
            >
              <Heart className="mr-2 size-5" />
              <span className="hidden md:inline">Liked Songs</span>
            </Link>
          </SignedIn>
        </div>
      </div>
      {/* Library section */}
      <div className="flex-1 rounded-lg bg-zinc-900 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-white px-2">
            <Library className="size-5 mr-2 " />
            <span className="hidden md:inline">Library</span>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-2">
            {/* Albums */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-zinc-400 px-2 mb-2">
                Albums
              </h3>
              {isLoading ? (
                <PlaylistSkeleton />
              ) : (
                albums.slice(0, 5).map((album) => (
                  <Link
                    to={`/albums/${album._id}`}
                    key={album._id}
                    className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
                  >
                    <img
                      className="size-12 rounded-md flex-shrink-0 object-cover"
                      src={album.imageUrl}
                      alt="Album img"
                    />

                    <div className="flex-1 min-w-0 hidden md:block">
                      <p className="font-medium truncate">{album.title}</p>
                      <p className="text-sm text-zinc-400 truncate">
                        • Album • {album.artist}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* Liked Songs */}
            <SignedIn>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-zinc-400 px-2 mb-2">
                  Liked Songs
                </h3>
                <Link
                  to="/liked-songs"
                  className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-md flex items-center justify-center text-white font-bold text-lg">
                    ♥
                  </div>
                  <div className="flex-1 min-w-0 hidden md:block">
                    <p className="font-medium truncate">Liked Songs</p>
                    <p className="text-sm text-zinc-400 truncate">
                      • Playlist • {likedSongs.length} songs
                    </p>
                  </div>
                </Link>
              </div>
            </SignedIn>

            {/* User Playlists */}
            <SignedIn>
              <div>
                <div className="flex items-center justify-between px-2 mb-2">
                  <h3 className="text-sm font-medium text-zinc-400">
                    Your Playlists
                  </h3>
                  <button
                    onClick={() => setCreateDialogOpen(true)}
                    className="text-zinc-400 hover:text-white transition-colors"
                    title="Create new playlist"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {playlistsLoading ? (
                  <PlaylistSkeleton />
                ) : (
                  playlists.slice(0, 5).map((playlist) => (
                    <Link
                      to={`/playlists/${playlist._id}`}
                      key={playlist._id}
                      className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
                    >
                      {playlist.imageUrl ? (
                        <img
                          src={playlist.imageUrl}
                          alt={playlist.name}
                          className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md flex items-center justify-center text-white font-bold text-sm">
                          {playlist.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="flex-1 min-w-0 hidden md:block">
                        <p className="font-medium truncate">{playlist.name}</p>
                        <p className="text-sm text-zinc-400 truncate">
                          • Playlist • {playlist.songs.length} songs
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </SignedIn>
          </div>
        </ScrollArea>
      </div>

      {/* Create Playlist Dialog */}
      <CreatePlaylistDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
};
export default LeftSidebar;
