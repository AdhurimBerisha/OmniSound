import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { Plus, Music } from "lucide-react";
import type { Song, Playlist } from "@/types";

interface AddToPlaylistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  song: Song | null;
}

export function AddToPlaylistDialog({
  open,
  onOpenChange,
  song,
}: AddToPlaylistDialogProps) {
  const {
    playlists,
    addSongToPlaylist,
    createPlaylist,
    fetchUserPlaylists,
    isLoading,
  } = usePlaylistStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  useEffect(() => {
    if (open) {
      setShowCreateForm(false);
      setNewPlaylistName("");
    }
  }, [open]);

  const handleAddToPlaylist = async (playlistId: string) => {
    if (!song) return;

    try {
      await addSongToPlaylist(playlistId, song._id);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to add song to playlist:", error);
    }
  };

  const handleCreateAndAdd = async () => {
    if (!song || !newPlaylistName.trim()) return;

    try {
      await createPlaylist({
        name: newPlaylistName.trim(),
        description: `Created for ${song.title}`,
        isPublic: false,
      });

      setTimeout(async () => {
        try {
          const newPlaylist = playlists.find(
            (p) => p.name === newPlaylistName.trim()
          );
          if (newPlaylist) {
            await addSongToPlaylist(newPlaylist._id, song._id);
          } else {
            await fetchUserPlaylists();
            const updatedPlaylists = usePlaylistStore.getState().playlists;
            const foundPlaylist = updatedPlaylists.find(
              (p) => p.name === newPlaylistName.trim()
            );
            if (foundPlaylist) {
              await addSongToPlaylist(foundPlaylist._id, song._id);
            }
          }
          onOpenChange(false);
        } catch (error) {
          console.error("Failed to add song to new playlist:", error);
        }
      }, 500);
    } catch (error) {
      console.error("Failed to create playlist:", error);
    }
  };

  if (!song) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Playlist</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Song info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <img
                  src={song.imageUrl}
                  alt={song.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-medium">{song.title}</h3>
                  <p className="text-sm text-muted-foreground">{song.artist}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Playlist selection */}
          {!showCreateForm ? (
            <div className="space-y-2">
              <h4 className="font-medium">Choose a playlist:</h4>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {playlists.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <Music className="h-8 w-8 mx-auto mb-2" />
                    <p>No playlists yet</p>
                  </div>
                ) : (
                  playlists.map((playlist) => (
                    <Card
                      key={playlist._id}
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => handleAddToPlaylist(playlist._id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {playlist.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">
                              {playlist.name}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {playlist.songs.length} songs
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              <Button
                variant="outline"
                onClick={() => setShowCreateForm(true)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Playlist
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="playlistName" className="text-sm font-medium">
                  Playlist Name
                </label>
                <input
                  id="playlistName"
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Enter playlist name"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleCreateAndAdd}
                  disabled={isLoading || !newPlaylistName.trim()}
                  className="flex-1"
                >
                  {isLoading ? "Creating..." : "Create & Add"}
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
