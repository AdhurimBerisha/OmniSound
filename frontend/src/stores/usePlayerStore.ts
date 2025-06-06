import { create } from "zustand";
import type { Song } from "@/types";
import { useChatStore } from "./useChatStore";

interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;
  isShuffled: boolean;
  isLooped: boolean;

  initializeQueue: (songs: Song[]) => void;
  playAlbum: (songs: Song[], startIndex?: number) => void;
  setCurrentSong: (song: Song | null) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  toggleShuffle: () => void;
  toggleLoop: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,
  isShuffled: false,
  isLooped: false,

  initializeQueue: (songs: Song[]) => {
    set({
      queue: songs,
      currentSong: get().currentSong || songs[0],
      currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
    });
  },

  playAlbum: (songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return;

    const song = songs[startIndex];

    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }
    set({
      queue: songs,
      currentSong: song,
      currentIndex: startIndex,
      isPlaying: true,
    });
  },

  setCurrentSong: (song: Song | null) => {
    if (!song) return;

    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }

    const songIndex = get().queue.findIndex((s) => s._id === song._id);
    set({
      currentSong: song,
      isPlaying: true,
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
    });
  },

  togglePlay: () => {
    const willStartPlaying = !get().isPlaying;

    const currentSong = get().currentSong;
    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity:
          willStartPlaying && currentSong
            ? `Playing ${currentSong.title} by ${currentSong.artist}`
            : "Idle",
      });
    }

    set({
      isPlaying: willStartPlaying,
    });
  },

  playNext: () => {
    const { currentIndex, queue, isShuffled, isLooped } = get();
    
    if (isShuffled) {
      // Get a random index that's not the current one
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * queue.length);
      } while (nextIndex === currentIndex && queue.length > 1);
      
      const nextSong = queue[nextIndex];

      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
        });
      }

      set({
        currentSong: nextSong,
        currentIndex: nextIndex,
        isPlaying: true,
      });
    } else {
      const nextIndex = currentIndex + 1;

      // if there is a next song to play, let's play it
      if (nextIndex < queue.length) {
        const nextSong = queue[nextIndex];

        const socket = useChatStore.getState().socket;
        if (socket.auth) {
          socket.emit("update_activity", {
            userId: socket.auth.userId,
            activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
          });
        }

        set({
          currentSong: nextSong,
          currentIndex: nextIndex,
          isPlaying: true,
        });
      } else {
        // If loop is enabled, start from the beginning
        if (isLooped && queue.length > 0) {
          const firstSong = queue[0];
          
          const socket = useChatStore.getState().socket;
          if (socket.auth) {
            socket.emit("update_activity", {
              userId: socket.auth.userId,
              activity: `Playing ${firstSong.title} by ${firstSong.artist}`,
            });
          }

          set({
            currentSong: firstSong,
            currentIndex: 0,
            isPlaying: true,
          });
        } else {
          // no next song and loop is disabled
          set({ isPlaying: false });

          const socket = useChatStore.getState().socket;
          if (socket.auth) {
            socket.emit("update_activity", {
              userId: socket.auth.userId,
              activity: `Idle`,
            });
          }
        }
      }
    }
  },

  playPrevious: () => {
    const { currentIndex, queue, isShuffled } = get();
    
    if (isShuffled) {
      // Get a random index that's not the current one
      let prevIndex;
      do {
        prevIndex = Math.floor(Math.random() * queue.length);
      } while (prevIndex === currentIndex && queue.length > 1);
      
      const prevSong = queue[prevIndex];

      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Playing ${prevSong.title} by ${prevSong.artist}`,
        });
      }

      set({
        currentSong: prevSong,
        currentIndex: prevIndex,
        isPlaying: true,
      });
    } else {
      const prevIndex = currentIndex - 1;

      // theres a prev song
      if (prevIndex >= 0) {
        const prevSong = queue[prevIndex];

        const socket = useChatStore.getState().socket;
        if (socket.auth) {
          socket.emit("update_activity", {
            userId: socket.auth.userId,
            activity: `Playing ${prevSong.title} by ${prevSong.artist}`,
          });
        }

        set({
          currentSong: prevSong,
          currentIndex: prevIndex,
          isPlaying: true,
        });
      } else {
        // no prev song
        set({ isPlaying: false });

        const socket = useChatStore.getState().socket;
        if (socket.auth) {
          socket.emit("update_activity", {
            userId: socket.auth.userId,
            activity: `Idle`,
          });
        }
      }
    }
  },

  toggleShuffle: () => {
    const { queue, currentIndex, isShuffled } = get();
    const currentSong = queue[currentIndex];
    
    if (!isShuffled) {
      // Create a new array excluding the current song
      const remainingSongs = queue.filter((_, index) => index !== currentIndex);
      // Shuffle the remaining songs
      const shuffledSongs = [...remainingSongs].sort(() => Math.random() - 0.5);
      // Put the current song at the beginning
      const newQueue = [currentSong, ...shuffledSongs];
      
      set({
        queue: newQueue,
        currentIndex: 0,
        isShuffled: true
      });
    } else {
      // Reset to original order
      const originalQueue = [...queue].sort((a, b) => {
        const indexA = queue.findIndex(song => song._id === a._id);
        const indexB = queue.findIndex(song => song._id === b._id);
        return indexA - indexB;
      });
      
      const newIndex = originalQueue.findIndex(song => song._id === currentSong?._id);
      
      set({
        queue: originalQueue,
        currentIndex: newIndex,
        isShuffled: false
      });
    }
  },

  toggleLoop: () => {
    set((state) => ({
      isLooped: !state.isLooped
    }));
  },
}));
