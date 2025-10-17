import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { Song } from "../models/song.model.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const currentUserId = req.auth.userId;
    const users = await User.find({ clerkId: { $ne: currentUserId } });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const myId = req.auth.userId;
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: myId },
        ,
        { senderId: myId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

// Get user's liked songs
export const getLikedSongs = async (req, res, next) => {
  try {
    const userId = req.auth.userId;

    // Find user by clerkId
    const user = await User.findOne({ clerkId: userId }).populate("likedSongs");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.likedSongs);
  } catch (error) {
    next(error);
  }
};

// Like a song
export const likeSong = async (req, res, next) => {
  try {
    const { songId } = req.params;
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

    // Check if song is already liked
    if (user.likedSongs.includes(songId)) {
      return res.status(400).json({ message: "Song already liked" });
    }

    user.likedSongs.push(songId);
    await user.save();
    await user.populate("likedSongs");

    res
      .status(200)
      .json({
        message: "Song liked successfully",
        likedSongs: user.likedSongs,
      });
  } catch (error) {
    next(error);
  }
};

// Unlike a song
export const unlikeSong = async (req, res, next) => {
  try {
    const { songId } = req.params;
    const userId = req.auth.userId;

    // Find user by clerkId
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if song is liked
    const songIndex = user.likedSongs.indexOf(songId);
    if (songIndex === -1) {
      return res.status(400).json({ message: "Song not in liked songs" });
    }

    user.likedSongs.splice(songIndex, 1);
    await user.save();
    await user.populate("likedSongs");

    res
      .status(200)
      .json({
        message: "Song unliked successfully",
        likedSongs: user.likedSongs,
      });
  } catch (error) {
    next(error);
  }
};
