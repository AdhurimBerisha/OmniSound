import { axiosInstance } from "@/lib/axios";
import type { Playlist, Song } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";

interface PlaylistStore {
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  isLoading: boolean;
  error: string | null;
  publicPlaylists: Playlist[];

  createPlaylist: (data: {
    name: string;
    description?: string;
    imageUrl?: string;
    isPublic?: boolean;
  }) => Promise<void>;
  fetchUserPlaylists: () => Promise<void>;
  fetchPlaylistById: (id: string) => Promise<void>;
  updatePlaylist: (
    id: string,
    data: {
      name?: string;
      description?: string;
      imageUrl?: string;
      isPublic?: boolean;
    }
  ) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;

  addSongToPlaylist: (playlistId: string, songId: string) => Promise<void>;
  removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;

  fetchPublicPlaylists: () => Promise<void>;

  clearCurrentPlaylist: () => void;
}

export const usePlaylistStore = create<PlaylistStore>((set, get) => ({
  playlists: [],
  currentPlaylist: null,
  isLoading: false,
  error: null,
  publicPlaylists: [],

  createPlaylist: async (data) => {
    set({ isLoading: true, error: null });
    try {
      console.log("Creating playlist with data:", data);
      const response = await axiosInstance.post("/playlists", data);
      console.log("Response from createPlaylist:", response.data);
      const newPlaylist = response.data;

      set((state) => ({
        playlists: [newPlaylist, ...state.playlists],
      }));

      toast.success("Playlist created successfully");
    } catch (error: any) {
      console.error("Error in createPlaylist:", error);
      console.error("Error response:", error.response?.data);
      toast.error(
        "Failed to create playlist: " +
          (error.response?.data?.message || error.message)
      );
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserPlaylists: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/playlists");
      set({ playlists: response.data });
    } catch (error: any) {
      console.log("Error in fetchUserPlaylists", error);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPlaylistById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/playlists/${id}`);
      set({ currentPlaylist: response.data });
    } catch (error: any) {
      console.log("Error in fetchPlaylistById", error);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updatePlaylist: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put(`/playlists/${id}`, data);
      const updatedPlaylist = response.data;

      set((state) => ({
        playlists: state.playlists.map((playlist) =>
          playlist._id === id ? updatedPlaylist : playlist
        ),
        currentPlaylist:
          state.currentPlaylist?._id === id
            ? updatedPlaylist
            : state.currentPlaylist,
      }));

      toast.success("Playlist updated successfully");
    } catch (error: any) {
      console.log("Error in updatePlaylist", error);
      toast.error("Failed to update playlist");
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deletePlaylist: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/playlists/${id}`);

      set((state) => ({
        playlists: state.playlists.filter((playlist) => playlist._id !== id),
        currentPlaylist:
          state.currentPlaylist?._id === id ? null : state.currentPlaylist,
      }));

      toast.success("Playlist deleted successfully");
    } catch (error: any) {
      console.log("Error in deletePlaylist", error);
      toast.error("Failed to delete playlist");
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addSongToPlaylist: async (playlistId, songId) => {
    set({ isLoading: true, error: null });
    try {
      console.log("Adding song to playlist:", { playlistId, songId });
      const response = await axiosInstance.post(
        `/playlists/${playlistId}/songs`,
        { songId }
      );
      console.log("Response from addSongToPlaylist:", response.data);
      const updatedPlaylist = response.data;

      set((state) => ({
        playlists: state.playlists.map((playlist) =>
          playlist._id === playlistId ? updatedPlaylist : playlist
        ),
        currentPlaylist:
          state.currentPlaylist?._id === playlistId
            ? updatedPlaylist
            : state.currentPlaylist,
      }));

      toast.success("Song added to playlist");
    } catch (error: any) {
      console.error("Error in addSongToPlaylist:", error);
      console.error("Error response:", error.response?.data);
      toast.error(
        "Failed to add song to playlist: " +
          (error.response?.data?.message || error.message)
      );
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  removeSongFromPlaylist: async (playlistId, songId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.delete(
        `/playlists/${playlistId}/songs/${songId}`
      );
      const updatedPlaylist = response.data;

      set((state) => ({
        playlists: state.playlists.map((playlist) =>
          playlist._id === playlistId ? updatedPlaylist : playlist
        ),
        currentPlaylist:
          state.currentPlaylist?._id === playlistId
            ? updatedPlaylist
            : state.currentPlaylist,
      }));

      toast.success("Song removed from playlist");
    } catch (error: any) {
      console.log("Error in removeSongFromPlaylist", error);
      toast.error("Failed to remove song from playlist");
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPublicPlaylists: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/playlists/public");
      set({ publicPlaylists: response.data });
    } catch (error: any) {
      console.log("Error in fetchPublicPlaylists", error);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  clearCurrentPlaylist: () => {
    set({ currentPlaylist: null });
  },
}));
