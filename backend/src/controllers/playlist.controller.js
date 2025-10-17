import { Playlist } from "../models/playlist.model.js";
import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";

// Create a new playlist
export const createPlaylist = async (req, res, next) => {
  try {
    const { name, description, imageUrl, isPublic } = req.body;
    const userId = req.auth.userId;

    // Find user by clerkId
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const playlist = new Playlist({
      name,
      description: description || "",
      imageUrl: imageUrl || "",
      userId: user._id,
      songs: [],
      isPublic: isPublic || false,
    });

    await playlist.save();
    await playlist.populate("songs");

    res.status(201).json(playlist);
  } catch (error) {
    next(error);
  }
};

// Get all playlists for a user
export const getUserPlaylists = async (req, res, next) => {
  try {
    const userId = req.auth.userId;

    // Find user by clerkId
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const playlists = await Playlist.find({ userId: user._id })
      .populate("songs")
      .sort({ createdAt: -1 });

    res.status(200).json(playlists);
  } catch (error) {
    next(error);
  }
};

// Get a specific playlist by ID
export const getPlaylistById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.auth.userId;

    // Find user by clerkId
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const playlist = await Playlist.findOne({
      _id: id,
      userId: user._id,
    }).populate("songs");

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    res.status(200).json(playlist);
  } catch (error) {
    next(error);
  }
};

// Update playlist details
export const updatePlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl, isPublic } = req.body;
    const userId = req.auth.userId;

    // Find user by clerkId
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const playlist = await Playlist.findOneAndUpdate(
      { _id: id, userId: user._id },
      {
        name,
        description,
        imageUrl,
        isPublic,
      },
      { new: true }
    ).populate("songs");

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    res.status(200).json(playlist);
  } catch (error) {
    next(error);
  }
};

// Delete playlist
export const deletePlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.auth.userId;

    // Find user by clerkId
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const playlist = await Playlist.findOneAndDelete({
      _id: id,
      userId: user._id,
    });

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    res.status(200).json({ message: "Playlist deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Add song to playlist
export const addSongToPlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { songId } = req.body;
    const userId = req.auth.userId;

    // Find user by clerkId
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if song exists
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    const playlist = await Playlist.findOne({ _id: id, userId: user._id });
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // Check if song is already in playlist
    if (playlist.songs.includes(songId)) {
      return res.status(400).json({ message: "Song already in playlist" });
    }

    playlist.songs.push(songId);
    await playlist.save();
    await playlist.populate("songs");

    res.status(200).json(playlist);
  } catch (error) {
    next(error);
  }
};

// Remove song from playlist
export const removeSongFromPlaylist = async (req, res, next) => {
  try {
    const { id, songId } = req.params;
    const userId = req.auth.userId;

    // Find user by clerkId
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const playlist = await Playlist.findOne({ _id: id, userId: user._id });
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    playlist.songs = playlist.songs.filter(
      (song) => song.toString() !== songId
    );
    await playlist.save();
    await playlist.populate("songs");

    res.status(200).json(playlist);
  } catch (error) {
    next(error);
  }
};

// Get public playlists
export const getPublicPlaylists = async (req, res, next) => {
  try {
    const playlists = await Playlist.find({ isPublic: true })
      .populate("songs")
      .populate("userId", "fullName imageUrl")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json(playlists);
  } catch (error) {
    next(error);
  }
};
