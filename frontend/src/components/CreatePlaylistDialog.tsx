import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { useAuth } from "@clerk/clerk-react";
import { axiosInstance } from "@/lib/axios";
import type { Playlist } from "@/types";

interface CreatePlaylistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playlist?: Playlist | null; // For editing existing playlists
}

export function CreatePlaylistDialog({
  open,
  onOpenChange,
  playlist,
}: CreatePlaylistDialogProps) {
  const { createPlaylist, updatePlaylist, isLoading } = usePlaylistStore();
  const { isSignedIn, getToken } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    isPublic: false,
  });

  const isEditing = !!playlist;

  // Populate form data when editing
  useEffect(() => {
    if (playlist && open) {
      setFormData({
        name: playlist.name,
        description: playlist.description,
        imageUrl: playlist.imageUrl,
        isPublic: playlist.isPublic,
      });
    } else if (!playlist && open) {
      // Reset form for new playlist
      setFormData({
        name: "",
        description: "",
        imageUrl: "",
        isPublic: false,
      });
    }
  }, [playlist, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return;
    }

    // Check if user is signed in
    if (!isSignedIn) {
      console.error("User must be signed in to create/update playlists");
      return;
    }

    try {
      // Ensure we have a fresh token
      const token = await getToken();
      if (token) {
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
      }

      if (isEditing && playlist) {
        await updatePlaylist(playlist._id, {
          name: formData.name.trim(),
          description: formData.description.trim(),
          imageUrl: formData.imageUrl.trim(),
          isPublic: formData.isPublic,
        });
      } else {
        await createPlaylist({
          name: formData.name.trim(),
          description: formData.description.trim(),
          imageUrl: formData.imageUrl.trim(),
          isPublic: formData.isPublic,
        });
      }

      // Reset form
      setFormData({
        name: "",
        description: "",
        imageUrl: "",
        isPublic: false,
      });

      onOpenChange(false);
    } catch (error) {
      console.error(
        `Failed to ${isEditing ? "update" : "create"} playlist:`,
        error
      );
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Playlist" : "Create New Playlist"}
          </DialogTitle>
        </DialogHeader>

        {!isSignedIn && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            You must be signed in to create or edit playlists.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Playlist Name *
            </label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter playlist name"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter playlist description"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="imageUrl" className="text-sm font-medium">
              Cover Image URL
            </label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange("imageUrl", e.target.value)}
              placeholder="Enter image URL"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => handleInputChange("isPublic", e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="isPublic" className="text-sm font-medium">
              Make this playlist public
            </label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.name.trim() || !isSignedIn}
            >
              {isLoading
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : !isSignedIn
                ? "Please Sign In"
                : isEditing
                ? "Update Playlist"
                : "Create Playlist"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
