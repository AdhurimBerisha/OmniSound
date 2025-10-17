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
import { uploadFile } from "@/lib/fileUpload";
import type { Playlist } from "@/types";

interface CreatePlaylistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playlist?: Playlist | null;
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const isEditing = !!playlist;

  useEffect(() => {
    if (playlist && open) {
      setFormData({
        name: playlist.name,
        description: playlist.description,
        imageUrl: playlist.imageUrl,
        isPublic: playlist.isPublic,
      });
      setPreviewUrl(playlist.imageUrl || "");
      setSelectedFile(null);
    } else if (!playlist && open) {
      setFormData({
        name: "",
        description: "",
        imageUrl: "",
        isPublic: false,
      });
      setPreviewUrl("");
      setSelectedFile(null);
    }
  }, [playlist, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return;
    }

    if (!isSignedIn) {
      console.error("User must be signed in to create/update playlists");
      return;
    }

    try {
      const token = await getToken();
      if (token) {
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
      }

      let imageUrl = formData.imageUrl.trim();

      if (selectedFile) {
        imageUrl = await uploadFile(selectedFile);
      }

      if (isEditing && playlist) {
        await updatePlaylist(playlist._id, {
          name: formData.name.trim(),
          description: formData.description.trim(),
          imageUrl: imageUrl,
          isPublic: formData.isPublic,
        });
      } else {
        await createPlaylist({
          name: formData.name.trim(),
          description: formData.description.trim(),
          imageUrl: imageUrl,
          isPublic: formData.isPublic,
        });
      }

      setFormData({
        name: "",
        description: "",
        imageUrl: "",
        isPublic: false,
      });
      setSelectedFile(null);
      setPreviewUrl("");

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setFormData((prev) => ({ ...prev, imageUrl: "" }));
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
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
            <label className="text-sm font-medium">Cover Image</label>

            {/* File Picker */}
            <div className="space-y-3">
              <input
                type="file"
                id="imageFile"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />

              {/* URL Input (alternative) */}
              <div className="text-xs text-gray-500">Or enter image URL:</div>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => {
                  handleInputChange("imageUrl", e.target.value);
                  if (e.target.value) {
                    setSelectedFile(null);
                    setPreviewUrl("");
                  }
                }}
                placeholder="Enter image URL"
                disabled={!!selectedFile}
              />
            </div>

            {/* Preview */}
            {(previewUrl || formData.imageUrl) && (
              <div className="space-y-2">
                <div className="text-xs text-gray-500">Preview:</div>
                <div className="relative w-32 h-32 border rounded-md overflow-hidden">
                  <img
                    src={previewUrl || formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
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
