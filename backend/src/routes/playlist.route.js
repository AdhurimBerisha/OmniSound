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

router.get("/public", getPublicPlaylists);

router.use(protectRoute);

router.post("/", createPlaylist);
router.get("/", getUserPlaylists);
router.get("/:id", getPlaylistById);
router.put("/:id", updatePlaylist);
router.delete("/:id", deletePlaylist);

router.post("/:id/songs", addSongToPlaylist);
router.delete("/:id/songs/:songId", removeSongFromPlaylist);

export default router;
