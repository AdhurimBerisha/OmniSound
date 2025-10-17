import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Playlist } from "@/types";
import { Play, MoreHorizontal, Trash2, Edit } from "lucide-react";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { useState } from "react";

interface PlaylistCardProps {
  playlist: Playlist;
  onPlay?: (playlist: Playlist) => void;
  onEdit?: (playlist: Playlist) => void;
  showActions?: boolean;
}

export function PlaylistCard({
  playlist,
  onPlay,
  onEdit,
  showActions = true,
}: PlaylistCardProps) {
  const { deletePlaylist } = usePlaylistStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      setIsDeleting(true);
      try {
        await deletePlaylist(playlist._id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const totalDuration = playlist.songs.reduce(
    (total, song) => total + song.duration,
    0
  );

  return (
    <Card className="group hover:bg-accent/50 transition-colors cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {playlist.imageUrl ? (
              <img
                src={playlist.imageUrl}
                alt={playlist.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                {playlist.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <CardTitle className="text-base">{playlist.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {playlist.songs.length} songs • {formatDuration(totalDuration)}
              </p>
            </div>
          </div>

          {showActions && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay?.(playlist);
                }}
                className="h-8 w-8"
              >
                <Play className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(playlist);
                }}
                className="h-8 w-8"
              >
                <Edit className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                disabled={isDeleting}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      {playlist.description && (
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {playlist.description}
          </p>
        </CardContent>
      )}
    </Card>
  );
}
