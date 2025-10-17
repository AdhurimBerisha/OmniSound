import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  getPublicPlaylists,
} from "../controllers/playlist.controller.js";

const router = Router();

// Public routes
router.get("/public", getPublicPlaylists);

// Protected routes
router.use(protectRoute);

// Playlist CRUD operations
router.post("/", createPlaylist);
router.get("/", getUserPlaylists);
router.get("/:id", getPlaylistById);
router.put("/:id", updatePlaylist);
router.delete("/:id", deletePlaylist);

// Song management in playlists
router.post("/:id/songs", addSongToPlaylist);
router.delete("/:id/songs/:songId", removeSongFromPlaylist);

export default router;
