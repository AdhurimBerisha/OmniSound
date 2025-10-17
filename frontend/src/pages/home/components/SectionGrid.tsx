import type { Song } from "@/types";
import SectionGridSkeleton from "./SectionGridSkeleton";
import { Button } from "@/components/ui/button";
import PlayButton from "./PlayButton";
import { AddToPlaylistDialog } from "@/components/AddToPlaylistDialog";
import { useState } from "react";
import { Plus } from "lucide-react";

type SectionGridProps = {
  title: string;
  songs: Song[];
  isLoading: boolean;
};

const DEFAULT_VISIBLE = 4;

const SectionGrid = ({ title, songs, isLoading }: SectionGridProps) => {
  const [showAll, setShowAll] = useState(false);
  const [addToPlaylistOpen, setAddToPlaylistOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  if (isLoading) return <SectionGridSkeleton />;

  const visibleSongs = showAll ? songs : songs.slice(0, DEFAULT_VISIBLE);

  const handleAddToPlaylist = (song: Song) => {
    setSelectedSong(song);
    setAddToPlaylistOpen(true);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
        {songs.length > DEFAULT_VISIBLE && (
          <Button
            variant="link"
            className="text-sm text-zinc-400 hover:text-white"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? "Show less" : "Show all"}
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {visibleSongs.map((song) => (
          <div
            key={song._id}
            className="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer relative"
          >
            <div className="relative mb-4">
              <div className="aspect-square rounded-md shadow-lg overflow-hidden">
                <img
                  src={song.imageUrl}
                  alt={song.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <PlayButton song={song} />
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToPlaylist(song);
                }}
                className="absolute top-2 left-2 bg-blue-600 hover:bg-blue-500 text-white opacity-100 transition-opacity h-8 w-8 z-10"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <h3 className="font-medium mb-2 truncate">{song.title}</h3>
            <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
          </div>
        ))}
      </div>

      <AddToPlaylistDialog
        open={addToPlaylistOpen}
        onOpenChange={setAddToPlaylistOpen}
        song={selectedSong}
      />
    </div>
  );
};
export default SectionGrid;
